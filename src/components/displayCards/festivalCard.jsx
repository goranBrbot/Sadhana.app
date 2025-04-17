import { useState } from "react";
import { parse, isToday, isAfter, isWithinInterval, differenceInMilliseconds } from "date-fns";
import { PropTypes } from "prop-types";
import Panchang from "../panchang";
import GregorianToVedicTime from "../vedicTime";
import FindGregorianDateFromVedic from "../vedicToGregorian";
import {} from "astronomy-engine";
import { motion } from "framer-motion";

/* function calculateAnniversary(eventDate, year) {
  function getTithiForDate(date) {
    const razlikaMoonSun = PairLongitude("Moon", "Sun", date); // Računanje razlike Mjesečeve i Sunčeve ekliptičke dužine
    const tithiPeriod = razlikaMoonSun / 12; // Svaki tithi je 12° razlike
    const calculatedTithiDay = Math.ceil(tithiPeriod); // Zaokružujemo na najbliži cijeli broj
    return calculatedTithiDay;
    }
    
    const eventTithi = getTithiForDate(eventDate);
    console.log(`Tithi on the event date: ${eventTithi}`);
    
    let date = new Date(year, 11, 1, 0, 0, 0); // Početak tražene godine
    console.log(`date: ${date}`);
    
    let found = false;
    let anniversaryDate;
    
    while (date.getFullYear() === year) {
      const tithi = getTithiForDate(date);
      if (tithi === eventTithi) {
        anniversaryDate = new Date(date); // Pronađen datum s istim tithijem
        found = true;
        break;
        }
        date.setDate(date.getDate() + 1); // Pomjeri datum za 1 dan unaprijed
        }
        
        return found ? anniversaryDate : null;
        }
        
        // Koristi funkciju za pronalaženje obljetnice
        const eventDate = new Date("1963-12-05");
        console.log(eventDate);
        
        const anniversary2024 = calculateAnniversary(eventDate, 2024);
        if (anniversary2024) {
          console.log(`Anniversary in 2024 falls on: ${anniversary2024}`);
          } else {
            console.log("No matching tithi found in 2024.");
        } */

export default function FestivalCard({ location }) {
  console.log(location);

  const panchangData = Panchang(new Date(), location);
  console.log(panchangData);

  const vedicTime = GregorianToVedicTime(new Date(), location);
  console.log(vedicTime);

  const obljetnicaMahasamadhi = FindGregorianDateFromVedic("Pauṣa", "Kṛṣṇa Pakṣa", "Caturthī", "Purnimanta", location);
  console.log(obljetnicaMahasamadhi.gregorianDate);

  const [containerVisible, setContainerVisible] = useState(false);
  const toggleContainer = () => setContainerVisible(!containerVisible);

  const festivalTable = () => {
    const festivals = [
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

    const today = new Date();
    const currentYear = today.getFullYear();

    let nextIndex = -1;
    let nextFestivalDate = null;

    for (let i = 0; i < festivals.length; i++) {
      // eslint-disable-next-line no-unused-vars
      const [name, dateStr] = festivals[i];
      const [startStr, endStr] = dateStr.split("-");

      const startDate = parse(`${startStr}${currentYear}`, "d.M.yyyy", new Date());

      if (endStr) {
        const endDate = parse(`${endStr}${currentYear}`, "d.M.yyyy", new Date());

        if (isWithinInterval(today, { start: startDate, end: endDate })) {
          nextIndex = i;
          break;
        }
      }

      if (isToday(startDate) || isAfter(startDate, today)) {
        nextIndex = i;
        nextFestivalDate = startDate;
        break;
      }
    }

    const nextFestival = festivals[nextIndex];
    const timeDifference = nextFestivalDate ? differenceInMilliseconds(nextFestivalDate, today) : 0;

    // Calculate days and hours remaining
    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div style={{ marginTop: "30px" }}>
        {nextFestival && (
          <div style={{ fontWeight: "500", textAlign: "center" }}>
            <span>{"Next Festival .."}</span>
            <br />
            <span>{`"${nextFestival[0]}"`}</span>
            <br />
            <span>{`${daysRemaining} days | ${hoursRemaining} hours | ${minutesRemaining} minutes`}</span>
          </div>
        )}
        <table style={{ marginTop: "30px" }}>
          {/* <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Festival</th>
              <th style={{ textAlign: "center" }}>Date</th>
            </tr>
          </thead> */}
          <tbody>
            {festivals.map(([name, date], index) => {
              const isNext = index === nextIndex;
              const style = { fontWeight: isNext ? "700" : "400" };
              return (
                <tr key={index}>
                  <td style={{ ...style, textAlign: "left" }}>{name}</td>
                  <td style={{ ...style, textAlign: "right" }}>{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div className='card festivalCard'>
        <div className='topBar' onClick={toggleContainer}>
          <h3>Upcoming festivals</h3>
          <small>PANCHANG & CALENDAR</small>
        </div>
        <div className={`container ${containerVisible ? "visible" : "hidden"}`}>
          <img className='iconFestival' src='icons/puja.png' alt='Bell' />
          <img className='iconFestival2' src='festivalIcons/durga.png' alt='Festival avatar' />
          {/* <p>{vedicTime}</p> */}
          <span>Tithi: {panchangData.Tithi}</span>
          <br />
          <span>Paksha: {panchangData.Paksha}</span>
          <br />
          <span>Masa: {panchangData.Masa}</span>
          <br />
          <span>Samvat: {panchangData.Samvat}</span>
          <br />
          <span>Nakshatra: {panchangData.Nakshatra}</span>
          <br />
          <span>Yoga: {panchangData.Yoga}</span>
          <br />
          <span>Karana: {panchangData.Karana}</span>
          <br />
          <span>Var: {panchangData.Var}</span>
          <br />
          <span>{festivalTable()}</span>
        </div>
      </div>
    </motion.div>
  );
}

FestivalCard.propTypes = {
  location: PropTypes.object,
};
