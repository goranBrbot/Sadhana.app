import express from "express";
import webPush from "web-push";
import dotenv from "dotenv";

dotenv.config(); // Učitaj varijable iz .env datoteke

const app = express();
app.use(express.json()); // Omogućava parsiranje JSON tijela zahtjeva

// Sada možeš koristiti varijable iz .env
const publicVapidKey = process.env.VITE_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VITE_VAPID_PRIVATE_KEY;

// Provjera da su VAPID ključevi postavljeni
if (!publicVapidKey || !privateVapidKey) {
  console.error("VAPID ključevi nisu ispravno postavljeni.");
  process.exit(1); // Prekid programa ako ključevi nisu postavljeni
}

// Provjera da su ključevi postavljeni
console.log("Public VAPID Key:", publicVapidKey);
console.log("Private VAPID Key:", privateVapidKey);

// Konfigurirajte VAPID detalje
webPush.setVapidDetails(
  "mailto:goran.brbot@gmail.com", // Zamijenite sa vašom email adresom
  publicVapidKey,
  privateVapidKey
);

// Endpoint za slanje notifikacija
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  const payload = JSON.stringify({
    title: "Naslov",
    body: "Poruka",
  }); // Podaci koji će biti poslani u notifikaciji

  // Pošaljite notifikaciju
  webPush
    .sendNotification(subscription, payload)
    .then((response) => {
      console.log("Notifikacija poslana:", response);
      res.status(200).send("Notifikacija poslana."); // Potvrda klijentu
    })
    .catch((error) => {
      console.error("Greška prilikom slanja notifikacije:", error);
      res.sendStatus(500); // Ako dođe do greške, pošaljite 500 status
    });
});

// Pokrenite server
const PORT = process.env.PORT || 3000; // Koristite port iz varijable okruženja ili 3000
app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});
