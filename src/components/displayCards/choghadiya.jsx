import { useEffect, useState } from "react";
import { isBefore, addDays, differenceInMilliseconds, addMilliseconds, getDay } from "date-fns";
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

const CHOGHADIYA_TIPOVI = {
  Amrit: "Najpovoljnije vrijeme za početak bilo kojeg važnog posla.",
  Shubh: "Vrlo povoljno za sve pozitivne aktivnosti.",
  Labh: "Dobro za poslovne dobitke i ulaganja.",
  Char: "Neutralno vrijeme, pogodno za svakodnevne zadatke.",
  Rog: "Nepovoljno – izbjegavajte zdravstvene i važne odluke.",
  Kaal: "Vrlo nepovoljno – ne preporučuje se početak ničega.",
  Udveg: "Vrijeme stresa i prepreka, najbolje izbjegavati važne radnje.",
};

const Choghadiya = ({ location, sunrise, sunset }) => {
  const [dnevnaTablica, setDnevnaTablica] = useState([]);
  const [nocnaTablica, setNocnaTablica] = useState([]);
  const [containerVisible, setContainerVisible] = useState(false);

  const toggleContainer = () => setContainerVisible(!containerVisible);

  /* useEffect(() => {
    if (!location || !sunrise || !sunset) return;

    const danas = new Date();
    const sutra = addDays(new Date(sunrise), 1);

    const dayOfWeek = danas.getDay();
    const dnevniChoghadiya = CHOGHADIYA_MAP[dayOfWeek].dan;
    const nocniChoghadiya = CHOGHADIYA_MAP[dayOfWeek].noc;

    const generirajIntervale = (startDate, endDate, niz) => {
      const trajanje = new Date((endDate - startDate) / 8);
      return niz.map((chogh, i) => {
        const start = new Date(startDate.getTime() + i * trajanje);
        const end = new Date(start.getTime() + trajanje);
        return { chogh, start, end };
      });
    };

    setDnevnaTablica(generirajIntervale(new Date(sunrise), new Date(sunset), dnevniChoghadiya));
    setNocnaTablica(generirajIntervale(new Date(sunset), new Date(sutra), nocniChoghadiya));
  }, [location, sunrise, sunset]);

  const sada = new Date();
  const formatTime = (date) => date.toTimeString().slice(0, 5);
  const stilReda = (tip) => (["Rog", "Kaal", "Udveg"].includes(tip) ? "nepovoljno" : "povoljno");

  const renderTablica = (podaci, naslov) => (
    <div>
      <br />
      <p>{naslov}</p>
      <table>
        <tbody>
          {podaci.map(({ chogh, start, end }, i) => (
            <tr key={i} className={`${stilReda(chogh)} ${sada >= start && sada < end ? "aktivni" : ""}`} title={CHOGHADIYA_TIPOVI[chogh]}>
              <td>
                {formatTime(start)} – {formatTime(end)}
              </td>
              <td>{chogh}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ); */

  useEffect(() => {
    if (!location || !sunrise || !sunset) return;

    const danas = new Date();
    const dayOfWeek = getDay(danas);
    const dnevniChoghadiya = CHOGHADIYA_MAP[dayOfWeek].dan;
    const nocniChoghadiya = CHOGHADIYA_MAP[dayOfWeek].noc;

    const startDay = new Date(sunrise); // lokalno
    const endDay = new Date(sunset); // lokalno

    const startNight = endDay;
    const endNight = addDays(startDay, 1);

    // Ako je endNight "manje" od startNight (zbog vremenskih pomaka), korigiraj
    if (isBefore(endNight, startNight)) {
      endNight.setHours(endNight.getHours() + 24);
    }

    const generirajIntervale = (startDate, endDate, niz) => {
      const ukupnoTrajanje = differenceInMilliseconds(endDate, startDate);
      const trajanjeSegmenta = ukupnoTrajanje / 8;

      return niz.map((chogh, i) => {
        const start = addMilliseconds(startDate, i * trajanjeSegmenta);
        const end = addMilliseconds(start, trajanjeSegmenta);
        return { chogh, start, end };
      });
    };

    const dnevniRaspored = generirajIntervale(startDay, endDay, dnevniChoghadiya);
    const nocniRaspored = generirajIntervale(startNight, endNight, nocniChoghadiya);

    setDnevnaTablica(dnevniRaspored);
    setNocnaTablica(nocniRaspored);
  }, [location, sunrise, sunset]);

  const sada = new Date();
  const formatTime = (date) => date.toTimeString().slice(0, 5);
  const stilReda = (tip) => (["Rog", "Kaal", "Udveg"].includes(tip) ? "nepovoljno" : "povoljno");

  const renderTablica = (podaci, naslov) => (
    <div>
      <br />
      <p>{naslov}</p>
      <table>
        <tbody>
          {podaci.map(({ chogh, start, end }, i) => (
            <tr key={i} className={`${stilReda(chogh)} ${sada >= start && sada < end ? "aktivni" : ""}`} title={CHOGHADIYA_TIPOVI[chogh]}>
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

  if (!location || !sunrise || !sunset) return <p>Učitavanje podataka...</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div
        className='card'
        style={{
          "--card-bg": "url(backgrounds/1.jpg)",
          "--card-bg-position": "top right",
        }}>
        <div className='topBar' onClick={toggleContainer}>
          <small>CHOGHADIYA MUHURTA</small>
        </div>
        <div className={`container ${containerVisible ? "visible" : "hidden"}`}>
          {renderTablica(dnevnaTablica, "From sunrise to sunset.")}
          {renderTablica(nocnaTablica, "From sunset to sunrise.")}
        </div>
      </div>
    </motion.div>
  );
};

export default Choghadiya;

Choghadiya.propTypes = {
  location: PropTypes.object,
  sunrise: PropTypes.instanceOf(Date),
  sunset: PropTypes.instanceOf(Date),
};
