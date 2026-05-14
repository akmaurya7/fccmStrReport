-- ============================================================
-- DUMMY DATA (aligned with entity mappings in /entity)
-- Path: same folder as schema.sql
-- ============================================================

-- Optional cleanup (uncomment if needed)
-- delete from str_supporting_document;
-- delete from str_account_customer;
-- delete from str_account;
-- delete from str_report_customer;
-- delete from str_customer_phone;
-- delete from str_customer;
-- delete from str_transaction;
-- delete from str_report;
-- delete from str_reporting_entity;
-- commit;

-- 1) Reporting entities
insert into str_reporting_entity (reporting_entity_id) values ('ENT1001');
insert into str_reporting_entity (reporting_entity_id) values ('ENT1002');

-- 2) Reports (matches StrReport entity + table constraints)
insert into str_report (
  reporting_entity_id,
  report_type,
  report_identifier,
  submit_date,
  transaction_status,
  report_preparation_date,
  report_transmission_date,
  suspicion_category_code,
  suspicion_description,
  created_at
) values (
  'ENT1001',
  'New',
  null,
  null,
  'Completed',
  date '2026-05-01',
  date '2026-05-02',
  'MONEY_LAUNDER',
  'Unusual movement pattern observed across linked accounts with no valid business explanation provided.',
  systimestamp
);

insert into str_report (
  reporting_entity_id,
  report_type,
  report_identifier,
  submit_date,
  transaction_status,
  report_preparation_date,
  report_transmission_date,
  suspicion_category_code,
  suspicion_description,
  created_at
) values (
  'ENT1002',
  'Update',
  'UPD2026ABC12345',
  date '2026-05-03',
  'Pending',
  date '2026-05-03',
  date '2026-05-04',
  'FRAUD',
  'New supporting details indicate probable identity misuse and forged records in recent transfer activity.',
  systimestamp
);

-- 3) Transactions (matches StrTransaction entity)
insert into str_transaction (
  report_id, transaction_date, transaction_amount, currency_code, transaction_type_code, country_code, branch
)
select r.report_id, date '2026-04-29', 125000.50, 'USD', 'IN_INT_TRANSFER', 'AFG', 'KABUL_MAIN_01'
from str_report r
where r.reporting_entity_id = 'ENT1001'
  and r.report_type = 'New'
  and r.report_preparation_date = date '2026-05-01';

insert into str_transaction (
  report_id, transaction_date, transaction_amount, currency_code, transaction_type_code, country_code, branch
)
select r.report_id, date '2026-04-30', 40000.00, 'AFN', 'CASH_DEPOSIT', 'AFG', 'HERAT_CENTRAL_02'
from str_report r
where r.reporting_entity_id = 'ENT1001'
  and r.report_type = 'New'
  and r.report_preparation_date = date '2026-05-01';

insert into str_transaction (
  report_id, transaction_date, transaction_amount, currency_code, transaction_type_code, country_code, branch
)
select r.report_id, date '2026-05-01', 87500.00, 'EUR', 'OUT_INT_TRANSFER', 'ARE', 'DUBAI_BRANCH_05'
from str_report r
where r.report_identifier = 'UPD2026ABC12345';

-- 4) Customers (matches StrCustomer entity)
insert into str_customer (
  customer_type, id_type, passport_country_code, id_number,
  first_name, middle_name, last_name, dob,
  father_first_name, father_last_name,
  tin, legal_entity_full_name,
  house_number, street_name, district_name, location_name, city_name
) values (
  'Individual', 'Passport', 'AFG', 'P12345678',
  'Ahmad', 'K', 'Rahimi', date '1991-03-17',
  'Karim', 'Rahimi',
  null, null,
  'H-21', 'Shahr-e-Naw Road', 'District 10', 'Near City Mall', 'Kabul'
);

insert into str_customer (
  customer_type, id_type, passport_country_code, id_number,
  first_name, middle_name, last_name, dob,
  father_first_name, father_last_name,
  tin, legal_entity_full_name,
  house_number, street_name, district_name, location_name, city_name
) values (
  'Legal Entity', null, null, null,
  null, null, null, null,
  null, null,
  'TIN-LE-9001', 'Aryan Trading LLC',
  'BLD-9', 'Airport Road', 'District 8', 'Industrial Zone', 'Kabul'
);

insert into str_customer (
  customer_type, id_type, passport_country_code, id_number,
  first_name, middle_name, last_name, dob,
  father_first_name, father_last_name,
  tin, legal_entity_full_name,
  house_number, street_name, district_name, location_name, city_name
) values (
  'Government/NGO', null, null, null,
  null, null, null, null,
  null, null,
  'TIN-NGO-7788', 'Relief Support NGO',
  'OFF-3', 'University Street', 'District 6', 'Civic Block', 'Herat'
);

