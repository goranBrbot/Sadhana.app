import * as React from "react";
import { format, addMinutes } from "date-fns";
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

export default function DayCard({ sunrise, sunset, tithiDay }) {
  console.log(sunrise);
  console.log(sunset);
  console.log(tithiDay);

  const todayDayDate = format(new Date(), "EEEE dd.MM.yyyy");
  const todaySunriseTime = format(sunrise, "kk:mm'h'");
  console.log(todaySunriseTime);

  const todaySunsetTime = format(sunset, "kk:mm'h'");
  const brahmamuhurtaStart = format(addMinutes(sunrise, -96), "kk:mm'h'"); // 1 sat i 36 minuta manje
  const brahmamuhurtaEnd = format(addMinutes(sunrise, -48), "kk:mm'h'"); // 48 minuta manje

  function tithiCalc(day) {
    if (day <= 15) {
      return day;
    } else if (day > 15) {
      return day - 15;
    }
  }

  const brightDarkTithi = tithiCalc(tithiDay);
  const brightDarkTithiHtml = tithiDay <= 15 ? `${tithiDay} Tithi - ${brightDarkTithi} day of "Shukla Pakṣa"` : `${tithiDay} Tithi - ${brightDarkTithi} day of "Kṛṣṇa Navamī"`;

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
          <small>DAY TIME</small>
          <React.Fragment>
            <IconButton variant='text' size='small' style={{ marginLeft: "auto", marginRight: "5px" }} onClick={handleClickOpen}>
              <InfoSharpIcon variant='contained' fontSize='small' style={{ color: "rgba(253, 250, 237, 0.5)" }}></InfoSharpIcon>
            </IconButton>
            <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
              <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
                Basic information
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
                  The application works on the basis of permitted access to the user location and the exact time of sunrise at that location. Based on the above, it calculates Brahmamuhurta, Tithi
                  (lunar day and bright/dark fortnight), Amavasya, Purnima, Ekadashi and the active swara of the current lunar day.
                </Typography>
                <Typography gutterBottom>
                  Tithi is a lunar day which is approximately 1/30th of the time it takes the Moon to orbit the Earth. Thus Tithi is a period in which the difference between the longitudes of Moon and
                  Sun is exactly 12°. Tithi may begin at varying times of the day and may also vary in duration from approximately 19 to 26 hours.
                </Typography>
                <Typography gutterBottom>
                  A particular day is ruled by the Tithi prevailed on that day at sunrise time, but the Tithi can change anytime of the day or night as it is not based on the solar day but on the
                  situation of the Moon in relation to the Sun.
                </Typography>
              </DialogContent>
            </BootstrapDialog>
          </React.Fragment>
        </div>
        <div className='container'>
          <span>{todayDayDate}</span>
          <br />
          <span>{brightDarkTithiHtml}</span>
          <br />
          <span>
            Sunrise: {todaySunriseTime} / Sunset: {todaySunsetTime}
          </span>
          <br />
          <span>
            Brahma-muhūrta: {brahmamuhurtaStart} - {brahmamuhurtaEnd}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

DayCard.propTypes = {
  sunrise: PropTypes.instanceOf(Date),
  sunset: PropTypes.instanceOf(Date),
  tithiDay: PropTypes.number,
};
