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
  Amrit: "",
  Shubh: "",
  Labh: "",
  Char: "",
  Rog: "",
  Kaal: "",
  Udveg: "",
};

// parashara - grahas (benefic-malefic), internally-externally represented qualities, guna (sattva, rajas, tamas), and their effects on human life
const CHOGHADIYA_INFO = {
  Amrit: {
    ruler: "Chandra (Moon)", // parashara - manas (mind), thoughts (imagination), emotions (empathy), support, royal, motherly (nurturing), Water, Satwic,
    rulerIcon: "☽",
    guna: "Sattva",
    tatva: "Water",
    title: "Amrit Choghadiya", // Nectar
    description: "Best time for bhakti, japa and meditation.",
  },
  Shubh: {
    ruler: "Guru (Jupiter)", // parashara - knowledge, wisdom (spirituality), growth, spread, prosperity, optimism, happiness, teacher (learning-teaching), Ether, Satwic,
    rulerIcon: "♃",
    guna: "Sattva",
    tatva: "Ether",
    title: "Shubh Choghadiya", // Auspicious
    description: "Best time for svadhyaya or spread of wisdom.",
  },
  Labh: {
    ruler: "Budha (Mercury)", // parashara - speech (communication), buddhi (intellect), logic, clarity, adaptability, diplomat, Earth, Rajasik
    rulerIcon: "☿",
    guna: "Rajas",
    tatva: "Earth",
    title: "Labh Choghadiya", // Profitable
    description: "Best time for chanting of mantras.*",
  },
  Char: {
    ruler: "Shukra (Venus)", // parashara - reproduction (semen), relationships (pleasures), harmony (balance), comforts (desires), beauty (art), advisor, Water, Rajasik
    rulerIcon: "♀",
    guna: "Rajas",
    tatva: "Water",
    title: "Char Choghadiya", // Moving
    description: "Best time for bhajans, kirtans, and sangha.",
  },
  Rog: {
    ruler: "Mangala (Mars)", // parashara - energy, strength, protecting (aggression), action, focus, motivation (will), CEO (commanding), Fire, Tamasic,
    rulerIcon: "♂",
    guna: "Tamas",
    tatva: "Fire",
    title: "Rog Choghadiya", // Disease
    description: "Best time for asanas, pranayama, and physical exercise.",
  },
  Kaal: {
    ruler: "Shani (Saturn)", // parashara - grief, deep (profound), serious (cold), eternal (slow but steady), long term values, responsibility, commitment, stability, employee (servants) and introverts (researchers, monks) Air, Tamasik
    rulerIcon: "♄",
    guna: "Tamas",
    tatva: "Air",
    title: "Kal Choghadiya", // Time
    description: "Best time for mauna or pratyahara.",
  },
  Udveg: {
    ruler: "Surya (Sun)", // parashara - atma (soul), ego, power, identity, self-confidence, royal, fatherly(leadership), Fire, Satwic,
    rulerIcon: "☉",
    guna: "Sattva",
    tatva: "Fire",
    title: "Udveg Choghadiya", // Anxiety
    description: "Best time for karma yoga or confronting ego through disciplined practice.",
  },
  // Rahu Kaal is a period of time considered inauspicious in Hindu astrology.
  RahuKaal: {
    ruler: "Rahu", // parashara - outsiders (excentric), unexpected (unpredictable), passionate, impulsive, wild (tricky, fake), illusionary
    rulerIcon: "☊",
    guna: "",
    title: "Rahu Kaal",
    description: "Rahu Kaal is considered very inauspicious and is avoided for important activities.",
  },
};

