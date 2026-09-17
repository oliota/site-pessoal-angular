# Replacement package

This archive is a complete project replacement and includes the existing `.git` repository metadata from the supplied project. Delete the old project contents, then extract this archive into the repository root. Do not delete the extracted `.git` directory.

## Preserved project infrastructure
- `.git/` original repository history and remotes
- `.firebaserc` original Firebase project (`oliota`)
- `firebase.json` Firebase Hosting configuration, updated for the Angular application builder output (`dist/site-pessoal-angular/browser`)
- `.editorconfig`
- `.browserslistrc`
- `.gitignore` updated for the rewritten Angular project
