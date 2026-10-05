# SirEdvin MermaidStudio fork

This public fork carries the customizations in [the release notes](fork-release-notes.md). Upstream attribution and the MIT license are preserved.

## Container

```sh
docker run --rm -p 8080:8080 ghcr.io/siredvin/mermaidstudio:0.9.4
```

Use `PORT` to select the listen port. The image is unprivileged; use a high port. Serve through an HTTPS reverse proxy for browser WebGPU features. No volume is required: diagram data is in each browser's IndexedDB, not on the server. Export backups explicitly.

## Build and release

The root `Dockerfile` builds the checked-out source directly: no upstream clone or build-time source patches. It runs lint, the complete unit test suite, type checking, the production build and lazy-chunk guards. GitHub Actions additionally smoke-tests the dynamic port, nginx configuration and COOP/COEP headers.

Push a `vX.Y.Z` tag matching `package.json` to publish `ghcr.io/siredvin/mermaidstudio:X.Y.Z` and `latest`, then create a GitHub release with the image digest. Only linux/amd64 is currently published and verified. Publication uses the workflow's `GITHUB_TOKEN`; no homelab credentials or custom registry secrets are required. GitHub packages may initially be private: set the package visibility to public in GitHub package settings for anonymous pulls.

The removed input filter is a deliberate behavior change, not a security improvement. DOMPurify sanitization remains enabled. No production deployment is performed by GitHub Actions.
