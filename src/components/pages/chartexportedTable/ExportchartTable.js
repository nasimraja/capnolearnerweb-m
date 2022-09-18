
import React, { Component, useCallback, useEffect, useState } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import RangeSlider from 'react-bootstrap-range-slider';
import { ModalHeader, Modal, ModalBody } from "reactstrap";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import InputColor from 'react-input-color';
import Plots from 'react-plotly.js';
import { csv } from 'd3';
import { jsPDF } from "jspdf";
import ChartExportedHeader from '../../component/ChartExportedHeader';
import ExportChart from './ChartExported';
import folderimage from '../../images/choosefile.png'
import { red } from '@material-ui/core/colors';
import backIcon from "../../images/back.png";


const ChartTable = (props) => {
    //// console.log("chart props", props)

    const accessToken = localStorage.getItem('accessToken');
    const { config, session, record } = useParams();
    const [graphs, setgraphs] = useState([]);
    const [value, setValue] = useState(0);
    const [point, setPoint] = useState(25);
    const [color, setColor] = useState();
    const [child, setchild] = useState('')
    const [setfileLoaded, setsetfileLoaded] = useState('')
    const [HelpModal, setHelpModal] = useState(false);
    const toggleHelpModal = () => setHelpModal(!HelpModal);
    const [fileSelected, setfileSelected] = useState(null)
    const [showHeader, setShowHeader] = useState(false);
    const [signalStat, setSignalStat] = useState({})
    const [showSignalStat, setShowSignalStat] = useState(false)
    const [sessioninfo, setsessioninfo] = useState({});

    const [requestProcessedModal, setrequestProcesedModal] = useState(false);
    const requestProcessedModalToggle = () => setrequestProcesedModal(!requestProcessedModal);

    const [requestProcessingModal, setrequestProcessingModal] = useState(false);
    const requestProcessingModalToggle = () => setrequestProcessingModal(!requestProcessingModal);


    const exportExcel = () => {

        setrequestProcesedModal(true);

    }

    const getData = props.getData;
    //// console.log("getData", getData)
    const fileLoaded = props.fileLoaded;
    //// console.log("fileLoaded", fileLoaded);






    useEffect(() => {
        exportChart();


    }, []);

    const exportChart = () => {
        fetch("https://capno-api.herokuapp.com/api/report/config?report_id=" + config,
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
                    console.warn(" Exported result", resp);
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
    const fileupload = (event) => {
        //setfileLoaded(true)
        var file = event.target.files[0];
        //// console.log(event.target)
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = event => {
            const dataContent = event.target.result;


        };
        setfileSelected(event.target.files);
        getSessionInfo(event.target.files);

    }

    const getSessionInfo = (_fileSelected) => {
        let _files = Array.from(_fileSelected)

        _files.length > 0 && _files.map(function (v, i) {
            if (v.name.includes(".json")) {
                var reader = new FileReader();
                // reader.readAsDataURL(v);
                reader.readAsText(v)
                reader.onload = event => {
                    let sessiondata = JSON.parse(event.target.result);
                    setsessioninfo(sessiondata)

                };

            }

        })
    }

    const downloadImage = () => {
        let _image = Array.from(fileSelected)
        let _imageArray = [];
        _image.length > 0 && _image.map(function (v, i) {
            if (v.name.includes(".png")) {
                _imageArray.push(v)

            }
            if (i == (_image.length - 1)) {
                SaveImage(_imageArray)
            }
        })
        // // console.log("png image jdfsdj", _imageArray)
    }


    const setStats = (_signal, data) => {

        // // console.log("signal data",data)
        let _temp = signalStat;
        let _tempData = [];
        data.map((v, i) => {
            _tempData.push({
                x: v.x,
                mean: v.mean,
                median: v.median,
                sd: v.sd,
            })
        })
        _temp[_signal] = _tempData;
        // console.log("signal data 1" + _signal, _temp);
        setSignalStat(_temp)
        setTimeout(() => {
            setShowHeader(true);
        }, 2000 * graphs.length);
    }

    const SaveImage = (_imageArray) => {
        const doc = new jsPDF();
        for (let pageNumber = 1; pageNumber <= doc.getNumberOfPages(); pageNumber++) {
            doc.setPage(pageNumber)
            doc.setTextColor(2, 4, 7);
            doc.text('Capnolearning Report', 10, 10,
                { styles: { fontSize: 20, fontWeight: 'bold' } })
            doc.setDrawColor(0, 0, 0);
            doc.line(10, 15, 600, 15);
            doc.setFontSize(10);
            doc.text(sessioninfo.session.date, 35, 25)
            doc.setFont(undefined, 'bold');
            doc.text("Session Date:", 10, 25)

            doc.text("Session Date:", 10, 25)
            // doc.text("Client:", 10, 30);
            // doc.text("Trainer:", 10, 35);
            // console.log("lenght of iamge", _imageArray.length - 4)
            let ev = 0;

            _imageArray.length > 0 && _imageArray.map((v, i) => {
                let reader = new FileReader();
                // console.log("result of v", v)
                if (v) {
                    // console.log("v result", v)
                    reader.readAsDataURL(v);
                    reader.onload = event => {
                        let dataimage = event.target.result;
                        // console.log("dataimage", dataimage)
                        doc.addImage(dataimage, 7, 50 + (ev * 110), 200, 90);
                        //doc.addImage(dataimage, 3, 0 + (ev * 0), pageWidth, pageHeight);
                        ev++;
                        if (ev == 2) {
                            ev = 0;
                            doc.addPage();
                        }

                    };

                }
            })

        }
        setTimeout(() => {
            doc.save("Live Session Images - " + sessioninfo.session.date + " .pdf");

        }, _imageArray.length * 2000);
    }
    return (
        <div>


            {
                graphs.length > 0 && showHeader &&
                <ChartExportedHeader graphs={graphs} setShowSignalStat={setShowSignalStat} setrequestProcessingModal={setrequestProcessingModal} setrequestProcesedModal={setrequestProcesedModal} showSignalStat={showSignalStat} signalStat={signalStat} exportExcel={exportExcel} showHeader={showHeader} sessioninfo={sessioninfo} downloadImage={downloadImage} fileupload={fileupload} config={config} />

            }
            {
                graphs.length > 0 && !showHeader &&
                <ChartExportedHeader graphs={graphs} setShowSignalStat={setShowSignalStat} setrequestProcessingModal={setrequestProcessingModal} exportExcel={exportExcel} setrequestProcesedModal={setrequestProcesedModal} showSignalStat={showSignalStat} signalStat={signalStat} showHeader={showHeader} sessioninfo={sessioninfo} downloadImage={downloadImage} fileupload={fileupload} config={config} />

            }
            <div className="wrp-charttable" id="exported-chart">
                <div className="container-fluid">
                    <div className="row justify-content-between">
                        {
                            sessioninfo.annotations && fileSelected && graphs && graphs.map(function (d, i) {
                                // console.log("graph show", d);
                                return (
                                    <div className="chart-w" style={{ width: (d.col != "1/1" ? (eval((d.col)) * 99) + "%" : (eval(d.col) * 100) + "%"), maxWidth: (eval(d.col) * 100) + "%", height: "auto", minHeight: (eval(d.row) * 82) + "vh" }}>
                                        <ExportChart sessioninfo={sessioninfo} showSignalStat={showSignalStat} getData={getData} setStats={setStats} index={i} dataFile={fileSelected} record={record} session={session} signal={d.signal_name} xmax={d.xmax} xmin={d.ymin} ymin={d.ymin} ymax={d.ymax} type={d.type} color={d.color} col={d.col} row={d.row} />
                                    </div>

                                )

                            })
                        }
                        {
                            !fileSelected &&
                            <div className='col-md-12'>
                                <div className="bag-1">
                                    <div className="back-icon-wrp">
                                        <Link to="/choose/exported/file/config" className="backbtn-icon">
                                            <img src={backIcon} alt="backicon" />
                                            <span>Back</span>
                                        </Link>
                                    </div>
                                    <div className="uploadfile">
                                        <div className='content1'>
                                            <p className='bag-10'>
                                                Please choose the client session folder on your computer. <br /> You can find the folder by clicking on the <b>"Capno Offline"</b> icon on your desktop. <br />After choosing a client, click on the session you want to review. </p>
                                        </div>
                                        <div className='content2 '>
                                            <div className='bag-2'>
                                                <button className="buttonstyle" >
                                                    <label><img style={{ marginRight: "10px", marginTop: "3px" }} src={folderimage}></img></label>
                                                    <h6 style={{ color: "#800080", marginTop: "5px", display: "inline-block" }}>Choose Client Folder</h6>
                                                </button>
                                                <input id="ChooseFolder" multiple type="file" onChange={fileupload} webkitdirectory="true"
                                                />
                                            </div>


                                        </div>
                                        {/* <div className=" content3 " >
                                       <a href='#' onClick={toggleHelpModal}>
                                          <p className='bag-10'>See Pictures</p>
                                           <span><i class="fa fa-question-circle need- bag-200" aria-hidden="true"></i></span>

                                       </a>
                                   </div> */}

                                    </div>
                                    <Modal isOpen={HelpModal} toggle={toggleHelpModal} className="modal-box-wrp" centered={true}>
                                        <ModalHeader toggle={toggleHelpModal}><span className="ml-1 roititle modal-head">Instructions to load session files for visulaization </span></ModalHeader>
                                        <ModalBody>

                                            <ol>
                                                <li>Click on <b>Choose Client Folder</b> button. It will open a file picker dialog box.</li>
                                                <li>On the dialog box open <b>Desktop</b>.</li>
                                                <li>Then open folder, <b>Capno Offline.</b></li>
                                                <li>Double click on the <b>client name folder</b>, e,g John Smith.</li>
                                                <li>Double click on the <b>session date folder</b>, which you want to load for visualization, e.g 2022-6-18-19-10.</li>

                                            </ol>

                                        </ModalBody>

                                    </Modal>


                                </div>
                            </div>

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

        </div>
    )
}

export default ChartTable;