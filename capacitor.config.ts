import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kenganashura.fitness',
  appName: 'Kengan Ashura Fitness',
  webDir: 'dist',
  server: {
    // Allows the WebView to load/fetch plain-HTTP content -- needed while
    // the dev backend runs over HTTP. Remove once the API is served over
    // HTTPS for a real deployment.
    cleartext: true,
    // Capacitor's default is "https", so the app page itself loads at
    // https://localhost. Fetching a plain-HTTP API from an HTTPS page is
    // then blocked as mixed content (a separate check from cleartext
    // policy, and the actual cause of "Failed to fetch" against the dev
    // backend). Serving the page over http://localhost instead keeps both
    // same-scheme. Switch back to "https" once the API is HTTPS too.
    androidScheme: 'http',
  },
  plugins: {
    // CapacitorHttp intercepts window.fetch()/XMLHttpRequest and routes them
    // through native Java networking instead of the WebView's own network
    // stack. That native shim doesn't expose a real streamable
    // response.body (ReadableStream), which the chat screen's SSE client
    // depends on (response.body.getReader()) -- disable it so fetch() stays
    // native-WebView and streaming works.
    CapacitorHttp: {
      enabled: false,
    },
  },
};

export default config;
