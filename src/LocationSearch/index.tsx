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

  const searchOptions = {
    types: ['(cities)'],
  };
  return (
    <PlacesAutocomplete
      highlightFirstSuggestion
      searchOptions={searchOptions}
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
      shouldFetchSuggestions={address.length > 1}
      googleCallbackName="placesAutocompleteCallback"
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="Search-box">
          <input
            {...getInputProps({
              placeholder: 'Enter City...',
              className: 'location-search-input',
            })}
          />
          {suggestions.length > 0 && (
            <div className="autocomplete-dropdown-container">
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
  );
};

export default LocationSearch;
