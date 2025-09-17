# Kursportal

En webbapplikation byggd med **Vue.js (frontend)**, **Node.js + Express (backend)** och **MongoDB Atlas (databas)**.  
Projektet utvecklas enligt **Agile-metodik** med sprintar, backlog och versionshantering i **GitHub**.  

---

## Mål

Målet är att skapa en applikation där användare kan logga in, hantera data (visa, lägga till, uppdatera och ta bort objekt) och lagra informationen säkert i molnet.

---

## Teknik
- **Frontend:** Vue.js  
- **Backend:** Node.js + Express  
- **Databas:** MongoDB Atlas  
- **Versionshantering:** Git + GitHub  
- **Arbetsmetod:** Agile (sprintar, backlog, demo)  

---

## Funktioner
- Registrering av nya användare  
- Inloggning med JWT-autentisering  
- Lista alla objekt  
- Lägga till nya objekt  
- Uppdatera och ta bort objekt  

---

## Backlog

### Sprint 1 – Grundläggande funktioner
**Mål:** Få igång användarhantering och grundläggande visning av objekt.  
- **User Stories:**
  1. Som användare vill jag kunna logga in för att komma åt systemet.  
  2. Som användare vill jag kunna se en lista med objekt så att jag får en översikt.  

---

### Sprint 2 – Skapa och uppdatera objekt
**Mål:** Möjliggöra att användaren kan lägga till och redigera objekt.  
- **User Stories:**
  1. Som användare vill jag kunna lägga till nya objekt så att jag kan uppdatera systemet.  
  2. Som användare vill jag kunna ändra information om objekt.  

---

### Sprint 3 – Ta bort objekt och förbättringar
**Mål:** Slutföra CRUD-funktionaliteten och förbättra användarupplevelsen.  
- **User Stories:**
  1. Som användare vill jag kunna ta bort objekt som inte längre behövs.  
  2. Som användare vill jag ha bättre feedback och felmeddelanden vid interaktioner.  
  3. Som användare vill jag ha grundläggande responsiv design på gränssnittet.

---

## Arkitektur

![Strukturdiagram](../diagram2.png)


**Flöde:**
Flöde: Användaren interagerar med frontend (Vue.js) → frontend skickar HTTP-förfrågningar till backend API (Express) → backend hanterar logik och kommunicerar med databasen (MongoDB Atlas) → data skickas tillbaka via backend till frontend för visning.

---

## Installation

1. Klona repo:  
   ```bash
   git clone https://github.com/Username/projectName