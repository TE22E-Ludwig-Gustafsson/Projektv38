# Kursportal

En webbapplikation byggd med **Vue.js (frontend)**, **Node.js + Express (backend)** och **MongoDB Atlas (databas)**.  
Projektet utvecklas enligt **Agile-metodik** med sprintar, backlog..  

---

## Mål

Målet är att skapa en applikation där användare kan registrera, logga in och Se tillagda kurser. Admin roll ska finnas där admins kan lägga till, ändra och ta bort kurser från kurslistan.

---

## Teknik
- **Frontend:** Vue.js  
- **Backend:** Node.js + Express  
- **Databas:** MongoDB Atlas  
- **Arbetsmetod:** Agile (sprintar, backlog, demo)  

---

## Funktioner
- Registrering av nya användare  
- Inloggning med JWT-autentisering  
- Lista alla objekt  
- (Admin) Lägga till nya objekt  
- (Admin) Uppdatera och ta bort objekt  

---

## Backlog

### Sprint 1 – Grundläggande funktioner
**Mål:** Få igång användarhantering och grundläggande visning av objekt.  
- **User Stories:**
  1. Som användare och admin vill jag kunna registrera konto och logga in för att komma åt sidan.  
  2. Som användare och admin vill jag kunna se en lista med objekt så att jag får en översikt.  

---

### Sprint 2 – Skapa och uppdatera objekt
**Mål:** Möjliggöra att admin kan lägga till och redigera objekt.  
- **User Stories:**
  1. Som admin vill jag kunna lägga till nya objekt så att jag kan uppdatera sidan.  
  2. Som admin vill jag kunna ändra information om objekt.  

---

### Sprint 3 – Ta bort objekt och förbättringar
**Mål:** Slutföra CRUD-funktionaliteten och förbättra användarupplevelsen.  
- **User Stories:** 
  1. Som användare vill jag ha bättre feedback och felmeddelanden vid interaktioner.  
  2. Som användare vill jag ha grundläggande responsiv design på gränssnittet.

---

## Arkitektur

![Strukturdiagram](../Projektv38/Backend%20(1).png)

 
**Flöde:**
Flöde: Användaren interagerar med frontend (Vue.js) → frontend skickar HTTP-förfrågningar till backend API (Express) → backend hanterar logik och kommunicerar med databasen (MongoDB Atlas) → data skickas tillbaka via backend till frontend för visning.

---

## Installation

1. Klona repo:  
   ```bash
   git clone https://github.com/TE22E-Ludwig-Gustafsson/Projektv38