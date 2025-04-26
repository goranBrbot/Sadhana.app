import { useState, useEffect } from "react";
import { Observer } from "astronomy-engine";
import { PropTypes } from "prop-types";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function LoadingCircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant='determinate'
        sx={(theme) => ({
          color: theme.palette.grey[200],
          ...theme.applyStyles("dark", {
            color: theme.palette.grey[800],
          }),
        })}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant='indeterminate'
        disableShrink
        sx={(theme) => ({
          color: "#a8d3f5",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
          ...theme.applyStyles("dark", {
            color: "#a8d3f5",
          }),
        })}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

export default function GeoFindMe({ setLocation }) {
  const [loading, setLoading] = useState(true); // kako bi se istovremeno rendali lat, long i async dohvat mjesta
  const [locationFailed, setLocationFailed] = useState(false);

  async function fetchAltitude(latitude, longitude, gpsAltitude) {
    // Ako GPS ne vraća visinu, koristi Open-Meteo API
    if (gpsAltitude !== null) {
      return Math.round(gpsAltitude);
    }
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();
      const result = Array.isArray(data.elevation) && data.elevation.length > 0 ? data.elevation[0] : 0;
      return Math.round(result); // geoid mean sea level by "Copernicus DEM GLO-90"
    } catch (error) {
      console.error("Error fetching elevation:", error);
      return 0;
    }
  }

  async function getCityFromCoords(latitude, longitude) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();
      const tourism = data.address.tourism || "";
      const road = data.address.road || "";
      const house_number = data.address.house_number || "";
      const hamlet = data.address.hamlet || "";
      const village = data.address.village || "";
      const town = data.address.town || "";
      const city = data.address.city || "";
      return `${tourism} ${road ? road : hamlet} ${house_number} ${village}, ${town ? town : city}`;
    } catch (error) {
      console.error("Error fetching city:", error);
      return "City not found";
    }
  }

  async function success(position) {
    try {
      let newLocation = null;
      if (position) {
        // Ako geolokacija uspije
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const altitude = await fetchAltitude(latitude, longitude, position.coords.altitude);
        const pulledCity = await getCityFromCoords(latitude, longitude);

        newLocation = { pozicija: new Observer(latitude, longitude, altitude), adresa: pulledCity };
        localStorage.setItem("locationState", JSON.stringify(newLocation));
        console.log("Saved to localStorage:", JSON.parse(localStorage.getItem("locationState")));
      } else {
        // Ako geolokacija ne uspije, koristi fallback iz localStorage
        const savedState = localStorage.getItem("locationState");
        console.log("Retrieved from localStorage:", savedState);
        if (savedState) {
          const locationState = JSON.parse(savedState);
          console.log("Parsed locationState:", locationState);
          if (locationState) {
            const { latitude, longitude, height } = locationState.pozicija;
            if (typeof latitude === "number" && typeof longitude === "number" && typeof height === "number") {
              newLocation = { pozicija: new Observer(latitude, longitude, height), adresa: `Using previously saved location!` };
            }
          }
        }
      }
      if (newLocation) {
        setLocation(newLocation);
      } else {
        setLocationFailed(true);
      }
    } catch (error) {
      setLocationFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function error() {
    console.warn("Geolocation failed, falling back to localStorage.");
    success(null); // Poziva success s null kako bi se fallback logika obradila
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='location'>
      {loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}>
          <LoadingCircularProgress />
          <small style={{ marginTop: "24px" }}>Preparing data for your location ..</small>
        </Box>
      )}
      {!loading && locationFailed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}>
          <img className='iconMap' src='icons/map-pin.png' alt='Pin' />
          <small>
            Location access is required!
            <br />
            Please enable GPS/location services.
          </small>
        </Box>
      )}
    </div>
  );
}

GeoFindMe.propTypes = {
  setLocation: PropTypes.func,
};
