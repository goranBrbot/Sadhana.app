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
    } else return `"Purnima" ${format(fullMoon.date, "dd.MM.yyyy kk:mm")}h`;
  }

  function ekadashi() {
    const today = new Date();
    const spEkadashiStart = SearchMoonPhase(120, today, 30);
    const spEkadashiEnd = SearchMoonPhase(132, today, 30);
    const kpEkadashiStart = SearchMoonPhase(300, today, 30);
    const kpEkadashiEnd = SearchMoonPhase(312, today, 30);

    const spDate = `${format(spEkadashiStart.date, "dd.MM.yyyy kk:mm")}h - ${format(
      spEkadashiEnd.date,
      "dd.MM.yyyy kk:mm"
    )}h`;
    const kpDate = `${format(kpEkadashiStart.date, "dd.MM.yyyy kk:mm")}h - ${format(
      kpEkadashiEnd.date,
      "dd.MM.yyyy kk:mm"
    )}h`;

    if (tithiDay < 15 && spEkadashiStart != null && spEkadashiEnd != null) {
      return (
        <div>
          Ekadashi of Shukla Pakṣa
          <br />
          {spDate}
        </div>
      );
    } else if (tithiDay >= 15 && kpEkadashiStart != null && kpEkadashiEnd != null) {
      return (
        <div>
          Ekadashi of Kṛṣṇa Navamī
          <br />
          {kpDate}
        </div>
      );
    } else if (tithiDay == 11) return "Ekadashi is today!";
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div className='card'>
        <div className='topBar'>
          <small>FASTING TIME</small>
        </div>
        <div className='container'>
          <span>{amavasya()}</span>
          <br />
          <span>{purnima()}</span>
          <br />
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
