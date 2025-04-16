import { addDays } from "date-fns";
import { SearchRiseSet } from "astronomy-engine";

// krivi time daje, doraditi kod ..

export default function GregorianToVedicTime(currentTime, location) {
  const pulledLocation = location;

  const currentDate = new Date();
  const nextDay = addDays(currentDate, 1);
  const sunriseToday = SearchRiseSet("Sun", pulledLocation, +1, currentDate, -1, 0.0).date;
  const sunrisePrevious = SearchRiseSet("Sun", pulledLocation, +1, nextDay, -1, 0.0).date;
  console.log(sunriseToday);

  const sunrise = currentTime >= sunriseToday ? sunriseToday : sunrisePrevious;

  let diffSeconds = (currentTime - sunrise) / 1000; // kao float

  const totalVipal = diffSeconds / 0.4; // 1 vipal = 0.4 sekunde

  const ghati = Math.floor(totalVipal / 3600); // 1 ghati = 3600 vipal
  const remainingAfterGhati = totalVipal % 3600;

  const pal = Math.floor(remainingAfterGhati / 60); // 1 pal = 60 vipal
  const vipal = Math.floor(remainingAfterGhati % 60);

  return `Vedic time: ${ghati} ghati, ${pal} pal, ${vipal} vipal`;
}
