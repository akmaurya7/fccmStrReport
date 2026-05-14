-- STR schema (Oracle) normalized with lookup tables and unified customer model

create table str_country (
   country_code varchar2(3) not null,
   country_name varchar2(100) not null,
   constraint pk_str_country primary key ( country_code ),
   constraint uq_str_country_name unique ( country_name )
);

create table str_currency (
   currency_code varchar2(3) not null,
   currency_name varchar2(100),
   constraint pk_str_currency primary key ( currency_code )
);

create table str_transaction_type (
   transaction_type_code varchar2(40) not null,
   transaction_type_name varchar2(100) not null,
   constraint pk_str_transaction_type primary key ( transaction_type_code ),
   constraint uq_str_transaction_type_name unique ( transaction_type_name )
);

create table str_account_type (
   account_type_code varchar2(20) not null,
   account_type_name varchar2(50) not null,
   constraint pk_str_account_type primary key ( account_type_code ),
   constraint uq_str_account_type_name unique ( account_type_name )
);

create table str_phone_type (
   phone_type_code varchar2(20) not null,
   phone_type_name varchar2(50) not null,
   constraint pk_str_phone_type primary key ( phone_type_code ),
   constraint uq_str_phone_type_name unique ( phone_type_name )
);

create table str_suspicion_category (
   suspicion_category_code varchar2(40) not null,
   suspicion_category_name varchar2(100) not null,
   constraint pk_str_suspicion_category primary key ( suspicion_category_code ),
   constraint uq_str_suspicion_category_name unique ( suspicion_category_name )
);

create table str_reporting_entity (
   reporting_entity_id varchar2(30) not null,
   constraint pk_str_reporting_entity primary key ( reporting_entity_id ),
   constraint chk_entity_id_format check ( regexp_like ( reporting_entity_id,
                                                         '^[A-Za-z0-9 _/\-]+$' ) )
);

create table str_report (
   report_id                number generated always as identity primary key,
   reporting_entity_id      varchar2(30) not null,
   report_type              varchar2(10) not null,
   report_identifier        varchar2(15),
   submit_date              date,
   transaction_status       varchar2(20) not null,
   report_preparation_date  date not null,
   report_transmission_date date not null,
   suspicion_category_code  varchar2(40) not null,
   suspicion_description    varchar2(2000) not null,
   created_at               timestamp default systimestamp not null,
   constraint fk_report_entity foreign key ( reporting_entity_id )
      references str_reporting_entity ( reporting_entity_id ),
   constraint fk_report_suspicion_category foreign key ( suspicion_category_code )
      references str_suspicion_category ( suspicion_category_code ),
   constraint chk_report_type check ( report_type in ( 'New',
                                                       'Update' ) ),
   constraint chk_update_fields
      check ( ( report_type = 'Update'
         and regexp_like ( report_identifier,
                           '^[A-Za-z0-9]{15}$' )
         and submit_date is not null )
          or ( report_type = 'New'
         and report_identifier is null
         and submit_date is null ) ),
   constraint chk_tx_status
      check ( transaction_status in ( 'Completed',
                                      'Denied',
                                      'Pending' ) ),
   constraint chk_prep_date check ( report_preparation_date <= trunc(sysdate) ),
   constraint chk_trans_date check ( report_transmission_date <= trunc(sysdate) ),
   constraint chk_submit_date
      check ( submit_date is null
          or submit_date <= trunc(sysdate) ),
   constraint chk_suspicion_len
      check ( length(suspicion_description) between 30 and 2000 )
);

create table str_transaction (
   transaction_id        number generated always as identity primary key,
   report_id             number not null,
   transaction_date      date not null,
   transaction_amount    number(20,2) not null,
   currency_code         varchar2(3) not null,
   transaction_type_code varchar2(40) not null,
   country_code          varchar2(3) not null,
   branch                varchar2(80) not null,
   constraint fk_tx_report foreign key ( report_id )
      references str_report ( report_id )
         on delete cascade,
   constraint fk_tx_currency foreign key ( currency_code )
      references str_currency ( currency_code ),
   constraint fk_tx_type foreign key ( transaction_type_code )
      references str_transaction_type ( transaction_type_code ),
   constraint fk_tx_country foreign key ( country_code )
      references str_country ( country_code ),
   constraint chk_tx_date check ( transaction_date <= trunc(sysdate) ),
   constraint chk_tx_amount check ( transaction_amount > 0 ),
   constraint chk_tx_branch check ( regexp_like ( branch,
                                                  '^[A-Za-z0-9 _/\-]+$' ) )
);

