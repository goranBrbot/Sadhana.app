import { useState, useEffect } from "react";
import { SearchRiseSet, PairLongitude } from "astronomy-engine";
import GeoFindMe from "./components/geoLocation";
import DayCard from "./components/displayCards/dayCard";
import FastingCard from "./components/displayCards/fastingCard";
import Swara from "./components/displayCards/swarCard";
// import Loader from "./components/loader";
import "./styles/App.css";

function App() {
  const [location, setLocation] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [tithiDay, setTithiDay] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [swaraText, setSwaraText] = useState("");
  const [notificationSent, setNotificationSent] = useState(false);
  // const [loader, setLoader] = useState(false);

  const handleLocationUpdate = (newLocation) => {
    const pullLocation = newLocation;
    setLocation(pullLocation);
    console.log(location);

    const SunRise = SearchRiseSet("Sun", pullLocation, +1, new Date(), -1, 0.0);
    const SunSet = SearchRiseSet("Sun", pullLocation, -1, new Date(), -1, 0.0);
    setSunrise(SunRise.date);
    setSunset(SunSet.date);

    const razlikaMoonSun = PairLongitude("Moon", "Sun", SunRise.date);
    const tithiPeriod = razlikaMoonSun / 12;
    const calculatedTithiDay = Math.floor(tithiPeriod) + 1;
    setTithiDay(calculatedTithiDay);
    console.log(calculatedTithiDay);

    setDataReady(true);
    // setLoader(true);
  };

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

  // Implementacija notifikacija
  useEffect(() => {
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
        await fetch("https://sadhana-app.vercel.app/subscribe", {
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

    function scheduleNotification() {
      const now = new Date();
      const nextSunRise = SearchRiseSet("Sun", location, +1, new Date(), 1, 0.0);
      const sunriseTime = new Date(nextSunRise.date);

      // Postavi tajmer za slanje notifikacije u trenutku izlaska sunca
      const timeUntilSunrise = sunriseTime.getTime() - now.getTime();

      setTimeout(() => {
        sendNotification();
        setNotificationSent(true); // Označimo da je notifikacija poslana za taj dan
      }, timeUntilSunrise);
    }

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
      <GeoFindMe setLocation={handleLocationUpdate} />
      <div>{dataReady && <DayCard sunrise={sunrise} sunset={sunset} tithiDay={tithiDay} />}</div>
      <br />
      <div>{dataReady && <FastingCard tithiDay={tithiDay} />}</div>
      <br />
      <div>{dataReady && <Swara sunrise={sunrise} tithiDay={tithiDay} onTextGenerated={setSwaraText} />}</div>
      <br />
    </div>
  );
}

export default App;
