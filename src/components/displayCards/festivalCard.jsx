import { useState, useEffect } from "react";
import { DateTime, Interval } from "luxon";
import { PropTypes } from "prop-types";
import Panchang from "../panchang";
import { motion, AnimatePresence } from "framer-motion";
import { PolarArea, Doughnut } from "react-chartjs-2";
import { Chart, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(RadialLinearScale, ArcElement, Tooltip, Legend);
//import GregorianToVedicTime from "../vedicTime";
//import FindGregorianDateFromVedic from "../vedicToGregorian";

const FESTIVALS = [
  ["Makar Sankranti", "14.1.", "Marks the Sun's transition into Capricorn (Makara Rāshi), symbolizing spiritual ascent and the awakening of inner light."],
  ["Vasant Panchami", "2.2.", "Dedicated to Devi Saraswati, the goddess of wisdom and divine speech, invoking clarity and inner knowledge."],
  ["Om Ashram Anniversary", "19.2.", "Commemorates the founding of Om Ashram, a center of spiritual practice (Sadhana), Seva, and divine wisdom."],
  ["Maha Shivaratri", "26.2.", "A sacred night of worship to Lord Shiva, observed with fasting, Japa, and meditation, invoking inner transformation."],
  ["Holi", "14.3.", "Festival of divine joy and renewal, celebrating the triumph of Dharma through surrender and devotion (Bhakti)."],
  ["Spring Navaratri", "30.3.-6.4.", "Nine nights of worship to Divine Mother Durga, invoking Shakti to overcome inner tamas and awaken purity."],
  ["Ramnavami", "6.4.", "Celebrates the divine birth of Lord Rama, embodiment of Dharma, righteousness, and ideal kingly virtue."],
  ["Hanuman Jayanti", "12.4.", "Honors the birth of Lord Hanuman, symbol of strength, humility, and unwavering devotion (Bhakti) to the Divine."],
  ["International Day of Yoga", "21.6.", "A UN day to reaffirm the path of Yoga as a means to Self-realization, inner peace, and global unity."],
  ["Mataji's Mahasamadhi", "27.6.", "Sacred remembrance of Mataji final liberation (Mahasamadhi), honoring a life of service and spiritual attainment."],
  ["Guru Purnima", "10.7.", "Day of reverence to the Satguru, whose light dispels darkness and reveals the Self (Atma Jñāna)."],
  ["Sri Devpuriji Mahasamadhi", "26.7.", "Honors the Mahasamadhi of Sri Devpuriji, revered yogi and realized Master of transcendental consciousness."],
  ["Vishwaguruji's Birthday", "27.7.", "Celebration of the divine birth of Vishwaguruji, embodiment of Jñāna, Bhakti and compassion in action."],
  ["Raksha Bandhan", "9.8.", "Symbolizes sacred protection and unity of spirit among siblings and all beings as one divine family."],
  ["Janmashtami", "16.8.", "Divine birth of Lord Krishna, the avatar of love (Prema), wisdom (Jñāna), and the eternal witness (Sākṣin)."],
  ["Holy Guruji's Birthday", "24.8.", "Celebrates the birth of Holy Guruji, source of divine guidance, Seva, and spiritual upliftment."],
  ["Ganesh Chaturthi", "26.8.", "Worship of Lord Ganesha, remover of obstacles and symbol of auspicious beginnings in spiritual life."],
  ["Pitr Purnima", "7.9.", "Day to honor ancestors through prayer and offerings, expressing gratitude and continuing the flow of blessings."],
  ["UN Peace Day", "21.9.", "Affirms the yogic ideal of Ahimsa (non-violence), promoting harmony through inner peace and conscious living."],
  ["Autumn Navaratri", "22.9.-2.10.", "Nine nights of Devi worship to invoke courage, purity, and victory over ego and ignorance."],
  ["UN Non-Violence Day", "2.10.", "Commemorates Ahimsa as the highest Dharma, aligned with the yogic path of compassion and truth."],
  ["Dussehra (Vijaya Dashami)", "2.10.", "Celebrates the victory of light over darkness, Dharma over adharma, and the conquest of ego through divine grace."],
  ["Sharad Purnima", "6.10.", "Full moon festival of divine love and abundance, celebrated in devotion to Lord Krishna and the universal Mother."],
  ["Diwali", "20.10.", "Festival of lights symbolizing the victory of inner light over ignorance, and awakening of the Self (Atman)."],
  ["Holy Guruji Mahasamadhi", "28.10.", "Remembrance of Holy Guruji Mahasamadhi, reflecting eternal presence through his teachings and divine service."],
  ["UN World Meditation Day", "21.12.", "Global observance encouraging Dhyana (meditation) as a universal path to inner peace and spiritual awakening."],
];

export default function FestivalCard({ location, tithiDay, isOpen, onToggle }) {
  const panchangData = Panchang(new Date(), location);
  //const vedicTime = GregorianToVedicTime(new Date(), location);
  //const obljetnicaMahasamadhi = FindGregorianDateFromVedic("Pauṣa", "Kṛṣṇa Pakṣa", "Caturthī", "Purnimanta", location);

  const [showTable, setShowTable] = useState(false);
  const [nextFestivalInfo, setNextFestivalInfo] = useState({
    name: "",
    daysRemaining: "",
    timeRemaining: "",
    message: "",
  });

  // Funkcija za dohvat intervala festivala
  function getFestivalInterval(dateStr, year) {
    if (dateStr.includes("-")) {
      const [startStr, endStr] = dateStr.split("-");
      const start = DateTime.fromFormat(startStr.trim() + year, "d.M.yyyy");
      const end = DateTime.fromFormat(endStr.trim() + year, "d.M.yyyy").endOf("day");
      return Interval.fromDateTimes(start, end);
    } else {
      const date = DateTime.fromFormat(dateStr.trim() + year, "d.M.yyyy");
      return Interval.fromDateTimes(date.startOf("day"), date.endOf("day"));
    }
  }

  useEffect(() => {
    const today = DateTime.local();
    const currentYear = today.year;

    // Prvo traži aktivni festival
    let activeFestival = null;
    for (let i = 0; i < FESTIVALS.length; i++) {
      const interval = getFestivalInterval(FESTIVALS[i][1], currentYear);
      if (interval.contains(today)) {
        activeFestival = FESTIVALS[i];
        break;
      }
    }
    if (activeFestival) {
      setNextFestivalInfo({
        name: activeFestival[0],
        daysRemaining: null,
        timeRemaining: "",
        message: "Is today",
      });
      return;
    }

    // Traži prvi festival u budućnosti
    let nextFestival = null;
    let nextFestivalDate = null;
    for (let i = 0; i < FESTIVALS.length; i++) {
      const interval = getFestivalInterval(FESTIVALS[i][1], currentYear);
      if (interval.start > today) {
        nextFestival = FESTIVALS[i];
        nextFestivalDate = interval.start;
        break;
      }
    }
    if (!nextFestival) {
      setNextFestivalInfo({
        name: "",
        daysRemaining: "",
        timeRemaining: "",
        message: "No more festivals this year",
      });
      return;
    }

    const diff = nextFestivalDate.diff(today, ["days", "hours", "minutes"]).toObject();
    setNextFestivalInfo({
      name: nextFestival[0],
      daysRemaining: Math.floor(diff.days),
      timeRemaining: `${Math.floor(diff.hours)}:${Math.floor(diff.minutes)}h`,
      message: "",
    });
  }, []);

  function formatFestivalCountdown(days, time) {
    if (days > 1) {
      return `in ${days} days`;
    } else if (days === 1) {
      return `in 1 day`;
    } else if (days === 0) {
      return `in ${time}`; // prikazuje sate i minute kad je 0 dana
    } else {
      return time; // za slučaj kad je null ili undefined
    }
  }

  useEffect(() => {
    if (!isOpen) setShowTable(false);
  }, [isOpen]);

  const festivalTable = () => (
    <div style={{ marginBottom: "24px" }}>
      <div className='festivalButton' onClick={() => setShowTable((prev) => !prev)}>
        <h4>All festival dates in 2025</h4>
      </div>
      {showTable && (
        <table>
          <tbody>
            {FESTIVALS.map(([name, date], index) => (
              <tr key={index}>
                <td
                  style={{
                    textAlign: "left",
                    fontWeight: name === nextFestivalInfo.name ? "500" : "normal",
                  }}>
                  {name}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontWeight: name === nextFestivalInfo.name ? "500" : "normal",
                  }}>
                  {date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  function getTithiMoonImage(tithiDay) {
    // Osigurava da je tithiDay između 1 i 30
    const validTithiDay = Math.max(1, Math.min(tithiDay, 30));
    return <img className='iconMoon' src={`icons/moon/${validTithiDay}.png`} alt={`Moon phase for Tithi ${validTithiDay}`} />;
  }

  function getPanchangChart(panchangData) {
    // Primjeri povoljnosti (1-povoljno, 0-neutralno, -1-nepovoljno) od ChatGPT-a !!!!!!!
    const tithiFavorability = {
      Pratipadā: 0, // neutralno za sadhanu
      Dvitīyā: 1, // povoljno za duhovne početke
      Tṛtīyā: 1, // povoljno za rituale
      Caturthī: -1, // nepovoljno za duhovnu praksu
      Pañcamī: 0, // neutralno
      Ṣaṣṭhī: -1, // nepovoljno
      Saptamī: 0, // neutralno
      Aṣṭamī: -1, // nepovoljno
      Navamī: 0, // neutralno
      Daśamī: 1, // povoljno za duhovne aktivnosti
      Ekādaśī: 1, // vrlo povoljno za sadhanu
      Dvādaśī: 1, // povoljno
      Trayodaśī: 0, // neutralno
      Caturdaśī: -1, // nepovoljno
      Pūrṇimā: 1, // vrlo povoljno, puni mjesec donosi energiju
      Amāvasyā: -1, // nepovoljno, noć nove lune nije idealna za sadhanu
    };

    const nakshatraFavorability = {
      Aśvinī: 1, // povoljno za početke i energiju
      Bhraṇī: -1, // nepovoljno za meditaciju, izaziva nemir
      Kṛttikā: 0, // neutralno, može biti i izazovno
      Rohiṇī: 1, // povoljno, donosi stabilnost i plodnost
      Mṛgaśirā: 1, // povoljno, povoljno za um i intuiciju
      Ārdrā: -1, // nepovoljno, može donijeti tjeskobu
      Punarvasu: 1, // povoljno, donosi obnovu i čistoću
      Pūṣya: 1, // vrlo povoljno, povoljno za sadhanu i rituale
      Aśleśā: -1, // nepovoljno, može donijeti emotivne smetnje
      Maghā: 0, // neutralno, više za ceremonijalne svrhe
      Pūrvāphālgunī: 1, // povoljno, za kreativnost i mir
      Uttarāphālgunī: 1, // povoljno, stabilno i podržavajuće
      Hasta: 1, // povoljno, povoljno za rad i meditaciju
      Citrā: 0, // neutralno, dinamično i izazovno
      Svātī: 1, // povoljno, sloboda i lakoća
      Viśākhā: 0, // neutralno, ambiciozno
      Anurādhā: 1, // povoljno, za posvećenost i snagu
      Jyeṣṭhā: -1, // nepovoljno, donosi unutarnju borbu
      Mūla: -1, // nepovoljno, destruktivni aspekti
      Pūrvāṣāḍhā: 1, // povoljno, za pobjede i uspjehe
      Uttarāṣāḍhā: 1, // povoljno, stabilnost i moć
      Śravaṇa: 1, // povoljno, dobra komunikacija i učenje
      Dhaniṣṭhā: 0, // neutralno, muzikalnost i ritam
      Śatabhiṣā: 1, // povoljno, iscjeljenje i zaštita
      Pūrvābhādrapadā: 0, // neutralno, mistično i duboko
      Uttarābhādrapadā: 1, // povoljno, mir i duhovna snaga
      Revatī: 1, // vrlo povoljno, duhovni kraj i ispunjenje
    };

    const yogaFavorability = {
      Viṣkaṃbha: -1, // nepovoljno, ometa mir i koncentraciju
      Prīti: 1, // povoljno, donosi radost i harmoniju
      Āyuṣmān: 1, // povoljno, dobar za zdravlje i dugovječnost
      Saubhāgya: 1, // povoljno, povoljno za sreću i uspjeh
      Śobhana: 1, // povoljno, blagoslov i prosperitet
      Atigaṇḑa: -1, // nepovoljno, donosi prepreke i nelagodu
      Sukarmā: 1, // povoljno, dobar za dobre radnje i sadhanu
      Dhṛti: 1, // povoljno, stabilnost i snaga
      Śūla: -1, // nepovoljno, može donijeti stres i probleme
      Gaṇḑa: -1, // nepovoljno, izazovi i teškoće
      Vṛddhi: 1, // povoljno, rast i razvoj
      Dhruva: 1, // povoljno, stabilnost i sigurnost
      Vyāghāta: -1, // nepovoljno, sukobi i nesuglasice
      Harṣaṇa: 1, // povoljno, radost i zadovoljstvo
      Vajra: 1, // povoljno, snaga i izdržljivost
      Siddhi: 1, // povoljno, uspjeh i ostvarenje
      Vyatīpāta: -1, // nepovoljno, nesreće i nesklad
      Varīyān: 1, // povoljno, uspjeh i zadovoljstvo
      Parigha: -1, // nepovoljno, prepreke i frustracije
      Śiva: 1, // povoljno, zaštita i blagoslov
      Siddha: 1, // povoljno, postignuće i moć
      Sādhya: 1, // povoljno, ostvarenje ciljeva
      Śubha: 1, // povoljno, povoljno u svakom pogledu
      Śukla: 1, // povoljno, svjetlost i jasnoća
      Brahma: 1, // povoljno, kreativnost i snaga
      Indra: 1, // povoljno, moć i autoritet
      Vaidhṛta: -1, // nepovoljno, problemi i prepreke
    };

    const karanaFavorability = {
      Kimstughna: 1, // povoljno, donosi uspjeh i blagostanje
      Bava: 1, // povoljno, stabilnost i mir
      Bālava: 1, // povoljno, snaga i energija
      Kaulava: -1, // nepovoljno, može donijeti nemir
      Taitila: -1, // nepovoljno, smetnje i prepreke
      Gara: -1, // nepovoljno, izazovi i napetosti
      Vaṇija: 1, // povoljno, blagostanje i uspjeh
      Vṛṣṭi: -1, // nepovoljno, nepovoljno za bilo kakvu praksu
      Śakuni: -1, // nepovoljno, sukobi i nesuglasice
      Catuṣpāda: 1, // povoljno, stabilnost i snaga
      Nāga: 1, // povoljno, zaštita i podrška
    };

    const varFavorability = {
      Ravivār: -1, // nedjelja, nepovoljno za intenzivnu sadhanu zbog previše aktivnosti i vanjskih utjecaja
      Somvār: 1, // ponedjeljak, vrlo povoljno za meditaciju i duhovnu praksu
      Mangaḷvār: 0, // utorak, neutralno, energično, ali može biti izazovno
      Budhvār: 1, // srijeda, povoljno za učenje i intelektualnu praksu
      Guruvār: 1, // četvrtak, vrlo povoljno za duhovni rast i blagoslove
      Shukravār: 0, // petak, neutralno, povoljno za rituale, ali manje za duboku meditaciju
      Shanivār: -1, // subota, nepovoljno zbog teže energije i prepreka
    };

    return {
      Tithi: tithiFavorability[panchangData.TithiInfo.tithiName] ?? 0,
      Nakshatra: nakshatraFavorability[panchangData.Nakshatra] ?? 0,
      Yoga: yogaFavorability[panchangData.Yoga] ?? 0,
      Karana: karanaFavorability[panchangData.Karana] ?? 0,
      Var: varFavorability[panchangData.Var] ?? 0,
    };
  }

  const favorability = getPanchangChart(panchangData);

  const getColor = (value) => {
    if (value === 1) return "rgba(195, 226, 246, 1)";
    if (value === 0) return "rgba(154, 179, 195, 1)"; // rgba(255, 211, 71, 0.8)
    if (value === -1) return "rgba(93, 108, 118, 1)"; // rgba(248, 105, 0, 0.6)
    return "#fff"; // fallback
  };

  // Mapiranje povoljnosti na prikazivu vrijednost
  const mapFavorability = (value) => {
    if (value === 1) return 1; // povoljno - puni radijus
    if (value === 0) return 0.75; // neutralno - srednji radijus
    if (value === -1) return 0.5; // nepovoljno - mali radijus
    return 0.1; // fallback
  };

  const polarData = {
    labels: ["Tithi", "Nakshatra", "Yoga", "Karana", "Vara"],
    datasets: [
      {
        label: "Panchang Chart",
        data: [
          mapFavorability(favorability.Tithi),
          mapFavorability(favorability.Nakshatra),
          mapFavorability(favorability.Yoga),
          mapFavorability(favorability.Karana),
          mapFavorability(favorability.Var),
        ],
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: [getColor(favorability.Tithi), getColor(favorability.Nakshatra), getColor(favorability.Yoga), getColor(favorability.Karana), getColor(favorability.Var)],
      },
    ],
  };

  const polarOptions = {
    maintainAspectRatio: true,
    responsive: true,
    layout: {
      padding: 3, // radi buga kod prikaza savršene kružnice
    },
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          display: false, // <--- OVO SAKRIVA NUMERACIJU I VERTIKALU
          stepSize: 0.25,
          callback: (value) => (value === 1 ? "" : value === 0.66 ? "" : value === 0.33 ? "" : ""),
        },
        grid: {
          color: "#fff", // boja kružnih linija (grid circles)
          lineWidth: 1, // debljina kružnih linija
          circular: true, // koristi kružne linije (ne poligonalne)
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
    animation: false,
  };

  const doughnutData = {
    labels: ["Tithi", "Nakshatra", "Yoga", "Karana", "Vara"],
    datasets: [
      {
        data: [1, 1, 1, 1, 1],
        backgroundColor: ["rgb(152, 202, 246)", "rgb(255, 211, 71)", "rgb(242, 142, 65)", "rgb(56, 76, 92)", "rgb(104, 139, 169)"],
        borderColor: "#fff",
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "90%",
    layout: {
      padding: 1, // radi buga kod prikaza savršene kružnice
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: false,
  };

  const panchangLabels = ["TITHI", "NAKSHATRA", "YOGA", "KARANA", "VARA"];

  // Definiraj ponderirane vrijednosti za svaki element
  const ponderi = {
    Nakshatra: 0.35,
    Tithi: 0.3,
    Yoga: 0.2,
    Karana: 0.1,
    Vara: 0.05,
  };

  function postotakPovoljnosti(tithi, nakshatra, yoga, karana, vara) {
    const ukupno = tithi * ponderi.Tithi + nakshatra * ponderi.Nakshatra + yoga * ponderi.Yoga + karana * ponderi.Karana + vara * ponderi.Vara;
    console.log(`Ukupno povoljnosti: ${ukupno} (Tithi: ${tithi}, Nakshatra: ${nakshatra}, Yoga: ${yoga}, Karana: ${karana}, Vara: ${vara})`);
    console.log(ukupno);

    let opis;
    // 0.65 ili 0.85 (tithi i nakshatra ili tithi, nakshatra i yoga) tradicionalno gledani za duhovnost
    if (ukupno >= 0.65) {
      opis = "very auspicious"; // 0.65 - 1
    } else if (ukupno >= 0.35) {
      opis = "auspicious"; // 0.35 - 0.65
    } else if (ukupno >= -0.35) {
      opis = "neutral"; // -0.35 - 0.35
    } else if (ukupno >= -0.65) {
      opis = "inauspicious"; // -0.65 - -0.35
    } else {
      opis = "very inauspicious"; // -1 - -0.65
    }

    return {
      opis,
    };
  }

  const povoljnost = postotakPovoljnosti(favorability.Tithi, favorability.Nakshatra, favorability.Yoga, favorability.Karana, favorability.Var);

  return (
    <motion.div initial={{ opacity: 0, y: 27 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 27 }} transition={{ delay: 0.5, duration: 0.3 }}>
      <div className='card festivalCard'>
        <div className='topBar' onClick={onToggle} style={{ position: "relative" }}>
          <h3>Upcoming festivals</h3>
          <small>PANCHANG & CALENDAR</small>
          <small className='aktivniInfo'>{nextFestivalInfo.message ? nextFestivalInfo.message : formatFestivalCountdown(nextFestivalInfo.daysRemaining, nextFestivalInfo.timeRemaining)}</small>{" "}
        </div>
        <motion.div className='container' initial={false} animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
          <AnimatePresence>
            {isOpen && (
              <motion.div className='panchangContainer' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 0.15, duration: 0.25 }}>
                {/* <img className='iconFestival' src='icons/puja.png' alt='Bell' /> */}
                {/* <img className='iconFestival2' src='festivalIcons/durga.png' alt='Festival avatar' /> */}
                {/* <p>{vedicTime}</p> */}
                <div>
                  <p>According to all elements of panchang this moment is {povoljnost.opis}.</p>
                  <h4>Purnimanta Panchang</h4>
                  <span>
                    Tithi<span style={{ fontWeight: 900, color: "rgb(152, 202, 246)" }}> •</span> {panchangData.TithiInfo.tithiName}
                  </span>
                  <br /> {/* lunar day */}
                  <span>
                    Nakshatra<span style={{ fontWeight: 900, color: "rgb(255, 211, 71)" }}> •</span> {panchangData.Nakshatra}
                  </span>
                  <br /> {/* lunar constelation (house) */}
                  <span>
                    Yoga<span style={{ fontWeight: 900, color: "rgb(242, 142, 65)" }}> •</span> {panchangData.Yoga}
                  </span>
                  <br /> {/* Sun and Moon combination */}
                  <span>
                    Karana<span style={{ fontWeight: 900, color: "rgb(56, 76, 92)" }}> •</span> {panchangData.Karana}
                  </span>
                  <br /> {/* half of tithi */}
                  <span>
                    Vara<span style={{ fontWeight: 900, color: "rgb(104, 139, 169)" }}> •</span> {panchangData.Var}
                  </span>
                  <br /> {/* day of the week */}
                </div>
                <div className='panchangChart' style={{ width: "130px", height: "130px", backdropFilter: "blur(3px)" }}>
                  {/* Doughnut kao tanki prsten */}
                  <Doughnut
                    data={doughnutData}
                    options={doughnutOptions}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "130px",
                      height: "130px",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  />
                  {/* PolarArea u sredini */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      width: "110px",
                      height: "110px",
                      zIndex: 2,
                      pointerEvents: "none",
                    }}>
                    <PolarArea data={polarData} options={polarOptions} />
                    {/* Transparentni krug u sredini */}
                    <div
                      style={{
                        position: "absolute",
                        top: "47.5px",
                        left: "47.5px",
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        background: "rgb(255,255,255)",
                        zIndex: 10,
                        pointerEvents: "none",
                        boxShadow: "0 0 8px 2px rgba(255,255,255,0.7) inset",
                      }}
                    />
                  </div>
                  {/* Svi graničnici u jednom SVG-u */}
                  <svg
                    width='130'
                    height='130'
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      pointerEvents: "none",
                      zIndex: 4,
                    }}>
                    <defs>
                      {panchangLabels.map((label, i) => {
                        // Parametri kružnice
                        const r = 47; // polumjer za tekst (unutar donata)
                        const cx = 65;
                        const cy = 65;
                        // Kutovi za segment
                        const startAngle = (i / panchangLabels.length) * 2 * Math.PI - Math.PI / 2;
                        const endAngle = ((i + 1) / panchangLabels.length) * 2 * Math.PI - Math.PI / 2;
                        // Početna i završna točka luka
                        const x1 = cx + r * Math.cos(startAngle);
                        const y1 = cy + r * Math.sin(startAngle);
                        const x2 = cx + r * Math.cos(endAngle);
                        const y2 = cy + r * Math.sin(endAngle);
                        // Veliki luk (always 0 jer je <180deg)
                        const largeArcFlag = 0;
                        // Sweep flag (1 = "naprijed")
                        const sweepFlag = 1;
                        // Jedinstveni ID za svaki path
                        const pathId = `arc-path-${i}`;
                        return <path key={pathId} id={pathId} d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`} fill='none' />;
                      })}
                    </defs>
                    {/* Graničnici */}
                    {panchangLabels.map((_, i) => {
                      const angle = (i / panchangLabels.length) * 2 * Math.PI - Math.PI / 2;
                      const x = 65 + 65 * Math.cos(angle);
                      const y = 65 + 65 * Math.sin(angle);
                      return <line key={i} x1='65' y1='65' x2={x} y2={y} stroke='#fff' strokeWidth='2' strokeDasharray='0' />;
                    })}
                    {/* Tekst po kružnici */}
                    {/*                 {panchangLabels.map((label, i) => (
                  <text key={label} fontSize='8' fontWeight='bold' fill='rgba(88, 88, 88, 0.5)' textAnchor='middle' dominantBaseline='middle'>
                    <textPath href={`#arc-path-${i}`} startOffset='50%' alignmentBaseline='middle'>
                      {label}
                    </textPath>
                  </text>
                ))} */}
                  </svg>
                </div>
              </motion.div>
            )}
            <motion.div className='calendarContainer'>
              <div className='moonPhase'>
                <div>{getTithiMoonImage(tithiDay)}</div>
                <div>
                  <span>
                    {panchangData.Paksha} Pakṣa {panchangData.TithiInfo.tithiName}
                  </span>
                  {/* lunar waxing or waning */}
                  <br />
                  <span>
                    {panchangData.Tithi} {panchangData.Masa} Māsa Tithi
                  </span>
                  {/* lunar month, purnimanta system*/}
                  <br />
                  <span>{panchangData.Samvat} Vikrama Samvata</span>
                  {/* lunar year */}
                </div>
              </div>
              {nextFestivalInfo.name && (
                <div>
                  <div style={{ marginTop: "35px", textAlign: "center", fontWeight: "500" }}>
                    <span>{`${nextFestivalInfo.name}`}</span>
                    <br />
                    <span>{nextFestivalInfo.message ? nextFestivalInfo.message : formatFestivalCountdown(nextFestivalInfo.daysRemaining, nextFestivalInfo.timeRemaining)}</span>
                  </div>
                  <br />
                  <div>
                    {(() => {
                      const fest = FESTIVALS.find((f) => f[0] === nextFestivalInfo.name);
                      return fest ? fest[2] : "";
                    })()}
                  </div>
                  <br />
                </div>
              )}
              {festivalTable()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

FestivalCard.propTypes = {
  location: PropTypes.object,
  tithiDay: PropTypes.number,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};