create table str_customer (
   customer_id            number generated always as identity primary key,
   customer_type          varchar2(20) not null,
   id_type                varchar2(20),
   passport_country_code  varchar2(3),
   id_number              varchar2(40),
   first_name             varchar2(100),
   middle_name            varchar2(100),
   last_name              varchar2(100),
   dob                    date,
   father_first_name      varchar2(100),
   father_last_name       varchar2(100),
   tin                    varchar2(30),
   legal_entity_full_name varchar2(200),
   house_number           varchar2(100) not null,
   street_name            varchar2(200) not null,
   district_name          varchar2(200) not null,
   location_name          varchar2(200) not null,
   city_name              varchar2(200) not null,
   constraint fk_customer_passport_country foreign key ( passport_country_code )
      references str_country ( country_code ),
   constraint chk_customer_type
      check ( customer_type in ( 'Individual',
                                 'Legal Entity',
                                 'Government/NGO' ) ),
   constraint chk_customer_id_type
      check ( id_type is null
          or id_type in ( 'Tazkira',
                          'Passport',
                          'Valid Identifier' ) ),
   constraint chk_customer_dob
      check ( dob is null
          or dob <= trunc(sysdate) ),
   constraint chk_customer_tin_format
      check ( tin is null
          or regexp_like ( tin,
                           '^[A-Za-z0-9\-]{3,30}$' ) ),
   constraint chk_customer_individual_fields
      check ( ( customer_type = 'Individual'
         and id_type is not null
         and id_number is not null
         and first_name is not null
         and last_name is not null
         and dob is not null
         and father_first_name is not null
         and father_last_name is not null
         and ( ( id_type = 'Passport'
         and passport_country_code is not null )
          or id_type <> 'Passport' ) )
          or ( customer_type <> 'Individual' ) ),
   constraint chk_customer_non_individual_fields
      check ( ( customer_type in ( 'Legal Entity',
                                   'Government/NGO' )
         and tin is not null
         and legal_entity_full_name is not null )
          or ( customer_type = 'Individual' ) )
);

create table str_customer_phone (
   customer_phone_id number generated always as identity primary key,
   customer_id       number not null,
   phone_type_code   varchar2(20) not null,
   phone_number      varchar2(20) not null,
   constraint fk_customer_phone_customer foreign key ( customer_id )
      references str_customer ( customer_id )
         on delete cascade,
   constraint fk_customer_phone_type foreign key ( phone_type_code )
      references str_phone_type ( phone_type_code ),
   constraint uq_customer_phone_type unique ( customer_id,
                                              phone_type_code ),
   constraint chk_customer_phone_format check ( regexp_like ( phone_number,
                                                              '^\+?[0-9\-\s]{7,20}$' ) )
);

create table str_report_customer (
   report_customer_id number generated always as identity primary key,
   report_id          number not null,
   customer_id        number not null,
   participant_role   varchar2(20) not null,
   constraint fk_report_customer_report foreign key ( report_id )
      references str_report ( report_id )
         on delete cascade,
   constraint fk_report_customer_customer foreign key ( customer_id )
      references str_customer ( customer_id ),
   constraint chk_report_customer_role
      check ( participant_role in ( 'PRINCIPLE',
                                    'PROXY',
                                    'BENEFICIARY' ) ),
   constraint uq_report_customer_role unique ( report_id,
                                               customer_id,
                                               participant_role )
);

create table str_account (
   account_id        number generated always as identity primary key,
   report_id         number not null,
   account_number    varchar2(34) not null,
   account_type_code varchar2(20) not null,
   bank_name         varchar2(200) not null,
   bank_address      varchar2(500) not null,
   constraint fk_account_report foreign key ( report_id )
      references str_report ( report_id )
         on delete cascade,
   constraint fk_account_type foreign key ( account_type_code )
      references str_account_type ( account_type_code ),
   constraint chk_account_number check ( regexp_like ( account_number,
                                                       '^[A-Za-z0-9\-]{6,34}$' ) )
);

