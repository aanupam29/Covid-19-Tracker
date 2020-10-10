import React from "react";
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet";

const casestypecolors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 500,
    },
    recovered: {
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 700,
    },
    deaths: {
        hex: "#fb4443",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 1300,
    },
};

export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if(a.cases > b.cases) {
            return -1;
        }
        else {
            return 1;
        }
    })
    return sortedData;
}

export const PrintStat = (stat) => 
stat ? `+${numeral(stat).format("0.0a")}` : "+0"

export const showDataOnMap = (data, casesType="cases") => 
    data.map(country => (
        <Circle 
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casestypecolors[casesType].hex}
            fillColor={casestypecolors[casesType].hex}
            radius={
                Math.sqrt(country[casesType])*casestypecolors[casesType].multiplier
            }
        >
        <Popup>
            <div className="info-container">
                <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})` }} ></div>
                <div className="info-name">{country.country}</div>
                <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                <div className="info-confirmed">Recovered: {numeral(country.recovered).format("0,0")}</div>
                <div className="info-confirmed">Deaths: {numeral(country.deaths).format("0,0")}</div>
            </div>
        </Popup>
        </Circle>
    ));