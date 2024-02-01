import { format, addMinutes } from "date-fns";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

export default function DayCard({ sunrise, sunset, tithiDay }) {
  console.log(sunrise);
  console.log(sunset);
  console.log(tithiDay);

  const todayDayDate = format(new Date(), "EEEE dd.MM.yyyy");
  const todaySunriseTime = format(sunrise, "kk:mm'h'");
  console.log(todaySunriseTime);

  const todaySunsetTime = format(sunset, "kk:mm'h'");
  const brahmamuhurtaStart = format(addMinutes(sunrise, -96), "kk:mm'h'"); // 1 sat i 36 minuta manje
  const brahmamuhurtaEnd = format(addMinutes(sunrise, -48), "kk:mm'h'"); // 48 minuta manje

  function tithiCalc(day) {
    if (day <= 15) {
      return day;
    } else if (day > 15) {
      return day - 15;
    }
  }

  const brightDarkTithi = tithiCalc(tithiDay);
  const brightDarkTithiHtml =
    tithiDay <= 15
      ? `${tithiDay} Tithi - ${brightDarkTithi} day of "Shukla Pakṣa"`
      : `${tithiDay} Tithi - ${brightDarkTithi} day of "Kṛṣṇa Navamī"`;

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div className='card'>
        <div className='topBar'>
          <small>DAILY TIME</small>
        </div>
        <div className='container'>
          <span>{todayDayDate}</span>
          <br />
          <span>{brightDarkTithiHtml}</span>
          <br />
          <span>
            Sunrise: {todaySunriseTime} / Sunset: {todaySunsetTime}
          </span>
          <br />
          <span>
            Brahma-muhūrta: {brahmamuhurtaStart} - {brahmamuhurtaEnd}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

DayCard.propTypes = {
  sunrise: PropTypes.instanceOf(Date),
  sunset: PropTypes.instanceOf(Date),
  tithiDay: PropTypes.number,
};
