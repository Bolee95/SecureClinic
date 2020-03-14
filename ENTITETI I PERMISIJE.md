
=====================================
========== ULOGE I OZNAKE ===========
=====================================
|    oznaka      |    korisnik      |
-------------------------------------
|       A        |      ADMIN       |
-------------------------------------
|       U        |      USER        |
-------------------------------------
|      DOC       |     DOCTOR       |
-------------------------------------
|       T        |    TECHNICAL     |
-------------------------------------
|      DIR       |    DIRECTOR      |
=====================================

=====================================
========= OZNAKE PODATAKA ===========
=====================================
|    oznaka      |    znacenje      |
-------------------------------------
|     -//-       |   javni podaci   |
-------------------------------------
|      PD        |  private data    |
=====================================    


=====================================
========== FUNKCIJE UGOVORA =========
===============================================================================================================
|       Ugovor      |       Funkcija        |       Parametri f-je        |       Dozvola za izvrsenje        |
|-------------------------------------------------------------------------------------------------------------|
|      Pacient      |      getPacient       |      pacientKey (lbo)       |             DOC, DIR              |
|                   |      addPacient       |       pacient (Model)       |               DOC                 |
|                   |     pacientExists     |      pacientKey (lbo)       |               DOC                 |
|                   |     updatePacient     |       pacient (Model)       |               DOC                 |
|                   |     removePacient     |      pacientKey (lbo)       |               DIR                 |
|                   |     getAllPacients    |            -//-             |               DOC                 |
|-------------------------------------------------------------------------------------------------------------|
|    Pacient PD     | addPacientPrivateData |     privateData(Model)      |             DOC,DIR               |
|                   | getPacientPrivateData |   pacientKey (uniqueId)     |             DOC,DIR               |
|                   |    updatePacientPD    |     privateData(Model)      |             DOC,DIR               |
|-------------------------------------------------------------------------------------------------------------|
|     Hospital      |     addHospital       |      hospital (Model)       |                A                  |
|                   |     getHospital       |       hospitalCode          |            DOC, U, T              |
|                   |    updateHospital     |      hospital (Model)       |                A                  |
|                   |    getAllHospitals    |           -//-              |             DOC, U                |
|-------------------------------------------------------------------------------------------------------------|
|     Facility      |     addFacility       |      facility (Model)       |                A                  | 
|                   |     getFacility       |       facilityCode          |                A       		      |
|                   |    updateFacility     |      facility (Model)       |                A                  |
|                   |    removeFacility     |       facilityCode          |                A                  |
|-------------------------------------------------------------------------------------------------------------|
|     Pending       |     addPending        |       pending (Model)       |               DOC                 |
|                   |     getPending        | [hCode, sCode, oCode, lbo]  |          U, DOC, DIR, T           |
|                   |    updatePending      |       pending (Model)       |            DOC,DIR, T             |
|                   |    getAllPendings     |           -//-              |                A                  |
|                   | getAllPendingsHospital|        hospitalCode         |           DOC, DIR, T             |
|                   |    removePending      | [hCode, sCode, oCode, lbo]  |           -//- (AUTO)             | 
|-------------------------------------------------------------------------------------------------------------|
|   WaitingList     |    addWaitingList     |        list (Model)         |             DIR, A                |
|                   |    getWaitingList     |          listId             |             DOC, U                |
|                   |   updateWaitingList   |        list (Model)         |           -//- (AUTO?)            |
|                   |  getAllWaitingLists   |           -//-              |           DOC, DIR, A             |
|                   |  getAllWLForHospital  |        hospitalCode         |            DOC, DIR               | 
|-------------------------------------------------------------------------------------------------------------|
|     Ammend        |      addAmmend        |     ammend (Model)          |          T, DOC, DIR              |
|                   |      getAmmend        |        ammendId             |          T, DOC, DIR              |
|                   |     updateAmmend      |     ammend (Model)          |          T, DOC, DIR              |
|                   |     removeAmmend      |        ammendId             |           -//- (AUTO)             |
|                   |    getAllAmmends      |           -//-              |               A                   |
|                   | getAllAmmendsForHosp  |      hospitalCode           |          T, DOC, DIR              | 
|-------------------------------------------------------------------------------------------------------------|