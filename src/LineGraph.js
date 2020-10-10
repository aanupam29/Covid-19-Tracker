import React, { useEffect, useState } from 'react'
import {Line} from "react-chartjs-2";
import numeral from "numeral"

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YYYY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function(value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
}


const buildChartData = (data) => {
    const chartData = [];
    let lastDataPoint=1;

    for(let date in data.cases) {
        if(lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data["cases"][date] - lastDataPoint
            };
            chartData.push(newDataPoint)
        }
        lastDataPoint = data["cases"][data];
    }
    return chartData;
}

function LineGraph() {

    const [data, setdata] = useState({});

    

    useEffect(() => {

        const fetchData = async () => {

            fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                let chartData = buildChartData(data);
                console.log(chartData);
                setdata(chartData);
            })

        }

        fetchData();

    }, [])

    return (
        <div>
            <h1>In a graph</h1>
            {data?.length > 0 && (

                <Line 
                    options={options} 
                    data={{
                        datasets: [{
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                            data: data
                        }]
                    }} 
                />

            )}
        </div>
    )
}

export default LineGraph
