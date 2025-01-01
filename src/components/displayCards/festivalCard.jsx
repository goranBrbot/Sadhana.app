import * as React from "react";
import { PropTypes } from "prop-types";
import Panchang from "../panchang";
import { format, isAfter, isSameDay, addYears } from "date-fns";
import {} from "astronomy-engine";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const festivals = [
  { name: "Makar Sankranti", description: "The Sun starts moving towards the north", date: makarSankranti() },
  { name: "Vasant Panchami", description: "Birthday of Goddess Sarasvati (wisdom)", date: "13.2.2024" },
  { name: "Maha Shivaratri", description: "Night of worship and meditation dedicated to Lord Shiva", date: "8.3.2024" },
  { name: "Holi", description: "Festival honoring devotee Prahlad (bhakti)", date: "24.3.2024" },
  { name: "Spring Navaratri", description: "9 days of fasting in honor of the Holy Mother", date: "9.4.2024-16.4.2024" },
  { name: "Rama Navami", description: "Birthday of Lord Rama", date: "16.4.2024" },
  { name: "Hanuman Jayanti", description: "Festival in honor of Sri Hanuman", date: "23.4.2024" },
  { name: "International Day of Yoga", description: "Proclaimed by the UN", date: "21.6.2024" },
  { name: "Mahasamadhi of Mataji (Swami Punyanand Bhartiji)", description: "(2.7.2011 according to the Western calendar)", date: "7.7.2024" },
  { name: "Guru Purnima", description: "Festival honoring the Guru, birthday of Maharishi Ved Vyas", date: "21.7.2024" },
  { name: "Sri Devpuriji's Mahasamadhi", description: "(14.8.1942 according to the Western calendar)", date: "6.8.2024" },
  { name: "Vishwaguruji's Birthday", description: "(15.8.1945 according to the Western calendar)", date: "7.8.2024" },
  { name: "Raksha Bandhan", description: "Festival of brothers and sisters", date: "19.8.2024" },
  { name: "Sri Krishna Jayanti (Janmashtami)", description: "Birthday of Lord Krishna", date: "26.8.2024" },
  { name: "Holy Guruji's Birthday", description: "(11.09.1923 according to the Western calendar)", date: "3.9.2024" },
  { name: "Ganesh Chaturthi", description: "Festival of Lord Ganesha", date: "6.9.2024" },
  { name: "Pitr Purnima", description: "Day of remembrance for ancestors", date: "17.9.2024" },
  { name: "UN International Day of Peace", description: "Prayer at JUSŽ Tree of Peace", date: "21.9.2024" },
  { name: "UN International Day of Non-Violence", description: "Birthday of Mahatma Gandhi, International Day of Non-Violence", date: "2.10.2024" },
  { name: "Autumn Navaratri", description: "9 days of fasting in honor of the Holy Mother", date: "3.10.2024-12.10.2024" },
  { name: "Vijaya Dashami (Dasera)", description: "Festival honoring Goddess Durga, day of victory of good over evil, 'Day of Enlightenment'", date: "12.10.2024" },
  { name: "Sharad Purnima", description: "", date: "16.10.2024" },
  { name: "Diwali (Dipavali)", description: "Festival of Lights, birthday of Bhagavan Sri Deep Narayan Mahaprabhuji", date: "31.10.2024" },
  { name: "Lakshmi Puja, New Year 2080", description: "Festival of Goddess Lakshmi (prosperity), Indian New Year", date: "31.10.2024" },
  { name: "Holy Guruji's Mahasamadhi", description: "(31.10.2003 according to the Western calendar)", date: "8.11.2024" },
  { name: "Sri Mahaprabhuji's Mahasamadhi", description: "(05.12.1963 according to the Western calendar)", date: "18.12.2024" },
];

//console.log(festivals.find((festival) => festival.name === "Makar Sankranti"));

