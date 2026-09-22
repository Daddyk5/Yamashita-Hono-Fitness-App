# Running as a native app (Capacitor)

The web app is wrapped as-is into a real Android app via
[Capacitor](https://capacitorjs.com/) — same React code, same backend, no
rewrite. iOS needs a Mac (Capacitor supports it the same way; just
`npx cap add ios` there), so only Android is set up here.

## First-time setup

Requires: Java (JDK 17+), Android SDK (`ANDROID_HOME` set), and either an
emulator (AVD) or a physical device with USB debugging on. All already
present on this machine — see below if setting up fresh.

```bash
pnpm install
pnpm android:sync   # builds the web app (mobile mode) + copies into android/
```

## Building & running

```bash
cd android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk

adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.kenganashura.fitness/.MainActivity
```

Or in one step: `pnpm android:build` (runs `android:sync` + `assembleDebug`).

After changing frontend source, **you must re-run `pnpm android:sync` and
rebuild** — unlike the browser dev server, there's no hot reload into an
installed APK.

## Talking to the backend from the emulator/device

`localhost` inside the emulator means the emulator itself, not your PC.

- **Emulator** → use `10.0.2.2` (its alias for the host machine). Already
  configured: [.env.mobile](.env.mobile) sets `VITE_API_URL=http://10.0.2.2:4000`,
  which `pnpm build:mobile` (part of `android:sync`) bakes into the build.
- **Physical device on the same Wi-Fi** → change `.env.mobile` to your PC's
  LAN IP instead (e.g. `http://192.168.1.23:4000`), then re-sync.

The backend's Docker container reaches your host's Ollama via
`host.docker.internal` (already set in `docker-compose.yml`); that's a
separate hop from the emulator-to-backend one above.

## Three non-obvious things that block this and how they're handled

Found by actually running the app on an emulator and watching a real network
call fail, not by inspection — each one silently produces the same generic
`Failed to fetch`, so don't assume it's whichever you fix first.

1. **The desktop "phone frame" breaks on a real device.** `AppShell`
   ([src/components/Layout.tsx](src/components/Layout.tsx)) normally renders a
   decorative rounded phone bezel for previewing in a browser tab. Wrapped as
   a native app, the WebView *is* the phone, so that frame renders as a
   smaller phone shape floating inside the real screen. Fixed by detecting
   `Capacitor.isNativePlatform()` and rendering edge-to-edge in that case.

2. **Android blocks plain-HTTP cleartext traffic by default** (API 28+).
   Handled three ways at once (belt-and-suspenders, since only one of these
   turned out to be sufficient on its own — see #3):
   [android/app/src/main/res/xml/network_security_config.xml](android/app/src/main/res/xml/network_security_config.xml)
   scopes an exception to `10.0.2.2`/`localhost`; `usesCleartextTraffic="true"`
   in `AndroidManifest.xml`; and `server.cleartext: true` in
   `capacitor.config.ts`.

3. **Mixed-content blocking — the actual cause, and a different mechanism
   from #2.** Capacitor's default `androidScheme` serves the app at
   `https://localhost`. Fetching a plain-`http://` API from an `https://`
   page is blocked by Chromium as mixed content, regardless of cleartext
   policy — this is what was actually producing `Failed to fetch` here, not
   #2. Fixed by setting `server.androidScheme: 'http'` in
   `capacitor.config.ts` so the page itself loads over `http://localhost`,
   matching the backend's scheme. (Diagnosed via the WebView's own remote
   DevTools protocol over `adb forward` + the `Network` domain — the
   `blockedReason: "mixed-content"` field on `Network.loadingFailed` is what
   pinned it down; a plain JS `try/catch` on the `fetch()` only ever reports
   the generic `TypeError: Failed to fetch`.)

The backend's CORS allowlist (`CORS_ORIGIN` in `.env`) includes
`http://localhost`, `https://localhost`, and `capacitor://localhost` to
cover this scheme plus iOS's default, in addition to the Vite dev origin.

## Known local-dev-only setup

- `usesCleartextTraffic` / mixed-content workarounds above are for a plain-
  HTTP dev backend. Point `VITE_API_URL` at an HTTPS API for a real release
  build and these can be removed (switch `androidScheme` back to `'https'`
  too).
- No app icon/splash screen customization yet — using Capacitor's defaults.
- Emulator used for testing: AVD `fitness_test` (Pixel 6 profile, Android
  16 / API 36, Google Play system image). Recreate with:
  ```bash
  avdmanager create avd -n fitness_test \
    -k "system-images;android-36;google_apis_playstore;x86_64" -d pixel_6
  emulator -avd fitness_test
  ```
