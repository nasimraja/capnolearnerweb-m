import React, { Component, useEffect, useState } from 'react';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import html2canvas from 'html2canvas';

import { Link, useParams, Router } from 'react-router-dom';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import InputColor from 'react-input-color';
import Plots from 'react-plotly.js';
import { csv } from 'd3';
import ViewChartHeader from '../../component/ViewChartHeader';
import Chart from './Chart';
import { API_URL } from '../../../config';

const ViewChartTable = () => {
    const accessToken = localStorage.getItem('accessToken');
    const { session , reportId , record} = useParams();
    const [currentConfig ,setCurrentConfig] = useState()
    
    const [graphs, setgraphs] = useState([]);
    const [notes,setNotes] = useState(null) ; 
    const [reportName,setReportName] = useState(null) ; 
    const [showHeader,setShowHeader] = useState(false) ; 
    const [sessionDate,setSessionDate] = useState(null) ; 
    const userId = localStorage.getItem('user_id');
    const [showActualTime,setShowActualTime] =  useState(true) ; 
    
    // const [value, setValue] = useState(0);
    // const [point, setPoint] = useState(25);
    // const [color, setColor] = useState();
    const [signalConfig , setSignalConfig] = useState({})
    const [signalStat , setSignalStat] = useState({})
    const [showSignalStat , setShowSignalStat] = useState(false)
    
    const [requestProcessingModal, setrequestProcessingModal] = useState(false);
    const requestProcessingModalToggle = () => setrequestProcessingModal(!requestProcessingModal);

    const [savingReportConfirmation, setSavingReportConfirmation] = useState(false);
    const savingReportConfirmationToggle = () => setSavingReportConfirmation(!savingReportConfirmation);
    
    const [savingAlternateConfirmation, setSavingAlternateConfirmation] = useState(false);
    const savingAlternateConfirmationToggle = () => setSavingAlternateConfirmation(!savingAlternateConfirmation);


    const [requestProcessedModal, setrequestProcesedModal] = useState(false);
    const requestProcessedModalToggle = () => setrequestProcesedModal(!requestProcessedModal);


    const setConfig = (_signal,data) => {
        let _temp = signalConfig ; 
        _temp[_signal] = {
            color : data.color,
            type : data.type,
            avg : data.avg,
            xmin : data.xmin/1e3,
            thick : data.thick,
            signal: data.signal,
            xextreme : data.xextreme/1e3,
            xmax : data.xmax/1e3,
            ymin : data.ymin,
            ymax : data.ymax,
            record : data.record,
            graph_order : data.graph_order,
            comment : data.comment,
            row : data.row,
            clientSerial : data.clientSerial,
            col : data.col,
            xrange: data.xrange, 
            units: data.units,
            annotation: data.annotation,
            grid: data.grid,
            inverty: data.inverty,
            yposition: data.yposition,
            lineType: data.lineType
        }
        // console.log("signal config",_temp);
        setSignalConfig(_temp)
    }


    const setStats = (_signal,data) => {
        
    // // console.log("signal data",data)
    let _temp = signalStat ; 
    let _tempData = [] ;
        data.map((v,i) => {
            _tempData.push({
                x : v.x,
                mean : v.mean,
                median : v.median,
                sd : v.sd,
            })
        })
        _temp[_signal] = _tempData ; 
        // // console.log("signal data 1",_temp);
        setSignalStat(_temp)
        setTimeout(() => {
            setShowHeader(true);
        }, 1000*graphs.length);
    }

    useEffect(() => {
        reportChart();


    }, []);

    const reportChart = () => {
        fetch(API_URL+"/view/report/config?report_id=" + reportId,
 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {
                    // console.warn("result", resp);
                    setgraphs(resp.graphs)


                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }



        })
    }
    const logout = () => {
        localStorage.clear();
        window.location.reload();
    } 


    const exportExcel = () => {
            setrequestProcesedModal(true);

    }


  const saveReport = () => {
    setrequestProcessingModal(true)
     
                let timezone = new Date().getTimezoneOffset() ; 
                let formDataReport = {    
                    'rid':  reportId,
                    'notes': notes,
                    'timezone' : timezone   
                    } ;
                    
                    fetch(API_URL + "/update/single/report", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': accessToken,
                        },
                        body: JSON.stringify(formDataReport),
                    }).then(async (result) => {
                        let _res = await result.json() ;
                        
            
                        graphs.map((v,i) => {
                                let _config = signalConfig[v.signal_name] ; 
                                // // console.log(_config) ;
                                fetch(API_URL + "/update/single/report/graph", {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-access-token': accessToken,
                                    },
                                    body: JSON.stringify({
                                        reportId,
                                        _config,
                                        signal_name: v.signal_name
                                    }),
                                }).then(async (result) => {
                                    let _res = await result.json() ;
                                   
                        
                                    if(i == (graphs.length - 1)){
                                        setrequestProcessingModal(false);
                                        setrequestProcesedModal(true)
                                        setSavingReportConfirmation(false)
                                    }
                                    
                        
                                })
                        })
                        
            
                    })

                    
            
    }

    const saveReportConfig = () => {
        setSavingAlternateConfirmation(false)
        runSaveReportConfig() ; 

    }
  
    const runSaveReportConfig = () => {
        setrequestProcessingModal(true)
        let formData = {    
        'original':  config,
        'user': userId,
        'name': "Alternate",
        'type': "1",
        'status': "1"
        } ;
        
        fetch(API_URL + "/save/single/alertnate/report/config", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
            },
            body: JSON.stringify(formData),
        }).then(async (result) => {
            let _res = await result.json() ;
            let alternateId = _res.reports.insertId ;

            graphs.map((v,i) => {
                    let _config = signalConfig[v.signal_name] ; 
                    // // console.log(_config) ;
                    fetch(API_URL + "/save/single/alertnate/report/graph", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': accessToken,
                        },
                        body: JSON.stringify({
                            alternateId,
                            _config,
                            signal_name: v.signal_name
                        }),
                    }).then(async (result) => {
                        let _res = await result.json() ;
                       
            
                        if(i == (graphs.length - 1)){
                            setrequestProcessingModal(false);
                            setrequestProcesedModal(true)
                        }
                        
            
                    })
            })
            

        })

    }


    return (
        <div>
            {
                graphs.length > 0  && showHeader &&
                <ViewChartHeader showHeader={showHeader}   setShowSignalStat={setShowSignalStat}  showSignalStat={showSignalStat} setSessionDate={setSessionDate} setSavingReportConfirmation={setSavingReportConfirmation} setrequestProcessingModal={setrequestProcessingModal}  setrequestProcesedModal={setrequestProcesedModal} setNotes={setNotes} graphs={graphs} signalStat={signalStat} notes={notes} exportExcel={exportExcel} saveReportConfig={() => setSavingAlternateConfirmation(!savingAlternateConfirmation)} config={currentConfig} />
            }

{
                graphs.length > 0  && !showHeader &&
                <ViewChartHeader showHeader={showHeader}  setShowSignalStat={setShowSignalStat}  showSignalStat={showSignalStat} setSessionDate={setSessionDate} setSavingReportConfirmation={setSavingReportConfirmation} setrequestProcessingModal={setrequestProcessingModal}  setrequestProcesedModal={setrequestProcesedModal} setNotes={setNotes} graphs={graphs} signalStat={signalStat} notes={notes} exportExcel={exportExcel} saveReportConfig={() => setSavingAlternateConfirmation(!savingAlternateConfirmation)} config={currentConfig} />
            }

          
              
            <div className="wrp-charttable" id="chart-table">
                <div className="container-fluid">
                    <div className="row justify-content-between">
                        {
                            graphs.length > 0 && sessionDate &&   graphs.map(function (d, i) {
                            
                                return (
                                  
                                        <div className="chart-w" style={{ width:  (d.col != "1/1" ? (eval((d.col)) * 99 )+ "%" : (eval(d.col) * 100) + "%"), maxWidth: (eval(d.col) * 100) + "%", height: "auto" , minHeight:  (eval(d.row) * 84) + "vh"  }}>
                                        <Chart sessionDate={sessionDate} showActualTime={showActualTime} showSignalStat={showSignalStat} comment={d.comment} setStats={setStats} col={d.col} row={d.row} setConfig={setConfig} record={record} session={session} signal={d.signal_name} xmax={d.xmax} xmin={d.xmin}  ymin={d.ymin} ymax={d.ymax} thick={d.thick} otherConfig={d.other_config} graph_order={d.graph_order} type={d.type} color={d.color} />
                                        </div>
                                   

                                )

                            })
                        }

            

                    </div>
                </div>
            </div>



                    {/* request processing modal */}

                    <Modal isOpen={requestProcessingModal} toggle={requestProcessingModalToggle} className="modal-box-wrp" centered={true}>
                    <ModalHeader toggle={requestProcessingModalToggle}><span className="ml-1 roititle modal-head">Request processing...</span></ModalHeader>
                    <ModalBody>
                        <p className='text-center'>Your request is getting processed. Please wait.</p>
                    <div className="wrp-chart-loader">
                    <div class="loading">
                        <div class="loading-1"></div>
                        <div class="loading-2"></div>
                        <div class="loading-3"></div>
                        <div class="loading-4"></div>
                    </div>
                </div>
                    </ModalBody>

                </Modal>

                {/* request processing modal  */}

                
                    {/* request processed modal */}

                    <Modal isOpen={requestProcessedModal} toggle={requestProcessedModalToggle} className="modal-box-wrp" centered={true}>
                    <ModalHeader toggle={requestProcessedModalToggle}><span className="ml-1 roititle modal-head">Request processed.</span></ModalHeader>
                    <ModalBody>
                        <p className='text-center'>Your request has been processed succesfully.</p>
                        
                    </ModalBody>

                </Modal>

                {/* request processed modal  */}


                
                    {/* alternate report confirmation  modal */}

                    <Modal isOpen={savingAlternateConfirmation} toggle={savingAlternateConfirmationToggle} className="modal-box-wrp" centered={true}>
                    <ModalHeader toggle={savingAlternateConfirmationToggle}><span className="ml-1 roititle modal-head">Confirm request.</span></ModalHeader>
                    <ModalBody>
                        <p className='text-center'>Are you sure you want to save the current configuration as an alternate configuration of this report?</p>
                        <div className='d-flex justify-content-around mt-3'>
                            <button className='lightbtn w-100'  onClick={savingAlternateConfirmationToggle} >Cancel</button>
                            <button className='darktbtn w-100 ml-1'  onClick={saveReportConfig} >Save</button>
                        </div>
                    </ModalBody>

                </Modal>

                {/* alternate report confirmation  modal  */}




                
                    {/* savng report confirmation modal */}

                    <Modal isOpen={savingReportConfirmation} toggle={savingReportConfirmationToggle} className="modal-box-wrp" centered={true}>
                    <ModalHeader toggle={savingReportConfirmationToggle}><span className="ml-1 roititle modal-head">Confirm request.</span></ModalHeader>
                    <ModalBody>
                        <p className='text-center'>Are you sure you want to save the changes to report?</p>
                        <div className='d-flex justify-content-around mt-3'>
                            <button className='lightbtn w-100'  onClick={savingReportConfirmationToggle} >Cancel</button>
                            <button className='darktbtn w-100 ml-1'  onClick={saveReport} >Save</button>
                        </div>
                    </ModalBody>

                </Modal>

                {/* saving report confirmation  modal  */}

        </div>
    )
}

export default ViewChartTable;