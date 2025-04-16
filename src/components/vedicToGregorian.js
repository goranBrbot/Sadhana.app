import { SearchRiseSet, Equator } from "astronomy-engine";

function getSiderealLongitude(body, date, location) {
  const ayanamsha = 24.210517; // Lahiri Ayanamsha za 2024.
  const equ = Equator(body, date, location, true, true);
  const tropicalLongitude = equ.ra * 15; // RA u stupnjevima
  return (tropicalLongitude - ayanamsha + 360) % 360;
}

function Panchang(date, location, system = "Purnimanta") {
  const sunRiseResult = SearchRiseSet("Sun", location, +1, date, -1, 0.0);
  const sunRiseTime = sunRiseResult.date;

  const moonLon = getSiderealLongitude("Moon", sunRiseTime, location);
  const sunLon = getSiderealLongitude("Sun", sunRiseTime, location);
  const tithiAngle = (moonLon - sunLon + 360) % 360;

  const tithi = Math.floor(tithiAngle / 12) + 1;
  const paksha = tithi <= 15 ? "Shukla Pakṣa" : "Kṛṣṇa Pakṣa";

  let masaIndex = Math.floor(sunLon / 30);

  // U Purnimanta sustavu, masa se mijenja na Purnimu, pa za Kṛṣṇa Pakṣa se masa smanjuje
  if (system === "Purnimanta" && paksha === "Kṛṣṇa Pakṣa") {
    masaIndex = (masaIndex + 11) % 12; // -1 modulo 12
  }

  // U Amanta sustavu, masa se mijenja na Amavasya, pa za Shukla Pakṣa se masa smanjuje
  if (system === "Amanta" && paksha === "Shukla Pakṣa") {
    masaIndex = (masaIndex + 11) % 12; // -1 modulo 12
  }

  const purnimantaMasaNames = ["Caitra", "Vaiśākha", "Jyeṣṭha", "Āṣāḍha", "Śrāvaṇa", "Bhādrapada", "Aśvin", "Kārttika", "Mārgaśīrṣa", "Pauṣa", "Māgha", "Phālguna"];

  const amantaMasaNames = ["Phālguna", "Caitra", "Vaiśākha", "Jyeṣṭha", "Āṣāḍha", "Śrāvaṇa", "Bhādrapada", "Aśvin", "Kārttika", "Mārgaśīrṣa", "Pauṣa", "Māgha"];

  const masa = system === "Amanta" ? amantaMasaNames[masaIndex] : purnimantaMasaNames[masaIndex];

  return {
    Tithi: tithi,
    Paksha: paksha,
    Masa: masa,
    Date: sunRiseTime,
  };
}

export default function FindGregorianDateFromVedic(masa, paksha, tithiName, system = "Purnimanta", location) {
  const tithiNames = ["Pratipadā", "Dvitīyā", "Tṛtīyā", "Caturthī", "Pañcamī", "Ṣaṣṭhī", "Saptamī", "Aṣṭamī", "Navamī", "Daśamī", "Ekādaśī", "Dvādaśī", "Trayodaśī", "Caturdaśī", "Pūrṇimā/Amāvāsyā"];

  const startDate = new Date("2025-01-01");
  const endDate = new Date("2025-12-31");

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const p = Panchang(new Date(date), location, system);
    const actualTithiName = tithiNames[(p.Tithi - 1) % 15];

    if (p.Masa === masa && p.Paksha === paksha && actualTithiName === tithiName) {
      return {
        gregorianDate: new Date(date),
        vedic: {
          masa: p.Masa,
          paksha: p.Paksha,
          tithi: actualTithiName,
        },
      };
    }
  }

  return null;
}