create table str_account_customer (
   account_customer_id number generated always as identity primary key,
   account_id          number not null,
   customer_id         number not null,
   owner_role          varchar2(20) default 'OWNER' not null,
   constraint fk_account_customer_account foreign key ( account_id )
      references str_account ( account_id )
         on delete cascade,
   constraint fk_account_customer_customer foreign key ( customer_id )
      references str_customer ( customer_id ),
   constraint uq_account_customer unique ( account_id,
                                           customer_id ),
   constraint chk_account_customer_role check ( owner_role in ( 'OWNER' ) )
);

create table str_supporting_document (
   document_id         number generated always as identity primary key,
   report_id           number not null,
   file_name           varchar2(255) not null,
   file_content        blob not null,
   document_name       varchar2(255) not null,
   document_type       varchar2(50) not null,
   document_identifier varchar2(200) not null,
   document_date       date not null,
   document_preparer   varchar2(200) not null,
   constraint fk_document_report foreign key ( report_id )
      references str_report ( report_id )
         on delete cascade,
   constraint chk_document_type
      check ( document_type in ( 'Contract',
                                 'Invoice',
                                 'Identity Evidence',
                                 'Audit Note',
                                 'Bank Statement',
                                 'Other' ) ),
   constraint chk_document_date check ( document_date <= trunc(sysdate) ),
   constraint chk_file_ext
      check ( regexp_like ( file_name,
                            '\.(pdf|doc|docx)$',
                            'i' ) )
);

create index idx_report_entity on
   str_report (
      reporting_entity_id
   );
create index idx_tx_report on
   str_transaction (
      report_id
   );
create index idx_report_customer_report on
   str_report_customer (
      report_id
   );
create index idx_report_customer_customer on
   str_report_customer (
      customer_id
   );
create index idx_account_report on
   str_account (
      report_id
   );
create index idx_account_customer_account on
   str_account_customer (
      account_id
   );
create index idx_account_customer_customer on
   str_account_customer (
      customer_id
   );
create index idx_customer_phone_customer on
   str_customer_phone (
      customer_id
   );
create index idx_document_report on
   str_supporting_document (
      report_id
   );

-- ============================================================
-- Seed lookup values expected by frontend dropdowns
-- ============================================================

insert into str_country (
   country_code,
   country_name
) values ( 'AFG',
           'Afghanistan' );
insert into str_country (
   country_code,
   country_name
) values ( 'IND',
           'India' );
insert into str_country (
   country_code,
   country_name
) values ( 'PAK',
           'Pakistan' );
insert into str_country (
   country_code,
   country_name
) values ( 'ARE',
           'United Arab Emirates' );
insert into str_country (
   country_code,
   country_name
) values ( 'SAU',
           'Saudi Arabia' );
insert into str_country (
   country_code,
   country_name
) values ( 'GBR',
           'United Kingdom' );
insert into str_country (
   country_code,
   country_name
) values ( 'USA',
           'United States' );
insert into str_country (
   country_code,
   country_name
) values ( 'CAN',
           'Canada' );
insert into str_country (
   country_code,
   country_name
) values ( 'DEU',
           'Germany' );
insert into str_country (
   country_code,
   country_name
) values ( 'FRA',
           'France' );
insert into str_country (
   country_code,
   country_name
) values ( 'TUR',
           'Turkey' );
insert into str_country (
   country_code,
   country_name
) values ( 'CHN',
           'China' );
insert into str_country (
   country_code,
   country_name
) values ( 'JPN',
           'Japan' );
insert into str_country (
   country_code,
   country_name
) values ( 'AUS',
           'Australia' );
insert into str_country (
   country_code,
   country_name
) values ( 'SGP',
           'Singapore' );

