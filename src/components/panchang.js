// import { format, addYears } from "date-fns";
import { PairLongitude, SearchRiseSet, Equator, Search } from "astronomy-engine";

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

  // Tithi - lunarni dan
  function getTithi() {
    const razlikaMoonSun = PairLongitude("Moon", "Sun", SunRise.date);
    const tithiPeriod = razlikaMoonSun / 12;
    const calculatedTithiDay = Math.ceil(tithiPeriod);
    return calculatedTithiDay;
  }

  // Tithi info objekt - grupe tithija sa specifičnim kvalitetama (phala – plodovima)
  function getTithiInfo(tithiNumber) {
    const tithiNames = [
      "Prathama",
      "Dwitiya",
      "Tritiya",
      "Chaturthi",
      "Panchami",
      "Shashti",
      "Saptami",
      "Ashtami",
      "Navami",
      "Dashami",
      "Ekadashi",
      "Dwadashi",
      "Trayodashi",
      "Chaturdashi",
      "Purnima / Amavasya",
    ];

    const groups = {
      Nanda: [1, 6, 11],
      Bhadra: [2, 7, 12],
      Jaya: [3, 8, 13],
      Riktha: [4, 9, 14],
      Poorna: [5, 10, 15, 30], // 30 je Amavasya
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
  function getPaksha() {
    const tithi = getTithi();
    if (tithi <= 15) {
      return `Shukla`;
    } else if (tithi > 15) {
      return `Kṛṣṇa`;
    }
  }

  // lunarni mjesec u godini
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
    const moonLongitude = getSiderealMoonLongitude();
    console.log(moonLongitude);

    // Kut od 13° 20′ (13 stupnjeva i 20 minuta) pretvoren u decimalni oblik stupnjeva = 13.3333
    // 360° / 27 nakšatra = 13.3333° po nakšatri

    if (moonLongitude >= 0 && moonLongitude < 13.33) {
      return "Aśvinī";
    } else if (moonLongitude >= 13.33 && moonLongitude < 26.66) {
      return "Bharani";
    } else if (moonLongitude >= 26.66 && moonLongitude < 40) {
      return "Kṛttikā";
    } else if (moonLongitude >= 40 && moonLongitude < 53.33) {
      return "Rohiṇī";
    } else if (moonLongitude >= 53.33 && moonLongitude < 66.66) {
      return "Mṛgaśīrṣa";
    } else if (moonLongitude >= 66.66 && moonLongitude < 80) {
      return "Ārdrā";
    } else if (moonLongitude >= 80 && moonLongitude < 93.33) {
      return "Punarvasu";
    } else if (moonLongitude >= 93.33 && moonLongitude < 106.66) {
      return "Puṣya";
    } else if (moonLongitude >= 106.66 && moonLongitude < 120) {
      return "Āśleṣā";
    } else if (moonLongitude >= 120 && moonLongitude < 133.33) {
      return "Maghā";
    } else if (moonLongitude >= 133.33 && moonLongitude < 146.66) {
      return "Pūrvaphalgunī";
    } else if (moonLongitude >= 146.66 && moonLongitude < 160) {
      return "Uttaraphalgunī";
    } else if (moonLongitude >= 160 && moonLongitude < 173.33) {
      return "Hasta";
    } else if (moonLongitude >= 173.33 && moonLongitude < 186.66) {
      return "Citrā";
    } else if (moonLongitude >= 186.66 && moonLongitude < 200) {
      return "Svātī";
    } else if (moonLongitude >= 200 && moonLongitude < 213.33) {
      return "Viśākhā";
    } else if (moonLongitude >= 213.33 && moonLongitude < 226.66) {
      return "Anurādhā";
    } else if (moonLongitude >= 226.66 && moonLongitude < 240) {
      return "Jyeṣṭhā";
    } else if (moonLongitude >= 240 && moonLongitude < 253.33) {
      return "Mūla";
    } else if (moonLongitude >= 253.33 && moonLongitude < 266.66) {
      return "Pūrvāṣāḍhā";
    } else if (moonLongitude >= 266.66 && moonLongitude < 280) {
      return "Uttarāṣāḍhā";
    } else if (moonLongitude >= 280 && moonLongitude < 293.33) {
      return "Śravaṇa";
    } else if (moonLongitude >= 293.33 && moonLongitude < 306.66) {
      return "Dhaniṣṭhā";
    } else if (moonLongitude >= 306.66 && moonLongitude < 320) {
      return "Śatabhiṣaja";
    } else if (moonLongitude >= 320 && moonLongitude < 333.33) {
      return "Pūrvabhādrapadā";
    } else if (moonLongitude >= 333.33 && moonLongitude < 346.66) {
      return "Uttarabhādrapadā";
    } else if (moonLongitude >= 346.66 && moonLongitude < 360) {
      return "Revatī";
    } else {
      throw new Error("Invalid moon longitude: " + moonLongitude);
    }
  }

  // Yoga - spajanje Mjeseca i Sunca
  function getYoga() {
    const sunLongitude = getSiderealSunLongitude();
    const moonLongitude = getSiderealMoonLongitude();

    const yogaDegreeSum = (sunLongitude + moonLongitude) % 360;

    if (yogaDegreeSum >= 0 && yogaDegreeSum < 13.333) {
      return "Viṣkambha";
    } else if (yogaDegreeSum >= 13.333 && yogaDegreeSum < 26.666) {
      return "Prīti";
    } else if (yogaDegreeSum >= 26.666 && yogaDegreeSum < 40) {
      return "Āyuśmān";
    } else if (yogaDegreeSum >= 40 && yogaDegreeSum < 53.333) {
      return "Saubhāgya";
    } else if (yogaDegreeSum >= 53.333 && yogaDegreeSum < 66.666) {
      return "Śobhana";
    } else if (yogaDegreeSum >= 66.666 && yogaDegreeSum < 80) {
      return "Atigaṇḍa";
    } else if (yogaDegreeSum >= 80 && yogaDegreeSum < 93.333) {
      return "Sukarman";
    } else if (yogaDegreeSum >= 93.333 && yogaDegreeSum < 106.666) {
      return "Dhṛti";
    } else if (yogaDegreeSum >= 106.666 && yogaDegreeSum < 120) {
      return "Śūla";
    } else if (yogaDegreeSum >= 120 && yogaDegreeSum < 133.333) {
      return "Ganda";
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
      return "Varīgā";
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
      return "Vaidhṛti";
    } else {
      throw new Error("Invalid Yoga calculation: " + yogaDegreeSum);
    }
  }

  // Karana - polovina tithija
  function getKarana() {
    const tithi = getTithi(); // Koristimo već izračunati tithi

    // Fiksni Karane za mlad i pun Mesec
    if (tithi === 30) return "Kimstughna"; // Fiksni Karana za Amavasya (mlad Mesec)
    if (tithi === 15) return "Shakuni"; // Fiksni Karana za Purnima (pun Mesec)

    // Promenljivi Karane (ponavljaju se osam puta tokom meseca)
    const movableKaranas = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];

    // Prva polovina tithija (1-14 i 16-29)
    const karanaIndex = (tithi - 1) % 7; // Određujemo indeks za promenljive Karane
    const isSecondHalf = tithi > 15; // Proveravamo da li je u Krishna Paksha (tamna polovina)

    if (isSecondHalf) {
      // Krishna Paksha (tamna polovina meseca)
      if (tithi === 29) return "Chatushpada"; // Fiksni Karana za Krishna Paksha
      if (tithi === 28) return "Naga"; // Fiksni Karana za Krishna Paksha
    }

    // Vraćamo odgovarajući promenljivi Karana
    return movableKaranas[karanaIndex];
  }

  // Dan u tjednu
  function getVara() {
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) return "Ravivāsaraḥ" /* (Nedjelja - Sunce) */;
    else if (dayOfWeek === 1) return "Somavāsaraḥ" /* (Ponedjeljak - Mjesec) */;
    else if (dayOfWeek === 2) return "Maṅgalavāsaraḥ" /* (Utorak - Mars) */;
    else if (dayOfWeek === 3) return "Budhavāsaraḥ" /* (Srijeda - Merkur) */;
    else if (dayOfWeek === 4) return "Guruvāsaraḥ" /* (Četvrtak - Jupiter) */;
    else if (dayOfWeek === 5) return "Śukravāsaraḥ" /* (Petak - Venera) */;
    else if (dayOfWeek === 6) return "Śanivāsaraḥ" /* (Subota - Saturn) */;

    throw new Error("Invalid day for Var calculation: " + dayOfWeek);
  }

  function izracunajTithiInfo(date, location) {
    function elongacijaZaVrijeme() {
      const siderealSun = getSiderealSunLongitude();
      const siderealMoon = getSiderealMoonLongitude();
      const elongacija = (siderealMoon - siderealSun + 360) % 360;
      return elongacija;
    }

    function binarnaPretragaPrijelaza(cilj, startDate, loc, smjer = +1, maxSec = 86400) {
      let t1 = new Date(startDate.getTime());
      let t2 = new Date(t1.getTime() + smjer * maxSec * 1000);
      if (t2 < t1) [t1, t2] = [t2, t1];

      const eps = 0.000001;

      while (t2 - t1 > 1000) {
        const tm = new Date((t1.getTime() + t2.getTime()) / 2);
        const e = elongacijaZaVrijeme(tm, loc);
        console.log(`Cilj: ${cilj}, Trenutna elongacija: ${e}, Vrijeme: ${tm}`);
        if (e < cilj - eps) {
          t1 = tm;
        } else {
          t2 = tm;
        }
      }

      console.log(`Pronađeni prijelaz: ${t2}`);
      return t2;
    }

    const eNow = elongacijaZaVrijeme(date, location);
    console.log(`Trenutna elongacija: ${eNow}`);

    const tithiIndex = Math.floor(eNow / 12); // 0–29 → Tithi 1–30
    console.log(`Tithi indeks: ${tithiIndex}`);

    const donjaGranica = tithiIndex * 12;
    const gornjaGranica = (tithiIndex + 1) * 12;

    console.log(`Donja granica: ${donjaGranica}, Gornja granica: ${gornjaGranica}`);

    const pocetakTithija = binarnaPretragaPrijelaza(donjaGranica, new Date(date.getTime() - 36 * 3600 * 1000), location, -1);
    let krajTithija;

    try {
      krajTithija = binarnaPretragaPrijelaza(gornjaGranica, date, location, +1);
    } catch (e) {
      console.error("Greška pri računanju kraja tithija:", e);
      krajTithija = null; // tithi traje cijeli dan
    }

    const tithiTrajeCijeliDan = krajTithija === null || krajTithija.getDate() !== pocetakTithija.getDate();

    console.log(`Početak tithija: ${pocetakTithija}`);
    console.log(`Kraj tithija: ${krajTithija}`);
    console.log(`Tithi traje cijeli dan: ${tithiTrajeCijeliDan}`);

    return {
      tithiIndex: tithiIndex + 1,
      pocetakTithija,
      krajTithija,
      tithiTrajeCijeliDan,
    };
  }

  console.log(izracunajTithiInfo(date, location));

  return { Tithi: getTithi(), Paksha: getPaksha(), Masa: getMasa("Purnimanta"), Samvat: getSamvat(), Nakshatra: getNakshatra(), Yoga: getYoga(), Karana: getKarana(), Var: getVara() };
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
