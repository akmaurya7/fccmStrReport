# FCCM STR Reporting Project

This project contains a frontend STR form and a Spring Boot backend with Oracle DB persistence.

## Project Structure

- `frontend/` : HTML/CSS/JS STR form UI
- `fccmStrReport/fccmStrReport/` : Spring Boot backend (Java + JPA)
- `schema.sql` : Oracle schema
- `dummy.sql` : sample test data

## Features

- Multi-section STR form (transactions, participants, accounts, owners, documents)
- Backend save into Oracle tables
- Backend-generated XML download on submit
- Lookup APIs for dropdown values
- Document metadata + file content saved in DB (`BLOB`)

## Backend Setup

1. Go to backend directory:

```powershell
cd fccmStrReport/fccmStrReport
```

2. Configure DB in `src/main/resources/application.properties`.

3. Run backend:

```powershell
.\mvnw.cmd clean compile
.\mvnw.cmd spring-boot:run
```

Backend runs on `http://localhost:8081`.

## Database Setup

Run in Oracle:

1. `schema.sql`
2. `dummy.sql` (optional sample data)

## Frontend Setup

Serve `frontend` via local server (or VS Code Go Live):

```powershell
cd frontend
python -m http.server 5500
```

Open: `http://localhost:5500`

## Main API Endpoints

- `GET /api/lookups/countries`
- `GET /api/lookups/currencies`
- `GET /api/lookups/transaction-types`
- `GET /api/lookups/account-types`
- `GET /api/lookups/phone-types`
- `GET /api/lookups/suspicion-categories`
- `POST /api/reports/submit-xml` (save + return XML file)

## Submit Flow

1. User fills frontend form.
2. Frontend validates input.
3. Frontend sends full payload to backend `/api/reports/submit-xml`.
4. Backend saves report + related entities.
5. Backend generates XML and returns it as attachment.
6. Browser downloads XML.

## Notes

- `reportingEntityId` must exist in `str_reporting_entity`.
- `report_type='Update'` requires `report_identifier` + `submit_date`.
- If port `8081` is busy, stop old process or change `server.port`.

## Verify Saved Documents in Oracle

```sql
select document_id, report_id, file_name, dbms_lob.getlength(file_content) as file_size_bytes
from str_supporting_document
order by document_id desc;
```

## Git Remote

Repository: `https://github.com/akmaurya7/fccmStrReport.git`
