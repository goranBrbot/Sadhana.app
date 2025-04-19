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
import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

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

  const handleLocationUpdate = (newLocation) => {
    const pullLocation = newLocation.pozicija;
    const pullLocationName = newLocation.adresa;
    setLocation(pullLocation);
    setLocationName(pullLocationName);
    console.log("Location updated:", pullLocation, pullLocationName);

    const SunRise = SearchRiseSet("Sun", pullLocation, +1, new Date(), -1, 0.0);
    const SunSet = SearchRiseSet("Sun", pullLocation, -1, new Date(), -1, 0.0);
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

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
      <React.Fragment>
        <IconButton variant='text' size='small' style={{ position: "absolute", top: "10px", right: "10px" }} onClick={handleClickOpen}>
          <InfoSharpIcon variant='contained' fontSize='small' style={{ color: "rgba(27, 27, 27, 0.25)" }}></InfoSharpIcon>
        </IconButton>
        <BootstrapDialog fullScreen onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
          <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
            About app
          </DialogTitle>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}>
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Typography gutterBottom>
              The application works based on the allowed access to the user location. By granting access to the user location, current data on the <strong>geographic latitude and longitude</strong> of
              that location is obtained. Taking into account the obtained location, the current <strong>sunrise</strong> and sunset visible from that location are calculated.
            </Typography>
            <Typography gutterBottom>
              After calculating the sunrise by subtracting 96 minutes from the sunrise we calculate the <strong>Brahmamuhurta</strong> time lasting 48 minutes.
            </Typography>
            <Typography gutterBottom>
              Then we calculate the <strong>Tithi</strong> (lunar day and bright <strong>Shukla Pakṣa</strong> - dark <strong>Kṛṣṇa Navamī</strong> fortnight) which is approximately 1/30th of the time
              it takes the Moon to go around the Earth, i.e. the period in which the difference between the longitudes of the Moon and the Sun is exactly 12°. A Tithi can start at different times of
              the day and can also vary in duration from approximately 19 to 26 hours so a particular day is governed by the Tithi prevailing on that day at the time of sunrise, but it can change at
              any time of the day or night as it is not based on a solar day, but on the position of the Moon in relation to the Sun.
            </Typography>
            <Typography gutterBottom>The above calculations are the basis for further calculations of other application possibilities.</Typography>
            <Typography gutterBottom>We calculate the active swara (dominant nostril) with which the current lunar day begins at sunrise based on verses 63-64 of Shiv Swarodaya shastra.</Typography>
            <Typography gutterBottom>
              <strong>
                &quot;During the first three days of “Shuklapaksha” (the bright fortnight), the Ida flows and then alternates. (1st,2nd,3rd-IDA, 4th,5th,6th Pingla, thus they keep alternating). While,
                conversely, during the first three days of “Krishnapaksha” (the dark fortnight), the Pingala flows first. (1st,2nd,3rd PINGLA, 4th 5th,6th IDA thus they alternate).&quot;
              </strong>
            </Typography>
            <Typography gutterBottom>
              <strong>
                &quot;In the bright fortnight, the lunar swara (Ida) rises from the time of sunrise and continues till the time span of two & a half Ghadis (60 minutes). In the dark fortnight, the
                solar Swara (Pingala) rises first. So, these swaras flow alternately for a period of two-and-a half ghadis (60 minutes) throughout the twenty four hours of a day.&quot;
              </strong>
            </Typography>
            <Typography gutterBottom>Here are three main lunar phases for fasting.</Typography>
            <Typography gutterBottom>
              <strong>Amāvásyā</strong> is the lunar phase of the new moon and <strong>Pūrṇimā</strong> is the lunar phase of the full moon.
            </Typography>
            <Typography gutterBottom>
              While on the eleventh day of each lunar cycle, the Moon forms a trine with the Earth and the Sun during which the distance between the Moon and the Sun is in the range of 120-132 degrees
              on <strong>Shukla Pakṣa Ekadashi</strong> and in the range of 300-312 degrees on <strong>Kṛṣṇa Pakṣa Ekadashi</strong>. Therefore, Ēkādaśī is the eleventh lunar day (tithi) in the waxing
              (Shukla Pakṣa) and waning (Kṛṣṇa Pakṣa) lunar cycle.
            </Typography>
          </DialogContent>
        </BootstrapDialog>
      </React.Fragment>

      {/* <div>{ <Loader isVisible={loader} /> }</div> */}
      {/* <GeoFindMe setLocation={handleLocationUpdate} /> */}
      <div>
        <GeoFindMe setLocation={handleLocationUpdate} />
      </div>
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
