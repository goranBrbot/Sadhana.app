import { useState } from "react";

import { format, isSameDay } from "date-fns";
import { EclipticLongitude, SearchMoonPhase } from "astronomy-engine";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

export default function FastingCard({ sunrise }) {
  const [containerVisible, setContainerVisible] = useState(false);

  const toggleContainer = () => setContainerVisible(!containerVisible);

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

    const startStr = format(newMoonStart.date, "dd.MM. HH:mm");
    const endStr = format(newMoonEnd.date, "dd.MM. HH:mm");

    if (isToday) {
      return `Amavasya is today till ${format(newMoonEnd.date, "HH:mm")}h`;
    } else {
      return `Amavasya ${startStr}h – ${endStr}h`;
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
      return `Shukla Ekadashi is today till ${format(prevShuklaEnd.date, "HH:mm")}h`;
    }
    // Ako je sada unutar Krishna Ekadashija
    if (now >= prevKrishnaStart.date && now < prevKrishnaEnd.date) {
      return `Krishna Ekadashi is today till ${format(prevKrishnaEnd.date, "HH:mm")}h`;
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
    const startStr = format(nextStart.date, "dd.MM. HH:mm");
    const endStr = format(nextEnd.date, "dd.MM. HH:mm");
    return `${label} ${startStr}h – ${endStr}h`;
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = format(new Date(), "EEE");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
      <div className='card fastingCard'>
        <div className='topBar' onClick={toggleContainer} style={{ position: "relative" }}>
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
        <div className={`container ${containerVisible ? "visible" : "hidden"}`}>
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
};
