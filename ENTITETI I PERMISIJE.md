
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
|       PD       |  private data    |
=====================================    


=====================================
========== FUNKCIJE UGOVORA =========
===============================================================================================================
|       Ugovor      |       Funkcija        |       Parametri f-je        |       Dozvola za izvrsenje        |
---------------------------------------------------------------------------------------------------------------
|      Pacient      |      getPacient       |      pacientKey (lbo)       |             DOC, DIR              |
|                   |      addPacient       |       pacient (Model)       |               DOC                 |
|                   |     pacientExists     |      pacientKey (lbo)       |               DOC                 |
|                   |     updatePacient     |       pacient (Model)       |               DOC                 |
|                   |     removePacient     |      pacientKey (lbo)       |               DIR                 |
|                   |     getAllPacients    |            -//-             |               DOC                 |
---------------------------------------------------------------------------------------------------------------
|    Pacient PD     | addPacientPrivateData |     privateData(Model)      |               DOC                 |
|                   | getPacientPrivateData |   pacientKey (uniqueId)     |               DOC                 |
|                   |    updatePacientPD    |     privateData(Model)      |               DOC                 |
---------------------------------------------------------------------------------------------------------------
|     Hospital      |     addHospital       |      hospital (Model)       |                A                  |
|                   |     getHospital       |       hospitalCode          |            DOC, U, T              |
|                   |    updateHospital     |      hospital (Model)       |                A                  |
|                   |    getAllHospitals    |           -//-              |             DOC, U                |
---------------------------------------------------------------------------------------------------------------
|     Facility      |     addFacility       |      facility (Model)       |             A, DIR                | 
|                   |     getFacility       |       facilityCode          |             A, DIR                |
|                   |    updateFacility     |      facility (Model)       |             A, DIR                |
|                   |    removeFacility     |       facilityCode          |             A, DIR                |
---------------------------------------------------------------------------------------------------------------
|     Pending       |     addPending        |       pending (Model)       |               DOC                 |
|                   |     getPending        | [hCode, sCode, oCode, lbo]  |          U, DOC, DIR, T           |
|                   |    updatePending      |       pending (Model)       |               DOC                 |
|                   |    getAllPendings     |           -//-              |                A                  |
|                   | getAllPendingsHospital|        hospitalCode         |           DOC, DIR, T             |
|                   |    removePending      | [hCode, sCode, oCode, lbo]  |           -//- (AUTO)             | 
---------------------------------------------------------------------------------------------------------------
|   WaitingList     |    addWaitingList     |        list (Model)         |             DIR, A                |
|                   |    getWaitingList     |          listId             |             DOC, U                |
|                   |   updateWaitingList   |        list (Model)         |             DIR, A                |
|                   |  getAllWaitingLists   |           -//-              |           DOC, DIR, A             |
|                   |  getAllWLForHospital  |        hospitalCode         |            DOC, DIR               | 
---------------------------------------------------------------------------------------------------------------
|     Ammand        |      addAmmend        |     ammand (Model)          |          T, DOC, DIR              |
|                   |      getAmmand        |        ammandId             |          T, DOC, DIR              |
|                   |     updateAmmand      |     ammand (Model)          |          T, DOC, DIR              |
|                   |     removeAmmand      |        ammandId             |           -//- (AUTO)             |
|                   |    getAllAmmands      |           -//-              |               A                   |
|                   | getAllAmmandsForHosp  |      hospitalCode           |          T, DOC, DIR              | 
---------------------------------------------------------------------------------------------------------------