const Choghadiya = ({ sunrise, sunset }) => {
  const [dnevnaTablica, setDnevnaTablica] = useState([]);
  const [nocnaTablica, setNocnaTablica] = useState([]);
  const [containerVisible, setContainerVisible] = useState(false);
  const [aktivnaChoghadiya, setAktivnaChoghadiya] = useState(null); // Dodano za aktivnu Choghadiya

  const toggleContainer = () => setContainerVisible(!containerVisible);

  /* useEffect(() => {
    if (!sunrise || !sunset) return;

    const sada = new Date();
    const referentniDatum = sada < sunrise ? addDays(sunrise, -1) : sunrise;
    const dayIdx = getDay(referentniDatum);

    const startDay = sunrise; // Početak dnevnog intervala
    const endDay = sunset; // Kraj dnevnog intervala
    const startNight = sunset; // Početak noćnog intervala
    const endNight = addDays(sunrise, 1); // Kraj noćnog intervala (sunrise sljedećeg dana)

    const generirajIntervale = (startDate, endDate, niz) => {
      const ukupnoTrajanje = differenceInMilliseconds(endDate, startDate);
      const trajanjeSegmenta = ukupnoTrajanje / 8;

      return niz.map((chogh, i) => {
        const start = addMilliseconds(startDate, i * trajanjeSegmenta);
        const end = addMilliseconds(start, trajanjeSegmenta);
        return { chogh, start, end };
      });
    };

    const dnevniRaspored = generirajIntervale(startDay, endDay, CHOGHADIYA_MAP[dayIdx].dan);
    const nocniRaspored = generirajIntervale(startNight, endNight, CHOGHADIYA_MAP[dayIdx].noc);

    setDnevnaTablica(dnevniRaspored);
    setNocnaTablica(nocniRaspored);

    // Pronađi aktivnu Choghadiya
    const aktivna = dnevniRaspored.concat(nocniRaspored).find(({ start, end }) => sada >= start && sada < end) || null;
    setAktivnaChoghadiya(aktivna ? aktivna.chogh : null);
  }, [sunrise, sunset]); */

  useEffect(() => {
    if (!sunrise || !sunset) return;

    const izracunajChoghadiya = () => {
      // Ako je trenutno vrijeme prije izlaska sunca, koristi jučerašnji dan
      const sada = new Date();
      const referentniDatum = sada < sunrise ? addDays(sunrise, -1) : sunrise;
      const dayIdx = getDay(referentniDatum);

      const startDay = sunrise;
      const endDay = sunset;
      const startNight = sunset;
      const endNight = addDays(sunrise, 1);

      const generirajIntervale = (startDate, endDate, niz) => {
        const ukupnoTrajanje = differenceInMilliseconds(endDate, startDate);
        const trajanjeSegmenta = ukupnoTrajanje / 8;
        return niz.map((chogh, i) => {
          const start = addMilliseconds(startDate, i * trajanjeSegmenta);
          const end = addMilliseconds(start, trajanjeSegmenta);
          return { chogh, start, end };
        });
      };

      const dnevniRaspored = generirajIntervale(startDay, endDay, CHOGHADIYA_MAP[dayIdx].dan);
      const nocniRaspored = generirajIntervale(startNight, endNight, CHOGHADIYA_MAP[dayIdx].noc);

      setDnevnaTablica(dnevniRaspored);
      setNocnaTablica(nocniRaspored);

      const aktivna = dnevniRaspored.concat(nocniRaspored).find(({ start, end }) => sada >= start && sada < end) || null;
      setAktivnaChoghadiya(aktivna ? aktivna.chogh : null);
    };

    izracunajChoghadiya();
    const interval = setInterval(izracunajChoghadiya, 60 * 1000); // 1 minuta
    return () => clearInterval(interval);
  }, [sunrise, sunset]);

  const sada = new Date();
  const formatTime = (date) => date.toTimeString().slice(0, 5);
  const stilReda = (tip) => (["Rog", "Kaal", "Udveg"].includes(tip) ? "nepovoljno" : "povoljno");

  // Vaar Vela - nedjelja - Amrit, ponedjeljak - Labh, utorak - Udveg, srijeda - Rog, četvrtak - Shubh, petak - Amrit, subota - Labh
  // Kaal Vela is the Kaal Choghadiya or time period ruled by Saturn
  // Kaal Ratri is the Laabh Choghadiya ruled by Mercury
  // Rahu kaal is the inauspicious time period ruled by Rahu

  function getInauspiciousPeriods(date, sunrise, sunset) {
    // Ako je trenutno vrijeme prije izlaska sunca, koristi jučerašnji dan
    const referentniDatum = date < sunrise ? addDays(sunrise, -1) : sunrise;
    const dayOfWeek = getDay(referentniDatum); // 0 = nedjelja, 1 = ponedjeljak, ...
    const msPerMinute = 60000;
    const msPerHour = 60 * msPerMinute;

    const dayDurationMs = sunset - sunrise;
    const nightDurationMs = 24 * msPerHour - dayDurationMs;

    const oneEighthDay = dayDurationMs / 8;
    const oneEighthNight = nightDurationMs / 8;

    // Vaar Vela tipovi po danima
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
    const kaalVelaIndices = planetaryDay.map((planet, idx) => (planet === "Saturn" ? idx : -1)).filter((idx) => idx !== -1);
    const kaalVelaSegments = kaalVelaIndices.map((idx) => ({
      label: "Kaal Vela",
      start: new Date(sunrise.getTime() + oneEighthDay * idx),
      end: new Date(sunrise.getTime() + oneEighthDay * (idx + 1)),
      mark: "KV",
    }));

    // Kaal Ratri: segment noći gdje je vladar "Merkur"
    const planetaryNight = PLANETARY_MAP[dayOfWeek].noc;
    const kaalRatriIdx = planetaryNight.map((planet, idx) => (planet === "Merkur" ? idx : -1)).filter((idx) => idx !== -1);
    const kaalRatriSegments = kaalRatriIdx.map((idx) => ({
      label: "Kaal Ratri",
      start: new Date(sunset.getTime() + oneEighthNight * idx),
      end: new Date(sunset.getTime() + oneEighthNight * (idx + 1)),
      mark: "KR",
    }));

    // Rahu Kaal indeks po danima (0 = nedjelja, 1 = ponedjeljak, ...)
    const rahuKaalSegmentArr = [8, 2, 7, 5, 6, 4, 3];
    const rahuKaalSegment = rahuKaalSegmentArr[dayOfWeek]; // npr. 7 za nedjelju
    const rahuKaalIdx = rahuKaalSegment - 1; // pretvori u 0-based indeks
    const rahuKaalStart = new Date(sunrise.getTime() + oneEighthDay * rahuKaalIdx);
    const rahuKaalEnd = new Date(rahuKaalStart.getTime() + oneEighthDay);
    const rahuImg = <img src='icons/rahu-kalam.png' style={{ float: "right", width: 20, height: 20, paddingTop: 3 }} alt='Rahu Kaal' />;

    return {
      VV: { label: "Vaar Vela", start: vaarVelaStart, end: vaarVelaEnd, mark: "VV" },
      KV: kaalVelaSegments, // Vraćamo više segmenata za Kaal Vela
      KR: kaalRatriSegments, // Vraćamo više segmenata za Kaal Ratri
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
        <table>
          <tbody>
            <tr>
              <td colSpan={2} className='choghadiyaTableHeader'>
                {naslov}
              </td>
            </tr>

            {podaci.map(({ chogh, start, end }, i) => {
              // Pronađi sve oznake koje se preklapaju s ovim intervalom
              // eslint-disable-next-line no-unused-vars
              const marksArr = Object.entries(inauspicious).flatMap(([key, val]) => {
                if (Array.isArray(val)) {
                  // Ako je niz (npr. KV), provjeri svaki segment
                  return val.filter(({ start: s, end: e }) => isOverlap(start, end, s, e)).map((seg) => seg.mark);
                } else if (val && typeof val === "object" && "start" in val && "end" in val) {
                  // Ako je objekt s start/end
                  return isOverlap(start, end, val.start, val.end) ? [val.mark] : [];
                }
                return [];
              });

              return (
                <tr key={i} className={`${stilReda(chogh)} ${sada >= start && sada < end ? "aktivni" : ""}`}>
                  <td style={{ width: "40%", textAlign: "left", paddingLeft: 35 }}>
                    {chogh} {CHOGHADIYA_TYPE[chogh]}{" "}
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
              {aktivnaChoghadiya} {CHOGHADIYA_TYPE[aktivnaChoghadiya]}
            </small>
          )}
        </div>
        <div className={`container ${containerVisible ? "visible" : "hidden"}`}>
          {CHOGHADIYA_INFO[aktivnaChoghadiya] && (
            <div className='muhurtaContainer'>
              <p>
                Brahmamuhurta {brahmamuhurtaStart} - {brahmamuhurtaEnd}
              </p>
              <span className='aktivni'>Active muhurta | {CHOGHADIYA_INFO[aktivnaChoghadiya].title}</span> <br />
              <span>
                {CHOGHADIYA_INFO[aktivnaChoghadiya].rulerIcon} {CHOGHADIYA_INFO[aktivnaChoghadiya].ruler} | {CHOGHADIYA_INFO[aktivnaChoghadiya].tatva} | {CHOGHADIYA_INFO[aktivnaChoghadiya].guna}
              </span>
            </div>
          )}
          {CHOGHADIYA_INFO[aktivnaChoghadiya] && (
            <div>
              {/* <p>{CHOGHADIYA_INFO[aktivnaChoghadiya].description}</p> */}
              {renderTablica(dnevnaTablica, "DAY CHOGHADIYA")} <br />
              {renderTablica(nocnaTablica, "NIGHT CHOGHADIYA")}
            </div>
          )}
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
