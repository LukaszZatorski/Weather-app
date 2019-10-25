import React, { useState } from 'react';
import './index.scss';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

type LatLng = {
  lat: number;
  lng: number;
};

type Position = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type LocationSearchProps = {
  updateLatLng: (latLng: LatLng) => void;
};

const LocationSearch = ({ updateLatLng }: LocationSearchProps) => {
  const [address, setAddress] = useState('');

  const handleChange = (address: string) => {
    setAddress(address);
  };
  const handleSelect = (address: string) => {
    setAddress(address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => updateLatLng(latLng))
      .catch(error => console.error('Error', error));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  const setPosition = (position: Position) => {
    const latLng: LatLng = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    updateLatLng(latLng);
    setAddress('');
  };

  const showError = (error: any) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        alert('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        alert('An unknown error occurred.');
        break;
    }
  };

  const searchOptions = {
    types: ['(cities)'],
  };
  return (
    <div className='Location-search'>
      <PlacesAutocomplete
        highlightFirstSuggestion
        searchOptions={searchOptions}
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        shouldFetchSuggestions={address.length > 1}
        googleCallbackName='placesAutocompleteCallback'
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className='Search-box'>
            <input
              {...getInputProps({
                placeholder: 'Enter City...',
                className: 'location-search-input',
              })}
            />
            {suggestions.length > 0 && (
              <div className='autocomplete-dropdown-container'>
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                      })}
                    >
                      <strong>{suggestion.formattedSuggestion.mainText}</strong>{' '}
                      <small>
                        {suggestion.formattedSuggestion.secondaryText}
                      </small>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </PlacesAutocomplete>
      <span className='Geolocation' onClick={getLocation}>
        <i className='fas fa-map-marker-alt fa-2x'></i>
      </span>
    </div>
  );
};

export default LocationSearch;
