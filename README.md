# Rubem Oliota — Personal Site v2

Modern rewrite of the personal portfolio using Angular 22, standalone components and Material Design 3 principles.

## Requirements

- Node.js 22.22.3+
- npm 10+

## Local development

```powershell
npm.cmd install
npm.cmd start
```

Open `http://localhost:5000`.

## Content

Public portfolio content is isolated in `src/assets/data/*.json`. Components consume it through `ContentService`. This keeps the UI independent from the data source and makes a later migration from local JSON to the Node/Heroku API straightforward.

## Structure

- `core/models`: shared data contracts
- `core/services`: content access
- `features`: route-level standalone pages
- `assets/data`: editable JSON content
- `assets/img`: local images

## Build

```powershell
npm.cmd run build
```
