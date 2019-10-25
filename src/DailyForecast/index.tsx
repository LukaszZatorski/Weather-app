import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import { DateTime } from 'luxon';

interface Weather {
  [string_key: string]: string | number | object;
  valid_date: string;
  moonrise_ts: string;
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

export const changeTimeZone = (time: string, tz: string) => {
  const adjustedTime: string = DateTime.fromISO(time, { zone: 'UTC' })
    .setZone(tz)
    .toLocaleString(DateTime.TIME_24_SIMPLE);
  return adjustedTime;
};

const DailyForecast = ({ latLng }: DailyForecastProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [forecast, setForecast] = useState<Weather[]>();

  useEffect(() => {
    axios
      .get(
        `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latLng.lat}&lon=${latLng.lng}&key=${API_KEY}`,
      )
      .then(response => {
        setForecast(response.data.data);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, [latLng]);
  return (
    <div className='Forecast'>
      {!isLoading && forecast
        ? forecast.map(weather => (
            <div key={weather.moonrise_ts} className='Forecast-item'>
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
                  <span className='Temperature-min'>
                    {weather.min_temp}&deg;
                  </span>
                </span>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

DailyForecast.defaultProps = defaultProps;

export default DailyForecast;
