import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { Link, useParams, Router } from 'react-router-dom';
import { useTranslation, initReactI18next } from "react-i18next";
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { API_URL } from '../../../config';
import backIcon from "../../../components/images/back.png";

const Createmultisession = () => {
    const clientId = localStorage.getItem('selectedClient');
    const homework = localStorage.getItem('selectedHomework');
    const accessToken = localStorage.getItem('accessToken');
    const [session, setSession] = useState([]);
    const [signals, setSignals] = useState([]);
    const [selectedSignals, setSelectedSignals] = useState([]);
    const { t } = useTranslation();
    // const selectedSignals = useRef() ; 
    const [selectedSessions, setSelectedSessions] = useState([]);
    // const selectedSessions =  useRef();
    const [requestProcessingModal, setrequestProcessingModal] = useState(false);
    const requestProcessingModalToggle = () => setrequestProcessingModal(!requestProcessingModal);
    const [requestProcessedModal, setrequestProcesedModal] = useState(false);
    const requestProcessedModalToggle = () => setrequestProcesedModal(!requestProcessedModal);


 
    useEffect(() => {
        getSession();
        getSignals(); 
    },[])

    
    const getSignals = () => {
        let url = API_URL+"/configured/signals";
        fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }

        ).then((response) => {
            if (response.status == 200) {
                response.json().then((result) => {
                    // // console.log(result.sesstion)
                    if (result.status) {
                        setSignals(result.signals)
                        // // console.log(setsesstion)
                    }


                    else {
                        alert("no data error")
                    }

                })
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        }).catch(err => {
            // // console.log(err)

        })
    }
 
const logout = () => {
    localStorage.clear();
    window.location.reload();
} 

    const getSession = () => {
        let _hw = 0;
        // console.log("homework",homework)
        if (homework === "true") {
            _hw = 1;
        }
         
        let url = API_URL+"/sessions?cid=" + clientId + "&hw=" + _hw;


        fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }

        ).then((response) => {
            if (response.status == 200) {
                response.json().then((result) => {
                    // // console.log(result.sesstion)
                    if (result.status) {
                        setSession(result.sessions)
                        // // console.log(setsesstion)
                    }


                    else {
                        alert("no data error")
                    }

                })
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        }).catch(err => {
            // // console.log(err)

        })
    }

    const createMultiSession = () => {
       setrequestProcessingModal(true);
        let data = {
            signals: selectedSignals,
            session: selectedSessions
        };
        fetch(API_URL+"/create/multi/session",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
                body: JSON.stringify(data)
            }

        ).then((response) => {
       setrequestProcessingModal(false);

            if (response.status == 200) {

                response.json().then((result) => {
      
              
                    if (result.status) {
                        setrequestProcesedModal(true)
                        window.location.replace("/view/multi/report/"+result.rid)
                    }


                    else {
                        alert("no data error")
                    }

                })
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        }).catch(err => {
            

        })
    }

    const handleSignalChange = (e) => {
        let _temp = selectedSignals ;
        if(e.target.checked){
            if(_temp.length == 3){
                alert("You can choose maximum 3 signals");
                return false;
            }
            else{
                if(!_temp.includes(e.target.value)){
                    _temp.push(e.target.value)
                }
            }
           
        } 
        else{
            if(_temp.includes(e.target.value)){
                let _index = _temp.indexOf(e.target.value);
                 _temp.splice(_index,1);

            }
        }
        setSelectedSignals(_temp);
    }

    const handleSessionChange = (e) => {
        let _temp = selectedSessions ;
        if(e.target.checked){
            if(!_temp.includes(e.target.value)){
                _temp.push(e.target.value)
            }
        } 
        else{
            if(_temp.includes(e.target.value)){
                let _index = _temp.indexOf(e.target.value);
                 _temp.splice(_index,1);

            }
        }
        setSelectedSessions(_temp);
    }

    return (
        <div className="demodata-bg">
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                    <div className="back-icon-wrp">
                        <Link to="/" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>{t("Back")}</span>
                        </Link>
                    </div>
                    <div className="choose-signals">
                        <p>{t("Choose-Signals")}</p>
                    </div>
                    <ul className="signals-list">
                        <li>
                            <div className="wrp-signal-content">
                                {
                                    signals.length > 0 && signals.map((v,i) => {
                                        return (
                                            <div className="signal-c-child">
                                            <div class="custom-radios">
                                                <input type="checkbox"  onChange={handleSignalChange} id={v.signal_code}   value={v.signal_code} />
                                                <label for={v.signal_code}>
                                                    <span className="redious">
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="caption-signal">
                                                <p dangerouslySetInnerHTML={{__html: v.signal_name}}></p>
                                            </div>
                                        </div>
                                        )
                                    })
                                }
                             
                              
                                
                            </div>
                        </li>
                    </ul>
                    <div className="choose-signals mrt-sessions">
                        <p>{t("Choose-Sessions")}</p>
                    </div>
                    <ul className="signals-list">
                        <li>
                            <div className="row">

                                {
                                    session.length > 0 &&  session.map((v,i) => {
                                        return (
                                            <div className="col-md-3 custom-flexs">
                                            <div class="custom-radios">
                                                <input type="checkbox" onChange={handleSessionChange} id={v.id} value={v.id}  />
                                                <label for={v.id} >
                                                    <span className="redious">
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="caption-signal">
                                                <p dangerouslySetInnerHTML={{__html: v.name }}></p>
                                            </div>
                                        </div>
                                        )
                                    })
                                }
                                 
                                
                            </div>
                        </li>
                    </ul>
                    {
                        session.length > 0 &&
                    <div className='d-flex justify-content-around mt-3'>
                            {/* <button className='lightbtn w-100'   >Cancel</button> */}
                            <button className='darktbtn w-100 ml-1'  onClick={createMultiSession}   >{t("Create")}</button>
                        </div>
                    }

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

export default Createmultisession;