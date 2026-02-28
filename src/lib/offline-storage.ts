/**
 * Offline Storage Layer — ContractorCalc
 *
 * Provides local-first data persistence for the iOS app.
 * Data is stored in Capacitor Preferences (key-value) and Filesystem.
 *
 * Architecture:
 *   - Quotes, customers, and rooms are stored locally as JSON
 *   - Files (floor plans, PDFs) are stored on the device filesystem
 *   - A sync queue tracks unsynced changes
 *   - When online, the sync service pushes changes to the server API
 *
 * Usage:
 *   import { offlineStore } from "@/lib/offline-storage";
 *   await offlineStore.saveQuote(quoteData);
 *   const quotes = await offlineStore.getQuotes();
 */

import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { Filesystem, Directory } from "@capacitor/filesystem";

// ── Types ──

interface SyncQueueItem {
  id: string;
  action: "create" | "update" | "delete";
  entity: "customer" | "quote" | "floorplan";
  data: Record<string, unknown>;
  createdAt: string;
}

interface OfflineQuote {
  localId: string;
  serverId?: string;
  customerId: string;
  trade: string;
  materials: unknown[];
  subtotal: number;
  laborCost?: number;
  markupPercent: number;
  taxRate: number;
  total: number;
  status: string;
  synced: boolean;
  updatedAt: string;
}

interface OfflineCustomer {
  localId: string;
  serverId?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  synced: boolean;
  updatedAt: string;
}

// ── Helper: Check if running natively ──

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

// ── Preferences Wrapper (works on web too via localStorage fallback) ──

async function getJSON<T>(key: string): Promise<T | null> {
  if (isNative()) {
    const result = await Preferences.get({ key });
    return result.value ? JSON.parse(result.value) : null;
  }
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

async function setJSON(key: string, value: unknown): Promise<void> {
  const json = JSON.stringify(value);
  if (isNative()) {
    await Preferences.set({ key, value: json });
  } else {
    localStorage.setItem(key, json);
  }
}

// ── Offline Store ──

export const offlineStore = {
  // ── Customers ──

  async getCustomers(): Promise<OfflineCustomer[]> {
    return (await getJSON<OfflineCustomer[]>("offline_customers")) || [];
  },

  async saveCustomer(customer: Omit<OfflineCustomer, "localId" | "synced" | "updatedAt">): Promise<OfflineCustomer> {
    const customers = await this.getCustomers();
    const entry: OfflineCustomer = {
      ...customer,
      localId: crypto.randomUUID(),
      synced: false,
      updatedAt: new Date().toISOString(),
    };
    customers.push(entry);
    await setJSON("offline_customers", customers);
    await this.addToSyncQueue({
      id: entry.localId,
      action: "create",
      entity: "customer",
      data: entry as unknown as Record<string, unknown>,
      createdAt: entry.updatedAt,
    });
    return entry;
  },

  async markCustomerSynced(localId: string, serverId: string): Promise<void> {
    const customers = await this.getCustomers();
    const idx = customers.findIndex((c) => c.localId === localId);
    if (idx >= 0) {
      customers[idx].synced = true;
      customers[idx].serverId = serverId;
      await setJSON("offline_customers", customers);
    }
  },

  // ── Quotes ──

  async getQuotes(): Promise<OfflineQuote[]> {
    return (await getJSON<OfflineQuote[]>("offline_quotes")) || [];
  },

  async saveQuote(quote: Omit<OfflineQuote, "localId" | "synced" | "updatedAt">): Promise<OfflineQuote> {
    const quotes = await this.getQuotes();
    const entry: OfflineQuote = {
      ...quote,
      localId: crypto.randomUUID(),
      synced: false,
      updatedAt: new Date().toISOString(),
    };
    quotes.push(entry);
    await setJSON("offline_quotes", quotes);
    await this.addToSyncQueue({
      id: entry.localId,
      action: "create",
      entity: "quote",
      data: entry as unknown as Record<string, unknown>,
      createdAt: entry.updatedAt,
    });
    return entry;
  },

  async markQuoteSynced(localId: string, serverId: string): Promise<void> {
    const quotes = await this.getQuotes();
    const idx = quotes.findIndex((q) => q.localId === localId);
    if (idx >= 0) {
      quotes[idx].synced = true;
      quotes[idx].serverId = serverId;
      await setJSON("offline_quotes", quotes);
    }
  },

  // ── Sync Queue ──

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    return (await getJSON<SyncQueueItem[]>("sync_queue")) || [];
  },

  async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    const queue = await this.getSyncQueue();
    queue.push(item);
    await setJSON("sync_queue", queue);
  },

  async removeSyncItem(id: string): Promise<void> {
    const queue = await this.getSyncQueue();
    await setJSON(
      "sync_queue",
      queue.filter((item) => item.id !== id)
    );
  },

  async clearSyncQueue(): Promise<void> {
    await setJSON("sync_queue", []);
  },

  // ── File Storage (floor plans, PDFs) ──

  async saveFile(fileName: string, base64Data: string): Promise<string> {
    if (!isNative()) {
      // Web fallback: store in localStorage (limited but functional for dev)
      localStorage.setItem(`file_${fileName}`, base64Data);
      return `local://${fileName}`;
    }

    const result = await Filesystem.writeFile({
      path: `contractorcalc/${fileName}`,
      data: base64Data,
      directory: Directory.Documents,
      recursive: true,
    });

    return result.uri;
  },

  async readFile(fileName: string): Promise<string | null> {
    if (!isNative()) {
      return localStorage.getItem(`file_${fileName}`);
    }

    try {
      const result = await Filesystem.readFile({
        path: `contractorcalc/${fileName}`,
        directory: Directory.Documents,
      });
      return typeof result.data === "string" ? result.data : null;
    } catch {
      return null;
    }
  },

  async deleteFile(fileName: string): Promise<void> {
    if (!isNative()) {
      localStorage.removeItem(`file_${fileName}`);
      return;
    }

    await Filesystem.deleteFile({
      path: `contractorcalc/${fileName}`,
      directory: Directory.Documents,
    });
  },

  // ── Session Tracking ──

  async logSession(sessionData: { action: string; details?: string }): Promise<void> {
    const sessions =
      (await getJSON<Array<{ timestamp: string; action: string; details?: string }>>(
        "session_log"
      )) || [];
    sessions.push({
      timestamp: new Date().toISOString(),
      ...sessionData,
    });
    // Keep last 500 entries
    if (sessions.length > 500) sessions.splice(0, sessions.length - 500);
    await setJSON("session_log", sessions);
  },

  async getSessionLog(): Promise<Array<{ timestamp: string; action: string; details?: string }>> {
    return (
      (await getJSON<Array<{ timestamp: string; action: string; details?: string }>>(
        "session_log"
      )) || []
    );
  },
};
