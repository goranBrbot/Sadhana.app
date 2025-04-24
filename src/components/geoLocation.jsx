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
  const [coords, setCoords] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true); // kako bi se istovremeno rendali lat, long i async dohvat mjesta

  async function fetchAltitude(latitude, longitude, gpsAltitude) {
    // Ako GPS ne vraća visinu, koristi Open-Meteo API
    if (gpsAltitude !== null) {
      return gpsAltitude;
    }
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();
      const result = Array.isArray(data.elevation) && data.elevation.length > 0 ? data.elevation[0] : 0;
      return result; // geoid mean sea level by "Copernicus DEM GLO-90"
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
        setCoords(`Lat ${latitude} Long ${longitude} Alt ${Math.round(altitude)}m`);

        const pulledCity = await getCityFromCoords(latitude, longitude);
        setCity(pulledCity);

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
            const adresa = locationState.adresa;
            if (typeof latitude === "number" && typeof longitude === "number" && typeof height === "number") {
              setCoords(`Using previously saved location`);
              setCity(adresa || "City not found");
              newLocation = { pozicija: new Observer(latitude, longitude, height), adresa: adresa };
            } else {
              setCoords("No valid saved location found");
              setCity("City not found");
            }
          } else {
            setCoords("Unable to retrieve your location and no saved location found");
            setCity("City not found");
          }
        }
      }
      if (newLocation) {
        setLocation(newLocation);
      } else {
        console.error("Failed to determine location.");
      }
    } catch (error) {
      console.error("Error in success function:", error);
      setCoords("An error occurred while retrieving your location");
      setCity("City not found");
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
      setCoords("Geolocation is not supported by your browser");
      setCity("City not found");
      setLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='location'>
      {loading ? (
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
      ) : (
        <div className='location'>
          <div>
            <span>{city}</span>
            <br />
            <span>{coords}</span>
          </div>
          <p>Altituda: {String(coords.altitude)}</p>
          <p>typeof: {typeof coords.altitude}</p>
          <p>isNaN: {isNaN(coords.altitude) ? "DA" : "NE"}</p>
          <p>isFinite: {isFinite(coords.altitude) ? "DA" : "NE"}</p>
          <p>Rounded: {typeof coords.altitude === "number" && isFinite(coords.altitude) ? Math.round(coords.altitude) : "Nepoznato"} m</p>
        </div>
      )}
    </div>
  );
}

GeoFindMe.propTypes = {
  setLocation: PropTypes.func,
};
