import { useEffect, useState } from "react";
import { addDays, differenceInMilliseconds, addMilliseconds, getDay } from "date-fns";
import { format, addMinutes } from "date-fns";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

const PLANETARY_MAP = {
  0: {
    // Nedjelja
    dan: ["Sunce", "Mjesec", "Merkur", "Jupiter", "Saturn", "Venera", "Mars", "Sunce"],
    noc: ["Venera", "Jupiter", "Mjesec", "Mars", "Saturn", "Merkur", "Sunce", "Venera"],
  },
  1: {
    // Ponedjeljak
    dan: ["Jupiter", "Saturn", "Venera", "Mars", "Sunce", "Mjesec", "Merkur", "Jupiter"],
    noc: ["Mjesec", "Mars", "Saturn", "Merkur", "Sunce", "Venera", "Jupiter", "Mjesec"],
  },
  2: {
    // Utorak
    dan: ["Mars", "Sunce", "Mjesec", "Merkur", "Jupiter", "Saturn", "Venera", "Mars"],
    noc: ["Saturn", "Merkur", "Sunce", "Venera", "Jupiter", "Mjesec", "Mars", "Saturn"],
  },
  3: {
    // Srijeda
    dan: ["Merkur", "Jupiter", "Saturn", "Venera", "Mars", "Sunce", "Mjesec", "Merkur"],
    noc: ["Sunce", "Venera", "Jupiter", "Mjesec", "Mars", "Saturn", "Merkur", "Sunce"],
  },
  4: {
    // Četvrtak
    dan: ["Venera", "Mars", "Sunce", "Mjesec", "Merkur", "Jupiter", "Saturn", "Venera"],
    noc: ["Jupiter", "Mjesec", "Mars", "Saturn", "Merkur", "Sunce", "Venera", "Jupiter"],
  },
  5: {
    // Petak
    dan: ["Mjesec", "Merkur", "Jupiter", "Saturn", "Venera", "Mars", "Sunce", "Mjesec"],
    noc: ["Mars", "Saturn", "Merkur", "Sunce", "Venera", "Jupiter", "Mjesec", "Mars"],
  },
  6: {
    // Subota
    dan: ["Saturn", "Venera", "Mars", "Sunce", "Mjesec", "Merkur", "Jupiter", "Saturn"],
    noc: ["Merkur", "Sunce", "Venera", "Jupiter", "Mjesec", "Mars", "Saturn", "Merkur"],
  },
};

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

