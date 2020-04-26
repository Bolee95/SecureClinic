#Backend Refactoring and API creation
1) Proci kroz kreirane metode za komunikaciju sa backendom, zameniti cmd argumente sa parametrima i odraditi default export za svaku **DONE**
2) Kreirati servise za svakog korisnika u aplikaciji koja ce prosledjivati pozive ka refaktorisanim metodama **DONE**
3) Kreirati API servis koriscenjem ExpressJS za svaku metodu (prouciti prosledjivanje argumenta kroz query)
4) Kreirati test pozive koriscenjem Postman alata i testirati novokreirani API


Proveriti:
addNewEvidenceToAmmend - na putanji Logic/Shared/Ammend
PacientPrivateData - koji id se koristi

https://github.com/IBM-Blockchain/ansible-examples -> Kako odraditi deployment lokalni za dve ogranizacije sa dva cvora
Da li dobro radi DELETE metoda kod API poziva?
Da li treba uniqueID za bilo sta da se prosledjuje kroz api, tj da se izracunava vam backenda?



TODO:
- Ubaciti error propagaciju u backendu, a uhvatiti greske u Servisima. Rezultat apiju vracamo kroz res ili error, popunjavaju se oba zavisno sta se vrati iz servisa. znaci ide (res, error) kao rezultat poziva funkcije