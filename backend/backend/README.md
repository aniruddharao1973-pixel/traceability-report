<!-- # Backend (Express) for Traceability demo

## Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill your Azure SQL connection details.
   - `DB_SERVER` should be like `yourserver.database.windows.net`
   - `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`
   - `DB_ENCRYPT=true` for Azure
4. `npm start` or `npm run dev` (if you have nodemon)

## Endpoint
- `GET /api/trace?uid=<UID>` returns JSON rows for that UID from the `trace.productiontraceability` view. -->


# Backend (Express) for Traceability demo
## Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill your PostgreSQL connection details.
   - `PG_HOST` should be `localhost`
   - `PG_PORT` should be `5432`
   - `PG_USER`, `PG_PASSWORD`, `PG_DATABASE`
4. `npm start` or `npm run dev` (if you have nodemon)

## Endpoint
- `GET /api/trace?uid=<UID>` returns JSON rows for that UID from the `trace.productiontraceability` view.