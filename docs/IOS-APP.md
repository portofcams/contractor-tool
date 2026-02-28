# ContractorCalc — iOS App Guide

## Overview

The iOS app is a **native Capacitor shell** that loads the web app from the server. This means:
- Web changes deploy instantly — no App Store update needed for UI/feature changes
- Native plugins provide camera, filesystem, offline storage
- The app works offline using locally cached data + a sync queue

## Prerequisites

- Xcode 15+ (install from Mac App Store)
- iOS 16+ deployment target
- Node.js 20+
- An Apple Developer account ($99/yr for App Store, free for device testing)

## Quick Start

```bash
# 1. Start the Next.js dev server
npm run dev

# 2. Open iOS project in Xcode (dev mode — points to localhost:3000)
npm run cap:dev

# 3. Or open Xcode manually
npm run ios
```

## How It Works

### Architecture

```
┌────────────────────────────────────┐
│  iOS Native Shell (Capacitor)      │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  WKWebView                   │  │
│  │  Loads: https://contractorcalc.com  │
│  │  (or localhost:3000 in dev)  │  │
│  └──────────────────────────────┘  │
│                                    │
│  Native Plugins:                   │
│  ├── Camera (floor plan photos)    │
│  ├── Filesystem (local files)      │
│  ├── Preferences (offline data)    │
│  ├── Network (connectivity check)  │
│  ├── SplashScreen                  │
│  ├── StatusBar                     │
│  └── App (back button, lifecycle)  │
└────────────────────────────────────┘
```

### Dev vs Production

| Mode       | Server URL              | Use Case                |
|-----------|-------------------------|-------------------------|
| Dev        | http://localhost:3000   | Local development       |
| Production | https://contractorcalc.com | App Store release    |

Toggle via `CAPACITOR_DEV` environment variable in `capacitor.config.ts`.

## Offline Support

### How offline works

1. **On app launch**: sync service pulls latest data from server
2. **User creates data offline**: saved to Capacitor Preferences (device storage)
3. **Changes queued**: added to sync queue with timestamp
4. **Network reconnects**: auto-detected, queue pushed to server
5. **Conflicts**: server wins (TODO: add configurable conflict resolution)

### Key files

| File                      | Purpose                              |
|--------------------------|--------------------------------------|
| `src/lib/offline-storage.ts` | Local CRUD for customers, quotes, files |
| `src/lib/sync-service.ts`    | Push/pull sync + auto-sync on reconnect |
| `src/lib/capacitor-init.ts`  | Bootstrap native plugins on launch   |
| `src/components/capacitor-provider.tsx` | React wrapper, runs init once |

## Native Plugin Usage

### Camera (future: photo floor plans)
```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const photo = await Camera.getPhoto({
  quality: 90,
  resultType: CameraResultType.Base64,
});
```

### Filesystem (save PDFs locally)
```typescript
import { offlineStore } from '@/lib/offline-storage';

await offlineStore.saveFile('quote-123.pdf', base64Data);
const data = await offlineStore.readFile('quote-123.pdf');
```

### Network (check connectivity)
```typescript
import { isOnline } from '@/lib/sync-service';

if (await isOnline()) {
  // sync with server
}
```

## Building for App Store

```bash
# 1. Ensure production URL in capacitor.config.ts
#    (CAPACITOR_DEV should NOT be set)

# 2. Sync native plugins
npx cap sync ios

# 3. Open Xcode
npx cap open ios

# 4. In Xcode:
#    - Select your team/signing certificate
#    - Set bundle ID: com.contractorcalc.app
#    - Product → Archive
#    - Distribute App → App Store Connect

# 5. In App Store Connect:
#    - Add app metadata, screenshots
#    - Submit for review
```

## iOS-Specific Config

File: `capacitor.config.ts`

| Setting              | Value                | Purpose                    |
|---------------------|----------------------|----------------------------|
| appId               | com.contractorcalc.app | Bundle identifier         |
| appName             | ContractorCalc       | Display name               |
| scheme              | ContractorCalc       | URL scheme for deep links  |
| SplashScreen color  | #1e40af (blue-800)   | Brand color on launch      |
| contentInset        | always               | Safe area handling         |

## File Structure

```
ios/
├── App/
│   ├── App/
│   │   ├── AppDelegate.swift    # App lifecycle
│   │   ├── Info.plist           # iOS permissions & config
│   │   ├── public/              # Fallback web assets
│   │   └── capacitor.config.json # Generated from .ts config
│   ├── App.xcodeproj/
│   └── App.xcworkspace/         # Open this in Xcode
└── Packages/                    # Native plugin packages
```
