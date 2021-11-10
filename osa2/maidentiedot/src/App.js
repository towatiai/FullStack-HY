import React, { useState, useEffect } from 'react';
import axios from "axios";

const URL_all = "https://restcountries.com/v3.1/all";
const URL_WEATHER_BASE = " http://api.weatherapi.com/v1";
const APIKEY = process.env.REACT_APP_API_KEY;
console.log(APIKEY ? "API key OK" : "No weather API key.");

// Helper function for binding setValue functions
const binder = (set) => (e) => set(e.target.value);

const CountryList = props => (
  <ul>
    {props.countries.map(c =>
      <li key={c.cca2}>
        {c.name.common}
        <button onClick={() => props.selectCountry(c)}>Show</button>
      </li>)}
  </ul>
)

const WeatherInfo = ({ capital }) => {

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    (async () => {
      setWeather((await axios.get(`${URL_WEATHER_BASE}/current.json`,
        { params: { key: APIKEY, q: capital } })).data);
    })();
  }, [capital]);

  return weather ? (
  <>
    <h2>Weather in {capital}</h2>
    <p>temperature: {weather.current.temp_c} Celsius</p>
    <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
    <p>wind: {weather.current.wind_kph} km/h direction {weather.current.wind_dir}</p>
  </> ) : <p>Loading...</p>;
}

const CountryInfo = ({ country }) => (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>population {country.population}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <WeatherInfo capital={country.capital[0]}/>
    </>
  )

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    // Because of react's limitations...
    (async () => {
      setCountries((await axios.get(URL_all))?.data);
    })();
  }, [])

  let filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      find countries <input value={search} onChange={binder(setSearch)} />
      {
        filteredCountries.length === 1 ?
          <CountryInfo country={filteredCountries[0]} />
          : selectedCountry ?
            <CountryInfo country={selectedCountry} />
            : filteredCountries.length > 10
              ? <p>Too many matches, specify another filter</p>
              : <CountryList countries={filteredCountries} selectCountry={setSelectedCountry} />
      }
    </div>
  )
}

export default App