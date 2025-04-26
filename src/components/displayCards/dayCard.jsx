import { format } from "date-fns";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
// import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

export default function DayCard({ sunrise, sunset, location, locationName }) {
  const todayDayDate = format(new Date(), "EEEE dd.MM.yyyy");
  const todaySunriseTime = format(sunrise, "kk:mm'h'");
  const todaySunsetTime = format(sunset, "kk:mm'h'");

  // Formatiraj `location` za prikaz
  const formattedLocation = location && location.latitude && location.longitude ? `Lat ${location.latitude} Lon ${location.longitude} Alt ${location.height}m` : "Location not available";

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
      <div className='card dayCard'>
        <React.Fragment>
          <img className='iconSun' src='icons/sun.png' alt='Sun' onClick={handleClickOpen} />
          <BootstrapDialog fullScreen onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
              About app
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
                The application works based on the allowed access to the user location. By granting access to the user location, current data on the <strong>geographic latitude and longitude</strong>{" "}
                of that location is obtained. Taking into account the obtained location, the current <strong>sunrise</strong> and sunset visible from that location are calculated.
              </Typography>
              <Typography gutterBottom>
                After calculating the sunrise by subtracting 96 minutes from the sunrise we calculate the <strong>Brahmamuhurta</strong> time lasting 48 minutes.
              </Typography>
              <Typography gutterBottom>
                Then we calculate the <strong>Tithi</strong> (lunar day and bright <strong>Shukla Pakṣa</strong> - dark <strong>Kṛṣṇa Pakṣa</strong> fortnight) which is approximately 1/30th of the
                time it takes the Moon to go around the Earth, i.e. the period in which the difference between the longitudes of the Moon and the Sun is exactly 12°. A Tithi can start at different
                times of the day and can also vary in duration from approximately 19 to 26 hours so a particular day is governed by the Tithi prevailing on that day at the time of sunrise, but it can
                change at any time of the day or night as it is not based on a solar day, but on the position of the Moon in relation to the Sun.
              </Typography>
              <Typography gutterBottom>The above calculations are the basis for further calculations of other application possibilities.</Typography>
              <Typography gutterBottom>We calculate the active swara (dominant nostril) with which the current lunar day begins at sunrise based on verses 63-64 of Shiv Swarodaya shastra.</Typography>
              <Typography gutterBottom>
                <strong>
                  &quot;During the first three days of “Shukla Pakṣa (the bright fortnight), the Ida flows and then alternates. (1st,2nd,3rd-IDA, 4th,5th,6th Pingla, thus they keep alternating).
                  While, conversely, during the first three days of “Krishna Pakṣa” (the dark fortnight), the Pingala flows first. (1st,2nd,3rd PINGLA, 4th 5th,6th IDA thus they alternate).&quot;
                </strong>
              </Typography>
              <Typography gutterBottom>
                <strong>
                  &quot;In the bright fortnight, the lunar swara (Ida) rises from the time of sunrise and continues till the time span of two & a half Ghadis (60 minutes). In the dark fortnight, the
                  solar Swara (Pingala) rises first. So, these swaras flow alternately for a period of two-and-a half ghadis (60 minutes) throughout the twenty four hours of a day.&quot;
                </strong>
              </Typography>
              <Typography gutterBottom>Here are three main lunar phases for fasting.</Typography>
              <Typography gutterBottom>
                <strong>Amāvásyā</strong> is the lunar phase of the new moon and <strong>Pūrṇimā</strong> is the lunar phase of the full moon.
              </Typography>
              <Typography gutterBottom>
                While on the eleventh day of each lunar cycle, the Moon forms a trine with the Earth and the Sun during which the distance between the Moon and the Sun is in the range of 120-132
                degrees on <strong>Shukla Pakṣa Ekadashi</strong> and in the range of 300-312 degrees on <strong>Kṛṣṇa Pakṣa Ekadashi</strong>. Therefore, Ēkādaśī is the eleventh lunar day (tithi) in
                the waxing (Shukla Pakṣa) and waning (Kṛṣṇa Pakṣa) lunar cycle.
              </Typography>
            </DialogContent>
          </BootstrapDialog>
        </React.Fragment>

        <div className='topBar'>
          <h3>Basic information</h3>
          <small>BY YOUR LOCATION</small>
        </div>
        <div className='container'>
          <span>{todayDayDate}</span>
          <br />
          <span>
            Sunrise: {todaySunriseTime} - Sunset: {todaySunsetTime}
          </span>
          <br />
          <span>{locationName}</span>
          <br />
          <span>{formattedLocation}</span>
        </div>
      </div>
    </motion.div>
  );
}

DayCard.propTypes = {
  sunrise: PropTypes.instanceOf(Date),
  sunset: PropTypes.instanceOf(Date),
  location: PropTypes.object,
  locationName: PropTypes.string,
};
