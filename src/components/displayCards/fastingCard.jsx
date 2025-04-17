import { useState } from "react";
import { format } from "date-fns";
import { SearchMoonPhase } from "astronomy-engine";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

export default function FastingCard({ tithiDay }) {
  function amavasya() {
    const today = format(new Date(), "dd.MM.yyyy");
    const newMoon = SearchMoonPhase(0, new Date(), 31);
    const amavasya = format(newMoon.date, "dd.MM.yyyy");
    if (amavasya == today) {
      return `Amavasya is today at ${format(newMoon.date, "kk:mm")}h`;
    } else return `Amavasya ${format(newMoon.date, "dd.MM.yyyy kk:mm")}h`;
  }

  function purnima() {
    const today = format(new Date(), "dd.MM.yyyy");
    const fullMoon = SearchMoonPhase(180, new Date(), 31);
    const purnima = format(fullMoon.date, "dd.MM.yyyy");
    if (purnima == today) {
      return `Purnima is today at ${format(fullMoon.date, "kk:mm")}h`;
    } else return `Purnima ${format(fullMoon.date, "dd.MM.yyyy kk:mm")}h`;
  }

  function ekadashi() {
    const today = new Date();
    const spEkadashiStart = SearchMoonPhase(120, today, 30);
    const spEkadashiEnd = SearchMoonPhase(132, today, 30);
    const kpEkadashiStart = SearchMoonPhase(300, today, 30);
    const kpEkadashiEnd = SearchMoonPhase(312, today, 30);

    if (tithiDay < 11 && tithiDay != 11 && spEkadashiStart != null && spEkadashiEnd != null) {
      const spDate = `${format(spEkadashiStart.date, "dd.MM.yyyy kk:mm")}h - ${format(spEkadashiEnd.date, "dd.MM.yyyy kk:mm")}h`;
      return (
        <div>
          Ekadashi of Shukla Pakṣa
          <br />
          {spDate}
        </div>
      );
    }

    if (tithiDay > 11 && tithiDay != 26 && kpEkadashiStart != null && kpEkadashiEnd != null) {
      const kpDate = `${format(kpEkadashiStart.date, "dd.MM.yyyy kk:mm")}h - ${format(kpEkadashiEnd.date, "dd.MM.yyyy kk:mm")}h`;
      return (
        <div>
          Ekadashi of Kṛṣṇa Navamī
          <br />
          {kpDate}
        </div>
      );
    }

    if (tithiDay == 11 || tithiDay == 26) {
      return <div>Ekadashi is today!</div>;
    }
  }

  const [containerVisible, setContainerVisible] = useState(false);
  const toggleContainer = () => setContainerVisible(!containerVisible);

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div className='card fastingCard'>
        <div className='topBar' onClick={toggleContainer}>
          <h3>Fasting days</h3>
          <small>VRATA & UPVAS</small>
        </div>
        <div className={`container ${containerVisible ? "visible" : "hidden"}`}>
          <img className='iconFood' src='icons/thali.png' alt='Fasting' />
          <span>{amavasya()}</span>
          <br />
          <span>{purnima()}</span>
          <br />
          <span>{ekadashi()}</span>
        </div>
      </div>
    </motion.div>
  );
}

FastingCard.propTypes = {
  tithiDay: PropTypes.number,
};