const CHOGHADIYA_INFO = {
  Amrit: "Amrit is time for meditation, mantra chanting (japa), bhakti yoga and prayers.",
  Shubh: "Shubh is time for teaching/learning, svadhyaya, satsanga, yajnas, and sankalpa-based practices.",
  Labh: "Labh is time for pranayama, sanskrit recitation/chanting and sattvic communication.",
  Char: "Char is time for bhajans, kirtan, pilgrimage, and walking meditations.",
  Rog: "Rog is time for dynamic asanas, physical cleansing, and mental strength-building.",
  Kaal: "Kaal is time for long fasting, self-reflection, difficult tapasya, and renunciation practices.",
  Udveg: "Udveg is time for seva, leadership roles in sangha, or confronting ego through disciplined practice.",
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

  // Vaar Vela - nedjelja - Amrit, ponedjeljak - Labh, utorak - Udveg, srijeda - Rog, četvrtak - Shubh, petak - Amrit, subota - Labh
  // Kaal Vela is the Kaal Choghadiya or time period ruled by Saturn
  // Kaal Ratri is the Laabh Choghadiya ruled by Mercury
  // Rahu kaal is the inauspicious time period ruled by Rahu

  function getInauspiciousPeriods(date, sunrise, sunset) {
    const dayOfWeek = date.getDay(); // 0 = nedjelja, 1 = ponedjeljak, ...
    const msPerMinute = 60000;
    const msPerHour = 60 * msPerMinute;

    const dayDurationMs = sunset - sunrise;
    const nightDurationMs = 24 * msPerHour - dayDurationMs;

    const oneEighthDay = dayDurationMs / 8;
    const oneEighthNight = nightDurationMs / 8;

    // Vaar Vela tipovi po danima
    // Pronađi indeks segmenta u CHOGHADIYA_MAP koji odgovara vaarVelaType
    const vaarVelaTypeMap = [
      "Amrit", // Nedjelja
      "Labh", // Ponedjeljak
      "Udveg", // Utorak
      "Rog", // Srijeda
      "Shubh", // Četvrtak
      "Amrit", // Petak
      "Labh", // Subota
    ];
    const vaarVelaType = vaarVelaTypeMap[dayOfWeek];
    const vaarVelaIdx = CHOGHADIYA_MAP[dayOfWeek].dan.findLastIndex((tip) => tip === vaarVelaType);
    const vaarVelaStart = new Date(sunrise.getTime() + oneEighthDay * vaarVelaIdx);
    const vaarVelaEnd = new Date(vaarVelaStart.getTime() + oneEighthDay);

    // Kaal Vela: segment dana gdje je vladar "Saturn"
    const planetaryDay = PLANETARY_MAP[dayOfWeek].dan;
    const kaalVelaIdx = planetaryDay.findIndex((planet) => planet === "Saturn");
    const kaalVelaStart = new Date(sunrise.getTime() + oneEighthDay * kaalVelaIdx);
    const kaalVelaEnd = new Date(kaalVelaStart.getTime() + oneEighthDay);

    // Kaal Ratri: segment noći gdje je vladar "Merkur"
    const planetaryNight = PLANETARY_MAP[dayOfWeek].noc;
    const kaalRatriIdx = planetaryNight.findIndex((planet) => planet === "Merkur");
    const kaalRatriStart = new Date(sunset.getTime() + oneEighthNight * kaalRatriIdx);
    const kaalRatriEnd = new Date(kaalRatriStart.getTime() + oneEighthNight);

    // Rahu Kaal indeks po danima (0 = nedjelja, 1 = ponedjeljak, ...)
    const rahuKaalSegmentArr = [8, 2, 7, 5, 6, 4, 3];
    const rahuKaalSegment = rahuKaalSegmentArr[dayOfWeek]; // npr. 7 za nedjelju
    const rahuKaalIdx = rahuKaalSegment - 1; // pretvori u 0-based indeks
    const rahuKaalStart = new Date(sunrise.getTime() + oneEighthDay * rahuKaalIdx);
    const rahuKaalEnd = new Date(rahuKaalStart.getTime() + oneEighthDay);

    // Ikona za Rahu Kaal
    const rahuImg = <img src='icons/rahu-kalam.png' style={{ float: "right", width: 20, height: 20, paddingTop: 3 }} alt='Rahu Kaal' />;

    return {
      VV: { label: "Vaar Vela", start: vaarVelaStart, end: vaarVelaEnd, mark: "VV" },
      KV: { label: "Kaal Vela", start: kaalVelaStart, end: kaalVelaEnd, mark: "KV" },
      KR: { label: "Kaal Ratri", start: kaalRatriStart, end: kaalRatriEnd, mark: "KR" },
      RK: { label: "Rahu Kaal", start: rahuKaalStart, end: rahuKaalEnd, mark: rahuImg },
    };
  }
  console.log(getInauspiciousPeriods(new Date(), sunrise, sunset));

  // Funkcija za provjeru preklapanja intervala
  const isOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };

  const renderTablica = (podaci, naslov) => {
    const inauspicious = getInauspiciousPeriods(new Date(), sunrise, sunset);

    return (
      <div>
        <p>{naslov}</p>
        <table>
          <tbody>
            {podaci.map(({ chogh, start, end }, i) => {
              // Pronađi sve oznake koje se preklapaju s ovim intervalom
              const marksArr = Object.entries(inauspicious)
                // eslint-disable-next-line no-unused-vars
                .filter(([key, { start: s, end: e }]) => isOverlap(start, end, s, e))
                // eslint-disable-next-line no-unused-vars
                .map(([key, val]) => val.mark);

              return (
                <tr key={i} className={`${stilReda(chogh)} ${sada >= start && sada < end ? "aktivni" : ""}`}>
                  <td style={{ width: "50%", textAlign: "left", paddingLeft: 15 }}>
                    {chogh} - {CHOGHADIYA_TYPE[chogh]}{" "}
                    <small style={{ color: "tomato", paddingInlineStart: "8px" }}>
                      {marksArr.map((mark, idx) =>
                        typeof mark === "string" ? (
                          <span key={idx}>{mark} </span>
                        ) : (
                          <span key={idx} style={{ verticalAlign: "middle" }}>
                            {mark}
                          </span>
                        )
                      )}
                    </small>
                  </td>
                  <td style={{ width: "40%" }}>
                    {formatTime(start)} – {formatTime(end)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

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
          <p>
            Brahma Muhurta: {brahmamuhurtaStart} - {brahmamuhurtaEnd}
          </p>
          <p>{CHOGHADIYA_INFO[aktivnaChoghadiya]}</p>
          {renderTablica(dnevnaTablica, "Day choghadiya is from sunrise to sunset.")} <br />
          {renderTablica(nocnaTablica, "Night choghadiya is from sunset to sunrise.")}
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
