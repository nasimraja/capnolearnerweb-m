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



const Editassemblyreport = () => {

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
    const [completetForm, setCompletetForm] = useState([]);
    
    const pdfUrl = "https://capnolearning.com/webroot/client_forms/";
    const tpdfUrl = "https://capnolearning.com/webroot/practioner_forms/";
    
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

    const [pdfindex, setPdfindex] = useState()
    const [togglepdf, setTogglepdf] = useState(false)
    const [liveimgindex, setLiveimgindex] = useState()
    const [toggleliveimgdes, setToggleliveimgdes] = useState(false)

    


    const handleTogglepdf = (index)=>{

        setPdfindex(index)
        setTogglepdf(!togglepdf)
       
      
    }

    const handleToggleliveimgdesc = (index)=>{

        setLiveimgindex(index)
        setToggleliveimgdes(!toggleliveimgdes)
      
    }

   

    const reportName = useRef();
    const summaryReportDes = useRef();
    const { id } = useParams();

    useEffect(() => {
        getNames();
        getassemblySetionReport();
        livesessionNotes();
        livesessionImages();
        reportsesionnotes();
        getCompleteforms();
        getCompletetforms();
        listAssemblyReportbyid()



    }, []);

    // console.log("mypdf", PdfReport)
    const listAssemblyReportbyid = () => {

        fetch(API_URL + "/assembly/list/by/" + id,
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

        fetch(API_URL + "/get/names/" + id,
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

        fetch(API_URL + "/get/assembly/report/" + id,
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

        fetch(API_URL + "/get/livenotes/" + id,
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

        fetch(API_URL + "/get/assembly/liveimages/" + id,
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

        fetch(API_URL + "/get/assembly/Sessionnotes/" + id,
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

    

    const getCompletetforms = () => {

        fetch(API_URL + "/get/assembly/complete/tform/" + id + "/" + Clientid,
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

                    setCompletetForm(resp.data);



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

        fetch(API_URL + "/get/assembly/complete/form/" + id + "/" + Clientid,
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
        if(reportName.current.value == "" || reportName.current.value == null){
            alert("Please enter a report name if you wish to save it.");
            return false;
        }
        else{
            loaderToggleModal()
        data['name'] = reportName.current.value;
        data['summary'] = summaryReportDes.current.value;
        data['report_desc'] = dataPdf;
        data['session_image_desc'] = liveImg;


        fetch(API_URL + "/update/assembly/report/" + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {
                    // console.log("results", resp);
                    setLoaderModal(false);
                    successToggleModal();
                });
            }
            else {
                console.log("network error")
            }

        })

   
    }

    }
    const saveAssemblyFullscreenshort = () => {


        html2canvas(document.getElementById("takescreenassembly")).then(function (canvas) {

            let dataimg = canvas.toDataURL('image/png')

            const doc = new jsPDF();

            doc.addImage(dataimg, 10, 15, 200, 115);

            doc.save("a4.pdf");


            let data = {};

            data['report_img'] = dataimg;

            fetch(API_URL + "/save/assembly/fullscreenshort/" + id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then((result) => {
                result.json().then((resp) => {


                })
            })


        });


    }


    const downloadpdf = () => {
   
        fetch(API_URL + "/get/full/screenshort/" + id + "/" + Clientid,
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
              
                const file = new Blob([response], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                window.open(fileURL);
                download(fileURL);
                setLoaderModal(false)

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
                
                        <Link to="/assemblyreport" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>Back</span>
                        </Link>
                    </div>
                    <div className="assembly-box" id="takescreenassembly">
                        <div className="client-names-wrp">
                            <div className="cients-name-content">
                                <p><i class="fa fa-user" aria-hidden="true"></i> <span>{t("Client")}:</span> {clientName}</p>
                            </div>
                            <div className="cients-name-content">
                                <p><i class="fa fa-user-md" aria-hidden="true"></i> <span>{t("trainer")}:</span> {trainerName}</p>
                            </div>
                            <div className="cients-name-content">
                                <p><i class="fa fa-calendar" aria-hidden="true"></i> <span>{t("Date")}:</span> {sessionDate}</p>
                            </div>
                        </div>
                        <div className="report-input bold-label">
                            <label>*{t("Name-of-Assembly-Report")}</label>
                            <input placeholder="Name of Assembly Report" defaultValue={assemblydata.name} ref={reportName} />
                        </div>
                        <div className="text-areat-report bold-label">
                            <label>{t("Summary-of-Assembly-Report")}</label>
                            <textarea ref={summaryReportDes}  defaultValue={assemblydata.summary} placeholder="Write Summary of Assembly Report" ></textarea>
                        </div>

                        {


                            PdfReport.length > 0 && PdfReport.map((pdfV, index) => {



                                return (
                                    <>
                                        <div className="live-section-img underline-label">
                                            <label>PDF DATA REPORT ({index + 1})</label>
                                            <img src={pdfV.data} />
                                        </div>

                                        <div className="text-areat-report not-underline-label">
                                            <label>Click here to enter a description of the above image. <a href="javascript:void(0)" onClick={() => handleTogglepdf(index + 1)} className="plus-icon"> {pdfindex == index +1 && togglepdf?<i class="fa fa-minus-circle" aria-hidden="true"></i>: <i class="fa fa-plus-circle" aria-hidden="true" ></i>}</a></label>
                                            {
                                                pdfindex == index +1 && togglepdf &&  <textarea placeholder="Write PDF Report Description" key={index} defaultValue={(PdfArrays[index] ? PdfArrays[index] : "")} onChange={handlepdfDescription(index)}></textarea>
                                               
                                            }

                                        </div>

                                    </>
                                )
                            })

                        }

                        {
                            livessesionNotes.length > 0  &&
                            
                                    <div className="report-notes underline-label">
                                        <>
                                            <label>{t("Live-Session-Notes")}</label>
                                            <p dangerouslySetInnerHTML={{ __html: livessesionNotes[livessesionNotes.length - 1].sessiondata ? livessesionNotes[livessesionNotes.length - 1].sessiondata : "No live session notes available" }}></p>

                                        </>
                                    </div>
                              
                        }

                        {
                            livessesionImages.length > 0 && livessesionImages.map((val, index) => {
                                return (
                                    <>
                                        <div className="live-section-img underline-label">
                                            <label>LIVE SESSION IMAGE ({index + 1})</label>
                                            <img src={val.sessiondata} />
                                        </div>
                                        <div className="text-areat-report not-underline-label">
                                            <label>Click here to enter a description of the above image. <a href="javascript:void(0)" onClick={() => handleToggleliveimgdesc(index + 1)} className="plus-icon">{liveimgindex == index +1 && toggleliveimgdes?<i class="fa fa-minus-circle" aria-hidden="true"></i>: <i class="fa fa-plus-circle" aria-hidden="true" ></i>}</a></label>

                                            {
                                                liveimgindex == index +1 && toggleliveimgdes && <textarea placeholder="Write Live Session Image Description" key={index} defaultValue={(livesessectionArray[index] ? livesessectionArray[index] : "")} onChange={handleLiveDescription(index)}></textarea>
                                                
                                            }

                                        </div>
                                    </>
                                )
                            })

                        }
                        {
                            reportSessionNotes.length > 0 && reportSessionNotes.map((val, i) => {
                                return (
                                    <div className="report-notes underline-label">
                                        <>
                                            <label>{t("Report-Notes")}</label>
                                            <p>{val.notes ? val.notes : "No report available"}</p>
                                        </>
                                    </div>
                                )
                            })
                        }


                        {
                            (completeForm.length > 0 || completetForm.length > 0) &&
                            <p className="complete-forms"><b><u>{t("Completed-Forms")}</u></b></p>
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

{
                            completetForm.length > 0 && completetForm.map((val, index) => {

                                return (
                                    <>
                                        <div className="live-section-img">
                                            <label>{val.forms}</label>
                                            <embed src={tpdfUrl + val.form} width="100%" height="1000px" />

                                        </div>

                                    </>
                                )
                            })

                        }

                        <div className="assembly-btn-wrp assembly-btn-wrp2">
                            <div className="assembly-btn"><a href="javascript:void" onClick={()=>{UpdateAssemblyreport(); }} >SAVE REPORT
                                {
                                    Loader2 &&
                                    <div id="loader"></div>
                                }
                            </a></div>
                            <div className="assembly-btn ml-assembly"><a href="javascript:void" action="" onClick={()=>{downloadpdf(); loaderToggleModal()}}>DOWNLOAD PDF
        
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
                        <p>Your Session Assembly Report has been Updated Successfully</p>
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

export default Editassemblyreport;