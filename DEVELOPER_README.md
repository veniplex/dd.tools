# Developer ReadMe

## Version Management

- `npm version patch` increases to 0.0.2
- `npm version minor` increases to 0.1.0
- `npm version major` increases to 1.0.0

## GitHub Releases

### GitHub CLI

1. `winget install --id GitHub.cli`
2. `gh auth login`

### Create Release

1. `git push origin v0.1.0`
2. `gh release create v0.1.0 --generate-notes`
