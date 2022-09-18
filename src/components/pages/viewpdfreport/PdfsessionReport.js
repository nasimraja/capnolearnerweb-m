import React, { useEffect, useState } from "react";
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { useTranslation, initReactI18next } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import download from '../../images/download.png'
import preveiw from '../../images/preveiw.png'
import { API_URL } from "../../../config";
import backIcon from "../../../components/images/back.png";
import { jsPDF } from "jspdf";

const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));

const PdfsessionReport = () => {
    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const [pdfs, setpdfs] = useState([]);
    const [data, setData] = useState([]);
    const sessionid = localStorage.getItem('selectedSession');
    const Clientid = localStorage.getItem('selectedClient');
    const [loaderModal, setLoaderModal] = useState(false);
    const loaderToggleModal = () => setLoaderModal(!loaderModal);



    const { pdftype } = useParams();
    const classes = useStyles();




    useEffect(() => {


        if (pdftype == "multi") {
            Multisession()
        }
        else {
            Singlesession();
        }


    }, []);





    const pdfdata = (sid) => {



        fetch(API_URL + "/pdf/list/" + sid,
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
                   
                    let _clientName = resp.firstname + " " + resp.lastname;
                    let _trainerName = resp.data[0].firstname + " " + resp.data[0].lastname;
                    let _pdfname = resp.pdfname;
                    let _sessionDate = resp.sessionDate;
                    downloadpdf(_clientName, _trainerName, resp.result, _pdfname, _sessionDate)
                    setLoaderModal(false);
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


    const downloadpdf = (_clientName, _trainerName, _image, _pdfname, _sessionDate) => {

        const doc = new jsPDF();

        doc.setTextColor(0, 0, 0);
        doc.text('Capnolearning Report', 10, 10,
            { styles: { fontSize: 20, fontWeight: 'bold' } })
        doc.setDrawColor(0, 0, 0);
        doc.line(10, 15, 600, 15);
        doc.setFontSize(10)

        doc.text(_sessionDate, 35, 25)
        doc.text(_clientName, 23, 30);
        doc.text(_trainerName, 25, 35);
        doc.setFont(undefined, 'bold');
        doc.text("Session Date:", 10, 25)
        doc.text("Client:", 10, 30);
        doc.text("Trainer:", 10, 35);
        // doc.setFont(undefined, 'bold')
        doc.addImage(_image, 5, 45, 200, 110);
        doc.save(_pdfname + ".pdf");
    }


    const Viewpdfdata = (sid) => {

        

        fetch(API_URL + "/pdf/list/" + sid,
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
                    setLoaderModal(false)
                    let _clientName = resp.firstname + " " + resp.lastname;
                    let _trainerName = resp.data[0].firstname + " " + resp.data[0].lastname;
                    let _pdfname = resp.pdfname;
                    let _sessionDate = resp.sessionDate;
                    Viewpdf(_clientName, _trainerName, resp.result, _pdfname, _sessionDate)

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

    const Viewpdf = (_clientName, _trainerName, _image, _pdfname, _sessionDate) => {

        const doc = new jsPDF();

        doc.setTextColor(0, 0, 0);
        doc.text('Capnolearning Report', 10, 10,
            { styles: { fontSize: 20, fontWeight: 'bold' } })
        doc.setDrawColor(0, 0, 0);
        doc.line(10, 15, 600, 15);
        doc.setFontSize(10)

        doc.text(_sessionDate, 35, 25)
        doc.text(_clientName, 23, 30);
        doc.text(_trainerName, 25, 35);
        doc.setFont(undefined, 'bold');
        doc.text("Session Date:", 10, 25)
        doc.text("Client:", 10, 30);
        doc.text("Trainer:", 10, 35);
        // doc.setFont(undefined, 'bold')
        doc.addImage(_image, 5, 45, 200, 110);
        // doc.output('dataurlnewwindow');
        window.open(doc.output('bloburl'))

    }


    const Singlesession = () => {


        fetch(API_URL + "/report/single/pdf?session_id=" + sessionid,
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
                    let _temp = [];
                    resp.pdfs.map((v, i) => {

                        _temp.push({
                            report: v.pdf_name,
                            Createdate: new Date(v.added_on).toLocaleString(),
                            actions: <p><Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="View" placement="top"><a href="javascript:void" onClick={() => {Viewpdfdata(v.id); loaderToggleModal()}} className="downloadimg tooltip2" ><img src={preveiw} /></a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Download" placement="top"><a href='javascript:void' onClick={() => {pdfdata(v.id); loaderToggleModal()}} className="downloadimg"><img src={download} /></a></Tooltip></p>
                        })
                    })
                    setData(_temp);

                    // let len = pdfs.length;
                    //   console.warn(len);


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

    const Multisession = () => {
        fetch(API_URL + "/report/multiple/pdf?client_id=" + Clientid,
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
                    let _temp = [];
                    resp.pdfs.map((v, i) => {
                        _temp.push({
                            report: v.name,
                            Createdate: new Date(v.added_on).toLocaleString(),
                            actions: <p><a href='#' className="downloadimg"><img src={preveiw} /></a></p>
                        })
                    })
                    setData(_temp);

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

    const columns = [
        {
            title: t("Report-Name"), field: "report"
        },
        {
            title: <span className="text-right">{t("Created-Date-Time")}</span>, field: "Createdate",align: "center"
        },
        {
            title: <span className="text-right">{t("Actions")}</span>, field: "actions",align: "right"
        }
    ]


    return (
        <div className="">
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                <div className="back-icon-wrp">
                        <Link to="/view/pdf/report" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>Back</span>
                        </Link>
                    </div>
                    <div className="head-demoreport">
                        <h3>{t("Session-Data-Reports")}</h3>

                        {/* <p>{pdftype == "multi" ? t("Multi") : pdftype == "single" ? t("Single") : pdftype == "group" ? t("group") : pdftype == "homework" ? t("homework") : null} Pdf {t("Sesseion-Report")}</p> */}
                    </div>
                    <div className="wrp-bankform">
                        <div style={{ maxWidth: '100%' }}>
                            <MaterialTable
                                columns={columns}
                                data={data}
                                title=""
                                options={{
                                    pageSize: 15,

                                    pageSizeOptions:[5,10,15,20]
                                }}
                            />

                        </div>
                    </div>
                </div>
            </div>
            
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

export default PdfsessionReport;