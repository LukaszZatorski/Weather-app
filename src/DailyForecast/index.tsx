import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import { DateTime } from 'luxon';

interface Weather {
  [string_key: string]: string | number | object;
  valid_date: string;
  moonrise_ts: string;
  sunrise_ts: number;
  sunset_ts: number;
  weather: { icon: string; code: number; description: string };
}

const defaultProps = {
  latLng: {
    lat: 52.406374,
    lng: 16.925168,
  },
};

type DailyForecastProps = typeof defaultProps;

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const changeTimeZone = (time: number, tz: string) => {
  const adjustedTime: string = DateTime.fromSeconds(time, {
    zone: 'UTC',
  })
    .setZone(tz)
    .toLocaleString(DateTime.TIME_24_SIMPLE);
  return adjustedTime;
};

const DailyForecast = ({ latLng }: DailyForecastProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [forecast, setForecast] = useState<Weather[]>();
  const [timeZone, setTimeZone] = useState('UTC');

  useEffect(() => {
    axios
      .get(
        `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latLng.lat}&lon=${latLng.lng}&key=${API_KEY}`,
      )
      .then(response => {
        setTimeZone(response.data.timezone);
        setForecast(response.data.data);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, [latLng]);
  return (
    <div className='Forecast'>
      {!isLoading && forecast
        ? forecast.map(weather => (
            <ForecastItem
              weather={weather}
              key={weather.moonrise_ts}
              timeZone={timeZone}
            />
          ))
        : null}
    </div>
  );
};

type ForecastItemProps = {
  weather: Weather;
  timeZone: string;
};

const ForecastItem = ({ weather, timeZone }: ForecastItemProps) => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className='Forecast-item' onClick={() => setToggle(!toggle)}>
      <div className='Forecast-general'>
        <span className='Date'>
          {DateTime.fromISO(weather.valid_date).toLocaleString({
            weekday: 'short',
            month: 'short',
            day: '2-digit',
          })}
        </span>
        <span>
          <img
            src={`https://www.weatherbit.io/static/img/icons/${
              weather!.weather.icon
            }.png`}
            alt='weather icon'
          />
        </span>
        <span>
          <i className='fas fa-umbrella'></i>
          {weather.pop}%
        </span>
        <span>
          <span>{weather.max_temp}&deg;</span>
          {' / '}
          <span className='Temperature-min'>{weather.min_temp}&deg;</span>
        </span>
      </div>
      {toggle && (
        <div className='Forecast-detailed'>
          <span>
            Wind: {weather.wind_cdir} {weather.wind_spd} m/s
          </span>
          <span>Pressure: {weather.pres} hpa</span>
          <span>Sunrise: {changeTimeZone(weather.sunrise_ts, timeZone)}</span>
          <span>Sunset: {changeTimeZone(weather.sunset_ts, timeZone)}</span>
        </div>
      )}
    </div>
  );
};
DailyForecast.defaultProps = defaultProps;

export default DailyForecast;
