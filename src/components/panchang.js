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
    const tithiData = [
      // u radu sa gpt
      {
        index: 1,
        tithi: "Pratipadā",
        paksha: "Śukla",
        ruler: "Agni",
        nityaDevi: "Kāmeśvarī",
        anandadiYoga: "Ānanda - Siddhi (Success)",
        nature: "Nanda (Happiness)",
        spiritualAuspicious: 0,
      },
      {
        index: 2,
        tithi: "Dvitīyā",
        paksha: "Śukla",
        ruler: "Brahmā",
        nityaDevi: "Bhagamalini",
        anandadiYoga: "Ānanda - Maṅgala (Auspiciousness)",
        nature: "Bhadra (Well-being)",
        spiritualAuspicious: 1,
      },
      {
        index: 3,
        tithi: "Tṛtīyā",
        paksha: "Śukla",
        ruler: "Gaurī (Pārvatī)",
        nityaDevi: "Nityaklinnā",
        anandadiYoga: "Jaya - Victory",
        nature: "Jaya (Victory)",
        spiritualAuspicious: 1,
      },
      {
        index: 4,
        tithi: "Caturthī",
        paksha: "Śukla",
        ruler: "Yama",
        nityaDevi: "Bheruṇḍā",
        anandadiYoga: "Nāṣṭa - Loss",
        nature: "Riktha (Emptiness)",
        spiritualAuspicious: 0,
      },
      {
        index: 5,
        tithi: "Pañcamī",
        paksha: "Śukla",
        ruler: "Nāga",
        nityaDevi: "Vahnivāsinī",
        anandadiYoga: "Sampūrṇa - Fulfillment",
        nature: "Pūrṇa (Completeness)",
        spiritualAuspicious: 1,
      },
      {
        index: 6,
        tithi: "Ṣaṣṭhī",
        paksha: "Śukla",
        ruler: "Kārttikeya",
        nityaDevi: "Mahāvajreśvarī",
        anandadiYoga: "Ānanda - Joy",
        nature: "Nanda (Happiness)",
        spiritualAuspicious: 1,
      },
      {
        index: 7,
        tithi: "Saptamī",
        paksha: "Śukla",
        ruler: "Sūrya",
        nityaDevi: "Dūtī",
        anandadiYoga: "Arogya - Health",
        nature: "Bhadra (Well-being)",
        spiritualAuspicious: 1,
      },
      {
        index: 8,
        tithi: "Aṣṭamī",
        paksha: "Śukla",
        ruler: "Śiva",
        nityaDevi: "Nārāyaṇī",
        anandadiYoga: "Jaya - Victory",
        nature: "Jaya (Victory)",
        spiritualAuspicious: 1, // Good for sadhana, especially intense tapasya
        notes: "Day for intense sādhana, overcoming inner blocks, powerful mantras and tapasya.",
      },
      {
        index: 9,
        tithi: "Navamī",
        paksha: "Śukla",
        ruler: "Durgā",
        nityaDevi: "Nīlapaṭāka",
        anandadiYoga: "Nāṣṭa - Loss",
        nature: "Riktha (Emptiness)",
        spiritualAuspicious: 0, // Neutral, good for retreat and letting go
        notes: "Retreat, introspection, work on letting go of ego, avoid material activities.",
      },
      {
        index: 10,
        tithi: "Daśamī",
        paksha: "Śukla",
        ruler: "Dharmarāja",
        nityaDevi: "Vijayā",
        anandadiYoga: "Sampūrṇa - Fulfillment",
        nature: "Pūrṇa (Completeness)",
        spiritualAuspicious: 1, // Good for sadhana
        notes: "Day for celebrating spiritual victories, completing important sādhana, gratitude to teachers.",
      },
      {
        index: 11,
        tithi: "Ekādaśī",
        paksha: "Śukla",
        ruler: "Viṣṇu",
        nityaDevi: "Sarvamaṅgalā",
        anandadiYoga: "Ānanda - Joy",
        nature: "Nanda (Happiness)",
        spiritualAuspicious: 1, // Good for sadhana, fasting, meditation
        notes: "Most auspicious day for fasting, meditation, japa, withdrawal from the world, intense sādhana.",
      },
      {
        index: 12,
        tithi: "Dvādaśī",
        paksha: "Śukla",
        ruler: "Vasu",
        nityaDevi: "Vijayā",
        anandadiYoga: "Arogya - Health",
        nature: "Bhadra (Well-being)",
        spiritualAuspicious: 1, // Good for sadhana, gentle practice
        notes: "Restoration of energy after Ekādaśī, gratitude, well-being, light practice and rest.",
      },
      {
        index: 13,
        tithi: "Trayodaśī",
        paksha: "Śukla",
        ruler: "Kāmadeva",
        nityaDevi: "Jayavighnā",
        anandadiYoga: "Jaya - Victory",
        nature: "Jaya (Victory)",
        spiritualAuspicious: 1, // Good for sadhana
        notes: "Day for overcoming obstacles, spiritual strength, work on love and compassion.",
      },
      {
        index: 14,
        tithi: "Caturdaśī",
        paksha: "Śukla",
        ruler: "Kāla",
        nityaDevi: "Sarvamaṅgalā",
        anandadiYoga: "Nāṣṭa - Loss",
        nature: "Riktha (Emptiness)",
        spiritualAuspicious: 1, // Good for deep meditation, letting go, transformation
        notes: "Very auspicious for retreat, deep meditation, intense letting go, and spiritual transformation.",
      },
      {
        index: 15,
        tithi: "Pūrṇimā",
        paksha: "Śukla",
        ruler: "Pitṛs",
        nityaDevi: "Pūrṇeśvarī",
        anandadiYoga: "Sampūrṇa - Fulfillment",
        nature: "Pūrṇa (Completeness)",
        spiritualAuspicious: 1, // Good for sadhana, group practice
        notes: "Peak of spiritual energy, suitable for group meditations, pūjās, gratitude, celebration of light.",
      },
      {
        index: 16,
        tithi: "Pratipadā",
        paksha: "Kṛṣṇa",
        ruler: "Agni",
        nityaDevi: "Kāmeśvarī",
        anandadiYoga: "Ānanda - Siddhi (Success)",
        nature: "Nanda (Happiness)",
        spiritualAuspicious: 1,
        notes: "New beginning, setting intention for the next cycle, stability in practice.",
      },
      {
        index: 17,
        tithi: "Dvitīyā",
        paksha: "Kṛṣṇa",
        ruler: "Brahmā",
        nityaDevi: "Bhagamalini",
        anandadiYoga: "Ānanda - Maṅgala (Auspiciousness)",
        nature: "Bhadra (Well-being)",
        spiritualAuspicious: 1,
        notes: "Restoration of energy, well-being, community support, light practice.",
      },
      {
        index: 18,
        tithi: "Tṛtīyā",
        paksha: "Kṛṣṇa",
        ruler: "Gaurī (Pārvatī)",
        nityaDevi: "Nityaklinnā",
        anandadiYoga: "Jaya - Victory",
        nature: "Jaya (Victory)",
        spiritualAuspicious: 1,
        notes: "Overcoming inner obstacles, strengthening willpower, spiritual struggle.",
      },
      {
        index: 19,
        tithi: "Caturthī",
        paksha: "Kṛṣṇa",
        ruler: "Yama",
        nityaDevi: "Bheruṇḍā",
        anandadiYoga: "Nāṣṭa - Loss",
        nature: "Riktha (Emptiness)",
        spiritualAuspicious: 0,
        notes: "Introspection, retreat, work on letting go of attachments, meditation.",
      },
      {
        index: 20,
        tithi: "Pañcamī",
        paksha: "Kṛṣṇa",
        ruler: "Nāga",
        nityaDevi: "Vahnivāsinī",
        anandadiYoga: "Sampūrṇa - Fulfillment",
        nature: "Pūrṇa (Completeness)",
        spiritualAuspicious: 1,
        notes: "Spiritual fulfillment, end of cycle, gratitude, pūjās.",
      },
      {
        index: 21,
        tithi: "Ṣaṣṭhī",
        paksha: "Kṛṣṇa",
        ruler: "Kārttikeya",
        nityaDevi: "Mahāvajreśvarī",
        anandadiYoga: "Ānanda - Joy",
        nature: "Nanda (Happiness)",
        spiritualAuspicious: 1,
        notes: "Joy, celebrating progress, community support, group meditation.",
      },
      {
        index: 22,
        tithi: "Saptamī",
        paksha: "Kṛṣṇa",
        ruler: "Sūrya",
        nityaDevi: "Dūtī",
        anandadiYoga: "Arogya - Health",
        nature: "Bhadra (Well-being)",
        spiritualAuspicious: 1,
        notes: "Sūrya Namaskāra practice, health of body and mind, purification through prāṇāyāma.",
      },
      {
        index: 23,
        tithi: "Aṣṭamī",
        paksha: "Kṛṣṇa",
        ruler: "Śiva",
        nityaDevi: "Nārāyaṇī",
        anandadiYoga: "Jaya - Victory",
        nature: "Jaya (Victory)",
        spiritualAuspicious: 1,
        notes: "Intense sādhana, overcoming blocks, powerful mantras.",
      },
      {
        index: 24,
        tithi: "Navamī",
        paksha: "Kṛṣṇa",
        ruler: "Durgā",
        nityaDevi: "Nīlapaṭāka",
        anandadiYoga: "Nāṣṭa - Loss",
        nature: "Riktha (Emptiness)",
        spiritualAuspicious: 1,
        notes: "Auspicious for deep retreat, ego dissolution, advanced meditation, and inner renunciation.",
      },
      {
        index: 25,
        tithi: "Daśamī",
        paksha: "Kṛṣṇa",
        ruler: "Dharmarāja",
        nityaDevi: "Vijayā",
        anandadiYoga: "Sampūrṇa - Fulfillment",
        nature: "Pūrṇa (Completeness)",
        spiritualAuspicious: 1,
        notes: "Celebrating spiritual victories, completing sādhana, gratitude to teachers.",
      },
      {
        index: 26,
        tithi: "Ekādaśī",
        paksha: "Kṛṣṇa",
        ruler: "Viṣṇu",
        nityaDevi: "Sarvamaṅgalā",
        anandadiYoga: "Ānanda - Joy",
        nature: "Nanda (Happiness)",
        spiritualAuspicious: 1,
        notes: "Most auspicious day for fasting, meditation, japa, withdrawal, intense sādhana.",
      },
      {
        index: 27,
        tithi: "Dvādaśī",
        paksha: "Kṛṣṇa",
        ruler: "Vasu",
        nityaDevi: "Vijayā",
        anandadiYoga: "Arogya - Health",
        nature: "Bhadra (Well-being)",
        spiritualAuspicious: 1,
        notes: "Restoration of energy after Ekādaśī, well-being, light practice and rest.",
      },
      {
        index: 28,
        tithi: "Trayodaśī",
        paksha: "Kṛṣṇa",
        ruler: "Kāmadeva",
        nityaDevi: "Jayavighnā",
        anandadiYoga: "Jaya - Victory",
        nature: "Jaya (Victory)",
        spiritualAuspicious: 1,
        notes: "Overcoming obstacles, spiritual strength, work on love and compassion.",
      },
      {
        index: 29,
        tithi: "Caturdaśī",
        paksha: "Kṛṣṇa",
        ruler: "Kāla",
        nityaDevi: "Sarvamaṅgalā",
        anandadiYoga: "Nāṣṭa - Loss",
        nature: "Riktha (Emptiness)",
        spiritualAuspicious: 1,
        notes: "Very auspicious for retreat, deep meditation, intense letting go, and spiritual transformation.",
      },
      {
        index: 30,
        tithi: "Amāvasyā",
        paksha: "Kṛṣṇa",
        ruler: "Pitṛs",
        nityaDevi: "Śivadūtī",
        anandadiYoga: "Sampūrṇa - Fulfillment",
        nature: "Pūrṇa (Completeness)",
        spiritualAuspicious: 1,
        notes: "Day for deep meditation, retreat, work with ancestors, end of cycle, new intention.",
      },
    ];
    console.log(tithiData);

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

  // sa weba https://vedictime.com/en/library/nakshatra
  const nakshatras = [
    {
      number: 1,
      name: "Aswini",
      degrees: "00:00 - 13:20, Mesha (Aries)",
      lord: "Ketu",
      deity: "Ashwins - the twin horsemen",
      meaning: "the horsemen",
      stars: 3,
      symbol: "horse’s head",
      guna: "Rajas",
      caste: "Vaishyas",
      goal: "dharma",
      race: "Deva",
      sex: "M",
      shakti: "quickly reaching things",
      basisAbove: "those to be healed",
      basisBelow: "healing therapies",
      result: "world becomes free from disease",
    },
    {
      number: 2,
      name: "Bharani",
      degrees: "13:20 - 26:40, Mesha (Aries)",
      lord: "Shukra (Venus)",
      deity: "Yama - Death",
      meaning: "the bearers",
      stars: 3,
      symbol: "female sexual organ",
      guna: "Tamas",
      caste: "Mlecchas",
      goal: "artha",
      race: "Manusha",
      sex: "F",
      shakti: "take things away",
      basisAbove: "removal of life from the body",
      basisBelow: "carrying the soul to the ancestral realm",
      result: "moving on to the next world",
    },
    {
      number: 3,
      name: "Krttika",
      degrees: "26:40, Mesha - 10:00, Vrishabha",
      lord: "Surya (Sun)",
      deity: "Agni - Fire",
      meaning: "razor/cutter",
      stars: 6,
      symbol: "dagger/razor",
      guna: "Sattva",
      caste: "Brahmins",
      goal: "kama",
      race: "Rakshasa",
      sex: "F",
      shakti: "to burn",
      basisAbove: "heat",
      basisBelow: "light",
      result: "burning or purification",
    },
    {
      number: 4,
      name: "Rohini",
      degrees: "10:00 - 23:20, Vrishabha (Taurus)",
      lord: "Chandra (Moon)",
      deity: "Prajapati - lord of creation",
      meaning: "ruddy cow, red, growing",
      stars: 5,
      symbol: "chariot",
      guna: "Rajas",
      caste: "Shudra",
      goal: "moksha",
      race: "Manusha",
      sex: "M",
      shakti: "growth",
      basisAbove: "plants",
      basisBelow: "waters",
      result: "creation",
    },
    {
      number: 5,
      name: "Mrigashira",
      degrees: "23:20, Vrishabha - 6:40, Mithuna",
      lord: "Mangala (Mars)",
      deity: "Soma - god of immortality",
      meaning: "deer or antelope's head",
      stars: 3,
      symbol: "head or a deer",
      guna: "Tamas",
      caste: "servant",
      goal: "moksha",
      race: "Deva",
      sex: "N",
      shakti: "giving fulfillment",
      basisAbove: "extension",
      basisBelow: "weaving",
      result: "make the world enjoyable",
    },
    {
      number: 6,
      name: "Ardra",
      degrees: "6:40 - 20:00, Mithuna (Gemini)",
      lord: "Rahu",
      deity: "Rudra - god of storm",
      meaning: "the moist",
      stars: 1,
      symbol: "tear drop, gem",
      guna: "Sattva",
      caste: "butcher",
      goal: "kama",
      race: "Manusha",
      sex: "F",
      shakti: "effort",
      basisAbove: "hunting or searching",
      basisBelow: "reaching the goal",
      result: "brings about achievement",
    },
    {
      number: 7,
      name: "Punarvasu",
      degrees: "20:00, Mithuna - 3:20, Karkata",
      lord: "Guru (Jupiter)",
      deity: "Aditi - mother of the Gods",
      meaning: "return of the light and goods",
      stars: "4/5",
      symbol: "quiver/house, bow",
      guna: "Rajas",
      caste: "Vaishyas",
      goal: "artha",
      race: "Deva",
      sex: "M",
      shakti: "ability to gain wealth or substance",
      basisAbove: "wind or air",
      basisBelow: "wetness or rain",
      result: "revitalization of plants",
    },
    {
      number: 8,
      name: "Pushyami",
      degrees: "3:20 - 16:40, Karkata (Cancer)",
      lord: "Shani (Saturn)",
      deity: "Brihaspati - teacher of the Devas",
      meaning: "nourisher, flower, the best",
      stars: 3,
      symbol: "teat of cow, arrow, flower",
      guna: "Tamas",
      caste: "Kshatriyas",
      goal: "dharma",
      race: "Deva",
      sex: "M",
      shakti: "create spiritual energy",
      basisAbove: "sacrificial worship",
      basisBelow: "the worshipper",
      result: "creation of spiritual energy",
    },
    {
      number: 9,
      name: "Aslesha",
      degrees: "16:40 - 30:00, Karkata (Cancer)",
      lord: "Buddha (Mercury)",
      deity: "Sarpa - serpent",
      meaning: "entwiner, embracer, intimate connection",
      stars: "5/6",
      symbol: "wheel, serpent",
      guna: "Sattva",
      caste: "Mlecchas",
      goal: "dharma",
      race: "Rakshasa",
      sex: "F",
      shakti: "inflict with poison",
      basisAbove: "approach of the serpent",
      basisBelow: "trembling and agitation",
      result: "destruction of the victim",
    },
    {
      number: 10,
      name: "Magha",
      degrees: "00:00 - 13:20, Simha (Leo)",
      lord: "Ketu",
      deity: "The Pitris - the Ancestral Fathers",
      meaning: "beneficent, mighty",
      stars: 5,
      symbol: "throne, palanquin, royal court",
      guna: "Rajas",
      caste: "Shudra",
      goal: "artha",
      race: "Rakshasa",
      sex: "F",
      shakti: "leave the body",
      basisAbove: "mourning",
      basisBelow: "leaving the body",
      result: "death",
    },
    {
      number: 11,
      name: "Purva Phalguni",
      degrees: "13:20 - 26:40, Simha (Leo)",
      lord: "Shukra (Venus)",
      meaning: "the former reddish one",
      stars: 2,
      symbol: "swinging hammock",
      guna: "Rajas",
      caste: "Brahmins",
      goal: "kama",
      race: "Manusha",
      sex: "F",
      deity: "Bhaga - god of delight",
      shakti: "procreation",
      basisAbove: "seed",
      basisBelow: "womb",
      result: "creation",
    },
    {
      number: 12,
      name: "Uttara Phalguni",
      degrees: "26:40, Simha (Leo) - 10:00, Kanya (Virgo)",
      lord: "Surya (Sun)",
      meaning: "the latter reddish one",
      stars: 2,
      symbol: "four legs of bed, cot",
      guna: "Rajas",
      caste: "Kshatriya",
      goal: "moksha",
      race: "Manusha",
      sex: "M",
      deity: "Aryaman - god of contracts",
      shakti: "wealth through marriage",
      basisAbove: "union",
      basisBelow: "wealth",
      result: "prosperity",
    },
    {
      number: 13,
      name: "Hasta",
      degrees: "10:00 - 23:20, Kanya (Virgo)",
      lord: "Chandra (Moon)",
      meaning: "hand",
      stars: 5,
      symbol: "hand or fist",
      guna: "Sattva",
      caste: "Vaishyas",
      goal: "artha",
      race: "Deva",
      sex: "M",
      deity: "Savitar - aspect of the Sun",
      shakti: "gain through touch",
      basisAbove: "hand",
      basisBelow: "fingers",
      result: "manifestation",
    },
    {
      number: 14,
      name: "Chitra",
      degrees: "23:20, Kanya (Virgo) - 6:40, Tula (Libra)",
      lord: "Mangala (Mars)",
      meaning: "bright or shining",
      stars: 1,
      symbol: "pearl or jewel",
      guna: "Tamas",
      caste: "Shudra",
      goal: "kama",
      race: "Rakshasa",
      sex: "F",
      deity: "Tvashtar - celestial architect",
      shakti: "accumulation of merit",
      basisAbove: "brightness",
      basisBelow: "forms",
      result: "creation of beauty",
    },
    {
      number: 15,
      name: "Swati",
      degrees: "6:40 - 20:00, Tula (Libra)",
      lord: "Rahu",
      meaning: "independent or self-going",
      stars: 1,
      symbol: "coral or sword",
      guna: "Rajas",
      caste: "Vaishyas",
      goal: "moksha",
      race: "Deva",
      sex: "N",
      deity: "Vayu - god of wind",
      shakti: "scattering like the wind",
      basisAbove: "wind",
      basisBelow: "air",
      result: "dispersal",
    },
    {
      number: 16,
      name: "Vishakha",
      degrees: "20:00, Tula (Libra) - 3:20, Vrischika (Scorpio)",
      lord: "Guru (Jupiter)",
      meaning: "branched or forked",
      stars: 4,
      symbol: "decorated archway",
      guna: "Sattva",
      caste: "Kshatriya",
      goal: "dharma",
      race: "Rakshasa",
      sex: "M",
      deity: "Indra-Agni",
      shakti: "power to achieve goals",
      basisAbove: "hope",
      basisBelow: "purpose",
      result: "achievement",
    },
    {
      id: 17,
      name: "Anuradha",
      degrees: "3:20 - 16:40, Vrishchika (Scorpio)",
      lord: "Shani (Saturn)",
      deity: "Mitra - divine friend, lord of compassion",
      meaning: "subsequent success, following Radha",
      stars: "4",
      symbol: "bali (heap of rice), umbrella",
      guna: "Tamas",
      caste: "Shudra",
      goal: "dharma",
      race: "Deva",
      sex: "M",
      shakti: "worship",
      basisAbove: "ascension",
      basisBelow: "descent",
      shaktiResult: "honor and abundance",
    },
    {
      id: 18,
      name: "Jyeshta",
      degrees: "16:40 - 30:00, Vrishchika (Scorpio)",
      lord: "Buddha (Mercury)",
      deity: "Indra - god of thunder",
      meaning: "the eldest",
      stars: "3",
      symbol: "kundal (ear ring), umbrella, talisman",
      guna: "Sattva",
      caste: "servant",
      goal: "artha",
      race: "Rakshasa",
      sex: "F?",
      shakti: "rise or conquer, and gain courage in battle",
      basisAbove: "attack",
      basisBelow: "defense",
      shaktiResult: "one becomes a hero",
    },
    {
      id: 19,
      name: "Moola",
      degrees: "00:00 - 13:20, Dhanu (Sagittarius)",
      lord: "Ketu",
      deity: "Nirritti - goddess of disaster, Alaksmi",
      meaning: "root, commencement",
      stars: "11",
      symbol: "tail of lion, crouching line",
      guna: "Rajas",
      caste: "butcher",
      goal: "kama",
      race: "Rakshasa",
      sex: "N",
      shakti: "to ruin or destroy",
      basisAbove: "breaking things apart",
      basisBelow: "crushing things",
      shaktiResult: "the power to destroy (can destroy destruction)",
    },
    {
      id: 20,
      name: "Poorva Ashada",
      degrees: "13:20 - 26:40, Dhanu (Sagittarius)",
      lord: "Shukra (Venus)",
      deity: "Apas - goddess of Waters",
      meaning: "earlier victory",
      stars: "2",
      symbol: "hand fan, winnowing basket, tusk, square",
      guna: "Tamas",
      caste: "Brahmins",
      goal: "moksha",
      race: "Manusha",
      sex: "F",
      shakti: "invigoration",
      basisAbove: "strength",
      basisBelow: "connection",
      shaktiResult: "gain of luster",
    },
    {
      id: 21,
      name: "Uttara Ashada",
      degrees: "26:40, Dhanu - 10:00, Makara (Capricorn)",
      lord: "Surya (Sun)",
      deity: "Vishvadevas - Universal Gods",
      meaning: "later victory",
      stars: "2/8",
      symbol: "machan, elephant tusk, square",
      guna: "Sattva",
      caste: "Kshatriyas",
      goal: "moksha",
      race: "Manusha",
      sex: "F",
      shakti: "grant an unchallengeable victory",
      basisAbove: "strength to win",
      basisBelow: "the goal that one can win",
      shaktiResult: "becomes unchallenged winner",
    },
    {
      id: 22,
      name: "Shravana",
      degrees: "10:00 - 23:20, Makara (Capricorn)",
      lord: "Chandra (Moon)",
      deity: "Vishnu - the Pervader",
      meaning: "famous, hearing",
      stars: "3",
      symbol: "3 footprints, arrow",
      guna: "Rajas",
      caste: "Mlecchas",
      goal: "artha",
      race: "Deva",
      sex: "M",
      shakti: "connection",
      basisAbove: "seeking",
      basisBelow: "the paths",
      shaktiResult: "connection of all things",
    },
    {
      id: 23,
      name: "Dhanishta",
      degrees: "23:20, Makara - 6:40, Kumbha (Aquarius)",
      lord: "Mangala (Mars)",
      deity: "Vasus - gods of Light and Abundance",
      meaning: "very rich, very swift",
      stars: "4/5",
      symbol: "mridanga (drum)",
      guna: "Tamas",
      caste: "servant",
      goal: "dharma",
      race: "Rakshasa",
      sex: "F",
      shakti: "give abundance and fame",
      basisAbove: "birth",
      basisBelow: "prosperity",
      shaktiResult: "bringing people together",
    },
    {
      id: 24,
      name: "Shatabishaka",
      degrees: "6:40 - 20:00, Kumbha (Aquarius)",
      lord: "Rahu",
      deity: "Varuna - god of Cosmic Waters",
      meaning: "100 medicines or doctors",
      stars: "100",
      symbol: "circle, flower",
      guna: "Sattva",
      caste: "butcher",
      goal: "dharma",
      race: "Rakshasa",
      sex: "N",
      shakti: "healing",
      basisAbove: "pervasion over all",
      basisBelow: "support of all",
      shaktiResult: "world freed of calamity",
    },
    {
      id: 25,
      name: "Poorva Bhadrapada",
      degrees: "20:00, Kumbha - 3:20, Meena (Pisces)",
      lord: "Guru (Jupiter)",
      deity: "Aja Ekapada - one footed serpent, horned goat, unicorn",
      meaning: "earlier auspicious one",
      stars: "2",
      symbol: "double faced man, stage, machan, legs of a cot",
      guna: "Rajas",
      caste: "Brahmins",
      goal: "artha",
      race: "Manusha",
      sex: "M",
      shakti: "gives the fire to raise one worshipping up in life",
      basisAbove: "what is good for all people",
      basisBelow: "what is good for the gods",
      shaktiResult: "support the entire world",
    },
    {
      id: 26,
      name: "Uttara Bhadrapada",
      degrees: "3:20 - 16:40, Meena (Pisces)",
      lord: "Shani (Saturn)",
      deity: "Ahir Budhyaya - dragon of the Depths of the atmosphere",
      meaning: "later auspicious one",
      stars: "2/8",
      symbol: "last bed, legs of a cot, two joined men",
      guna: "Tamas",
      caste: "Kshatriyas",
      goal: "artha",
      race: "Manusha",
      sex: "M",
      shakti: "bringing of the rain",
      basisAbove: "raining clouds",
      basisBelow: "growing of plants",
      shaktiResult: "stability of the three worlds",
    },
    {
      id: 27,
      name: "Revati",
      degrees: "16:40 - 30:00, Meena (Pisces)",
      lord: "Buddha (Mercury)",
      deity: "Pushan - Sun as nourisher, protector, fosterer",
      meaning: "rich, wealthy",
      stars: "32",
      symbol: "mridanga (drum), fish",
      guna: "Sattva",
      caste: "Shudra",
      goal: "moksha",
      race: "Deva",
      sex: "F",
      shakti: "nourishment, symbolized by milk",
      basisAbove: "cows",
      basisBelow: "calves",
      shaktiResult: "nourishment of the entire world",
    },
  ];
  console.log(nakshatras);

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
