import { useState, useEffect } from "react";
import { parse, isToday, isAfter, isWithinInterval, differenceInMilliseconds } from "date-fns";
import { PropTypes } from "prop-types";
import Panchang from "../panchang";
import { motion } from "framer-motion";
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

  function tithiCalc(day) {
    const tithiNames = {
      1: "Pratipada",
      2: "Dvitiya",
      3: "Tritiya",
      4: "Chaturthi",
      5: "Panchami",
      6: "Shashti",
      7: "Saptami",
      8: "Ashtami",
      9: "Navami",
      10: "Dashami",
      11: "Ekadashi",
      12: "Dvadashi",
      13: "Trayodashi",
      14: "Chaturdashi",
      15: "Purnima",
      0: "Amavasya",
    };

    if (day === 0 || day === 30) {
      return tithiNames[0];
    }

    const adjustedDay = day > 15 ? day - 15 : day;
    return tithiNames[adjustedDay];
  }

  const brightDarkTithi = tithiCalc(tithiDay);

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
          <span>System: Purnimanta </span>
          <br />
          <span>Var: {panchangData.Var}</span> {/* day of the week */}
          <br />
          <span>Tithi: {brightDarkTithi}</span> {/* lunar day */}
          <br />
          <span>Karana: {panchangData.Karana}</span> {/* half of tithi */}
          <br />
          <span>Paksha: {panchangData.Paksha}</span> {/* lunar waxing or waning */}
          <br />
          <span>Masa: {panchangData.Masa}</span> {/* lunar month */}
          <br />
          <span>Samvat: {panchangData.Samvat}</span> {/* lunar year */}
          <br />
          <span>Nakshatra: {panchangData.Nakshatra}</span> {/* lunar constelation (house) */}
          <br />
          <span>Yoga: {panchangData.Yoga}</span> {/* Sun and Moon combination */}
          <br />
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
