
--------------------------------------------------------------
**********************Pacient*********************************
--------------------------------------------------------------
__PUBLIC DATA__
- name
- surname
- **lbo**
- jmbg
- id
- curent_waiting_status
- hospital_name
- waiting_list_code
- hospital_code

__PRIVATE DATA__
- sick_history (array)
-- code -> active/non_active flag (?)
- id (foreignKey)
- card_id
- docs_id (array)
-- file_id -> valid_flag

-----------------------------------------------------------------
***********************Hospital**********************************
-----------------------------------------------------------------
__PUBLIC DATA__
- id
- name
- public 
- **hospital_code** 
- city
- list_of_ordinations (array)
-- ordiantion_code
- services (array)
-- code -> Number
-- day_capacity -> Number
- entities (array)
-- name -> String
-- role -> String
-- work_licence_id -> String

-----------------------------------------------------------------
***********************Facility**********************************
-----------------------------------------------------------------
__PUBLIC DATA__
- name 
- **code** 
- services (array)
-- code -> String
-- name -> String
-- max_waiting_time -> Number

-----------------------------------------------------------------
**********************Pending***********************************
-----------------------------------------------------------------
__PUBLIC DATA__
- **hospital_code**
- pendings (array)
-- jmbg
-- lbo
-- list_id
-- service_code
-- ordination_code
-- approvers (array)
--- role -> String
--- work_licence_id --> String

-----------------------------------------------------------------
**********************WaitingList*******************************
-----------------------------------------------------------------

***WaitingList list_id = hospital_code + ordination_code + service_code***

__PUBLIC DATA__
- **list_id**
- service_code
- ordination_code
- hospital_code
- pacients (array)
-- id -> String
-- place -> Number
-- date_of_placement -> Date
-- expected_time_waiting_days -> Number
-- pacient_score -> Number

-----------------------------------------------------------------
**********************WaitingListAmmend*************************
-----------------------------------------------------------------

***ammand_type can have values***
- // PACIENT_INITED
- // TEHNICAL
- // MEDICAL

__PUBLIC DATA__
- **hospital_code**
- ammands (array)
-- ammand_type -> String
-- pacient_jmbg -> String
-- action -> String (Optional)
-- number_of_needed_endorsments -> Number
-- list_id -> String
-- evidencies_docs (array)
--- doc_id -> String
-- approvers (array)
--- role -> String
--- work_licence_id -> String