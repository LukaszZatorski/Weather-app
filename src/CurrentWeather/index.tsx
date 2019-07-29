import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import { DateTime } from 'luxon';

interface Weather {
  [string_key: string]: string | number | object;
  timezone: string;
  sunrise: string;
  sunset: string;
  weather: { icon: string; code: number; description: string };
}

type CurrentWeatherProps = {
  latLng: {
    lat: number;
    lng: number;
  };
};

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const changeTimeZone = (time: string, tz: string) => {
  const adjustedTime: string = DateTime.fromISO(time, { zone: 'UTC' })
    .setZone(tz)
    .toLocaleString(DateTime.TIME_24_SIMPLE);
  return adjustedTime;
};

const CurrentWeather = ({ latLng }: CurrentWeatherProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState<Weather>();

  useEffect(() => {
    axios
      .get(
        `https://api.weatherbit.io/v2.0/current?lat=${latLng.lat}&lon=${
          latLng.lng
        }&key=${API_KEY}`,
      )
      .then(response => {
        console.log(response);
        setWeather(response.data.data[0]);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, [latLng]);
  return (
    <div className="Current-weather">
      {!isLoading ? (
        <React.Fragment>
          <div className="Info-general">
            <h2>{weather!.city_name}</h2>
            <div className="Conditions">
              <div className="Icon-weather">
                <img
                  src={`https://www.weatherbit.io/static/img/icons/${
                    weather!.weather.icon
                  }.png`}
                  alt="weather icon"
                />
              </div>
              <div className="Temperature">
                {weather!.temp}
                &deg;
              </div>
              <div className="Condition-desc">
                {weather!.weather.description}
              </div>
              <div className="Real-feels">
                Feels like: {weather!.app_temp}
                &deg;
              </div>
            </div>
          </div>
          <div className="Info-details">
            <div className="Humidity">
              <span>Humidity</span>
              <span className="Details-data">{weather!.rh} %</span>
            </div>
            <div className="Visibility">
              <span>Visibility</span>
              <span className="Details-data">{weather!.vis} km</span>
            </div>
            <div className="Uv-index">
              <span>UV index</span>
              <span className="Details-data">{weather!.uv} of 11</span>
            </div>
            <div className="Pressure">
              <span>Pressure</span>
              <span className="Details-data">{weather!.pres} hpa</span>
            </div>
            <div className="Dew-point">
              <span>Dew point</span>
              <span className="Details-data">
                {weather!.dewpt}
                &deg;
              </span>
            </div>
            <div className="Wind">
              <span>Wind</span>
              <span className="Details-data">
                {weather!.wind_cdir} {weather!.wind_spd} m/s
              </span>
            </div>
            <div className="Sunrise">
              <span>Sunrise</span>
              <span className="Details-data">
                {changeTimeZone(weather!.sunrise, weather!.timezone)}
              </span>
            </div>
            <div className="Sunset">
              <span>Sunset</span>
              <span className="Details-data">
                {changeTimeZone(weather!.sunset, weather!.timezone)}
              </span>
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default CurrentWeather;
