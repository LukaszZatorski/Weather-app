import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import CurrentWeather, { changeTimeZone } from '.';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CurrentWeather', () => {
  const response = {
    data: {
      data: [
        {
          rh: 36,
          pod: 'd',
          lon: 16.92993,
          pres: 1005.77,
          timezone: 'Europe/Warsaw',
          ob_time: '2019-07-26 11:54',
          country_code: 'PL',
          clouds: 78,
          ts: 1564142042,
          solar_rad: 563.854,
          state_code: '86',
          city_name: 'Poznań',
          wind_spd: 2.99894,
          last_ob_time: '2019-07-26T11:33:00',
          wind_cdir_full: 'northeast',
          wind_cdir: 'NE',
          slp: 1013.16,
          vis: 24.1352,
          h_angle: 0,
          sunset: '18:54',
          dni: 886.1,
          dewpt: 11.6,
          snow: 0,
          uv: 3.43981,
          precip: 0,
          wind_dir: 41,
          sunrise: '03:03',
          ghi: 831.94,
          dhi: 115.02,
          aqi: 21,
          lat: 52.40692,
          weather: {
            icon: 'c04d',
            code: '804',
            description: 'Overcast clouds',
          },
          datetime: '2019-07-26:11',
          temp: 27.9,
          station: 'AS410',
          elev_angle: 56.95,
          app_temp: 27.3,
        },
      ],
    },
  };

  const latLng = {
    lat: 52.406374,
    lng: 16.925168,
  };

  const url =
    'https://api.weatherbit.io/v2.0/current?lat=52.406374&lon=16.925168&key=undefined';

  test('fetch weather data and update DOM', async () => {
    mockedAxios.get.mockResolvedValue(response);

    const { getByText, container } = render(<CurrentWeather latLng={latLng} />);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(url);

    await wait(() => expect(getByText(/27.9/)).toBeTruthy());
    await wait(() => expect(getByText(/Poznań/)).toBeTruthy());

    await wait(() => expect(container.querySelector('.Humidity')).toBeTruthy());
  });

  test('adjust date properly on winter time', () => {
    const adjustedTime = changeTimeZone('2020-02-10T11:00', 'Europe/Warsaw');
    expect(adjustedTime).toBe('12:00');
  });
  test('adjust date properly on summer time', () => {
    const adjustedTime = changeTimeZone('2020-05-10T11:00', 'Europe/Warsaw');
    expect(adjustedTime).toBe('13:00');
  });
});
