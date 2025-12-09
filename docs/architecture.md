# Architecture Document

## Backend architecture
- Node.js + Express in /backend/src.
- Entry: index.js. Connects to MongoDB via src/config/database.js.
- Controllers: /src/controllers
- Services: /src/services
- Routes: /src/routes
- Models: /src/models
- Import script: ackend/scripts/importCsvToDB.js.

## Frontend architecture
- React (Vite) project in /frontend/src.
- Components in /src/components
- API layer in /src/services/api.js
- Styles in /src/styles

## Data flow
1. Frontend sends GET /api/sales with query params.
2. Backend builds MongoDB aggregation pipeline.
3. Database returns paginated + filtered results.
4. Frontend renders table + filters + KPIs.

## Folder structure
(Your project follows the required SDE Intern structure)

## Module responsibilities
- salesService.js — filtering, search, sorting, pagination logic.
- salesController.js — validates and handles endpoints.
- Sale.js — schema and indexes for sales data.
- React components — UI, state management, API integrations.

## Edge cases handled
- No results returns an empty UI state.
- Missing optional fields shown as "—".
- Invalid ranges handled gracefully.
