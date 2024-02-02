import { useState } from "react";
import { SearchRiseSet, PairLongitude } from "astronomy-engine";
import GeoFindMe from "./components/geoLocation";
import DayCard from "./components/displayCards/dayCard";
import FastingCard from "./components/displayCards/fastingCard";
import Swara from "./components/displayCards/swarCard";
import Loader from "./components/loader";
import "./styles/App.css";

function App() {
  const [location, setLocation] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [tithiDay, setTithiDay] = useState(null);
  const [dataReady, setDataReady] = useState(false);

  const handleLocationUpdate = (newLocation) => {
    const pullLocation = newLocation;
    setLocation(pullLocation);

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
  };

  console.log(location);

  return (
    <div>
      <div>
        <Loader />
        <br />
      </div>
      <GeoFindMe setLocation={handleLocationUpdate} />
      <div>{dataReady && <DayCard sunrise={sunrise} sunset={sunset} tithiDay={tithiDay} />}</div>
      <br />
      <div>{dataReady && <FastingCard tithiDay={tithiDay} />}</div>
      <br />
      <div>{dataReady && <Swara sunrise={sunrise} tithiDay={tithiDay} />}</div>
      <br />
    </div>
  );
}

export default App;
