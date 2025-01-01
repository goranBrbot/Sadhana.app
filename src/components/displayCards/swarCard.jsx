import * as React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

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
      redoslijed = ["IDA", "PINGALA"];
    } else if (filteredPingala) {
      redoslijed = ["PINGALA", "IDA"];
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

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: 1 }} // Animation to apply (fade in)
      transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
    >
      <div className='card'>
        <div className='topBar'>
          <small>SWAR TIME</small>
          <React.Fragment>
            <IconButton variant='text' size='small' style={{ marginLeft: "auto", marginRight: "5px" }} onClick={handleClickOpen}>
              <InfoSharpIcon variant='contained' fontSize='small' style={{ color: "rgba(253, 250, 237, 0.5)" }}></InfoSharpIcon>
            </IconButton>
            <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
              <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
                Swara information
              </DialogTitle>
              <IconButton
                aria-label='close'
                onClick={handleClose}
                sx={(theme) => ({
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: theme.palette.grey[500],
                })}>
                <CloseIcon />
              </IconButton>
              <DialogContent dividers>
                <Typography gutterBottom>
                  We calculate the active swara (dominant nostril) with which the current lunar day begins at sunrise based on verses 63-64 of Shiv Swarodaya shastra.
                </Typography>
                <Typography gutterBottom>
                  <strong>
                    &quot;During the first three days of “Shuklapaksha” (the bright fortnight), the Ida flows and then alternates. (1st,2nd,3rd-IDA, 4th,5th,6th Pingla, thus they keep alternating).
                    While, conversely, during the first three days of “Krishnapaksha” (the dark fortnight), the Pingala flows first. (1st,2nd,3rd PINGLA, 4th 5th,6th IDA thus they alternate).&quot;
                  </strong>
                </Typography>
                <Typography gutterBottom>
                  <strong>
                    &quot;In the bright fortnight, the lunar swara (Ida) rises from the time of sunrise and continues till the time span of two & a half Ghadis (60 minutes). In the dark fortnight, the
                    solar Swara (Pingala) rises first. So, these swaras flow alternately for a period of two-and-a half ghadis (60 minutes) throughout the twenty four hours of a day.&quot;
                  </strong>
                </Typography>
              </DialogContent>
            </BootstrapDialog>
          </React.Fragment>
        </div>
        <div className='container'>
          <ul>
            {idaVremena.map((item, index) => (
              <li key={index}>{`"${item.sequence}" swara at ${item.start} - ${item.end}`}</li>
            ))}
          </ul>
          <ul>
            {pingalaVremena.map((item, index) => (
              <li key={index}>{`"${item.sequence}" swara at ${item.start} - ${item.end}`}</li>
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
