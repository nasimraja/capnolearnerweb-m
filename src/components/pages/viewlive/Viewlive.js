import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import i18n from "i18next";
import { jsPDF } from "jspdf";
import download from 'downloadjs';
import { useTranslation, initReactI18next } from "react-i18next";
import { API_URL } from "../../../config";
import Header from '../../component/Header';
import Filter from '../../component/Filter';
import Sidebar from '../../component/Sidebar';
import right from '../../images/right.png';
import videoicon from '../../images/videoicon.png'


const Viewlive = () => {



    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const sessionid = localStorage.getItem('selectedSession');
    const [sessions, setsessions] = useState([]);
    const [session, setsession] = useState([]);
    const [selectedSession, setSelectedSession] = useState();
    const [downloaderModal, setDownloaderModal] = useState(false);
    const DownloaderToggleModal = () => setDownloaderModal(!downloaderModal);
    const [openModal, setOpenModal] = useState(false);
    const openToggleModal = () => setOpenModal(!openModal);
    const [fillallfieldmodal, setFillallfieldModal] = useState(false);
    const fillallfieldtoggleModal = () => setFillallfieldModal(!fillallfieldmodal);
    const zoomlink = useRef();
    const zoomlinkupdate = useRef();

    const [zoomlinkcontentmodal, setZoomlinkcontentmodal] = useState(false);
    const zoomlinkcontenttoggleModal = () => setZoomlinkcontentmodal(!zoomlinkcontentmodal);

    const [zoomlinkupdatecontentmodal, setZoomlinkupdatecontentmodal] = useState(false);
    const zoomlinkupdatecontenttoggleModal = () => setZoomlinkupdatecontentmodal(!zoomlinkupdatecontentmodal);

    const [addzoomlinkmodal, setAddzoomlinkmodal] = useState(false);
    const addzoomlinktoggleModal = () => setAddzoomlinkmodal(!addzoomlinkmodal);

    const [updatezoomlinkmodal, setUpdatezoomlinkmodal] = useState(false);
    const updatezoomlinktoggleModal = () => setUpdatezoomlinkmodal(!updatezoomlinkmodal);

    const [zoomdata, setZoomdata] = useState([])
    const [zoomlinks, setZoomlinks] = useState([])


    useEffect(() => {

        setInterval(() => {
            setSelectedSession(localStorage.getItem('selectedSession'));

        }, 100);

    }, []);

    useEffect(() => {
        if(selectedSession){
            livesessionNote();
            livesessionImage();
            zoomRecording();
            
            getZoomLinkbyid();
        }
   

    }, [selectedSession])


    const livesessionNote = () => {


        fetch(API_URL + "/session/data/type?type=3&session_id=" + sessionid,
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
                    setsessions(resp.sessions);
                    // let len = setsessions.length;
                    //   console.warn(len);


                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                alert("network error")
            }


        })
    }

    const livesessionImage = () => {


        fetch(API_URL + "/session/data/type?type=4&session_id=" + sessionid,
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
                    setsessions(resp.sessions);
                    // let len = setsessions.length;
                    //   console.warn(len);


                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                alert("network error")
            }


        })
    }
    const zoomRecording = () => {


        fetch(API_URL + "/session/info?session_id=" + sessionid,
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
                    // console.log("result", resp);
                    if (resp.session.length > 0) {
                        setsession(resp.session[0].link);

                    }
                    // let len = session.length;
                    //   console.warn(len);


                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                alert("network error")
            }


        })
    }

    const downloadlivesessionImage = () => {
        let dataType = 3;
        fetch(API_URL + "/get/live/sessionimage/download/" + sessionid + "/" + dataType,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/pdf"

                },
            }
        ).then(res => res.blob())
            .then(response => {
                //Create a Blob from the PDF Stream

                const file = new Blob([response], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                // window.open(fileURL);
                download(fileURL);
                setDownloaderModal(false);

            })
    }


    const ViewlivesessionImage = () => {
        let dataType = 3;
        fetch(API_URL + "/get/live/sessionimage/download/" + sessionid + "/" + dataType,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"

                },
            }
        ).then(res => res.blob())
            .then(response => {
                //Create a Blob from the PDF Stream

                const file = new Blob([response], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                // Open the URL on new Window
                window.open(fileURL);
                // download(fileURL);

                setOpenModal(false);

            })
    }




    const downloadlivesessionnotes = () => {

        let dataType = 4;

        fetch(API_URL + "/get/live/sessionimage/" + sessionid + "/" + dataType,
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
                    let _sessionDate = resp.sessionDate;
                    let _pdfname = resp.pdfname;
                    downloadlivenote(_clientName, _trainerName, resp.dataimg, _sessionDate)
                    setDownloaderModal(false);
                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                alert("network error")
            }


        })


    }

    const downloadlivenote = (_clientName, _trainerName, _notes, _sessionDate) => {
        let _notesB = _notes.length > 0 ? _notes[_notes.length - 1].sessiondata : "No note found" ; 

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
        doc.setFont(undefined, 'normal');
 
        if(_notes.length > 0){
            _notesB = _notes[_notes.length - 1].sessiondata.split("<br>");
            _notesB.map((v,i) => {
                doc.text(v, 10, 52+(i*1));

            })

        }
        else{
            doc.text("No note found", 10, 52);

        }
        doc.setFontSize(13)
        doc.text('Live Session Notes', 10, 45, { styles: { fontSize: 13, fontWeight: 'bold' } })
        doc.line(10, 47, 55, 47);
        doc.save(_sessionDate + ".pdf");
    }


    const Viewlivesessionnotes = () => {

        let dataType = 4;

        fetch(API_URL + "/get/live/sessionimage/" + sessionid + "/" + dataType,
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
                    setOpenModal(false);
                    let _clientName = resp.firstname + " " + resp.lastname;
                    let _trainerName = resp.data[0].firstname + " " + resp.data[0].lastname;
                    let _sessionDate = resp.sessionDate;
                    let _pdfname = resp.pdfname;
                    Viewlivenote(_clientName, _trainerName, resp.dataimg, _sessionDate)

                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                alert("network error")
            }


        })


    }

    const Viewlivenote = (_clientName, _trainerName, _notes, _sessionDate) => {
        let _notesB = _notes.length > 0 ? _notes[_notes.length - 1].sessiondata : "No note found" ; 
       
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
        doc.setFont(undefined, 'normal');
        if(_notes.length > 0){
            _notesB = _notes[_notes.length - 1].sessiondata.split("<br>");
            _notesB.map((v,i) => {
                doc.text(v, 10, 52+(i*1));

            })

        }
        else{
            doc.text("No note found", 10, 52);

        }
        doc.setFontSize(13)
        doc.text('Live Session Notes', 10, 45, { styles: { fontSize: 13, fontWeight: 'bold' } })
        doc.line(10, 47, 55, 47);
        window.open(doc.output('bloburl'))
    }


    function saveZoomLink() {
        // setLoader(true)
        let data = {};

        data['zoom_link'] = zoomlink.current.value;


        if (zoomlink.current.value == "") {
            fillallfieldtoggleModal();

            return false;
        }
        // console.log(data);
        fetch(API_URL + "/session/zoom/link/" + selectedSession, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken
            },
            body: JSON.stringify(data)
        }).then((response) => {


            if (response.status == 200) {
                response.json().then((resp) => {
                    addzoomlinktoggleModal()
                    zoomlinkcontenttoggleModal()
                    getZoomLinkbyid()
                    setOpenModal(false);
                    

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


    function updatezoomlink() {
        // setLoader(true)
        let data = {};

        data['zoom_link'] = zoomlinkupdate.current.value;


        if (zoomlinkupdate.current.value == "") {
            fillallfieldtoggleModal();

            return false;
        }
        // console.log(data);
        fetch(API_URL + "/session/zoom/link/" + selectedSession, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken
            },
            body: JSON.stringify(data)
        }).then((response) => {


            if (response.status == 200) {
                response.json().then((resp) => {
                    // // console.log("result", resp);
                    // successToggleModal();
                    updatezoomlinktoggleModal();
                    zoomlinkupdatecontenttoggleModal();
                    updatezoomlinktoggleModal();
                    getZoomLinkbyid();
                    setOpenModal(false);

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

    const getZoomLinkbyid = () => {
        fetch(API_URL + "/get/zoom/link/by/" + selectedSession,
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
                    // console.log("result", resp);

                    setZoomdata(resp.data)
                    setZoomlinks(resp.data[0])
                   

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
                    <Filter />

                    <div className="create-section">
                        <ul className="create-list">
                            <li>
                                <div className="create-list-box"><a href="javascript:void" className={(sessions.length == 0 || selectedSession === "" ||selectedSession === "null") ? "deactivate" : ""} onClick={() => { Viewlivesessionnotes(); openToggleModal() }}>{t('View-Live-Session-Notes')}</a></div>
                            </li>
                            <li>
                                <div className="create-list-box"><a href="#javascript:void" className={(sessions.length == 0 || selectedSession === "" ||selectedSession === "null") ? "deactivate" : ""} onClick={() => { downloadlivesessionnotes(); DownloaderToggleModal() }}>{t('Download-Live-Session-Notes')}</a></div>
                            </li>
                            <li>
                                <div className="create-list-box"><a href="javascript:void" className={(sessions.length == 0 || selectedSession === "" ||selectedSession === "null") ? "deactivate" : ""} onClick={() => { ViewlivesessionImage(); openToggleModal() }}>{t('View-Live-Session-Images')}</a></div>
                            </li>
                            <li>
                                <div className="create-list-box"><a href="javascript:void" className={(sessions.length == 0 || selectedSession === "" ||selectedSession === "null") ? "deactivate" : ""} onClick={() => { downloadlivesessionImage(); DownloaderToggleModal() }}>{t('Download-Live-Session-Images')}</a></div>
                            </li>
                            <li>
                                <div className="create-list-box" >
                                    <a href="javascript:void" className={(selectedSession === "" ||selectedSession === "null") ? "deactivate" : ""}>
                                        {/* {session} */}
                                        {
                                            (zoomdata.length > 0) ?
                                                <a href="javascript:void" data-toggle="modal" onClick={zoomlinkupdatecontenttoggleModal}  >{t('View/Link-Zoom-Recordings')}</a>
                                                :
                                                <a href="javascript:void" data-toggle="modal" onClick={zoomlinkcontenttoggleModal}  >{t('View/Link-Zoom-Recordings')}</a>


                                        }
                                    </a>
                                </div>
                            </li>
                        </ul>
                        <Modal isOpen={zoomlinkupdatecontentmodal} toggle={zoomlinkupdatecontenttoggleModal} className="connect-box" centered={true}>

                           
                                
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">{t("Session-Zoom-Recording")}</h5>
                                        {session}
                                        <button type="button" class="close" onClick={zoomlinkupdatecontenttoggleModal} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="addlink-input">
                                        <a href={zoomlinks ? zoomlinks.zoom_link : ""} target="_blank" className="openvideo">
                                            <img src={videoicon} />
                                            <a href={zoomlinks ? zoomlinks.zoom_link : ""} target="_blank">Open Video</a>
                                        </a>
                                        <input placeholder="Update link here" defaultValue={zoomlinks ? zoomlinks.zoom_link : ""} ref={zoomlinkupdate} />
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="close-btn" onClick={zoomlinkupdatecontenttoggleModal}>{t("Close")}</button>
                                        <button type="button" class="close-btn" onClick={ ()=>{updatezoomlink(); openToggleModal()}} >Update Link</button>
                                    </div>
                                
                          

                        </Modal>

                        <Modal isOpen={zoomlinkcontentmodal} toggle={zoomlinkcontenttoggleModal} className="connect-box" centered={true}>

                           
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">{t("Session-Zoom-Recording")}</h5>
                                        <button type="button" class="close" onClick={zoomlinkcontenttoggleModal} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="addlink-input">
                                        <input placeholder="Add link here" ref={zoomlink} />
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="close-btn" onClick={zoomlinkcontenttoggleModal}>{t("Close")}</button>
                                        <button type="button" class="close-btn" onClick={ ()=>{saveZoomLink(); openToggleModal()}}>{t("Add-link")}</button>
                                    </div>
                                

                        </Modal>
                    </div>
                </div>
            </div>

            <Modal isOpen={downloaderModal} toggle={DownloaderToggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={DownloaderToggleModal}><span className="ml-1 roititle modal-head">Request processing...</span></ModalHeader>
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
            <Modal isOpen={openModal} toggle={openToggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={openToggleModal}><span className="ml-1 roititle modal-head">Request processing...</span></ModalHeader>
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

            <Modal isOpen={fillallfieldmodal} toggle={fillallfieldtoggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={fillallfieldtoggleModal}><span className="ml-1 roititle font-weight-bold">Error</span></ModalHeader>
                <ModalBody>
                    <div className="modal-error-p">
                        <p>Please fill field</p>
                    </div>
                </ModalBody>

            </Modal>

            <Modal isOpen={addzoomlinkmodal} toggle={addzoomlinktoggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={addzoomlinktoggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        <div className="right-circle"><img src={right} /></div>
                        <h4>Saved!</h4>
                        <p>Zoom Link has been added successfully</p>
                    </div>
                </ModalBody>

            </Modal>
            <Modal isOpen={updatezoomlinkmodal} toggle={updatezoomlinktoggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={updatezoomlinktoggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        <div className="right-circle"><img src={right} /></div>
                        <h4>Saved!</h4>
                        <p>Zoom Link has been updated successfully</p>
                    </div>
                </ModalBody>

            </Modal>
        </div>
    )
}

export default Viewlive;