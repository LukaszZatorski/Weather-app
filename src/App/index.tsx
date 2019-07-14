import React, { useState } from 'react';
import './index.css';
import CurrentWeather from '../CurrentWeather';

const App = () => {
  const [latLng, setLatLng] = useState({ lat: 52.406374, lng: 16.925168 });
  return (
    <div className="App">
      <header className="App-header">
        <h4>SimpleWeather</h4>
      </header>
      <CurrentWeather latLng={latLng} />
    </div>
  );
};

export default App;
