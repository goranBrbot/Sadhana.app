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

  const festivalTable = () => {
    return (
      <table style={{ marginTop: "30px" }}>
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
              <td style={{ textAlign: "right", fontWeight: name === nextFestivalInfo.name ? "bold" : "normal" }}>{date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  function getTithiMoonImage(tithiDay) {
    // Osigurava da je tithiDay između 1 i 30
    const validTithiDay = Math.max(1, Math.min(tithiDay, 30));
    return <img className='iconMoon' src={`icons/moon/${validTithiDay}.png`} alt={`Moon phase for Tithi ${validTithiDay}`} />;
  }

  function getPanchangChart(panchangData) {
    // Primjeri povoljnosti (prilagodi prema stvarnim pravilima)
    const tithiFavorability = {
      Pratipat: 1,
      Dvitiya: 1,
      Tritiya: 1,
      Chaturthi: -1,
      Panchami: 1,
      Shashthi: 1,
      Saptami: 1,
      Ashtami: -1,
      Navami: -1,
      Dashami: 1,
      Ekadashi: 1,
      Dwadashi: 1,
      Trayodashi: 1,
      Chaturdashi: -1,
      Purnima: 1,
      Amavasya: -1, // Dodaj sve tithije prema potrebi
    };

    const nakshatraFavorability = {
      Ashwini: 1,
      Bharani: 1,
      Krittika: -1,
      Rohini: -1, // Dodaj sve nakshatre
    };

    const yogaFavorability = {
      Vishkambha: 1,
      Priti: 1,
      Ayushman: 1,
      Saubhagya: 1,
      Shobhana: 1,
      // Dodaj sve yoge
    };

    const karanaFavorability = {
      Bava: 1,
      Balava: 1,
      Kaulava: 1,
      Taitila: 1,
      Garaja: 1,
      Vanija: 1,
      Vishti: -1,
      // Dodaj sve karane
    };

    const varFavorability = {
      Ravivar: -1,
      Somvar: 1,
      Mangalavara: -1,
      Budhvar: 1,
      Guruvar: 1,
      Sukarman: 1,
      Shanivar: -1,
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
    if (value === 1) return "rgba(137, 174, 82, 0.3)"; // povoljno - zeleno
    if (value === 0) return "rgba(88, 88, 88, 0.3)"; // neutralno - žuto
    if (value === -1) return "rgba(253, 81, 33, 0.3)"; // nepovoljno - crveno
    return "#fff"; // fallback
  };

  // Mapiranje povoljnosti na prikazivu vrijednost
  const mapFavorability = (value) => {
    if (value === 1) return 1; // povoljno - puni radijus
    if (value === 0) return 0.66; // neutralno - srednji radijus
    if (value === -1) return 0.33; // nepovoljno - mali radijus
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
        borderWidth: 0,
        borderColor: "#fff",
        backgroundColor: [getColor(favorability.Tithi), getColor(favorability.Nakshatra), getColor(favorability.Yoga), getColor(favorability.Karana), getColor(favorability.Var)],
      },
    ],
  };

  const polarOptions = {
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          display: false, // <--- OVO SAKRIVA NUMERACIJU I VERTIKALU
          stepSize: 0.33,
          callback: (value) => (value === 1 ? "" : value === 0.66 ? "" : value === 0.33 ? "" : ""),
        },
        grid: {
          color: "#fff", // boja kružnih linija (grid circles)
          lineWidth: 0, // debljina kružnih linija
          circular: true, // koristi kružne linije (ne poligonalne)
        },
        angleLines: {
          color: "#fff", // boja radijalnih linija (angle lines)
          lineWidth: 0, // debljina radijalnih linija
          borderDash: [4, 2], // crtkanje (npr. [4,2] za isprekidano, [] za puno)
        },
        pointLabels: {
          color: "#fff", // boja labela na rubu
          font: { size: 10, weight: "bold" },
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
        backgroundColor: ["#ffffff00", "#ffffff00", "#ffffff00", "#ffffff00", "#ffffff00"],
        borderColor: "#fff",
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "74%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: false,
  };

  const panchangLabels = ["TITHI", "NAKSHATRA", "YOGA", "KARANA", "VARA"];

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
          <div>
            <div>
              <h4>Purnimanta Panchanga</h4>
              <span>Tithi: {panchangData.TithiInfo.tithiName}</span>
              <br /> {/* lunar day */}
              <span>Nakshatra: {panchangData.Nakshatra}</span>
              <br /> {/* lunar constelation (house) */}
              <span>Yoga: {panchangData.Yoga}</span>
              <br /> {/* Sun and Moon combination */}
              <span>Karana: {panchangData.Karana}</span>
              <br /> {/* half of tithi */}
              <span>Vara: {panchangData.Var}</span>
              <br /> {/* day of the week */}
            </div>
            <div className='panchangChart' style={{ width: "130px", height: "130px" }}>
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
                    const r = 48; // polumjer za tekst (unutar donata)
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
                  return <line key={i} x1='65' y1='65' x2={x} y2={y} stroke='#fff' strokeWidth='2' strokeDasharray='2' />;
                })}

                {/* Tekst po kružnici */}
                {panchangLabels.map((label, i) => (
                  <text key={label} fontSize='8' fontWeight='bold' fill='rgba(88, 88, 88, 0.5)' textAnchor='middle' dominantBaseline='middle'>
                    <textPath href={`#arc-path-${i}`} startOffset='50%' alignmentBaseline='middle'>
                      {label}
                    </textPath>
                  </text>
                ))}
              </svg>
            </div>

            <div className='moonPhase'>
              <div>{getTithiMoonImage(tithiDay)}</div>
              <div>
                <span>
                  {panchangData.Tithi} Tithi {panchangData.Masa} Masa
                </span>
                {/* lunar month, purnimanta system*/}
                <br />
                <span>
                  {panchangData.Paksha} Paksha {panchangData.TithiInfo.tithiName}
                </span>
                {/* lunar waxing or waning */}
                <br />
                <span>{panchangData.Samvat} Vikrama Samvata</span>
                {/* lunar year */}
              </div>
            </div>
            <br />
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