insert into str_currency (
   currency_code,
   currency_name
) values ( 'AFN',
           'Afghani' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'USD',
           'US Dollar' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'EUR',
           'Euro' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'GBP',
           'Pound Sterling' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'JPY',
           'Japanese Yen' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'CNY',
           'Chinese Yuan' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'INR',
           'Indian Rupee' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'PKR',
           'Pakistani Rupee' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'AED',
           'UAE Dirham' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'SAR',
           'Saudi Riyal' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'CAD',
           'Canadian Dollar' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'AUD',
           'Australian Dollar' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'CHF',
           'Swiss Franc' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'SEK',
           'Swedish Krona' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'NOK',
           'Norwegian Krone' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'DKK',
           'Danish Krone' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'SGD',
           'Singapore Dollar' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'HKD',
           'Hong Kong Dollar' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'TRY',
           'Turkish Lira' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'QAR',
           'Qatari Riyal' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'KWD',
           'Kuwaiti Dinar' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'BHD',
           'Bahraini Dinar' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'OMR',
           'Omani Rial' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'RUB',
           'Russian Ruble' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'ZAR',
           'South African Rand' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'MYR',
           'Malaysian Ringgit' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'THB',
           'Thai Baht' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'IDR',
           'Indonesian Rupiah' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'KRW',
           'South Korean Won' );
insert into str_currency (
   currency_code,
   currency_name
) values ( 'NZD',
           'New Zealand Dollar' );

insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'CASH_WITHDRAWAL',
           'CASH WITHDRAWAL' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'CHECK_WITHDRAWAL',
           'CHECK WITHDRAWAL' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'CASH_DEPOSIT',
           'CASH DEPOSIT' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'CHECK_DEPOSIT',
           'CHECK DEPOSIT' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'LETTER_TRANSFER',
           'LETTER TRANSFER' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'IN_INT_TRANSFER',
           'INBOUND INTERNATIONAL TRANSFER' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'OUT_INT_TRANSFER',
           'OUTBOUND INTERNATIONAL TRANSFER' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'IN_NAT_TRANSFER',
           'INBOUND NATIONAL TRANSFER' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'OUT_NAT_TRANSFER',
           'OUTBOUND NATIONAL TRANSFER' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'LOAN_REPAYMENT',
           'LOAN REPAYMENT' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'LOAN',
           'LOAN' );
insert into str_transaction_type (
   transaction_type_code,
   transaction_type_name
) values ( 'FOREIGN_EXCHANGE',
           'FOREIGN EXCHANGE' );

insert into str_account_type (
   account_type_code,
   account_type_name
) values ( 'SAVINGS',
           'SAVINGS' );
insert into str_account_type (
   account_type_code,
   account_type_name
) values ( 'CURRENT',
           'CURRENT' );
insert into str_account_type (
   account_type_code,
   account_type_name
) values ( 'LOAN',
           'LOAN' );
insert into str_account_type (
   account_type_code,
   account_type_name
) values ( 'FIXED_DEPOSIT',
           'FIXED DEPOSIT' );

insert into str_phone_type (
   phone_type_code,
   phone_type_name
) values ( 'HOME',
           'Home Phone' );
insert into str_phone_type (
   phone_type_code,
   phone_type_name
) values ( 'BUSINESS',
           'Business Phone' );
insert into str_phone_type (
   phone_type_code,
   phone_type_name
) values ( 'MOBILE',
           'Mobile Phone' );

insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'TERRORIST_FIN',
           'Terrorist Financing' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'MONEY_LAUNDER',
           'Money Laundering' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'CORRUPTION',
           'Corruption and Bribery' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'DRUG_TRAFFIC',
           'Drug Trafficking' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'KIDNAPPING',
           'Kidnapping' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'ORG_CRIME',
           'Organized Crime' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'HUMAN_TRAFFIC',
           'Human Trafficking' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'ARMS_TRAFFIC',
           'Arms Trafficking' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'FRAUD',
           'Fraud' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'TAX_CRIMES',
           'Tax Crimes' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'FORGERY',
           'Forgery' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'WIRE_FRAUD',
           'Wire Fraud' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'ASSET_REG',
           'Asset Registration' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'PIRACY',
           'Piracy' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'SMUGGLING',
           'Smuggling' );
insert into str_suspicion_category (
   suspicion_category_code,
   suspicion_category_name
) values ( 'ROBBERY',
           'Robbery' );
