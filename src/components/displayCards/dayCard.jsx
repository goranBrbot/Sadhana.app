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
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function DayCard({ sunrise, sunset, location, locationName, installPromptEvent, setInstallPromptEvent }) {
  const handleInstallClick = () => {
    if (!installPromptEvent) return;

    installPromptEvent.prompt();

    installPromptEvent.userChoice.then((result) => {
      if (result.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setInstallPromptEvent(null); // Resetiraj nakon akcije
    });
  };

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
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
      <div className='card dayCard'>
        <React.Fragment>
          <img className='iconSun' src='icons/sun.png' alt='Sun' onClick={handleClickOpen} />
          <BootstrapDialog fullScreen onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
              About Sadhana app
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
                <p>By the grace of Lord Surya, this knowledge is illumined!</p>
                <p>
                  Governed by the rhythms of kāla (time), deśa (space), and svabhāva (innate nature). Rooted in śāstra, it serves as a guide for daily Vedic insight and sāttvika discipline. It
                  provides clarity for right action (karma), at the right time (muhūrta), and with the right attitude (bhāva).
                </p>
                <h3>Five Cards of Daily Insight</h3>
                <br />
                <p>
                  The application presents five integrated components of daily Vedic insight. Basic Information displays the foundational elements of the day, solar and lunar date, precise sunrise and
                  sunset, and the user’s current location, serving as the base for all further calculations. Choghadiya Muhurta divides the day and night into time segments marked as auspicious or
                  inauspicious, based on traditional hora reckoning, to assist in selecting favorable moments (śubha muhūrta) for action. Swara Yoga determines the active swara (breath current) at
                  sunrise, following the teachings of Śiva in the Śiva Svarodaya, indicating whether the day favors action, rest, or spiritual discipline. Vrat and Upvāsa lists significant observances
                  such as vows and fasts, aligned with lunar tithi and planetary influences, practiced for purification and devotion. Finally, the Pañcāṅga and Festival Calendar offers the five limbs
                  of Vedic timekeeping - Tithi, Vāra, Nakṣatra, Yoga, and Karaṇa along with notable festivals, calculated according to the Purnimanta lunar tradition.
                </p>
              </Typography>
              <Box
                sx={{
                  marginTop: "50px",
                  overflowY: "auto",
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE 10+
                  "&::-webkit-scrollbar": {
                    display: "none", // Chrome, Safari, Edge
                  },
                }}>
                <Accordion
                  sx={{
                    boxShadow: "none",
                    backgroundColor: "#f5f5f5",
                  }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
                    <Typography>
                      <strong>Basic information</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography gutterBottom>
                      The application works based on the allowed access to the user location. By granting access to the user location, current data on the{" "}
                      <strong>geographic latitude and longitude</strong> of that location is obtained. Taking into account the obtained location, the current <strong>sunrise</strong> and sunset
                      visible from that location are calculated.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{
                    boxShadow: "none",
                    backgroundColor: "#f5f5f5",
                  }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel2-content' id='panel2-header'>
                    <Typography>
                      <strong>Choghadiya Muhurta</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <p>
                        In Vedic tradition, time is not just a flow it is a conscious force. Each part of the day carries a specific vibration based on the ruling planet. The system of Choghadiya,
                        which divides day and night into eight parts each, helps us align our actions with supportive energies. While some Choghadiyas are favorable for all types of sadhana, others
                        may carry restlessness or heaviness. Understanding their quality can help yogis deepen their connection, minimize obstacles, and tune in with cosmic rhythms.
                      </p>
                      <hr />
                      <br />
                      <span>Auspicious Choghadiyas</span>
                      <br />
                      <p>
                        <p>These time periods are supportive for meditation, mantra, puja, study of shastra, and devotional activities.</p>
                        <p>
                          <strong>Amrit Choghadiya (Ruled by Moon)</strong>
                          <br /> This time carries a gentle, nourishing, and sattvic vibration. Ideal for all kinds of inner work. Best for: meditation, bhakti yoga, mantra chanting (japa) and night
                          prayers.
                        </p>
                        <p>
                          <strong>Shubh Choghadiya (Ruled by Jupiter)</strong>
                          <br /> Time under Jupiter is infused with wisdom, expansion, and divine grace. It supports learning, deeper understanding, and spiritual initiation. Best for: Scriptural
                          study (svadhyaya), satsanga, teaching/learning sessions, yajnas, and sankalpa-based practices.
                        </p>
                        <p>
                          <strong>Labh Choghadiya (Ruled by Mercury)</strong>
                          <br /> Mercury brings clarity, alertness, and balance. It’s excellent for practices that involve mental discipline and verbal clarity, such as chanting and breathwork. Best
                          for: Pranayama, Sanskrit recitation, vedic chanting, intention setting, and sattvic communication.
                        </p>
                        <p>
                          <strong>Char Choghadiya (Ruled by Venus)</strong>
                          <br /> Venus offers softness, flow, and a devotional tone. This time supports emotional healing, harmony in sangha (spiritual community), and moving forms of sadhana. Best
                          for: Bhajans, kirtan, pilgrimage, and walking meditations.
                        </p>
                        <hr />
                        <br />
                        <span>Inauspicious Choghadiyas</span>
                        <br />
                        <p>
                          These periods are not ideal for deep spiritual absorption or starting new sadhanas, but they have their specific utility for certain types of tapas (austerity) or karma yoga.
                        </p>
                        <p>
                          <strong>Udveg Choghadiya (Ruled by Sun)</strong>
                          <br />
                          Carries intensity and restlessness. Not suited for inner stillness but can energize action when directed consciously. Best used for: Seva (selfless service), leadership roles
                          in sangha, or confronting ego through disciplined practice.
                        </p>
                        <p>
                          <strong>Kaal Choghadiya (Ruled by Saturn)</strong>
                          <br />
                          Heavy and slow. Can bring mental dullness or obstacles in meditation. However, it is excellent for discipline, solitude, and shadow work. Best used for: Long fasting,
                          vow-keeping, self-reflection, difficult tapasya, and renunciation practices.
                        </p>

                        <p>
                          <strong>Rog Choghadiya (Ruled by Mars)</strong>
                          <br />
                          Agitated and sharp in nature. Best avoided for peaceful sadhana, but it can be harnessed for breaking inner resistance or confronting inertia. Best used for: Dynamic yoga
                          (e.g. Surya Namaskar with intention), physical cleansing, and mental strength-building.
                        </p>
                        <hr />
                        <br />
                        <span>How to Use Choghadiya</span>
                        <br />
                        <p>
                          Begin your morning sadhana during Amrit or Shubh, if possible. Use Labh or Char periods for movement-based practices, pilgrimage, or service. Reserve Kaal, Udveg, and Rog for
                          challenging tasks, karma yoga, or spiritual austerity—not introspective or heart-based practices. Align Guru puja, mantra diksha, or deeper meditation retreats with
                          Jupiter-ruled (Shubh) periods. Spiritual progress is not just about effort—it’s about timing and alignment with cosmic forces. Choghadiya offers a practical tool to enhance
                          the fruits of your sadhana.
                        </p>
                      </p>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{
                    boxShadow: "none",
                    backgroundColor: "#f5f5f5",
                  }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel3-content' id='panel3-header'>
                    <Typography>
                      <strong>Swara Yoga</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <p>
                        Swara Yoga is a sacred yogic science that reveals how the flow of breath through the left and right nostrils—known as Ida and Pingala Nadis—aligns us with specific energies of
                        time, action, and consciousness. Rooted in texts like the Shiva Swarodaya, this wisdom helps spiritual aspirants know when to act, rest, meditate, or pray, simply by observing
                        their breath. It is not a breathing technique, but a timing tool, helping one to synchronize their sadhana and life with cosmic rhythms.
                      </p>
                      <p>
                        <strong>The Three Types of Swara</strong>
                        <br />
                        Ida Swara – Left Nostril Dominant <br />
                        Associated with the Moon, feminine energy, coolness, introversion, and mental clarity. Best for: Meditation and japa, Scriptural study (svadhyaya), Prayer and puja, Healing,
                        rest, and emotional balance. When Ida is flowing, the mind is inward and the heart is open. Ideal for calm, receptive practices. <br />
                        Pingala Swara – Right Nostril Dominant <br />
                        Associated with the Sun, masculine energy, heat, drive, and outward focus. Best for: Dynamic yoga asana and kriya, Pranayama and cleansing practices, Active seva (service),
                        Leadership, decision-making. When Pingala flows, energy is outward and upward. Ideal for action, discipline, and transformation. <br />
                        Sushumna Swara – Both Nostrils Flowing Equally <br />
                        Connected to the central channel (Sushumna Nadi). Rare and subtle, this state arises during the transition between Ida and Pingala. Best for: Deep meditation, Sitting in
                        silence (mouna), Guru connection and inner initiation. When Sushumna flows, the mind dissolves. No action, just stillness and witnessing.
                      </p>
                      <p>
                        <strong>Breathing with Awareness</strong>
                        <br />
                        The dominant nostril switches every 60–90 minutes under natural conditions. A conscious yogi observes this rhythm and chooses when to perform which sadhana accordingly. Swara
                        Yoga teaches that every breath is a message, every flow a signal. Rather than rushing blindly into sadhana, the Swara Yogi aligns first with Time (Kala), Energy (Shakti), and
                        Space (Desha). When you act during the right Swara, effort becomes grace. Practice becomes presence. Life becomes yoga.
                      </p>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{
                    boxShadow: "none",
                    backgroundColor: "#f5f5f5",
                  }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel4-content' id='panel4-header'>
                    <Typography>
                      <strong>Vrat & Upvas</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography gutterBottom>
                      <p>
                        <p>
                          In yogic and Vedic traditions, Vrat (vow/observance) and Upavās (fasting/abstinence) are powerful tools for inner purification, willpower, and alignment with the Divine. Far
                          beyond dietary restraint, these practices are acts of conscious withdrawal, intentional renunciation, and sacred discipline that elevate the practitioner toward higher states
                          of awareness.
                        </p>
                        <p>
                          Vrat is a vow undertaken with devotion and spiritual intention. It often includes abstaining from specific actions, foods, or behaviors, observing silence or solitude,
                          committing to a regular practice such as japa, puja, or selfless service for a defined period, and honoring particular deities or cosmic principles on auspicious days. The
                          purpose of Vrat is to strengthen ones sankalpa (spiritual resolve), align life with higher dharma, cleanse deep-seated subconscious tendencies, and redirect energy toward
                          sadhana and self-transcendence. A Vrat is not a restriction or hardship—it is a sacred promise that disciplines the body, purifies the mind, and empowers the soul to walk the
                          path of inner awakening.
                        </p>
                        <p>
                          Upavās literally means &quot to stay near &quot not near food, but near the Divine. Traditionally observed on spiritually potent tithis (lunar days) such as Ekadashi,
                          Purnima, Amavasya, or on days connected to specific deities like Shivratri, fasting in the yogic sense is far more than physical restraint—it is a psychic reset and a gesture
                          of inner alignment. There are various forms of Upavās, including nirjala (total fasting without food or water), phalahar (consuming only fruits, water, or herbal teas),
                          ekabhuktam (a single sattvic meal during the day), and even mindful fasting, where one abstains from toxic thoughts, negative speech, or digital distractions. These practices
                          are most effective when accompanied by mantra japa, silent meditation, scriptural reflection, and acts of loving devotion or selfless service. Far from being an austerity of
                          deprivation, Upavās is a spiritual accelerator—it cultivates subtlety, awakens inner fire, and brings one closer to grace.
                        </p>
                      </p>
                      <strong>Practical Guidance</strong>
                      <p>
                        <p>
                          For a yogic practitioner, aligning Vrat and Upavās with the rhythm of sadhana can amplify inner growth and deepen spiritual connection. Different days of the week and lunar
                          phases hold distinct energies that can be harnessed through conscious observances. For instance, Monday (Somvar) is ideal for taking a Vrat that promotes peace of mind and
                          devotion, often paired with fasting in honor of Lord Shiva. Thursday (Guruvar) supports vows for the cultivation of wisdom, with fasting done to invoke the grace of Jupiter
                          and one’s spiritual teacher (guru kripa). The Ekadashi, or 11th lunar day, is widely regarded for fasting dedicated to Lord Vishnu, offering deep purification of the mind and
                          senses. Purnima (Full Moon) and Amavasya (New Moon) are potent days for inner silence, meditation, and self-reflective Vrats. On Chaturthi, especially Sankashti Chaturthi,
                          fasting is observed to remove inner obstacles and foster clarity, often in devotion to Lord Ganesha.
                        </p>
                        <p>
                          The disciplined use of vows and fasting acts as a transformative catalyst on all levels of being. On the physical level, they help remove toxins and lighten the bodily
                          system, creating space for vitality. Mentally, they bring stillness, reduce cravings, and calm the fluctuations of thought. Emotionally, these practices loosen attachments
                          and dissolve identity-based clinging, allowing the heart to soften and expand. Energetically, Vrat and Upavās sharpen perception, boost ojas (vital essence), and increase
                          subtle awareness. And most importantly, on a spiritual level, they elevate sattva (purity), accelerate sadhana, and open inner space for grace, insight, and presence.
                        </p>
                        <p>
                          Vrat and Upavās are not punishments, they are offerings of love, acts of devotion to the Highest Self. Whether skipping a meal or observing inner silence, these practices
                          burn impurities and allow pure presence to shine. One who fasts with awareness does not just renounce food, but feeds the soul with divine remembrance.
                        </p>
                      </p>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{
                    boxShadow: "none",
                    backgroundColor: "#f5f5f5",
                  }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel5-content' id='panel5-header'>
                    <Typography>
                      <strong>Panchang & Calendar</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography gutterBottom>
                      <p>
                        The Panchang—literally meaning “five limbs”—is a traditional Vedic timekeeping system that captures the subtle fluctuations of cosmic energy. For a spiritual practitioner, it
                        functions not merely as a calendar, but as a vibrational map that reveals when certain types of sadhana (spiritual practices) are most supported by the natural rhythms of time.
                        By tuning into these five elements—Tithi, Vara, Nakshatra, Yoga, and Karana—the yogi aligns not only with celestial cycles but with the inner unfolding of consciousness.
                      </p>
                      <p>
                        Tithi represents the phase of the Moon, governing emotional and psychic energy. There are 30 Tithis in a lunar month, each with a distinct rasa (flavor) and influence on the
                        subtle body. The Moon governs the mind. Working with Tithis refines emotional intelligence, mental clarity, and energetic sensitivity in practice.
                      </p>
                      <p>
                        Each weekday (Vara) is ruled by a planetary deity, influencing the tone and focus of sadhana. Monday (Soma) – Moon day; best for bhakti, japa, and emotional healing. Tuesday
                        (Mangala) – Mars’ day; good for tapasya, disciplined asana, or vigorous kriyas. Wednesday (Budha) – Mercury day; ideal for scriptural study, journaling, and clear
                        communication. Thursday (Guru) – Jupiter’s day; auspicious for learning, wisdom, and gratitude toward teachers. Friday (Shukra) – Venus day; supports devotional arts, beauty in
                        practice, and refinement. Saturday (Shani) – Saturn’s day; good for seclusion, inner discipline, and karma yoga. Sunday (Ravi) – Sun day; enhances surya kriyas, sankalpa, and
                        personal strength. Working with Vara brings rhythmic structure to the week, turning each day into a unique opportunity for growth.
                      </p>
                      <p>
                        There are 27 Nakshatras—subtle constellations along the Moon path—each offering a unique energetic blueprint that shapes the mood of the day. The Nakshatra acts like a psychic
                        weather pattern. Observing it refines ones ability to sense when to be active, reflective, expressive, or withdrawn.
                      </p>
                      <p>
                        Yoga in Panchang is not the same as yoga as a practice—it is the angular relationship between the Sun and Moon that creates one of 27 Yogas, each affecting the flow of prana
                        and mental clarity. Yoga indicates how pranic forces interact during the day—helpful for choosing the balance between effort and surrender in practice. Karanas are subtle
                        subdivisions of each Tithi (two per Tithi), reflecting actional tendencies and practical momentum. There are 11 types of Karanas—four are fixed (like Shakuni, Chatushpada) and
                        seven are rotating. Karana governs karma in action—by attuning to it, the yogi times their activities with natural flow rather than friction.
                      </p>
                      <p>
                        Used with awareness, the Panchang becomes a living sadhana journal—a way to feel supported by the universe rather than moving against it. It doesn’t dictate what to do, but
                        illuminates when the soul is most open to specific transformations. Just as asana aligns the body, and mantra aligns the mind, Panchang aligns time so that each breath,
                        practice, and moment is nested in the deeper rhythm of the cosmos.
                      </p>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "50px", paddingRight: "30px" }}>
                <Button
                  type='button'
                  onClick={handleInstallClick}
                  variant='contained'
                  color='primary'
                  sx={{ borderRadius: "20px" }} // Zaobljenje
                >
                  Install App
                </Button>
              </div>
            </DialogContent>
          </BootstrapDialog>
        </React.Fragment>

        <div className='topBar'>
          <h3>Basic information</h3>
          <small>BY YOUR LOCATION</small>
        </div>
        <div className='container dayContainer'>
          {/* <div className='bird'></div> */}
          <span>{todayDayDate}</span>
          <br />
          <span>
            Sunrise {todaySunriseTime} - Sunset: {todaySunsetTime}
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
  installPromptEvent: PropTypes.object,
  setInstallPromptEvent: PropTypes.func.isRequired,
};
