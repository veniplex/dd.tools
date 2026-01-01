# Developer ReadMe

## Version Management

1. To release a new version, run one of the following commands, depending on the type of release:
   - `npm version patch` increases to 0.0.2
   - `npm version minor` increases to 0.1.0
   - `npm version major` increases to 1.0.0

2. Push the new version to GitHub:
   - `git push origin [v0.1.0]`

3. Create a new release on GitHub:
   - `gh release create [v0.1.0] --generate-notes`

## GitHub CLI

To install the GitHub CLI, run the following commands:

1. `winget install --id GitHub.cli`
2. `gh auth login`
