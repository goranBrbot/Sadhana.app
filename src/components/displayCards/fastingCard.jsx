import { format, isSameDay } from "date-fns";
import { EclipticLongitude, SearchMoonPhase } from "astronomy-engine";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

export default function FastingCard({ sunrise, tithiDay }) {
  function amavasya() {
    const today = format(new Date(), "dd.MM.yyyy");
    const newMoon = SearchMoonPhase(0, new Date(), 31);
    const amavasya = format(newMoon.date, "dd.MM.yyyy");
    if (amavasya == today) {
      return `Amavasya is today at ${format(newMoon.date, "kk:mm")}h`;
    } else return `Amavasya ${format(newMoon.date, "dd.MM.yyyy kk:mm")}h`;
  }

  /* function purnima() {
    const today = format(new Date(), "dd.MM.yyyy");
    const fullMoon = SearchMoonPhase(180, new Date(), 31);
    const purnima = format(fullMoon.date, "dd.MM.yyyy");
    if (purnima == today) {
      return `Purnima is today at ${format(fullMoon.date, "kk:mm")}h`;
    } else return `Purnima ${format(fullMoon.date, "dd.MM.yyyy kk:mm")}h`;
  } */

  // Izračunava trenutnu elongaciju Mjeseca od Sunca (0–360°)
  function getElongation(date) {
    let elongation = EclipticLongitude("Moon", date);
    if (elongation < 0) {
      elongation += 360;
    }
    return elongation;
  }

  function purnima() {
    const now = new Date();
    const elong = getElongation(now);

    let fullMoonStart, fullMoonEnd;

    if (elong >= 168 && elong < 180) {
      // Trenutno smo unutar Purnima Tithija — traži početak unazad
      fullMoonStart = SearchMoonPhase(168, now, -31);
      fullMoonEnd = SearchMoonPhase(180, now, 31);
    } else {
      // Nismo u Purnimi — traži sljedeću
      fullMoonStart = SearchMoonPhase(168, now, 31);
      fullMoonEnd = SearchMoonPhase(180, now, 31);
    }

    const isSameVedicDay = isSameDay(sunrise, fullMoonEnd.date);
    const isToday = now >= sunrise && now < fullMoonEnd.date && isSameVedicDay;

    const startStr = format(fullMoonStart.date, "dd.MM. HH:mm");
    const endStr = format(fullMoonEnd.date, "dd.MM. HH:mm");

    if (isToday) {
      return `Purnima is today till ${format(fullMoonEnd.date, "HH:mm")}h`;
    } else {
      return `Purnima ${startStr}h – ${endStr}h`;
    }
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
          Ekadashi of Kṛṣṇa Pakṣa
          <br />
          {kpDate}
        </div>
      );
    }

    if (tithiDay == 11 || tithiDay == 26) {
      return <div>Ekadashi is today!</div>;
    }
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = format(new Date(), "EEE");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
      <div className='card fastingCard'>
        <div className='topBar' style={{ position: "relative" }}>
          <h3>Fasting days</h3>
          <small>VRAT & UPVAS</small>
          <small className='aktivniInfo'>
            {daysOfWeek.map((day, index) => (
              <span
                key={day}
                style={{
                  color: day === currentDay ? "#f28e41" : "inherit",
                  marginRight: index < daysOfWeek.length - 1 ? "3px" : "0", // Dodaje razmak osim za zadnji
                }}>
                {day}
              </span>
            ))}
          </small>
        </div>
        <div className='container'>
          <span>{purnima()}</span>
          <br />
          <span>{amavasya()}</span>
          <br />
          <span>{ekadashi()}</span>
        </div>
      </div>
    </motion.div>
  );
}

FastingCard.propTypes = {
  sunrise: PropTypes.instanceOf(Date),
  tithiDay: PropTypes.number,
};
