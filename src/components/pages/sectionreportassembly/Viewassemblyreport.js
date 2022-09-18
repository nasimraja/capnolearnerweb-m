import React, { useEffect, useState } from "react";
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { useTranslation, initReactI18next } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
import download from 'downloadjs';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import downloads from '../../images/download.png'
import preveiw from '../../images/preveiw.png'
import { API_URL } from "../../../config";
import edit from '../../images/edit.png'
import Delete from '../../images/delete.png';
import closeicon from '../../images/closeicon.png';
import backIcon from "../../images/back.png";

const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));

const Viewassemblyreport = () => {
    const { t } = useTranslation()
    const accessToken = localStorage.getItem('accessToken');
    const sessionid = localStorage.getItem('selectedSession');
    const [data, setData] = useState([]);
    const Clientid = localStorage.getItem('selectedClient');
    const [itemId, setItemId] = useState(null);
    const [deleteModal, setdeleteModal] = useState(false);
    const deleteToggleModal = () => setdeleteModal(!deleteModal);
    const [downloaderModal, setDownloaderModal] = useState(false);
    const DownloaderToggleModal = () => setDownloaderModal(!downloaderModal);
    const [loaderModal, setLoaderModal] = useState(false);
    const loaderToggleModal = () => setLoaderModal(!loaderModal);
    const classes = useStyles();

    useEffect(() => {
        getassebllyList();


        const interval = setInterval(() => {
            getassebllyList();
        }, 3000);
        return () => clearInterval(interval);

    }, []);


    const getassebllyList = () => {


        fetch(API_URL + "/display/assembly/list/" + sessionid,

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
                    console.warn("result", resp);
                    const clientName = resp.firstname + " " + resp.lastname
                    const sessionDate = resp.sessionDate

                    // console.log(clientName)

                    let _temp = [];
                    // console.log(_temp)
                    resp.data.map((v, i) => {
                        _temp.push({
                            reportTitle: v.name,
                            Client: clientName,
                            Session: sessionDate,
                            dateCreated: new Date(v.created_at * 1000).toLocaleString(),
                            actions: <p>
                                {/* <Tooltip classes={{ */}
                                {/* tooltip: classes.customTooltip,}} title="Preview" placement="top"><a href="#" onClick={() => {viewpdf(v.id); loaderToggleModal()}} className="downloadimg" ><img src={preveiw} /></a></Tooltip> */}
                                <Tooltip classes={{
                                tooltip: classes.customTooltip,}} title="Edit" placement="top"><a href={"/view/edit/assemblyreport/" + v.id} className="downloadimg" ><img src={edit} /></a></Tooltip>
                                 <Tooltip classes={{
                                tooltip: classes.customTooltip,}} title="Download" placement="top"><a   onClick={() => {downloadpdf(v.id); loaderToggleModal()}} className="downloadimg"><img src={downloads} /></a></Tooltip>
                                 <Tooltip classes={{
                                tooltip: classes.customTooltip,}} title="Delete" placement="top"><a className="downloadimg" onClick={() => openItemPopUp(v.id)} ><img src={Delete} /></a></Tooltip>
                                 </p>

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





    const downloadpdf = (id) => {

        fetch(API_URL + "/get/full/screenshort/" + id + "/" + Clientid,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/pdf"

                },
            }
        ).then(res => res.blob())
        
            .then(res => {
                //Create a Blob from the PDF Stream
                
                const file = new Blob([res], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                download(fileURL);
                setLoaderModal(false)

            })
           
           
    }

    const viewpdf = (id) => {

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
                setLoaderModal(false)


            })
    }


    const openItemPopUp = (id) => {
        setItemId(id);
        setdeleteModal(!deleteModal)
    }

    const deleteClient = () => {
        let id = itemId;
        fetch(API_URL + "/delete/assembly/list/" + id,
            {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                getassebllyList();
                setdeleteModal(!deleteModal)
                window.location.reload()

            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }



        })

    }

    const columns = [
        {
            title: <span>{t("Client")}</span>, field: "Client"
        },
        {
            title: <span className="text-right">{t("Session")}</span>, field: "Session"
        },
        {
            title: <span className="text-right">{t("Report-Title")}</span>, field: "reportTitle"
        },
        // {
        //     title: <span className="text-right">{t("Date-Created")}</span>, field: "dateCreated"
        // },
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
                    <div className="head-demoreport">
                        <h3>{t("Session-Assembly-Reports")}</h3>
                        <div className="back-icon-wrp">
                        <Link to="/section/report/assembly" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>Back</span>
                        </Link>
                    </div>
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

            <Modal isOpen={deleteModal} toggle={deleteToggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={deleteToggleModal}><span className="ml-1 roititle font-weight-bold">Delete</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        <div className="right-circle cancel-circle"><img src={closeicon} /></div>
                        <h4>Are You Sure?</h4>
                        <p>Do you really wish to delete this Session Assembly Report?</p>
                        <div className="wrp-delete-btn">
                            <div className="cancel-btn1" ><a onClick={deleteToggleModal}>Cancel</a></div>
                            <div className="delete-btn1"><a onClick={deleteClient}>Delete</a></div>
                        </div>
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

export default Viewassemblyreport;