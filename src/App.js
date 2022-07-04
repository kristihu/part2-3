import React, { useState, useEffect } from "react";
import axios from "axios";
import "./app.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});

  const [single, setSingle] = useState({});

  useEffect(() => {
    axios.get("https://restcountries.com/v2/all").then((response) => {
      setCountries(response.data);
      console.log(response.data, "jjjooojojoj");
    });
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value, "vlluuu");
  };

  const filtered = !search
    ? countries
    : countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
      );

  useEffect(() => {
    if (filtered.length === 1)
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${filtered[0].latlng[0]}&lon=${filtered[0].latlng[1]}&appid=dec3f4240e64d413fcb80fe420fb6476`
        )
        .then((response) => {
          console.log(response.data, "wthhehheheh");
          setWeather({
            icon: response.data.weather[0].icon,
            temp: response.data.main.temp,
            wind: response.data.wind.speed,
          });
        });
  }, [filtered]);
  return (
    <div className="App">
      <p>
        filter shown with <input value={search} onChange={handleSearch}></input>
      </p>

      {filtered.length < 10 &&
        filtered.map((country) => {
          return (
            <div key={country.name}>
              {country.name}
              <button
                onClick={() => {
                  console.log(country, "countryy");
                  setSingle(country);
                  console.log(single, "sinq");
                }}
              >
                show
              </button>
            </div>
          );
        })}
      {filtered.length > 10 && "too many matches, specify another filter"}
      {filtered.length === 1 && (
        <>
          <p>capital: {filtered[0].capital}</p>
          <p>area: {filtered[0].area}</p>
          <img alt="alt" className="flag" src={filtered[0].flag}></img>
          <h4>Languages spoken</h4>
          <p>
            {filtered[0].languages.map((lang) => {
              return <span key={lang.name}>{lang.name}</span>;
            })}
          </p>

          {weather && (
            <>
              <h4>Weather in {filtered[0].capital}</h4>
              <img
                alt="weather"
                src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              ></img>
              <p>temperature: {weather.temp} kelvins</p>
              <p>wind speed: {weather.wind} m/s</p>
            </>
          )}
        </>
      )}
      {filtered.length !== 1 && (
        <p>
          {single.name}
          <br></br>
          {single.capital}
          <br></br>
          {single.area}

          {single.languages?.map((lang) => {
            return <span key={lang.name}>{lang.name}</span>;
          })}
        </p>
      )}
    </div>
  );
}

export default App;
