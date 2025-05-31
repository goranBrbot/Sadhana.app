// import { format, addYears } from "date-fns";
import { PairLongitude, SearchRiseSet, SunPosition, EclipticGeoMoon } from "astronomy-engine";

// Bazirano na Purnimanta sistemu
export default function Panchang(date, location) {
  const pulledLocation = location;
  const SunRise = SearchRiseSet("Sun", pulledLocation, +1, new Date(date), -1, 0.0);

  function getSiderealLong(ayanamsha = 24.21824) {
    // Vrijednost Ayanamsha za 2024. godinu (Lahiri Ayanamsha)
    const sun = SunPosition(date);
    const moon = EclipticGeoMoon(date);
    const sunLongitudeSidereal = (sun.elon - ayanamsha + 360) % 360;
    const moonLongitudeSidereal = (moon.lon - ayanamsha + 360) % 360;
    return {
      sunLongitude: sunLongitudeSidereal,
      moonLongitude: moonLongitudeSidereal,
    };
  }
  console.log(getSiderealLong());

  // -------------------------------------------------------------------------------------------

  // Izračunavanje Tithi od 1-30
  function getTithi() {
    const razlikaMoonSun = PairLongitude("Moon", "Sun", SunRise.date);
    const tithi = Math.ceil(razlikaMoonSun / 12);
    return tithi;
  }

  // Paksha tithi - lunarni dan 1-15
  function getPakshaTithi(system = "") {
    const razlikaMoonSun = PairLongitude("Moon", "Sun", SunRise.date);
    const tithi = Math.ceil(razlikaMoonSun / 12);
    if (system === "Purnimanta") {
      return ((tithi + 14) % 30) + 1;
    }
    return tithi; // amanta system
  }

  // Tithi info objekt - grupe tithija sa specifičnim kvalitetama (phala – plodovima)
  function getTithiInfo(tithiNumber) {
    const tithiNames = [
      "Pratipadā",
      "Dvitīyā",
      "Tṛtīyā",
      "Caturthī",
      "Pañcamī",
      "Ṣaṣṭhī",
      "Saptamī",
      "Aṣṭamī",
      "Navamī",
      "Daśamī",
      "Ekādaśī",
      "Dvādaśī",
      "Trayodaśī",
      "Caturdaśī",
      "Pūrṇimā",
      "Pratipadā",
      "Dvitīyā",
      "Tṛtīyā",
      "Caturthī",
      "Pañcamī",
      "Ṣaṣṭhī",
      "Saptamī",
      "Aṣṭamī",
      "Navamī",
      "Daśamī",
      "Ekādaśī",
      "Dvādaśī",
      "Trayodaśī",
      "Caturdaśī",
      "Amāvasyā",
    ];

    const groups = {
      Nanda: [1, 6, 11, 16, 21, 26],
      Bhadra: [2, 7, 12, 17, 22, 27],
      Jaya: [3, 8, 13, 18, 23, 28],
      Riktha: [4, 9, 14, 19, 24, 29],
      Poorna: [5, 10, 15, 20, 25, 30],
    };

    const meanings = {
      Nanda: { phala: "Ananda", meaning: "Radost, duhovna sreća" },
      // Idealno za započinjanje novih pothvata, posvećenje duhovnim praksama. Pogodan dan za puje, darivanja, duhovne discipline.
      Bhadra: { phala: "Arogya, Mangala", meaning: "Zdravlje i blagostanje" },
      // Dobro za aktivnosti koje jačaju tijelo i um, poslove vezane uz materijalno blagostanje. Povoljno za kupovinu, liječenje, sklapanje prijateljstava.
      Jaya: { phala: "Jaya", meaning: "Pobjeda i prevladavanje" },
      // Povoljno za pravne sporove, pregovore, političke i vojne akcije. Dan za prevladavanje prepreka i izlazak kao pobjednik.
      Riktha: { phala: "Nashta", meaning: "Gubitak, nepovoljnost" },
      // Nepovoljan – asocira se s prazninom, gubitkom, neuspjehom. Izbjegavati važne odluke, transakcije, sklapanje poslova.
      Poorna: { phala: "Sampoorna", meaning: "Ispunjenje, potpunost" },
      // Daje osjećaj ispunjenja i zaokruženja. Pogodno za završne faze projekata, rituale, brakove, puje.
    };

    if (tithiNumber < 1 || tithiNumber > 30) {
      return { error: "Tithi mora biti između 1 i 30." };
    }

    const pakshaTithi = tithiNumber % 15 === 0 ? 15 : tithiNumber % 15;
    const tithiName = tithiNames[pakshaTithi - 1];
    let matchedGroup = null;

    for (const [group, numbers] of Object.entries(groups)) {
      if (numbers.includes(pakshaTithi) || (group === "Poorna" && tithiNumber === 30)) {
        matchedGroup = group;
        break;
      }
    }

    const result = {
      tithiNumber,
      tithiName,
      group: matchedGroup || "Nepoznat",
      ...(meanings[matchedGroup] || { phala: "-", meaning: "-" }),
    };

    return result;
  }

  console.log(getTithiInfo(getTithi()));

  // Paksha - svijetla/tamna polovica mjeseca
  function getPaksha(system = "") {
    let tithi = getPakshaTithi(system);
    if (system === "Purnimanta") {
      tithi = ((tithi + 14) % 30) + 1;
    }
    if (tithi <= 15) {
      return "Śukla";
    } else {
      return "Kṛṣṇa";
    }
  }

  // lunarni mjesec u godini
  function getMasa(system = "") {
    const { sunLongitude } = getSiderealLong();
    // Masa prema sideralnoj dužini Sunca (Chaitra = 1)
    let masaIndex = Math.ceil(sunLongitude / 30) % 12; // 0-11

    // Tithi na izlasku Sunca
    const tithiToday = getPakshaTithi(false);

    // Za Purnimanta: masa se mijenja na Purnimu (tithi 15)
    // Za Amanta: masa se mijenja na Amavasya (tithi 30)
    if ((system === "Purnimanta" && tithiToday > 15) || (system === "Amanta" && tithiToday === 30)) {
      masaIndex = (masaIndex + 1) % 12;
    }

    const masaNames = ["Caitraḥ", "Vaiśākhaḥ", "Jyeṣṭhaḥ", "Āṣāḍhaḥ", "Śrāvaṇaḥ", "Bhādrapadaḥ", "Āśvinaḥ", "Kārtikaḥ", "Mārgaśīrṣaḥ", "Pauṣaḥ", "Māghaḥ", "Phālgunaḥ"];

    return masaNames[masaIndex];
  }

  // Lunarna godina (Vikram Samvat)
  function getSamvat() {
    const gregorianYear = date.getFullYear(); // Trenutna Gregorijanska godina

    // Pronađi Hindu Novu godinu (Chaitra Shukla Pratipada)
    const hinduNewYear = SearchRiseSet(
      "Sun",
      location,
      +1,
      new Date(gregorianYear, 2, 21), // Početak pretrage (21. mart tekuće godine)
      -1, // Tražimo izlazak Sunca
      0.0 // Visina horizonta
    ).date;

    // Proveri da li je trenutni datum pre ili posle Hindu Nove godine
    const isBeforeHinduNewYear = date < hinduNewYear;
    const vikramSamvat = gregorianYear + 57 - (isBeforeHinduNewYear ? 1 : 0);
    return `${vikramSamvat}`;
  }

  // Nakshatra - mjesečeva trenutna konstelacija (kuća)
  function getNakshatra() {
    const { moonLongitude } = getSiderealLong();

    // Kut od 13° 20′ (13 stupnjeva i 20 minuta) pretvoren u decimalni oblik stupnjeva = 13.3333
    // 360° / 27 nakšatra = 13.3333° po nakšatri

    const nakshatraIndex = Math.floor(moonLongitude / (360 / 27)); // 360° podijeljeno na 27

    const nakshatraNames = [
      "Aśvinī",
      "Bhraṇī",
      "Kṛttikā",
      "Rohiṇī",
      "Mṛgaśirā",
      "Ārdrā",
      "Punarvasu",
      "Pūṣya",
      "Aśleśā",
      "Maghā",
      "Pūrvāphālgunī",
      "Uttarāphālgunī",
      "Hasta",
      "Citrā",
      "Svātī",
      "Viśākhā",
      "Anurādhā",
      "Jyeṣṭhā",
      "Mūla",
      "Pūrvāṣāḍhā",
      "Uttarāṣāḍhā",
      "Śravaṇa",
      "Dhaniṣṭhā",
      "Śatabhiṣā",
      "Pūrvābhādrapadā",
      "Uttarābhādrapadā",
      "Revatī",
    ];

    return nakshatraNames[nakshatraIndex];
  }

  // Yoga - spajanje Mjeseca i Sunca
  function getYoga() {
    const { sunLongitude, moonLongitude } = getSiderealLong();
    const yogaDegreeSum = (sunLongitude + moonLongitude) % 360;

    if (yogaDegreeSum >= 0 && yogaDegreeSum < 13.333) {
      return "Viṣkaṃbha";
    } else if (yogaDegreeSum >= 13.333 && yogaDegreeSum < 26.666) {
      return "Prīti";
    } else if (yogaDegreeSum >= 26.666 && yogaDegreeSum < 40) {
      return "Āyuṣmān";
    } else if (yogaDegreeSum >= 40 && yogaDegreeSum < 53.333) {
      return "Saubhāgya";
    } else if (yogaDegreeSum >= 53.333 && yogaDegreeSum < 66.666) {
      return "Śobhana";
    } else if (yogaDegreeSum >= 66.666 && yogaDegreeSum < 80) {
      return "Atigaṇḑa";
    } else if (yogaDegreeSum >= 80 && yogaDegreeSum < 93.333) {
      return "Sukarmā";
    } else if (yogaDegreeSum >= 93.333 && yogaDegreeSum < 106.666) {
      return "Dhṛti";
    } else if (yogaDegreeSum >= 106.666 && yogaDegreeSum < 120) {
      return "Śūla";
    } else if (yogaDegreeSum >= 120 && yogaDegreeSum < 133.333) {
      return "Gaṇḑa";
    } else if (yogaDegreeSum >= 133.333 && yogaDegreeSum < 146.666) {
      return "Vṛddhi";
    } else if (yogaDegreeSum >= 146.666 && yogaDegreeSum < 160) {
      return "Dhruva";
    } else if (yogaDegreeSum >= 160 && yogaDegreeSum < 173.333) {
      return "Vyāghāta";
    } else if (yogaDegreeSum >= 173.333 && yogaDegreeSum < 186.666) {
      return "Harṣaṇa";
    } else if (yogaDegreeSum >= 186.666 && yogaDegreeSum < 200) {
      return "Vajra";
    } else if (yogaDegreeSum >= 200 && yogaDegreeSum < 213.333) {
      return "Siddhi";
    } else if (yogaDegreeSum >= 213.333 && yogaDegreeSum < 226.666) {
      return "Vyatīpāta";
    } else if (yogaDegreeSum >= 226.666 && yogaDegreeSum < 240) {
      return "Varīyān";
    } else if (yogaDegreeSum >= 240 && yogaDegreeSum < 253.333) {
      return "Parigha";
    } else if (yogaDegreeSum >= 253.333 && yogaDegreeSum < 266.666) {
      return "Śiva";
    } else if (yogaDegreeSum >= 266.666 && yogaDegreeSum < 280) {
      return "Siddha";
    } else if (yogaDegreeSum >= 280 && yogaDegreeSum < 293.333) {
      return "Sādhya";
    } else if (yogaDegreeSum >= 293.333 && yogaDegreeSum < 306.666) {
      return "Śubha";
    } else if (yogaDegreeSum >= 306.666 && yogaDegreeSum < 320) {
      return "Śukla";
    } else if (yogaDegreeSum >= 320 && yogaDegreeSum < 333.333) {
      return "Brahma";
    } else if (yogaDegreeSum >= 333.333 && yogaDegreeSum < 346.666) {
      return "Indra";
    } else if (yogaDegreeSum >= 346.666 && yogaDegreeSum < 360) {
      return "Vaidhṛta";
    } else {
      throw new Error("Invalid Yoga calculation: " + yogaDegreeSum);
    }
  }

  // Karana - polovina tithija
  function getKarana() {
    const razlikaMoonSun = PairLongitude("Moon", "Sun", new Date(date));
    console.log(date, razlikaMoonSun);

    const karanaIndex = Math.ceil(razlikaMoonSun / 6); // 60 karana u mjesecu - Math.ceil prebacuje na početak karane a floor na kraj

    const karanaNames = ["Bava", "Bālava", "Kaulava", "Taitila", "Gara", "Vaṇija", "Vṛṣṭi"];
    const fixedKaranas = ["Kimstughna", "Śakuni", "Catuṣpāda", "Nāga"];

    if (karanaIndex === 1) return fixedKaranas[0]; // Kimstughna
    if (karanaIndex >= 2 && karanaIndex <= 57) {
      return karanaNames[(karanaIndex - 2) % 7];
    }
    if (karanaIndex === 58) return fixedKaranas[1]; // Shakuni
    if (karanaIndex === 59) return fixedKaranas[2]; // Chatushpada
    if (karanaIndex === 60) return fixedKaranas[3]; // Naga

    return "Nepoznata karana";
  }

  // Dan u tjednu
  function getVara() {
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) return "Ravivār"; // Nedjelja - Sunce
    else if (dayOfWeek === 1) return "Somvār"; // Ponedjeljak - Mjesec
    else if (dayOfWeek === 2) return "Mangaḷvār"; // Utorak - Mars
    else if (dayOfWeek === 3) return "Budhvār"; // Srijeda - Merkur
    else if (dayOfWeek === 4) return "Guruvār"; // Četvrtak - Jupiter
    else if (dayOfWeek === 5) return "Shukravār"; // Petak - Venera
    else if (dayOfWeek === 6) return "Shanivār"; // Subota - Saturn

    throw new Error("Invalid day for Var calculation: " + dayOfWeek);
  }

  return {
    TithiNum: getTithi(),
    TithiInfo: getTithiInfo(getTithi()),
    Tithi: getPakshaTithi("Purnimanta"),
    Paksha: getPaksha("Purnimanta"),
    Masa: getMasa("Purnimanta"),
    Samvat: getSamvat(),
    Nakshatra: getNakshatra(),
    Yoga: getYoga(),
    Karana: getKarana(),
    Var: getVara(),
  };
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
