import * as React from "react";
import { format } from "date-fns";
import { SearchMoonPhase } from "astronomy-engine";
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

export default function FastingCard({ tithiDay }) {
  function amavasya() {
    const today = format(new Date(), "dd.MM.yyyy");
    const newMoon = SearchMoonPhase(0, new Date(), 31);
    const amavasya = format(newMoon.date, "dd.MM.yyyy");
    if (amavasya == today) {
      return `Amavasya is today at ${format(newMoon.date, "kk:mm")}h`;
    } else return `Amavasya ${format(newMoon.date, "dd.MM.yyyy kk:mm")}h`;
  }

  function purnima() {
    const today = format(new Date(), "dd.MM.yyyy");
    const fullMoon = SearchMoonPhase(180, new Date(), 31);
    const purnima = format(fullMoon.date, "dd.MM.yyyy");
    if (purnima == today) {
      return `Purnima is today at ${format(fullMoon.date, "kk:mm")}h`;
    } else return `"Purnima" ${format(fullMoon.date, "dd.MM.yyyy kk:mm")}h`;
  }

  function ekadashi() {
    const today = new Date();
    const spEkadashiStart = SearchMoonPhase(120, today, 30);
    const spEkadashiEnd = SearchMoonPhase(132, today, 30);
    const kpEkadashiStart = SearchMoonPhase(300, today, 30);
    const kpEkadashiEnd = SearchMoonPhase(312, today, 30);

    const spDate = `${format(spEkadashiStart.date, "dd.MM.yyyy kk:mm")}h - ${format(spEkadashiEnd.date, "dd.MM.yyyy kk:mm")}h`;
    const kpDate = `${format(kpEkadashiStart.date, "dd.MM.yyyy kk:mm")}h - ${format(kpEkadashiEnd.date, "dd.MM.yyyy kk:mm")}h`;

    console.log(tithiDay);

    if (tithiDay < 15 && tithiDay != 11 && spEkadashiStart != null && spEkadashiEnd != null) {
      return (
        <div>
          Ekadashi of Shukla Pakṣa
          <br />
          {spDate}
        </div>
      );
    }

    if (tithiDay >= 15 && tithiDay != 26 && kpEkadashiStart != null && kpEkadashiEnd != null) {
      return (
        <div>
          Ekadashi of Kṛṣṇa Navamī
          <br />
          {kpDate}
        </div>
      );
    }

    if (tithiDay == 11 || tithiDay == 26) {
      return <div>Ekadashi is today!</div>;
    }

    /*     if (tithiDay === 11) {
      return (
        <div>
          Ekadashi is today!
          <br />
          {spDate}
        </div>
      );
    }

    if (tithiDay === 26) {
      return (
        <div>
          Ekadashi is today!
          <br />
          {kpDate}
        </div>
      );
    } */
  }

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
          <small>FASTING TIME</small>
          <React.Fragment>
            <IconButton variant='text' size='small' style={{ marginLeft: "auto", marginRight: "5px" }} onClick={handleClickOpen}>
              <InfoSharpIcon variant='contained' fontSize='small' style={{ color: "rgba(253, 250, 237, 0.5)" }}></InfoSharpIcon>
            </IconButton>
            <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
              <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
                Fasting information
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
                <Typography gutterBottom>Here are three main lunar phases for fasting.</Typography>
                <Typography gutterBottom>
                  <strong>Amāvásyā</strong> is the lunar phase of the new moon and <strong>Pūrṇimā</strong> is the lunar phase of the full moon.
                </Typography>
                <Typography gutterBottom>
                  While on the eleventh day of each lunar cycle, the Moon forms a trine with the Earth and the Sun during which the distance between the Moon and the Sun is in the range of 120-132
                  degrees on <strong>Shukla Pakṣa Ekadashi</strong> and in the range of 300-312 degrees on <strong>Kṛṣṇa Pakṣa Ekadashi</strong>. Therefore, Ēkādaśī is the eleventh lunar day (tithi)
                  in the waxing (Shukla Pakṣa) and waning (Kṛṣṇa Pakṣa) lunar cycle.
                </Typography>
              </DialogContent>
            </BootstrapDialog>
          </React.Fragment>
        </div>
        <div className='container'>
          <span>{amavasya()}</span>
          <br />
          <span>{purnima()}</span>
          <br />
          <br />
          <span>{ekadashi()}</span>
        </div>
      </div>
    </motion.div>
  );
}

FastingCard.propTypes = {
  tithiDay: PropTypes.number,
};
