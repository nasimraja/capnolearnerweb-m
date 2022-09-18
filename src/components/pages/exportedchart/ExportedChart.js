import React, { Component, useEffect,useState } from 'react';
import Plots from 'react-plotly.js';
import { Link } from 'react-router-dom';
import Header from '../../component/Header';
import Sidebar from '../../component/Sidebar';
import {csv} from 'd3';

const ExportedChart = () => {
    const [xAxis,setXaxis] = useState([]);
    const [yAxis,setYaxis] = useState([]);
    const [plot,setPlot] = useState(null);
    useEffect(() => {
        // super(props);
        
    
    },[xAxis,yAxis])
    
    useEffect(() => {
        // super(props);
        getData() ; 
    
    },[])
    async function  plotGraph(_xAxis,_yAxis) {
    //    alert("here")
        let _plot = {
            options: {
                
                xaxis: {
                    categories: _xAxis
                }
            },
            series: [
                {
                    name: "series-1",
                    data: _yAxis
                }
            ]
        };
        setPlot(_plot);
    }
    

    async function getData(){
        let _x = [] ;
        let _y = [];
        csv('/60c4378df1710signalB.csv').then(data=>{
           // console.log(data);
            data.map((v,i) => {
                // _x.push(new Date(v.x));
                _x.push(new Date(parseInt(v.x)));
                _y.push(parseFloat(v.y));
                if(i == 1){
                    // alert("here");
                    setXaxis(_x);
                    setYaxis(_y);
                    // plotGraph(_x,_y);
 
                }
            })
            // // console.log(data)
        })

    }
    

        return (
            <div>
                <Header />
                <div className="wrp-dashbord">
                    <div className="sidebar-section">
                        <Sidebar />
                    </div>
                    <div className="right-section">
                        <div>
                            {
                                xAxis.length > 0 && yAxis.length > 0 &&
                                <Plots
                                data={[
                                    {
                                        x: xAxis,
                                        y: yAxis,
                                        type: 'bar',
                                        marker: { color: 'balck' },
                                    },
                                    // { type: 'bar', x: [1, 2, 3], y: [2, 6, 3] },
                                ]}
                               
                            />
                            }
                    
                           
                        </div>
                    </div>
                </div>
            </div>

        );
    
}

export default ExportedChart;