/* function calculateAnniversary(eventDate, year) {
    function getTithiForDate(date) {
      const razlikaMoonSun = PairLongitude("Moon", "Sun", date); // Računanje razlike Mjesečeve i Sunčeve ekliptičke dužine
      const tithiPeriod = razlikaMoonSun / 12; // Svaki tithi je 12° razlike
      const calculatedTithiDay = Math.ceil(tithiPeriod); // Zaokružujemo na najbliži cijeli broj
      return calculatedTithiDay;
    }

    const eventTithi = getTithiForDate(eventDate);
    console.log(`Tithi on the event date: ${eventTithi}`);

    let date = new Date(year, 11, 1, 0, 0, 0); // Početak tražene godine
    console.log(`date: ${date}`);

    let found = false;
    let anniversaryDate;

    while (date.getFullYear() === year) {
      const tithi = getTithiForDate(date);
      if (tithi === eventTithi) {
        anniversaryDate = new Date(date); // Pronađen datum s istim tithijem
        found = true;
        break;
      }
      date.setDate(date.getDate() + 1); // Pomjeri datum za 1 dan unaprijed
    }

    return found ? anniversaryDate : null;
  }

  // Koristi funkciju za pronalaženje obljetnice
  const eventDate = new Date("1963-12-05");
  console.log(eventDate);

  const anniversary2024 = calculateAnniversary(eventDate, 2024);
  if (anniversary2024) {
    console.log(`Anniversary in 2024 falls on: ${anniversary2024}`);
  } else {
    console.log("No matching tithi found in 2024.");
  } */

function makarSankranti() {
  const dates = [
    new Date(2024, 0, 15),
    new Date(2025, 0, 14),
    new Date(2026, 0, 14),
    new Date(2027, 0, 15),
    new Date(2028, 0, 15),
    new Date(2029, 0, 14),
    new Date(2030, 0, 14),
    new Date(2031, 0, 15),
    new Date(2032, 0, 15),
    new Date(2033, 0, 14),
    new Date(2034, 0, 14),
    new Date(2035, 0, 15),
    new Date(2036, 0, 15),
    new Date(2037, 0, 14),
    new Date(2038, 0, 14),
    new Date(2039, 0, 15),
    new Date(2040, 0, 15),
    new Date(2041, 0, 14),
    new Date(2043, 0, 15),
    new Date(2044, 0, 15),
    new Date(2045, 0, 14),
    new Date(2046, 0, 15),
    new Date(2047, 0, 15),
    new Date(2048, 0, 15),
    new Date(2049, 0, 14),
    new Date(2050, 0, 15),
  ];

  const today = new Date();
  const nextEntry = dates.find((date) => isAfter(date, today) || isSameDay(date, today));

  if (nextEntry) {
    const formattedDate = format(nextEntry, "dd.MM.yyyy");
    return `Makar Sankranti is ${formattedDate}`;
  } else {
    return "Nema dostupnih datuma za Makar Sankranti.";
  }
}

export default function FestivalCard({ location }) {
  console.log(location);

  console.log(festivals[0].date);

  const panchangData = Panchang(new Date(), location);
  console.log(panchangData);

  function calculatePanchangAnniversary(originalDate) {
    const oldDate = originalDate;
    const newDate = addYears(originalDate, 56);
    const passedYears = Number(newDate - oldDate);
    console.log(passedYears);

    // Dobij izvorne vrijednosti Panchanga
    const originalPanchang = Panchang(originalDate, location);
    const originalTithi = originalPanchang.Tithi;
    const originalPaksha = originalPanchang.Paksha;
    const originalMasa = originalPanchang.Masa;
    const originalYear = originalPanchang.Samvat;
    console.log(originalTithi, originalPaksha, originalMasa, originalYear);

    // Početni datum za pretraživanje je godina nakon originalDate
    let anniversaryDate = new Date(originalDate);
    anniversaryDate.setFullYear(originalYear + 56);
    console.log(anniversaryDate);
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
          <small>FESTIVALS</small>
          <React.Fragment>
            <IconButton variant='text' size='small' style={{ marginLeft: "auto", marginRight: "5px" }} onClick={handleClickOpen}>
              <InfoSharpIcon variant='contained' fontSize='small' style={{ color: "rgba(253, 250, 237, 0.5)" }}></InfoSharpIcon>
            </IconButton>
            <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
              <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
                Festival information
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
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas esse inventore voluptates doloribus? Nobis nesciunt blanditiis, natus iure beatae eius ex illo! Dolores nemo
                  pariatur amet esse labore non dignissimos?.
                </Typography>
                <Typography gutterBottom>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus voluptatem tenetur temporibus animi soluta itaque doloribus, impedit esse illum reiciendis facilis expedita
                  voluptatum nemo exercitationem sunt quaerat, velit placeat ut.
                </Typography>
              </DialogContent>
            </BootstrapDialog>
          </React.Fragment>
        </div>
        <div className='container'>
          <span>{makarSankranti()}</span>
          <br />
          <span>{calculatePanchangAnniversary(new Date(1963, 11, 5))}</span>
          <br />
          <span>{}</span>
        </div>
      </div>
    </motion.div>
  );
}

FestivalCard.propTypes = {
  location: PropTypes.object,
};
