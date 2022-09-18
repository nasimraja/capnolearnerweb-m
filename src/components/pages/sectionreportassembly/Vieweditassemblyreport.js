import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import i18n from "i18next";
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { useTranslation, initReactI18next } from "react-i18next";
import download from 'downloadjs';
import Header from '../../component/Header';
import Filter from '../../component/Filter';
import Sidebar from '../../component/Sidebar';
import report from '../../images/report.png'
import right from '../../images/right.png';
import { API_URL } from "../../../config";
import backIcon from "../../images/back.png";



const Vieweditassemblyreport = () => {

    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const [pdfs, setpdfs] = useState([]);
    const sessionid = localStorage.getItem('selectedSession');
    const Clientid = localStorage.getItem('selectedClient');
    const [selectedClient, setSelectedClient] = useState();
    const [selectedSession, setSelectedSession] = useState();
    const [selectedGroup, setselectedGroup] = useState();
    const [selectedHomework, setselectedHomework] = useState();
    const [userType, setUserType] = useState();
    const [PdfReport, setPdfReport] = useState([]);
    const [livessesionNotes, setLivessesionNotes] = useState([]);
    const [livessesionImages, setLivessesionImages] = useState([]);
    const [reportSessionNotes, setReportSessionNotes] = useState([]);
    const [clientName, setClientName] = useState([]);
    const [trainerName, setTrainerName] = useState([]);
    const [sessionDate, setSessionDate] = useState([]);
    const [completeForm, setCompleteForm] = useState([]);
    const pdfUrl = "https://capnolearning.com/webroot/client_forms/";
    const [dataPdf, setDataPdf] = useState([]);
    const [liveImg, setLiveImg] = useState([]);
    const [assemblydata, setAssemblydata] = useState([]);
    const [PdfArrays, setPdfArrays] = useState([]);
    const [livesessectionArray, setLivesessectionArray] = useState([]);
    const [Loader, setLoader] = useState(false)
    const [Loader2, setLoader2] = useState(false)
    const [successModal, setsuccessModal] = useState(false);
    const successToggleModal = () => setsuccessModal(!successModal);
    const [loaderModal, setLoaderModal] = useState(false);
    const loaderToggleModal = () => setLoaderModal(!loaderModal);


    const reportName = useRef();
    const summaryReportDes = useRef();
    const { vid } = useParams();

    useEffect(() => {
        getNames();
        getassemblySetionReport();
        livesessionNotes();
        livesessionImages();
        reportsesionnotes();
        getCompleteforms();
        listAssemblyReportbyid()



    }, []);

    // console.log("mypdf", PdfReport)
    const listAssemblyReportbyid = () => {

        fetch(API_URL + "/assembly/list/by/" + vid,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'

                },
            }
        ).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {

                    setAssemblydata(resp.data[0]);

                    const pdfdatareport = resp.data[0].report_desc;
                    if (pdfdatareport != null) {
                        const pdfArray = JSON.parse(pdfdatareport);
                        setPdfArrays(pdfArray)
                    }

                    const liveSessionreport = resp.data[0].session_image_desc;
                    if (liveSessionreport != null) {
                        const liveSessionreportArra = JSON.parse(liveSessionreport);
                        setLivesessectionArray(liveSessionreportArra)
                    }

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





    // if(pdfArray.length = 0){
    //     for (var index = 0; index < pdfArray.length; index++) {
    //         setPdfArray(pdfArray[index]);
    //      }
    // }




    const handlepdfDescription = index => e => {

        // console.log('index: ' + index);
        // console.log('property name: ' + e.target.value);
        let newArr = [...dataPdf];
        newArr[index] = e.target.value;
        setDataPdf(newArr);
    }

    const handleLiveDescription = index => e => {

        // console.log('index: ' + index);
        // console.log('property name: ' + e.target.value);
        let newArr = [...liveImg];
        newArr[index] = e.target.value;
        setLiveImg(newArr);
    }



    const getNames = () => {

        fetch(API_URL + "/get/names/" + vid,
            {
                method: 'GET',
                headers: {

                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {

                    setClientName(resp.firstname + " " + resp.lastname);
                    setSessionDate(resp.sessionDate);
                    setTrainerName(resp.data[0].firstname + " " + resp.data[0].lastname);



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

    const getassemblySetionReport = () => {

        fetch(API_URL + "/get/assembly/report/" + vid,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'

                },
            }
        ).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {

                    setPdfReport(resp.data);

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

    const livesessionNotes = () => {

        fetch(API_URL + "/get/livenotes/" + vid,
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

                    setLivessesionNotes(resp.data);



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

    const livesessionImages = () => {

        fetch(API_URL + "/get/assembly/liveimages/" + vid,
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
                    setLivessesionImages(resp.data);



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

    const reportsesionnotes = () => {

        fetch(API_URL + "/get/assembly/Sessionnotes/" + vid,
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

                    setReportSessionNotes(resp.data);



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


    const getCompleteforms = () => {

        fetch(API_URL + "/get/assembly/complete/form/" + vid + "/" + Clientid,
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

                    setCompleteForm(resp.data);



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


    const UpdateAssemblyreport = () => {

        let data = {};

        data['name'] = reportName.current.value;
        data['summary'] = summaryReportDes.current.value;
        data['report_desc'] = dataPdf;
        data['session_image_desc'] = liveImg;


        fetch(API_URL + "/update/assembly/report/" + vid, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {
                    // console.log("results", resp);
                    setLoaderModal(false)
                    successToggleModal();
                });
            }
            else {
                console.log("network error")
            }

        })



    }
   


    const downloadpdf = () => {
        setLoader(true)
        fetch(API_URL + "/get/full/screenshort/" + vid + "/" + Clientid,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/pdf"

                },
            }
        ).then(res => res.blob())
            .then(response => {
                //Create a Blob from the PDF Stream
                // console.log(response);
                setLoaderModal(false)
                const file = new Blob([response], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                window.open(fileURL);
                download(fileURL);

            })
    }

    const logout = () => {
        localStorage.clear();
        // alert("You Logout successful")
    }


    return (
        <div>
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">

                    <Sidebar />
                </div>
                <div className="right-section">
                <div className="back-icon-wrp">
                        <Link to="/view/assembly" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>Back</span>
                        </Link>
                    </div>
                    <div className="assembly-box" id="takescreenassembly">
                        <div className="client-names-wrp">
                            <div className="cients-name-content">
                                <p><i class="fa fa-user" aria-hidden="true"></i> <span>Client:</span> {clientName}</p>
                            </div>
                            <div className="cients-name-content">
                                <p><i class="fa fa-user-md" aria-hidden="true"></i> <span>Trainer:</span> {trainerName}</p>
                            </div>
                            <div className="cients-name-content">
                                <p><i class="fa fa-calendar" aria-hidden="true"></i> <span>Date:</span> {sessionDate}</p>
                            </div>
                        </div>
                        <div className="report-input">
                            <label>Name of Report</label>
                            <input placeholder="Name of Report" defaultValue={assemblydata.name} ref={reportName} />
                        </div>
                        <div className="text-areat-report">
                            <label>Summary of Report</label>
                            <textarea ref={summaryReportDes}  defaultValue={assemblydata.summary}  ></textarea>
                        </div>

                        {


                            PdfReport.length > 0 && PdfReport.map((pdfV, index) => {



                                return (
                                    <>
                                        <div className="live-section-img">
                                            <label>PDF Report ({index + 1})</label>
                                            <img src={pdfV.data} />
                                        </div>

                                        <div className="text-areat-report">
                                            <label>PDF Report Description ({index + 1})</label>
                                            <textarea key={index} defaultValue={(PdfArrays[index] ? PdfArrays[index] : "")} onChange={handlepdfDescription(index)}></textarea>

                                        </div>

                                    </>
                                )
                            })

                        }

                        {
                            livessesionNotes.length > 0 && livessesionNotes.map((val, i) => {
                                return (
                                    <div className="report-notes">
                                        <>
                                            <label>Live Session Notes</label>
                                            <p dangerouslySetInnerHTML={{ __html: val.sessiondata ? val.sessiondata : "No live session notes available" }}></p>

                                        </>
                                    </div>
                                )
                            })
                        }

                        {
                            livessesionImages.length > 0 && livessesionImages.map((val, index) => {
                                return (
                                    <>
                                        <div className="live-section-img">
                                            <label>Live Session Image ({index + 1})</label>
                                            <img src={val.sessiondata} />
                                        </div>
                                        <div className="text-areat-report">
                                            <label>Live Session Image Description ({index + 1})</label>
                                            <textarea key={index} defaultValue={(livesessectionArray[index] ? livesessectionArray[index] : "")} onChange={handleLiveDescription(index)}></textarea>

                                        </div>
                                    </>
                                )
                            })

                        }
                        {
                            reportSessionNotes.length > 0 && reportSessionNotes.map((val, i) => {
                                return (
                                    <div className="report-notes">
                                        <>
                                            <label>Report Notes </label>
                                            <p>{val.notes ? val.notes : "No report available"}</p>
                                        </>
                                    </div>
                                )
                            })
                        }


                        {
                            completeForm.length > 0 &&
                            <p className="complete-forms"><b>Completed Forms</b></p>
                        }

                        {
                            completeForm.length > 0 && completeForm.map((val, index) => {

                                return (
                                    <>
                                        <div className="live-section-img">
                                            <label>{val.forms}</label>
                                            <embed src={pdfUrl + val.form} width="100%" height="1000px" />

                                        </div>

                                    </>
                                )
                            })

                        }

                        <div className="assembly-btn-wrp assembly-btn-wrp2">
                            <div className="assembly-btn"><a href="javascript:void" onClick={ ()=> {UpdateAssemblyreport();loaderToggleModal()} } >SAVE REPORT
                              
                            </a></div>
                            <div className="assembly-btn ml-assembly"><a href="javascript:void" action="" onClick={ ()=> {downloadpdf();loaderToggleModal()}}>SAVE & DOWNLOAD PDF
                                
                            </a></div>
                            <div className="assembly-btn ml-assembly"><a href="/view/assembly">GO TO REPORTS LIST</a></div>

                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={successModal} toggle={successToggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={successToggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        <div className="right-circle"><img src={right} /></div>
                        <h4>Saved!</h4>
                        <p>Your Form has been Updated Successfully</p>
                    </div>
                </ModalBody>

            </Modal>

            <Modal isOpen={loaderModal} toggle={loaderToggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={loaderToggleModal}><span className="ml-1 roititle modal-head">Request processing...</span></ModalHeader>
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
        </div>

    )
}

export default Vieweditassemblyreport;