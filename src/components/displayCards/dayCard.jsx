import { format } from "date-fns";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";
import GeoFindMe from "../geoLocation";

export default function DayCard({ sunrise, sunset }) {
  console.log(sunrise);
  console.log(sunset);

  const todayDayDate = format(new Date(), "EEEE dd.MM.yyyy");
  const todaySunriseTime = format(sunrise, "kk:mm'h'");
  const todaySunsetTime = format(sunset, "kk:mm'h'");

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div className='card dayCard'>
        <div className='topBar'>
          <h3>Basic information</h3>
          <small>BY YOUR LOCATION</small>
        </div>
        <div className='container'>
          <img className='iconSun' src='icons/sun.png' alt='Sun' />
          <span>{GeoFindMe(location)}</span>
          <span>{todayDayDate}</span>
          <br />
          <span>
            Sunrise: {todaySunriseTime} - Sunset: {todaySunsetTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

DayCard.propTypes = {
  sunrise: PropTypes.instanceOf(Date),
  sunset: PropTypes.instanceOf(Date),
};
