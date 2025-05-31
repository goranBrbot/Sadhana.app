import { useState, useEffect } from "react";
import { parse, isToday, isAfter, isWithinInterval, differenceInMilliseconds } from "date-fns";
import { PropTypes } from "prop-types";
import Panchang from "../panchang";
import { motion } from "framer-motion";
import { PolarArea, Doughnut } from "react-chartjs-2";
import { Chart, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(RadialLinearScale, ArcElement, Tooltip, Legend);
//import GregorianToVedicTime from "../vedicTime";
//import FindGregorianDateFromVedic from "../vedicToGregorian";

const FESTIVALS = [
  ["Makar Sankranti", "14.1."],
  ["Vasant Panchami", "2.2."],
  ["Om Ashram Anniversary", "19.2."],
  ["Maha Shivaratri", "26.2."],
  ["Holi", "14.3."],
  ["Spring Navaratri", "30.3.-6.4."],
  ["Ramnavami", "6.4."],
  ["Hanuman Đajanti", "12.4."],
  ["International Day of Yoga", "21.6."],
  ["Mataji's Mahasamadhi", "27.6."],
  ["Guru Purnima", "10.7."],
  ["Sri Devpuriji Mahasamadhi", "26.7."],
  ["Vishwaguruji's Birthday", "27.7."],
  ["Raksha Bandhan", "9.8."],
  ["Janmashthami", "16.8."],
  ["Holy Guruji's Birthday", "24.8."],
  ["Ganesh Chaturthi", "26.8."],
  ["Pitr Purnima", "7.9."],
  ["UN Peace Day", "21.9."],
  ["Autumn Navaratri", "22.9.-2.10."],
  ["UN Non-Violence Day", "2.10."],
  ["Duhssera (Vijaya Dashami)", "2.10."],
  ["Sharad Purnima", "6.10."],
  ["Diwali", "20.10."],
  ["Holy Guruji's Mahasamadhi", "28.10."],
  ["UN World Meditation Day", "21.12."],
];

export default function FestivalCard({ location, tithiDay }) {
  const panchangData = Panchang(new Date(), location);
  //const vedicTime = GregorianToVedicTime(new Date(), location);
  //const obljetnicaMahasamadhi = FindGregorianDateFromVedic("Pauṣa", "Kṛṣṇa Pakṣa", "Caturthī", "Purnimanta", location);

  const [containerVisible, setContainerVisible] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [nextFestivalInfo, setNextFestivalInfo] = useState({
    name: "",
    daysRemaining: "",
    timeRemaining: "",
  });

  const toggleContainer = () => setContainerVisible(!containerVisible);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();

    let nextIndex = -1;
    let nextFestivalDate = null;

    for (let i = 0; i < FESTIVALS.length; i++) {
      // eslint-disable-next-line no-unused-vars
      const [name, dateStr] = FESTIVALS[i];
      const [startStr, endStr] = dateStr.split("-");

      const startDate = parse(`${startStr}${currentYear}`, "d.M.yyyy", new Date());

      if (endStr) {
        const endDate = parse(`${endStr}${currentYear}`, "d.M.yyyy", new Date());

        if (isWithinInterval(today, { start: startDate, end: endDate })) {
          nextIndex = i;
          nextFestivalDate = startDate;
          break;
        }
      }

      if (isToday(startDate) || isAfter(startDate, today)) {
        nextIndex = i;
        nextFestivalDate = startDate;
        break;
      }
    }

    const nextFestival = FESTIVALS[nextIndex];
    const timeDifference = nextFestivalDate ? differenceInMilliseconds(nextFestivalDate, today) : 0;

    // Calculate days, hours, and minutes remaining
    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    setNextFestivalInfo({
      name: nextFestival ? nextFestival[0] : "",
      daysRemaining: `${daysRemaining} days`,
      timeRemaining: `${hoursRemaining} hours | ${minutesRemaining} minutes`,
    });
  }, []);

  const festivalTable = () => (
    <div style={{ marginTop: "30px" }}>
      <div className='festivalButton' onClick={() => setShowTable((prev) => !prev)}>
        <h4>All festivals</h4>
      </div>
      {showTable && (
        <table>
          <tbody>
            {FESTIVALS.map(([name, date], index) => (
              <tr key={index}>
                <td
                  style={{
                    textAlign: "left",
                    fontWeight: name === nextFestivalInfo.name ? "bold" : "normal",
                  }}>
                  {name}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontWeight: name === nextFestivalInfo.name ? "bold" : "normal",
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
      <div className='card festivalCard'>
        <div className='topBar' onClick={toggleContainer}>
          <h3>Upcoming festivals</h3>
          <small>PANCHANG & CALENDAR</small>
          <small className='aktivniInfo'>in {nextFestivalInfo.daysRemaining}</small>
        </div>
        <div className={`container ${containerVisible ? "visible" : "hidden"}`}>
          {/* <img className='iconFestival' src='icons/puja.png' alt='Bell' /> */}
          {/* <img className='iconFestival2' src='festivalIcons/durga.png' alt='Festival avatar' /> */}
          {/* <p>{vedicTime}</p> */}
          <div className='panchangContainer'>
            <div>
              <p>According to the panchang, this moment is {povoljnost.opis} for your sadhana.</p>
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
          </div>
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
            <div style={{ marginTop: "25px", textAlign: "center", fontWeight: "500" }}>
              <span>{`Next is "${nextFestivalInfo.name}"`}</span>
              <br />
              <span>
                in {nextFestivalInfo.daysRemaining} | {nextFestivalInfo.timeRemaining}
              </span>
            </div>
          )}
          {festivalTable()}
        </div>
      </div>
    </motion.div>
  );
}

FestivalCard.propTypes = {
  location: PropTypes.object,
  tithiDay: PropTypes.number,
};
