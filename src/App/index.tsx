import React, { useState, useEffect } from 'react';
import './index.scss';
import CurrentWeather from '../CurrentWeather';
import LocationSearch from '../LocationSearch';

type LatLng = {
  lat: number;
  lng: number;
};

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const App = () => {
  const [latLng, setLatLng] = useState();

  useEffect(() => {
    const script = document.createElement('script');

    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&callback=placesAutocompleteCallback`;
    script.async = true;

    document.body.appendChild(script);
  }, []);

  const updateLatLng = (latLng: LatLng) => {
    setLatLng(latLng);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h4>SimpleWeather</h4>
        <LocationSearch updateLatLng={updateLatLng} />
      </header>
      <CurrentWeather latLng={latLng} />
    </div>
  );
};

export default App;
