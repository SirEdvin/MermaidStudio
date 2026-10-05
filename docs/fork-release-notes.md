## Fork changes

- Fix fullscreen panning by snapshotting mouse deltas before queued React state updates.
- Remove the fullscreen 500% maximum for toolbar, keyboard and wheel zoom; keep the 10% minimum.
- Disable raw-diagram suspicious-pattern rejection, including false positives such as `connection=database`.
- Retain diagram size/line limits and DOMPurify SVG sanitization. Disabling the input filter reduces defense-in-depth; it is not a claim that arbitrary diagram text is safe.
- Run nginx as a non-root user with an environment-configurable `PORT` (default 8080).
- Serve COOP/COEP headers for browser cross-origin isolation.
- Fix nginx template directory permissions and include container health checks.
- Include fullscreen and input-validation regression tests; bump the PWA cache.

Based on CatFoxVoyager/MermaidStudio commit `65166786b857ef0ba6eb42292a19fc374af18d7a` (MIT license). All diagram storage and AI inference remain browser-local.

Reload the application and accept the new-version prompt to refresh an installed PWA.