-- 5) Customer phones (matches StrCustomerPhone entity)
insert into str_customer_phone (customer_id, phone_type_code, phone_number)
select c.customer_id, 'MOBILE', '+93700111222' from str_customer c where c.id_number = 'P12345678';

insert into str_customer_phone (customer_id, phone_type_code, phone_number)
select c.customer_id, 'HOME', '+93700111223' from str_customer c where c.id_number = 'P12345678';

insert into str_customer_phone (customer_id, phone_type_code, phone_number)
select c.customer_id, 'BUSINESS', '+93790222001' from str_customer c where c.tin = 'TIN-LE-9001';

insert into str_customer_phone (customer_id, phone_type_code, phone_number)
select c.customer_id, 'MOBILE', '+93790222002' from str_customer c where c.tin = 'TIN-NGO-7788';

-- 6) Report participants (matches StrReportCustomer entity)
insert into str_report_customer (report_id, customer_id, participant_role)
select r.report_id, c.customer_id, 'PRINCIPLE'
from str_report r, str_customer c
where r.reporting_entity_id = 'ENT1001'
  and r.report_type = 'New'
  and r.report_preparation_date = date '2026-05-01'
  and c.id_number = 'P12345678';

insert into str_report_customer (report_id, customer_id, participant_role)
select r.report_id, c.customer_id, 'BENEFICIARY'
from str_report r, str_customer c
where r.reporting_entity_id = 'ENT1001'
  and r.report_type = 'New'
  and r.report_preparation_date = date '2026-05-01'
  and c.tin = 'TIN-LE-9001';

insert into str_report_customer (report_id, customer_id, participant_role)
select r.report_id, c.customer_id, 'PROXY'
from str_report r, str_customer c
where r.report_identifier = 'UPD2026ABC12345'
  and c.tin = 'TIN-NGO-7788';

-- 7) Accounts (matches StrAccount entity)
insert into str_account (report_id, account_number, account_type_code, bank_name, bank_address)
select r.report_id, 'ACCT-99887766', 'CURRENT', 'Afghan National Bank', 'Kabul Finance Street, Afghanistan'
from str_report r
where r.reporting_entity_id = 'ENT1001'
  and r.report_type = 'New'
  and r.report_preparation_date = date '2026-05-01';

insert into str_account (report_id, account_number, account_type_code, bank_name, bank_address)
select r.report_id, 'ACCT-55443322', 'SAVINGS', 'Herat Commercial Bank', 'Herat Main Market Road, Afghanistan'
from str_report r
where r.report_identifier = 'UPD2026ABC12345';

-- 8) Account owners (matches StrAccountCustomer entity)
insert into str_account_customer (account_id, customer_id, owner_role)
select a.account_id, c.customer_id, 'OWNER'
from str_account a, str_customer c
where a.account_number = 'ACCT-99887766'
  and c.id_number = 'P12345678';

insert into str_account_customer (account_id, customer_id, owner_role)
select a.account_id, c.customer_id, 'OWNER'
from str_account a, str_customer c
where a.account_number = 'ACCT-99887766'
  and c.tin = 'TIN-LE-9001';

insert into str_account_customer (account_id, customer_id, owner_role)
select a.account_id, c.customer_id, 'OWNER'
from str_account a, str_customer c
where a.account_number = 'ACCT-55443322'
  and c.tin = 'TIN-NGO-7788';

-- 9) Supporting documents (matches StrSupportingDocument entity)
insert into str_supporting_document (
  report_id, file_name, file_content, document_name, document_type, document_identifier, document_date, document_preparer
)
select r.report_id,
       'evidence_001.pdf',
       utl_raw.cast_to_raw('Dummy PDF content for testing'),
       'Transfer Evidence',
       'Bank Statement',
       'DOC-STR-001',
       date '2026-05-02',
       'Compliance Officer A'
from str_report r
where r.reporting_entity_id = 'ENT1001'
  and r.report_type = 'New'
  and r.report_preparation_date = date '2026-05-01';

insert into str_supporting_document (
  report_id, file_name, file_content, document_name, document_type, document_identifier, document_date, document_preparer
)
select r.report_id,
       'audit_note_002.docx',
       utl_raw.cast_to_raw('Dummy DOCX content for testing'),
       'Audit Trail Note',
       'Audit Note',
       'DOC-STR-002',
       date '2026-05-04',
       'Investigation Team B'
from str_report r
where r.report_identifier = 'UPD2026ABC12345';

commit;
