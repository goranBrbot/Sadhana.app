import { useState, useEffect } from "react";
import { SearchRiseSet, PairLongitude } from "astronomy-engine";
import GeoFindMe from "./components/geoLocation";
import DayCard from "./components/displayCards/dayCard";
import FastingCard from "./components/displayCards/fastingCard";
import FestivalCard from "./components/displayCards/festivalCard";
import Swara from "./components/displayCards/swarCard";
import Choghadiya from "./components/displayCards/choghadiya";
// import Loader from "./components/loader";
import "./styles/App.css";

function App() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [tithiDay, setTithiDay] = useState(null);
  const [swaraText, setSwaraText] = useState("");
  const [dataReady, setDataReady] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  // const [loader, setLoader] = useState(false);

  // Service Worker u vite.config kešira slike a ovdje preloada za učitavanje slika unaprijed ..
  const preloadImages = (imageUrls) => {
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => console.log(`Image loaded: ${url}`);
      img.onerror = () => console.error(`Failed to load image: ${url}`);
    });
  };

  useEffect(() => {
    const imageUrls = [
      "favicon.svg",
      "/icons/map-pin.png",
      "/icons/sun.png",
      "/backgrounds/daycard.png",
      "/backgrounds/swarcard.png",
      "/backgrounds/gurudev.png",
      "/backgrounds/choghadiyacard.png",
      "/backgrounds/fastingcard.png",
      "/backgrounds/festivalcard.png",
      // Dodati sve slike koje treba preloadati!
    ];
    preloadImages(imageUrls);
  }, []);

  const handleLocationUpdate = (newLocation) => {
    const pullLocation = newLocation.pozicija;
    const pullLocationName = newLocation.adresa;
    setLocation(pullLocation);
    setLocationName(pullLocationName);
    console.log("Location updated:", pullLocation, pullLocationName);

    const SunRise = SearchRiseSet("Sun", pullLocation, +1, new Date(), -1, 0.0);
    const SunSet = SearchRiseSet("Sun", pullLocation, -1, SunRise.date, 1, 0.0);
    setSunrise(SunRise.date);
    setSunset(SunSet.date);
    console.log(SunRise.date, SunSet.date);

    const razlikaMoonSun = PairLongitude("Moon", "Sun", SunRise.date);
    const tithiPeriod = razlikaMoonSun / 12;
    const calculatedTithiDay = Math.ceil(tithiPeriod);
    setTithiDay(calculatedTithiDay);
    console.log(calculatedTithiDay);

    setDataReady(true);
    // setLoader(true);
  };

  const updateSwaraText = (generatedText) => {
    const newText = generatedText;
    setSwaraText(newText);
  };

  // Implementacija notifikacija

  /*const publicVapidKey = process.env.VITE_VAPID_PUBLIC_KEY;*/
  const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  // Funkcija za konverziju VAPID ključa iz Base64 formata
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  useEffect(() => {
    function sendNotification() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker.ready
          .then((registration) => {
            registration.showNotification("Day starts with ..", {
              body: `${swaraText}`,
              icon: "favicon.ico",
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: "swara",
              requireInteraction: true, // Ostavlja notifikaciju dok korisnik ne reagira
            });
          })
          .catch((error) => {
            console.log("ServiceWorker not ready: ", error);
          });
      }
    }

    async function requestNotificationPermission() {
      if ("Notification" in window && "serviceWorker" in navigator && "PushManager" in window) {
        // Provjera je li korisnik već dao ili odbio dozvolu
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            console.log("Korisnik je dao dozvolu za prikazivanje notifikacija.");
          } else if (permission === "denied") {
            console.log("Korisnik je odbio dozvolu za prikazivanje notifikacija.");
          }
        }
      }
    }

    async function subscribeUser() {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
        console.log("Korisnik je pretplaćen:", subscription);

        /* // Ovdje možeš dobiti p256dh i auth ključeve
        const p256dh = subscription.getKey("p256dh");
        const auth = subscription.getKey("auth");

        console.log("p256dh:", btoa(String.fromCharCode(...new Uint8Array(p256dh))));
        console.log("auth:", btoa(String.fromCharCode(...new Uint8Array(auth)))); */

        // Pošalji pretplatu backend serveru
        const backendUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/subscribe" // ili port gdje backend radi
            : "https://swaryog.sanatankultura.com/subscribe"; // URL produkcije

        await fetch(`${backendUrl}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });
      } catch (error) {
        console.error("Greška prilikom pretplate korisnika na push notifikacije:", error);
      }
    }

    async function scheduleNotification() {
      const now = new Date();
      const nextSunRise = SearchRiseSet("Sun", location, +1, new Date(), 1, 0.0);
      const sunriseTime = new Date(nextSunRise.date);

      // Postavi tajmer za slanje notifikacije u trenutku izlaska sunca
      const timeUntilSunrise = sunriseTime.getTime() - now.getTime();
      if (timeUntilSunrise > 0) {
        setTimeout(() => {
          sendNotification();
          setNotificationSent(true); // Označimo da je notifikacija poslana za taj dan
        }, timeUntilSunrise);
      }
    }

    if (dataReady && !notificationSent) {
      requestNotificationPermission().then(() => {
        subscribeUser(); // Poziv na pretplatu
        scheduleNotification(); // Planiranje slanja notifikacije
      });
    }
  }, [location, publicVapidKey, dataReady, sunrise, tithiDay, swaraText, notificationSent]);

  return (
    <div>
      {/* <div>{ <Loader isVisible={loader} /> }</div> */}
      {/* <GeoFindMe setLocation={handleLocationUpdate} /> */}
      <GeoFindMe setLocation={handleLocationUpdate} />
      <div>{dataReady && <DayCard sunrise={sunrise} sunset={sunset} location={location} locationName={locationName} />}</div>
      <br />
      <div>{dataReady && <Swara sunrise={sunrise} tithiDay={tithiDay} setSwaraText={updateSwaraText} />}</div>
      <br />
      <div>{dataReady && <Choghadiya sunrise={sunrise} sunset={sunset} />}</div>
      <br />
      <div>{dataReady && <FastingCard tithiDay={tithiDay} />}</div>
      <br />
      <div>{dataReady && <FestivalCard location={location} tithiDay={tithiDay} />}</div>
    </div>
  );
}

export default App;
