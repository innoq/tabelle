# How to Release

1. Update CHANGELOG with new version
2. Increase version of library

    npm version patch|minor|major

3. Publish

    npm test
    npm run compile
    npm publish
