import { useEffect, useState } from "react";
import { addDays, differenceInMilliseconds, addMilliseconds, getDay } from "date-fns";
import { format, addMinutes } from "date-fns";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

const CHOGHADIYA_MAP = {
  0: { dan: ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"], noc: ["Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh"] },
  1: { dan: ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"], noc: ["Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char"] },
  2: { dan: ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"], noc: ["Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal"] },
  3: { dan: ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"], noc: ["Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg"] },
  4: { dan: ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"], noc: ["Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit"] },
  5: { dan: ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"], noc: ["Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog"] },
  6: { dan: ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"], noc: ["Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh"] },
};

const CHOGHADIYA_TYPE = {
  Amrit: "Best",
  Shubh: "Good",
  Labh: "Gain",
  Char: "Neutral",
  Rog: "Evil",
  Kaal: "Loss",
  Udveg: "Bad",
};

const Choghadiya = ({ sunrise, sunset }) => {
  const [dnevnaTablica, setDnevnaTablica] = useState([]);
  const [nocnaTablica, setNocnaTablica] = useState([]);
  const [containerVisible, setContainerVisible] = useState(false);
  const [aktivnaChoghadiya, setAktivnaChoghadiya] = useState(null); // Dodano za aktivnu Choghadiya

  const toggleContainer = () => setContainerVisible(!containerVisible);

  useEffect(() => {
    if (!sunrise || !sunset) return;

    console.log("Sunrise:", sunrise);
    console.log("Sunset:", sunset);

    const startDay = sunrise; // Početak dnevnog intervala
    const endDay = sunset; // Kraj dnevnog intervala

    const startNight = sunset; // Početak noćnog intervala
    const endNight = addDays(sunrise, 1); // Kraj noćnog intervala (sunrise sljedećeg dana)

    console.log("Sunrise:", startDay);
    console.log("Sunset:", endDay);
    console.log("Start Night:", startNight);
    console.log("End Night:", endNight);

    const generirajIntervale = (startDate, endDate, niz) => {
      const ukupnoTrajanje = differenceInMilliseconds(endDate, startDate);
      const trajanjeSegmenta = ukupnoTrajanje / 8;

      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      console.log("Ukupno Trajanje (ms):", ukupnoTrajanje);
      console.log("Trajanje Segmenta (ms):", trajanjeSegmenta);

      return niz.map((chogh, i) => {
        const start = addMilliseconds(startDate, i * trajanjeSegmenta);
        const end = addMilliseconds(start, trajanjeSegmenta);
        return { chogh, start, end };
      });
    };

    const dnevniRaspored = generirajIntervale(startDay, endDay, CHOGHADIYA_MAP[getDay(new Date())].dan);
    const nocniRaspored = generirajIntervale(startNight, endNight, CHOGHADIYA_MAP[getDay(new Date())].noc);

    setDnevnaTablica(dnevniRaspored);
    setNocnaTablica(nocniRaspored);

    // Pronađi aktivnu Choghadiya
    const sada = new Date();
    const aktivna = dnevniRaspored.concat(nocniRaspored).find(({ start, end }) => sada >= start && sada < end) || null;

    setAktivnaChoghadiya(aktivna ? aktivna.chogh : null);
  }, [sunrise, sunset]);

  const sada = new Date();
  const formatTime = (date) => date.toTimeString().slice(0, 5);
  const stilReda = (tip) => (["Rog", "Kaal", "Udveg"].includes(tip) ? "nepovoljno" : "povoljno");

  const renderTablica = (podaci, naslov) => (
    <div>
      <p>{naslov}</p>
      <table>
        <tbody>
          {podaci.map(({ chogh, start, end }, i) => (
            <tr key={i} className={`${stilReda(chogh)} ${sada >= start && sada < end ? "aktivni" : ""}`} title={CHOGHADIYA_TYPE[chogh]}>
              <td>
                {formatTime(start)} – {formatTime(end)}
              </td>
              <td>{chogh}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!sunrise || !sunset) return <p>Loading data ..</p>;

  const brahmamuhurtaStart = format(addMinutes(sunrise, -96), "kk:mm'h'"); // 1 sat i 36 minuta manje
  const brahmamuhurtaEnd = format(addMinutes(sunrise, -48), "kk:mm'h'"); // 48 minuta manje

  console.log("Choghadiya data:", { dnevnaTablica, nocnaTablica });

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div className='card choghadiyaCard'>
        <div className='topBar' onClick={toggleContainer}>
          <h3>Best daily timings</h3>
          <small>CHOGHADIYA MUHURTA</small>
          {aktivnaChoghadiya && (
            <small className='aktivniInfo'>
              {aktivnaChoghadiya} - {CHOGHADIYA_TYPE[aktivnaChoghadiya]}
            </small>
          )}
        </div>
        <div className={`container ${containerVisible ? "visible" : "hidden"}`}>
          <span>
            Brahma Muhurta: {brahmamuhurtaStart} - {brahmamuhurtaEnd}
          </span>
          <br />
          <br />
          {renderTablica(dnevnaTablica, "Choghadiya table from sunrise to sunset.")} <br />
          {renderTablica(nocnaTablica, "Choghadiya table from sunset to sunrise.")}
        </div>
      </div>
    </motion.div>
  );
};

export default Choghadiya;

Choghadiya.propTypes = {
  sunrise: PropTypes.instanceOf(Date),
  sunset: PropTypes.instanceOf(Date),
};
