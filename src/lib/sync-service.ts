/**
 * Sync Service — ContractorCalc
 *
 * Handles bidirectional sync between the local offline store and the server API.
 *
 * Flow:
 *   1. On app launch or network reconnect, check for pending sync items
 *   2. Push each queued item to the server API
 *   3. On success, mark the local item as synced and remove from queue
 *   4. Pull latest data from server to update local store
 *
 * The sync service is designed to be idempotent — safe to run multiple times.
 *
 * TODO (next session):
 *   - Conflict resolution (server wins vs client wins)
 *   - Batch sync for large queues
 *   - Background sync via Capacitor Background Task plugin
 *   - Delta sync (only changed records)
 */

import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { offlineStore } from "./offline-storage";

// ── Types ──

interface SyncResult {
  synced: number;
  failed: number;
  errors: string[];
}

// ── Network Status ──

export async function isOnline(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return navigator.onLine;
  }
  const status = await Network.getStatus();
  return status.connected;
}

// ── Push Sync: Local → Server ──

export async function pushSync(apiBaseUrl: string): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, failed: 0, errors: [] };

  const online = await isOnline();
  if (!online) {
    result.errors.push("Device is offline — sync skipped");
    return result;
  }

  const queue = await offlineStore.getSyncQueue();

  for (const item of queue) {
    try {
      let endpoint = "";
      let method = "POST";

      switch (item.entity) {
        case "customer":
          endpoint = `${apiBaseUrl}/api/customers`;
          break;
        case "quote":
          endpoint = `${apiBaseUrl}/api/quotes`;
          break;
        default:
          continue;
      }

      if (item.action === "update") {
        method = "PATCH";
        const serverId = (item.data as { serverId?: string }).serverId;
        endpoint = `${endpoint}/${serverId}`;
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.data),
      });

      if (res.ok) {
        const serverData = await res.json();

        // Mark local item as synced
        if (item.entity === "customer") {
          await offlineStore.markCustomerSynced(item.id, serverData.id);
        } else if (item.entity === "quote") {
          await offlineStore.markQuoteSynced(item.id, serverData.id);
        }

        await offlineStore.removeSyncItem(item.id);
        result.synced++;

        await offlineStore.logSession({
          action: "sync_push",
          details: `Synced ${item.entity} ${item.id} → server ${serverData.id}`,
        });
      } else {
        const errText = await res.text();
        result.failed++;
        result.errors.push(`${item.entity} ${item.id}: ${res.status} ${errText}`);
      }
    } catch (err) {
      result.failed++;
      result.errors.push(`${item.entity} ${item.id}: ${String(err)}`);
    }
  }

  return result;
}

// ── Pull Sync: Server → Local ──

export async function pullSync(apiBaseUrl: string): Promise<void> {
  const online = await isOnline();
  if (!online) return;

  try {
    // Pull customers
    const customersRes = await fetch(`${apiBaseUrl}/api/customers`);
    if (customersRes.ok) {
      const serverCustomers = await customersRes.json();
      // Store server data locally for offline access
      // TODO: merge with local unsynced changes instead of overwrite
      const existing = await offlineStore.getCustomers();
      const unsynced = existing.filter((c) => !c.synced);

      // Keep unsynced local items, update synced ones from server
      const merged = [
        ...unsynced,
        ...serverCustomers.map((c: Record<string, unknown>) => ({
          localId: crypto.randomUUID(),
          serverId: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          address: c.address,
          notes: c.notes,
          synced: true,
          updatedAt: c.createdAt || new Date().toISOString(),
        })),
      ];

      // Deduplicate by serverId
      const seen = new Set<string>();
      const deduped = merged.filter((c) => {
        if (c.serverId && seen.has(c.serverId)) return false;
        if (c.serverId) seen.add(c.serverId);
        return true;
      });

      // Store via Preferences (using localStorage on web)
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("offline_customers", JSON.stringify(deduped));
      }
    }

    await offlineStore.logSession({
      action: "sync_pull",
      details: "Pulled latest data from server",
    });
  } catch (err) {
    await offlineStore.logSession({
      action: "sync_pull_error",
      details: String(err),
    });
  }
}

// ── Full Sync (push then pull) ──

export async function fullSync(apiBaseUrl: string): Promise<SyncResult> {
  await offlineStore.logSession({ action: "sync_start" });
  const pushResult = await pushSync(apiBaseUrl);
  await pullSync(apiBaseUrl);
  await offlineStore.logSession({
    action: "sync_complete",
    details: `Pushed ${pushResult.synced} items, ${pushResult.failed} failed`,
  });
  return pushResult;
}

// ── Auto-Sync on Network Change ──

export function setupAutoSync(apiBaseUrl: string): void {
  if (!Capacitor.isNativePlatform()) return;

  Network.addListener("networkStatusChange", async (status) => {
    if (status.connected) {
      await offlineStore.logSession({
        action: "network_reconnect",
        details: `Connection type: ${status.connectionType}`,
      });
      await fullSync(apiBaseUrl);
    } else {
      await offlineStore.logSession({ action: "network_disconnect" });
    }
  });
}
