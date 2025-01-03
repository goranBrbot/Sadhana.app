import { format, addYears } from "date-fns";
import { PairLongitude, SearchRiseSet, Equator } from "astronomy-engine";

// Bazirano na Purnimanta sistemu
export default function Panchang(date, location) {
  const pulledLocation = location;
  const SunRise = SearchRiseSet("Sun", pulledLocation, +1, new Date(date), -1, 0.0);
  const tropicalSunLongitude = Equator("Sun", date, pulledLocation, true, true).ra * 15;

  function getSiderealMoonLongitude() {
    const ayanamsha = 24.210517; // Vrijednost Ayanamsha za 2024. godinu (Lahiri Ayanamsha)
    const tropicalMoonLongitude = Equator("Moon", date, pulledLocation, true, true).ra * 15;
    return (tropicalMoonLongitude - ayanamsha + 360) % 360;
  }

  function getSiderealSunLongitude() {
    const ayanamsha = 24.210517; // Vrijednost Ayanamsha za 2024. godinu (Lahiri Ayanamsha)
    const tropicalSunLongitude = Equator("Sun", date, pulledLocation, true, true).ra * 15;
    return (tropicalSunLongitude - ayanamsha + 360) % 360;
  }

  function getTithi() {
    const razlikaMoonSun = PairLongitude("Moon", "Sun", SunRise.date);
    const tithiPeriod = razlikaMoonSun / 12;
    const calculatedTithiDay = Math.ceil(tithiPeriod);
    if (calculatedTithiDay <= 15) {
      return calculatedTithiDay;
    } else if (calculatedTithiDay > 15) {
      return calculatedTithiDay - 15;
    }
  }

  function getPaksha() {
    const tithi = getTithi();
    if (tithi <= 15) {
      return `Shukla Pakṣa`;
    } else if (tithi > 15) {
      return `Kṛṣṇa Pakṣa`;
    }
  }

  function getMasa(system) {
    // lunarni mjesec u godini
    const delta = tropicalSunLongitude;
    console.log(delta);

    if (system === "Purnimanta") {
      // Logika za Purnimanta
      if (delta >= 0 && delta < 30) {
        return "Caitra";
      } else if (delta >= 30 && delta < 60) {
        return "Vaiśākha";
      } else if (delta >= 60 && delta < 90) {
        return "Jyeṣṭha";
      } else if (delta >= 90 && delta < 120) {
        return "Āṣāḍha";
      } else if (delta >= 120 && delta < 150) {
        return "Śrāvaṇa";
      } else if (delta >= 150 && delta < 180) {
        return "Bhādrapada";
      } else if (delta >= 180 && delta < 210) {
        return "Aśvin";
      } else if (delta >= 210 && delta < 240) {
        return "Kārttika";
      } else if (delta >= 240 && delta < 270) {
        return "Mārgaśīrṣa";
      } else if (delta >= 270 && delta < 300) {
        return "Pauṣa";
      } else if (delta >= 300 && delta < 330) {
        return "Māgha";
      } else if (delta >= 330 && delta < 360) {
        return "Phālguna";
      } else {
        throw new Error("Invalid delta longitude for Purnimanta system: " + delta);
      }
    } else if (system === "Amanta") {
      // Logika za Amanta
      if (delta >= 0 && delta < 30) {
        return "Phālguna";
      } else if (delta >= 30 && delta < 60) {
        return "Caitra";
      } else if (delta >= 60 && delta < 90) {
        return "Vaiśākha";
      } else if (delta >= 90 && delta < 120) {
        return "Jyeṣṭha";
      } else if (delta >= 120 && delta < 150) {
        return "Āṣāḍha";
      } else if (delta >= 150 && delta < 180) {
        return "Śrāvaṇa";
      } else if (delta >= 180 && delta < 210) {
        return "Bhādrapada";
      } else if (delta >= 210 && delta < 240) {
        return "Aśvin";
      } else if (delta >= 240 && delta < 270) {
        return "Kārttika";
      } else if (delta >= 270 && delta < 300) {
        return "Mārgaśīrṣa";
      } else if (delta >= 300 && delta < 330) {
        return "Pauṣa";
      } else if (delta >= 330 && delta < 360) {
        return "Māgha";
      } else {
        throw new Error("Invalid delta longitude for Amanta system: " + delta);
      }
    } else {
      throw new Error("Invalid lunar month calculation system: " + system);
    }
  }

  function getSamvat() {
    const vikramSamvat = Number(format(addYears(date, 56), "yyyy"));
    return vikramSamvat;
  }

  function getNakshatra() {
    const moonLongitude = getSiderealMoonLongitude();
    console.log(moonLongitude);

    if (moonLongitude >= 0 && moonLongitude < 13.33) {
      return "Ashwini";
    } else if (moonLongitude >= 13.33 && moonLongitude < 26.66) {
      return "Bharani";
    } else if (moonLongitude >= 26.66 && moonLongitude < 40) {
      return "Krittika";
    } else if (moonLongitude >= 40 && moonLongitude < 53.33) {
      return "Rohini";
    } else if (moonLongitude >= 53.33 && moonLongitude < 66.66) {
      return "Mrigashira";
    } else if (moonLongitude >= 66.66 && moonLongitude < 80) {
      return "Ardra";
    } else if (moonLongitude >= 80 && moonLongitude < 93.33) {
      return "Punarvasu";
    } else if (moonLongitude >= 93.33 && moonLongitude < 106.66) {
      return "Pushya";
    } else if (moonLongitude >= 106.66 && moonLongitude < 120) {
      return "Ashlesha";
    } else if (moonLongitude >= 120 && moonLongitude < 133.33) {
      return "Magha";
    } else if (moonLongitude >= 133.33 && moonLongitude < 146.66) {
      return "Purva Phalguni";
    } else if (moonLongitude >= 146.66 && moonLongitude < 160) {
      return "Uttara Phalguni";
    } else if (moonLongitude >= 160 && moonLongitude < 173.33) {
      return "Hasta";
    } else if (moonLongitude >= 173.33 && moonLongitude < 186.66) {
      return "Chitra";
    } else if (moonLongitude >= 186.66 && moonLongitude < 200) {
      return "Swati";
    } else if (moonLongitude >= 200 && moonLongitude < 213.33) {
      return "Vishakha";
    } else if (moonLongitude >= 213.33 && moonLongitude < 226.66) {
      return "Anuradha";
    } else if (moonLongitude >= 226.66 && moonLongitude < 240) {
      return "Jyeshtha";
    } else if (moonLongitude >= 240 && moonLongitude < 253.33) {
      return "Mula";
    } else if (moonLongitude >= 253.33 && moonLongitude < 266.66) {
      return "Purva Ashadha";
    } else if (moonLongitude >= 266.66 && moonLongitude < 280) {
      return "Uttara Ashadha";
    } else if (moonLongitude >= 280 && moonLongitude < 293.33) {
      return "Shravana";
    } else if (moonLongitude >= 293.33 && moonLongitude < 306.66) {
      return "Dhanishta";
    } else if (moonLongitude >= 306.66 && moonLongitude < 320) {
      return "Shatabhisha";
    } else if (moonLongitude >= 320 && moonLongitude < 333.33) {
      return "Purva Bhadrapada";
    } else if (moonLongitude >= 333.33 && moonLongitude < 346.66) {
      return "Uttara Bhadrapada";
    } else if (moonLongitude >= 346.66 && moonLongitude < 360) {
      return "Revati";
    } else {
      throw new Error("Invalid moon longitude: " + moonLongitude);
    }
  }

  function getYoga() {
    const sunLongitude = getSiderealSunLongitude();
    const moonLongitude = getSiderealMoonLongitude();

    const yogaDegreeSum = (sunLongitude + moonLongitude) % 360;

    if (yogaDegreeSum >= 0 && yogaDegreeSum < 13.333) {
      return "Vishkumbha";
    } else if (yogaDegreeSum >= 13.333 && yogaDegreeSum < 26.666) {
      return "Preeti";
    } else if (yogaDegreeSum >= 26.666 && yogaDegreeSum < 40) {
      return "Ayushman";
    } else if (yogaDegreeSum >= 40 && yogaDegreeSum < 53.333) {
      return "Saubhagya";
    } else if (yogaDegreeSum >= 53.333 && yogaDegreeSum < 66.666) {
      return "Shobhana";
    } else if (yogaDegreeSum >= 66.666 && yogaDegreeSum < 80) {
      return "Atiganda";
    } else if (yogaDegreeSum >= 80 && yogaDegreeSum < 93.333) {
      return "Sukarman";
    } else if (yogaDegreeSum >= 93.333 && yogaDegreeSum < 106.666) {
      return "Dhriti";
    } else if (yogaDegreeSum >= 106.666 && yogaDegreeSum < 120) {
      return "Shoola";
    } else if (yogaDegreeSum >= 120 && yogaDegreeSum < 133.333) {
      return "Ganda";
    } else if (yogaDegreeSum >= 133.333 && yogaDegreeSum < 146.666) {
      return "Vriddhi";
    } else if (yogaDegreeSum >= 146.666 && yogaDegreeSum < 160) {
      return "Dhruva";
    } else if (yogaDegreeSum >= 160 && yogaDegreeSum < 173.333) {
      return "Vyaghata";
    } else if (yogaDegreeSum >= 173.333 && yogaDegreeSum < 186.666) {
      return "Harshana";
    } else if (yogaDegreeSum >= 186.666 && yogaDegreeSum < 200) {
      return "Vajra";
    } else if (yogaDegreeSum >= 200 && yogaDegreeSum < 213.333) {
      return "Siddhi";
    } else if (yogaDegreeSum >= 213.333 && yogaDegreeSum < 226.666) {
      return "Vyatipata";
    } else if (yogaDegreeSum >= 226.666 && yogaDegreeSum < 240) {
      return "Variyana";
    } else if (yogaDegreeSum >= 240 && yogaDegreeSum < 253.333) {
      return "Parigha";
    } else if (yogaDegreeSum >= 253.333 && yogaDegreeSum < 266.666) {
      return "Shiva";
    } else if (yogaDegreeSum >= 266.666 && yogaDegreeSum < 280) {
      return "Siddha";
    } else if (yogaDegreeSum >= 280 && yogaDegreeSum < 293.333) {
      return "Sadhya";
    } else if (yogaDegreeSum >= 293.333 && yogaDegreeSum < 306.666) {
      return "Shubha";
    } else if (yogaDegreeSum >= 306.666 && yogaDegreeSum < 320) {
      return "Shukla";
    } else if (yogaDegreeSum >= 320 && yogaDegreeSum < 333.333) {
      return "Brahma";
    } else if (yogaDegreeSum >= 333.333 && yogaDegreeSum < 346.666) {
      return "Indra";
    } else if (yogaDegreeSum >= 346.666 && yogaDegreeSum < 360) {
      return "Vaidhriti";
    } else {
      throw new Error("Invalid Yoga calculation: " + yogaDegreeSum);
    }
  }

  function getKarana() {
    const tithi = PairLongitude("Moon", "Sun", SunRise.date) / 12;
    const isSecondHalf = tithi % 1 >= 0.5;
    const tithiIndex = Math.ceil(tithi);

    // Fiksni Karane za mlad i pun Mjesec
    if (tithiIndex === 0) {
      return isSecondHalf ? "Kimstughna" : "Bava";
    } else if (tithiIndex === 14) {
      return isSecondHalf ? "Shakuni" : "Garaja";
    }

    // Promjenjivi Karane
    if (tithiIndex === 1) return isSecondHalf ? "Balava" : "Bava";
    else if (tithiIndex === 2) return isSecondHalf ? "Kaulava" : "Balava";
    else if (tithiIndex === 3) return isSecondHalf ? "Taitila" : "Kaulava";
    else if (tithiIndex === 4) return isSecondHalf ? "Garaja" : "Taitila";
    else if (tithiIndex === 5) return isSecondHalf ? "Vanija" : "Garaja";
    else if (tithiIndex === 6) return isSecondHalf ? "Vishti" : "Vanija";
    else if (tithiIndex === 7) return isSecondHalf ? "Bava" : "Vishti";
    else if (tithiIndex === 8) return isSecondHalf ? "Balava" : "Bava";
    else if (tithiIndex === 9) return isSecondHalf ? "Kaulava" : "Balava";
    else if (tithiIndex === 10) return isSecondHalf ? "Taitila" : "Kaulava";
    else if (tithiIndex === 11) return isSecondHalf ? "Garaja" : "Taitila";
    else if (tithiIndex === 12) return isSecondHalf ? "Vanija" : "Garaja";
    else if (tithiIndex === 13) return isSecondHalf ? "Vishti" : "Vanija";
    else if (tithiIndex === 15) return isSecondHalf ? "Chatushpada" : "Vishti";
    else if (tithiIndex === 16) return isSecondHalf ? "Naga" : "Chatushpada";
    else if (tithiIndex === 17) return isSecondHalf ? "Kimstughna" : "Naga";
    else if (tithiIndex === 18) return isSecondHalf ? "Bava" : "Kimstughna";
    else if (tithiIndex === 19) return isSecondHalf ? "Balava" : "Bava";
    else if (tithiIndex === 20) return isSecondHalf ? "Kaulava" : "Balava";
    else if (tithiIndex === 21) return isSecondHalf ? "Taitila" : "Kaulava";
    else if (tithiIndex === 22) return isSecondHalf ? "Garaja" : "Taitila";
    else if (tithiIndex === 23) return isSecondHalf ? "Vanija" : "Garaja";
    else if (tithiIndex === 24) return isSecondHalf ? "Vishti" : "Vanija";
    else if (tithiIndex === 25) return isSecondHalf ? "Bava" : "Vishti";
    else if (tithiIndex === 26) return isSecondHalf ? "Balava" : "Bava";
    else if (tithiIndex === 27) return isSecondHalf ? "Kaulava" : "Balava";
    else if (tithiIndex === 28) return isSecondHalf ? "Taitila" : "Kaulava";
    else if (tithiIndex === 29) return isSecondHalf ? "Garaja" : "Taitila";

    // Ako ništa od navedenog nije zadovoljavajuće, vrati grešku
    throw new Error("Invalid Tithi index for Karana calculation: " + tithiIndex);
  }

  function getVar() {
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) return "Ravivara" /* (Nedjelja - Sunce) */;
    else if (dayOfWeek === 1) return "Somavara" /* (Ponedjeljak - Mjesec) */;
    else if (dayOfWeek === 2) return "Mangalavara" /* (Utorak - Mars) */;
    else if (dayOfWeek === 3) return "Budhavara" /* (Srijeda - Merkur) */;
    else if (dayOfWeek === 4) return "Guruvara" /* (Četvrtak - Jupiter) */;
    else if (dayOfWeek === 5) return "Shukravara" /* (Petak - Venera) */;
    else if (dayOfWeek === 6) return "Shanivara" /* (Subota - Saturn) */;

    throw new Error("Invalid day for Var calculation: " + dayOfWeek);
  }

  return { Tithi: getTithi(), Paksha: getPaksha(), Masa: getMasa("Purnimanta"), Samvat: getSamvat(), Nakshatra: getNakshatra(), Yoga: getYoga(), Karana: getKarana(), Var: getVar() };
}

/* 
Tithi - lunarni dan
Paksha - svijetla/tamna polovica mjeseca
Masa - lunarni mjesec u godini
Samvat - lunarna godina
Nakshatra - mjesečeva trenutna konstelacija (kuća)
Yoga - spajanje Mjeseca i Sunca
Karana - polovina tithija
Var - dan u tjednu
*/
