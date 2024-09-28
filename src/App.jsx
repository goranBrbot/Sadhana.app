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

    function scheduleNotification() {
      const now = new Date();
      const sunriseTime = new Date(sunrise);

      // Ako je trenutni dan, ali već nakon izlaska sunca, postavi za sljedeći dan
      if (now > sunriseTime) {
        sunriseTime.setDate(sunriseTime.getDate() + 1);
      }

      const timeUntilSunrise = sunriseTime.getTime() - now.getTime();
      // Postavi tajmer za slanje notifikacije u trenutku izlaska sunca
      setTimeout(() => {
        sendNotification();
        setNotificationSent(true); // Označimo da je notifikacija poslana za taj dan
      }, timeUntilSunrise);
    }

    if (dataReady && !notificationSent) {
      requestNotificationPermission();
      scheduleNotification();
    }
  }, [dataReady, sunrise, tithiDay, swaraText, notificationSent]);

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
