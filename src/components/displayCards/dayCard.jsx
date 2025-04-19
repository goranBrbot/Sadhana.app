import { format } from "date-fns";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

export default function DayCard({ sunrise, sunset, location, locationName }) {
  const todayDayDate = format(new Date(), "EEEE dd.MM.yyyy");
  const todaySunriseTime = format(sunrise, "kk:mm'h'");
  const todaySunsetTime = format(sunset, "kk:mm'h'");

  // Formatiraj `location` za prikaz
  const formattedLocation = location && location.latitude && location.longitude ? `Lat ${location.latitude}° Long ${location.longitude}° Alt ${location.height}m` : "Location not available";

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
          <span>{todayDayDate}</span>
          <br />
          <span>
            Sunrise: {todaySunriseTime} - Sunset: {todaySunsetTime}
          </span>
          <br />
          <span>{locationName}</span>
          <br />
          <span>{formattedLocation}</span>
        </div>
      </div>
    </motion.div>
  );
}

DayCard.propTypes = {
  sunrise: PropTypes.instanceOf(Date),
  sunset: PropTypes.instanceOf(Date),
  location: PropTypes.object,
  locationName: PropTypes.string,
};
