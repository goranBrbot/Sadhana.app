import { useState, useEffect } from "react";
import { Observer } from "astronomy-engine";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";

export default function GeoFindMe({ setLocation }) {
  const [coords, setCoords] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true); // kako bi se istovremeno rendali lat, long i async dohvat mjesta

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const height = 0;

    getCityFromCoords(latitude, longitude);
    setLoading(false);
    setCoords(`Lat ${latitude}° Long ${longitude}°`);

    // Spremi lokaciju u localStorage
    const newLocation = new Observer(latitude, longitude, height);
    localStorage.setItem("locationState", JSON.stringify(newLocation));
    setLocation(newLocation);
  }

  function error() {
    // Ako dohvaćanje lokacije ne uspije, koristi spremljenu lokaciju iz localStorage
    const savedState = localStorage.getItem("locationState");
    if (savedState) {
      const locationState = JSON.parse(savedState);

      if (locationState && typeof locationState.latitude === "number" && typeof locationState.longitude === "number") {
        setCoords(`Using previously saved location!`);
        getCityFromCoords(locationState.latitude, locationState.longitude);
        const { latitude, longitude } = locationState;
        const height = 0;
        setLocation(new Observer(latitude, longitude, height));
        setLoading(false);
      } else {
        setCoords("No valid saved location found");
        setLoading(false);
      }
    } else {
      setCoords("Unable to retrieve your location and no saved location found");
      setLoading(false);
    }
  }

  async function getCityFromCoords(latitude, longitude) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();
      const road = data.address.road !== undefined ? data.address.road : "";
      const house_number = data.address.house_number !== undefined ? data.address.house_number : "";
      const village = data.address.village !== undefined ? data.address.village : "";
      const town = data.address.town !== undefined ? data.address.town : "";
      const city = data.address.city !== undefined ? data.address.city : "";

      setCity(`${road} ${house_number}, ${(village, town || city)}`);
    } catch (error) {
      console.error("Error fetching city:", error);
      setCity("City not found");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords("Geolocation is not supported by your browser");
    } else {
      setCoords("Locating your position ..");
      navigator.geolocation.getCurrentPosition(success, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='location'>
      {loading ? (
        coords
      ) : (
        <motion.div
          initial={{ opacity: 0 }} // Initial state (invisible)
          animate={{ opacity: 1 }} // Animation to apply (fade in)
          transition={{ delay: 0.3, duration: 0.5 }} // Duration of the animation
        >
          <>
            <div className='location'>
              {/* <img className='logo' src='favicon.svg' alt='Om' /> */}
              {/* <img className='iconMap' src='icons/map-pin.png' alt='Map location' /> */}
              <div>
                {/* <small>YOUR LOCATION</small> */}
                <span>{city}</span>
                <br />
                <span>{coords}</span>
              </div>
            </div>
          </>
        </motion.div>
      )}
    </div>
  );
}

GeoFindMe.propTypes = {
  setLocation: PropTypes.func,
};
