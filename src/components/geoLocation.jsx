import { useState, useEffect } from "react";
import { Observer } from "astronomy-engine";
import { PropTypes } from "prop-types";

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
      return Array.isArray(data.elevation) && data.elevation.length > 0 ? data.elevation[0] : 0;
    } catch (error) {
      console.error("Error fetching elevation:", error);
      return 0;
    }
  }

  async function getCityFromCoords(latitude, longitude) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();
      const road = data.address.road || "";
      const house_number = data.address.house_number || "";
      const village = data.address.village || "";
      const town = data.address.town || "";
      const city = data.address.city || "";
      return `${road} ${house_number}, ${(village, town || city)}`;
    } catch (error) {
      console.error("Error fetching city:", error);
      return "City not found";
    }
  }

  async function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const altitude = await fetchAltitude(latitude, longitude, position.coords.altitude);
    setCoords(`Lat ${latitude}° Long ${longitude}° Alt ${altitude}m`);

    const pulledCity = await getCityFromCoords(latitude, longitude);
    setCity(pulledCity);

    const newLocation = { pozicija: new Observer(latitude, longitude, altitude), adresa: pulledCity };
    localStorage.setItem("locationState", JSON.stringify(newLocation));
    setLocation(newLocation);

    setLoading(false);
  }

  function error() {
    console.warn("Geolocation failed, using localStorage as fallback.");
    // Ako dohvaćanje lokacije ne uspije, koristi spremljenu lokaciju iz localStorage
    const savedState = localStorage.getItem("locationState");
    if (savedState) {
      const locationState = JSON.parse(savedState);
      if (locationState && typeof locationState.latitude === "number" && typeof locationState.longitude === "number") {
        const { latitude, longitude } = locationState;
        const altitude = locationState.altitude || 0;
        setCoords(`Using previously saved location!`);
        // getCityFromCoords(locationState.latitude, locationState.longitude);
        getCityFromCoords(latitude, longitude).then((cityName) => setCity(cityName));
        setLocation(new Observer(latitude, longitude, altitude));
      } else {
        setCoords("No valid saved location found");
        setCity("City not found");
      }
    } else {
      setCoords("Unable to retrieve your location and no saved location found");
      setCity("City not found");
    }
    setLoading(false);
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
    // OVA KOMPONENTA SE UOPĆE NE RENDA VIZUALNO A SLUŽITI ĆE ZA LOADER U BUDUĆNOSTI ..
    <div className='location'>
      {loading ? (
        <div className='loading-indicator'>Loading location...</div>
      ) : (
        <div className='location' style={{ display: "none" }}>
          <div>
            <span>{city}</span>
            <br />
            <span>{coords}</span>
          </div>
        </div>
      )}
    </div>
  );
}

GeoFindMe.propTypes = {
  setLocation: PropTypes.func,
};
