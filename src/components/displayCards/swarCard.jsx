import { useState, useEffect } from "react";
import { format, add } from "date-fns";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

const Swara = ({ sunrise, tithiDay, setSwaraText }) => {
  const idaDays = [1, 2, 3, 7, 8, 9, 13, 14, 15, 19, 20, 21, 25, 26, 27];
  const pingalaDays = [4, 5, 6, 10, 11, 12, 16, 17, 18, 22, 23, 24, 28, 29, 30];

  const [idaVremena, setIdaVremena] = useState([]);
  const [pingalaVremena, setPingalaVremena] = useState([]);
  const [remainingTime, setRemainingTime] = useState(null);
  const [containerVisible, setContainerVisible] = useState(false);

  const toggleContainer = () => setContainerVisible(!containerVisible);

  const swarVrijeme = (dan, lista, startVrijeme, trajanjeMinuta, brojElemenata) => {
    const rezultat = [];
    let trenutnoVrijeme = new Date(startVrijeme);
    console.log(trenutnoVrijeme);

    const filteredIda = idaDays.includes(dan);
    const filteredPingala = pingalaDays.includes(dan);

    let redoslijed = [];

    if (filteredIda) {
      redoslijed = ["Ida", "Pingala"];
    } else if (filteredPingala) {
      redoslijed = ["Pingala", "Ida"];
    }

    for (let i = 0; i < brojElemenata; i++) {
      const endTime = new Date(trenutnoVrijeme.getTime() + trajanjeMinuta * 60 * 1000);
      const sequence = redoslijed[i % 2];
      rezultat.push({
        sequence: sequence,
        start: trenutnoVrijeme,
        end: endTime,
      });
      trenutnoVrijeme = endTime;
    }

    lista.push(...rezultat);
  };

  const calculateRemainingTime = (currentTime, nextChangeTime) => {
    const diff = Math.abs(nextChangeTime - currentTime); // Razlika u milisekundama
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };
  const twoDigits = new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format;

  useEffect(() => {
    if (idaDays.includes(tithiDay)) {
      const idaResult = [];
      swarVrijeme(tithiDay, idaResult, sunrise, 60, 24);
      setIdaVremena(idaResult);
      const generatedText = `${idaResult[0].sequence} swara at ${idaResult[0].start} - ${idaResult[0].end}`;
      console.log(generatedText);
      setSwaraText(generatedText);
    } else if (pingalaDays.includes(tithiDay)) {
      const pingalaResult = [];
      swarVrijeme(tithiDay, pingalaResult, sunrise, 60, 24);
      setPingalaVremena(pingalaResult);
      const generatedText = `${pingalaResult[0].sequence} swara at ${pingalaResult[0].start} - ${pingalaResult[0].end}`;
      console.log(generatedText);
      setSwaraText(generatedText);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sunrise, tithiDay, setSwaraText]);

  function getNextSwaraChange(sunrise, tithiDay) {
    const daysUntilChange = 3 - ((tithiDay - 1) % 3);
    const nextChangeDay = daysUntilChange === 0 ? 3 : daysUntilChange;
    return add(sunrise, { days: nextChangeDay });
  }

  // računa do slijedeće promjene sware u sunrise
  useEffect(() => {
    if (sunrise && tithiDay) {
      const nextChange = getNextSwaraChange(sunrise, tithiDay);
      const updateRemaining = () => {
        const sada = new Date();
        setRemainingTime(calculateRemainingTime(sada, nextChange));
      };
      updateRemaining();
      const interval = setInterval(updateRemaining, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [sunrise, tithiDay]);

  // računa do slijedećeg sunrisea!
  /* useEffect(() => {
    if (sunrise) {
      const nextSunrise = add(sunrise, { hours: 24 });
      const updateRemaining = () => {
        const sada = new Date();
        setRemainingTime(calculateRemainingTime(sada, nextSunrise));
      };
      updateRemaining();
      const interval = setInterval(updateRemaining, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [sunrise]); */

  const getCurrentSwara = () => {
    const now = new Date();
    for (const item of idaVremena) {
      if (now >= item.start && now < item.end) {
        return item.sequence; // "Ida"
      }
    }
    for (const item of pingalaVremena) {
      if (now >= item.start && now < item.end) {
        return item.sequence; // "Pingala"
      }
    }
    return "--";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div className='card swarCard'>
        <div className='topBar' onClick={toggleContainer}>
          <h3>Active nostril</h3>
          <small>SWARA YOGA</small>
          <small className='aktivniInfo'>{getCurrentSwara()}</small>
          {/* <img className='gurudevIcon' src='/backgrounds/gurudev.png' alt='Gurudev' /> */}
          {/* <img className='iconSwar' src='/icons/hinduism.png' alt='Air flow' /> */}
        </div>
        <div className={`container ${containerVisible ? "visible" : "hidden"}`}>
          <div>
            <p>{idaDays.includes(tithiDay) ? `Day start with left nostril.` : pingalaDays.includes(tithiDay) ? `Day start with right nostril.` : "Swara"}</p>
          </div>
          <ul>
            {idaVremena.map((item, index) => (
              <li key={index}>{`${item.sequence} at ${format(item.start, "kk:mm'h'")} - ${format(item.end, "kk:mm'h'")}`}</li>
            ))}
          </ul>
          <ul>
            {pingalaVremena.map((item, index) => (
              <li key={index}>{`${item.sequence} at ${format(item.start, "kk:mm'h'")} - ${format(item.end, "kk:mm'h'")}`}</li>
            ))}
          </ul>
          {remainingTime && (
            <span>
              Changes for {twoDigits(remainingTime.hours)}:{twoDigits(remainingTime.minutes)}h
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// kod za render liste vremena .. <li key={index}>{`${item.sequence} from: ${item.start} - to: ${item.end}`}</li>
// ${format(sunrise, "kk:mm'h'")}

export default Swara;

Swara.propTypes = {
  sunrise: PropTypes.instanceOf(Date),
  tithiDay: PropTypes.number,
  setSwaraText: PropTypes.func,
};
