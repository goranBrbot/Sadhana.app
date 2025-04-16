import { useState, useEffect } from "react";
import { format } from "date-fns";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

const Swara = ({ sunrise, tithiDay, setSwaraText }) => {
  const idaDays = [1, 2, 3, 7, 8, 9, 13, 14, 15, 19, 20, 21, 25, 26, 27];
  const pingalaDays = [4, 5, 6, 10, 11, 12, 16, 17, 18, 22, 23, 24, 28, 29, 30];

  const [idaVremena, setIdaVremena] = useState([]);
  const [pingalaVremena, setPingalaVremena] = useState([]);

  const swarVrijeme = (dan, lista, startVrijeme, trajanjeMinuta, brojElemenata) => {
    const rezultat = [];
    let trenutnoVrijeme = new Date(startVrijeme);

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
        start: format(trenutnoVrijeme, "kk:mm'h'"),
        end: format(endTime, "kk:mm'h'"),
      });
      trenutnoVrijeme = endTime;
    }

    lista.push(...rezultat);
  };

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

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div className='card swarCard'>
        <div className='topBar'>
          <h3>Active nostril</h3>
          <small>SWARA YOGA</small>
        </div>
        <div className='container'>
          {/* <img className='iconSwar' src='icons/wind.png' alt='Breathing' /> */}
          <ul>
            {idaVremena.map((item, index) => (
              <li key={index}>{`${item.sequence} at ${item.start} - ${item.end}`}</li>
            ))}
          </ul>
          <ul>
            {pingalaVremena.map((item, index) => (
              <li key={index}>{`${item.sequence} at ${item.start} - ${item.end}`}</li>
            ))}
          </ul>
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
