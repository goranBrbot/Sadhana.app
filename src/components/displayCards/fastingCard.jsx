import { format, isSameDay, isAfter, addDays, differenceInDays, formatDistanceStrict } from "date-fns";
import { EclipticLongitude, SearchMoonPhase } from "astronomy-engine";
import Panchang from "../panchang";
import { PropTypes } from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

export default function FastingCard({ sunrise, location, isOpen, onToggle }) {
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

    const startStr = format(fullMoonStart.date, "dd.MM HH:mm");
    const endStr = format(fullMoonEnd.date, "dd.MM HH:mm");

    if (isToday) {
      return <span className='aktivni'>Purnima is today till ${format(fullMoonEnd.date, "HH:mm")}h</span>;
    } else {
      return (
        <div>
          <span>Purnima is for {getTimeUntil(fullMoonStart.date, now)}.</span> <br />
          <span>
            From {startStr}h till {endStr}h
          </span>
        </div>
      );
    }
  }

  function amavasya() {
    const now = new Date();
    const elong = getElongation(now);

    let newMoonStart, newMoonEnd;

    if (elong >= 348 || elong < 0) {
      // Trenutno smo unutar Amavasya Tithija — traži početak unazad
      newMoonStart = SearchMoonPhase(348, now, -31);
      newMoonEnd = SearchMoonPhase(0, now, 31);
    } else {
      // Nismo u Amavasya — traži sledeću
      newMoonStart = SearchMoonPhase(348, now, 31);
      newMoonEnd = SearchMoonPhase(0, now, 31);
    }

    const isSameVedicDay = isSameDay(sunrise, newMoonEnd.date);
    const isToday = now >= sunrise && now < newMoonEnd.date && isSameVedicDay;

    const startStr = format(newMoonStart.date, "dd.MM HH:mm");
    const endStr = format(newMoonEnd.date, "dd.MM HH:mm");

    if (isToday) {
      return <span className='aktivni'>Amavasya is today till ${format(newMoonEnd.date, "HH:mm")}h</span>;
    } else {
      return (
        <div>
          <span>Amavasya is for {getTimeUntil(newMoonStart.date, now)}.</span> <br />
          <span>
            From {startStr}h till {endStr}h
          </span>
        </div>
      );
    }
  }

  // prethodna verzija koja ne prikazuje string na dan ekadashija ali točno računa
  /* function ekadashi() {
    const now = new Date();
    const elong = getElongation(now);

    let ekadashiStart, ekadashiEnd, label;

    // Shukla paksha Ekadashi (120°–132°)
    if (elong >= 120 && elong < 132) {
      ekadashiStart = SearchMoonPhase(120, now, -31);
      ekadashiEnd = SearchMoonPhase(132, now, 31);
      label = "Shukla Ekadashi";
    }
    // Krishna paksha Ekadashi (300°–312°)
    else if (elong >= 300 && elong < 312) {
      ekadashiStart = SearchMoonPhase(300, now, -31);
      ekadashiEnd = SearchMoonPhase(312, now, 31);
      label = "Krishna Ekadashi";
    }
    // Nismo trenutno u Ekadashiju — traži sljedeću
    else {
      // Pronađi sljedeću Shukla i Krishna Ekadashi
      const nextShuklaStart = SearchMoonPhase(120, now, 31);
      const nextShuklaEnd = SearchMoonPhase(132, now, 31);
      const nextKrishnaStart = SearchMoonPhase(300, now, 31);
      const nextKrishnaEnd = SearchMoonPhase(312, now, 31);

      // Prikaži onu koja dolazi prva
      if (nextShuklaStart.date < nextKrishnaStart.date) {
        ekadashiStart = nextShuklaStart;
        ekadashiEnd = nextShuklaEnd;
        label = "Ekadashi"; // Shukla Ekadashi
      } else {
        ekadashiStart = nextKrishnaStart;
        ekadashiEnd = nextKrishnaEnd;
        label = "Ekadashi"; // Krishna Ekadashi
      }
    }

    const isSameVedicDay = isSameDay(sunrise, ekadashiEnd.date);
    const isToday = now >= sunrise && now < ekadashiEnd.date && isSameVedicDay;

    const startStr = format(ekadashiStart.date, "dd.MM. HH:mm");
    const endStr = format(ekadashiEnd.date, "dd.MM. HH:mm");

    if (isToday) {
      return `${label} is today till ${format(ekadashiEnd.date, "HH:mm")}h`;
    } else {
      return `${label} ${startStr}h – ${endStr}h`;
    }
  } */

  function ekadashi() {
    const now = new Date();
    // Pronađi prethodni Shukla Ekadashi
    const prevShuklaStart = SearchMoonPhase(120, now, -31);
    const prevShuklaEnd = SearchMoonPhase(132, prevShuklaStart.date, 31);
    // Pronađi prethodni Krishna Ekadashi
    const prevKrishnaStart = SearchMoonPhase(300, now, -31);
    const prevKrishnaEnd = SearchMoonPhase(312, prevKrishnaStart.date, 31);

    // Ako je sada unutar Shukla Ekadashija
    if (now >= prevShuklaStart.date && now < prevShuklaEnd.date) {
      return <span className='aktivni'>Shukla Ekadashi is today till {format(prevShuklaEnd.date, "HH:mm")}h</span>;
    }
    // Ako je sada unutar Krishna Ekadashija
    if (now >= prevKrishnaStart.date && now < prevKrishnaEnd.date) {
      return <span className='aktivni'>Krishna Ekadashi is today till {format(prevKrishnaEnd.date, "HH:mm")}h</span>;
    }
    // Inače, prikaži sljedeći ekadashi (onaj koji dolazi prije)
    const nextShuklaStart = SearchMoonPhase(120, now, 31);
    const nextShuklaEnd = SearchMoonPhase(132, nextShuklaStart.date, 31);
    const nextKrishnaStart = SearchMoonPhase(300, now, 31);
    const nextKrishnaEnd = SearchMoonPhase(312, nextKrishnaStart.date, 31);
    let nextStart, nextEnd, label;
    if (nextShuklaStart.date < nextKrishnaStart.date) {
      nextStart = nextShuklaStart;
      nextEnd = nextShuklaEnd;
      label = "Shukla Ekadashi";
    } else {
      nextStart = nextKrishnaStart;
      nextEnd = nextKrishnaEnd;
      label = "Krishna Ekadashi";
    }
    const startStr = format(nextStart.date, "dd.MM HH:mm");
    const endStr = format(nextEnd.date, "dd.MM HH:mm");
    return (
      <div>
        <span>
          {label} is for {getTimeUntil(nextStart.date, now)}.
        </span>
        <br />
        <span>
          From {startStr}h till {endStr}h
        </span>
      </div>
    );
  }

  // Funkcija za prikaz preostalog vremena do određenog datuma
  function getTimeUntil(targetDate, now = new Date()) {
    const targetDateSunrise = Panchang(targetDate, location).sunriseOnDay;

    // Ako je targetDate nakon izlaska sunca, pomakni ga na sutrašnji dan u isto vrijeme
    const adjustedTarget = isAfter(targetDate, targetDateSunrise) ? addDays(targetDate, 1) : targetDate;

    const days = differenceInDays(adjustedTarget, now);

    if (days > 0) {
      return `${days} days`;
    } else {
      return formatDistanceStrict(adjustedTarget, now, { unit: "hour" });
    }
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = format(new Date(), "EEE");

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
      <div className='card fastingCard'>
        <div className='topBar' onClick={onToggle} style={{ position: "relative" }}>
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
        <motion.div className='container' initial={false} animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
          <AnimatePresence>
            {isOpen && (
              <motion.div className='fastingContainer' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 0.15, duration: 0.25 }}>
                <p>According to tradition, observances of vrata or upavāsa should align with the corresponding tithi at sunrise.</p>
                <span>{purnima()}</span>
                <br />
                <span>{amavasya()}</span>
                <br />
                <span>{ekadashi()}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

FastingCard.propTypes = {
  sunrise: PropTypes.instanceOf(Date),
  location: PropTypes.object,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};
