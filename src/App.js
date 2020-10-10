import { CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import { Card } from '@material-ui/core'
import Table from './Table'
import {PrintStat, sortData} from './util'
import "leaflet/dist/leaflet.css"

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapcenter, setmapcenter] = useState({lat: 34.80746, lng: -40.4796})
  const [mapzoom, setmapzoom] = useState(3);
  const [mapcountries, setmapcountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => {

    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ))

        const sortedData = sortData(data);
        setTableData(sortedData);
        setmapcountries(data);
        setCountries(countries);
      })
    }

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countrycode = event.target.value; 
    setCountry(countrycode);

    const ur = 'https://disease.sh/v3/covid-19/countries/' + countrycode;

    const url = countrycode === "worldwide" ? 'https://disease.sh/v3/covid-19/all' : ur;

    await fetch(url)
    .then(response => response.json())
    .then((data) => {
      setCountry(countrycode);
      setCountryInfo(data);
      setmapcenter([data.countryInfo.lat, data.countryInfo.long]);
      setmapzoom(4);
    }) 

  }

  console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant = "outlined" onChange={onCountryChange} value = {country} >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }  

            </Select>
            </FormControl>

        </div>

        <div className="app__stats">
          <InfoBox active={casesType==="cases"} onClick={e => setCasesType("cases")} title= "Coronavirus Cases" cases={PrintStat(countryInfo.todayCases)} total={PrintStat(countryInfo.cases)} />

          <InfoBox active={casesType==="recovered"} onClick={e => setCasesType("recovered")} title= "Recovered" cases={PrintStat(countryInfo.todayRecovered)} total={PrintStat(countryInfo.recovered)} />

          <InfoBox active={casesType==="deaths"} onClick={e => setCasesType("deaths")} title= "Deaths" cases={PrintStat(countryInfo.todayDeaths)} total={PrintStat(countryInfo.deaths)} />
        </div>

        <Map casesType={casesType} countries={mapcountries} center={mapcenter} zoom={mapzoom} />
      </div>
      
      <Card className="app__right">
            <CardContent >
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
            </CardContent>
      </Card>
    </div>
  );
}

export default App;