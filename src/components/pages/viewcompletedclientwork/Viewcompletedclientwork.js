import React, { Component, useEffect, useRef, useState } from "react";
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import download from '../../images/download.png'
import preveiw from '../../images/preveiw.png'
import Delete from '../../images/delete.png';
import closeicon from '../../images/closeicon.png';
import { API_URL, SERVER_URL } from "../../../config";
import backIcon from "../../images/back.png";
import { useTranslation } from "react-i18next";
import md5 from "md5";

const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));

const Viewcompletedclientwork = () => { 
    const Sessionid = localStorage.getItem('selectedSession');
    const [data, setdata] = useState([]);
    const [itemId, setItemId] = useState(null);
    const [deleteModal, setdeleteModal] = useState(false);
    const deleteToggleModal = () => setdeleteModal(!deleteModal);
    const { t } = useTranslation();
    const [selectedSession,setSelectedSession] = useState(localStorage.getItem('selectedSession'));
    
    const classes = useStyles();

    const [ogdata, setOgdata] = useState([]);

    const [clients, setinclients] = useState([]);
    const [trainers, settrainers] = useState([]);
    const [sesstion, setsesstion] = useState([]);
    const [blankform, setblankform] = useState([]);
    const trainerActive = useRef()
    const formFile = useRef()
    const clientSelected = useRef()
    const trainerInactive = useRef()
    const clientActive = useRef()
    const clientInactive = useRef()
    const trainerSelected = useRef()
    const groupSelected = useRef()
    const cid = useRef()
    const sessionSelected = useRef()
    const userId = localStorage.getItem('user_id');
    const selectedTrainer = localStorage.getItem('selectedTrainer');
    const selectedClient = localStorage.getItem('selectedClient');
    const selectedGroup = localStorage.getItem('selectedGroup');
    const selectedtrainerActive = localStorage.getItem('selectedtrainerActive');
    const selectedtrainerInactive = localStorage.getItem('selectedtrainerInactive');
    const selectedclientActive = localStorage.getItem('selectedclientActive');
    const selectedclientInactive = localStorage.getItem('selectedclientInactive');
    const selectedHomework = localStorage.getItem('selectedHomework');
    const userType = localStorage.getItem('userType');
 
    const accessToken = localStorage.getItem('accessToken');
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const [successModal, setsuccessModal] = useState(false);
    const successToggleModal = () => setsuccessModal(!successModal);
    const [loaderModal, setLoaderModal] = useState(false);
    const loaderToggleModal = () => setLoaderModal(!loaderModal);

console.log("Sessionid",Sessionid)
    const columns = [
        {
            title: "Session", field: "session"
        },
        // {
        //     title: "Client Name", field: "clientname",align: "center"
        // },
        {
            title: "Added on", field: "addedon",align: "center"
        },
        
        {
            title: <span className="text-right">Actions</span>, field: "action",align: "right"
        }
    ]

    useEffect(() => {
        getTrainers()
       
        getClients();
    

    }, []);
  
    useEffect(() => {
        getTrainers()
        Homeworklist();
        getClients();
        getSession();

    }, [selectedClient]);


    useEffect(() => {
        if(ogdata.length > 0 ){
            reRender(ogdata);
        }
        else{
            Homeworklist();
        }

    }, [selectedSession]);


    

    const getTrainers = () => {

        let url = API_URL+"/trainers?user_id=" + userId + "&status=2";
        // // console.log(trainerActive);
        let _trainerActive = trainerActive.current.checked;
        let _trainerInactive = trainerInactive.current.checked;

        if (trainerActive.current.checked) {
            localStorage.setItem('selectedtrainerActive', true);
        }
        else {
            localStorage.setItem('selectedtrainerActive', false);

        }
        if (trainerInactive.current.checked) {
            localStorage.setItem('selectedtrainerInactive', true);
        }
        else {
            localStorage.setItem('selectedtrainerInactive', false);

        }

        if (_trainerActive && !_trainerInactive) {
            url = API_URL+"/trainers?user_id=" + userId + "&status=1";;
        }
        else if (!_trainerActive && _trainerInactive) {
            url = API_URL+"/trainers?user_id=" + userId + "&status=0";
        }
        else if (_trainerActive && _trainerInactive) {
            url = API_URL+"/trainers?user_id=" + userId;
        }
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
                    // console.log(result.trainers)
                    if (result.status) {
                        settrainers(result.trainers)
                        // getClients();
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
    const deletehomeworkasignment = () => {
        let id = itemId;
        setLoaderModal(true)

        fetch(API_URL + "/homework/client/delete/" + id,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                Homeworklist();
                setdeleteModal(!deleteModal)
                setLoaderModal(false)
                setsuccessModal(true)
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }

        })

    }
    const openItemPopUp = (id) => {
        setItemId(id);
        setdeleteModal(true)

    }
    const Homeworklist = () => {
        fetch(API_URL + "/homework/client/" + selectedClient,
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

                    console.log("result", resp);
                    // const clientname = resp.ClientName
                    setOgdata(resp.data)
                    reRender(resp.data)
                    



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
     const reRender = (_data) => {
            let _temp = [];
            
            console.log("dateSession" ,selectedSession)
        if(_data.length > 0 ){

                    _data.map((v, i) => {

            if (v.sessionid == md5(selectedSession) || selectedSession == "null" ){

                        _temp.push({
                            session: v.session_name,
                            addedon: new Date(v.added_on).toLocaleString(),
                            action: <p> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Download" placement="top"><a href={SERVER_URL+'/homework/'+v.file} target={"_blank"} className="downloadimg" download><img src={download} /></a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="View" placement="top"><a href={SERVER_URL+'/homework/'+v.file} target={"_blank"}  className="downloadimg"><img src={preveiw} /></a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="View" placement="top"><a onClick={() => openItemPopUp(v.id)} className="downloadimg"><img src={Delete} /></a></Tooltip></p>

                        })
                    }
                        if(_data.length - 1 == i){

                    setdata(_temp);
                }
                    })
                }
                else{
                    setdata([]);
            
                }
        }

    const updateSelectTrainer = () => {
        localStorage.setItem('selectedTrainer', trainerSelected.current.value);
        localStorage.setItem('selectedClient', null);

        getClients()
    }
    
    const getClients = () => {

        let _userId = localStorage.getItem('selectedTrainer');
        let _selectedGroup = localStorage.getItem('selectedGroup');
        let _userType = 3
        let _groupSelected = _selectedGroup === "true" ? true : false;
        let _trainer = true;
        if (_userId == "all") {
            _trainer = false;
        }


        localStorage.setItem('selectedGroup', false);
        if (_groupSelected) {
            localStorage.setItem('selectedGroup', true);
            _userType = 4;
        }

        if (clientActive.current.checked) {
            localStorage.setItem('selectedclientActive', true);
        }
        else {
            localStorage.setItem('selectedclientActive', false);

        }
        if (clientInactive.current.checked) {
            localStorage.setItem('selectedclientInactive', true);
        }
        else {
            localStorage.setItem('selectedclientInactive', false);

        }
        let url = API_URL+"/clients?user_id=" + _userId + "&status=2&trainer=" + _trainer + "&user_type=" + _userType;
        let _clientActive = clientActive.current.checked;
        let _clientInactive = clientInactive.current.checked;


        if (_clientActive && !_clientInactive) {
            url = API_URL+"/clients?user_id=" + _userId + "&status=1&trainer=" + _trainer + "&user_type=" + _userType;
        }
        else if (!_clientActive && _clientInactive) {
            url = API_URL+"/clients?user_id=" + _userId + "&status=0&trainer=" + _trainer + "&user_type=" + _userType;
        }
        else if (_clientActive && _clientInactive) {
            url = API_URL+"/clients?user_id=" + _userId + "&trainer=" + _trainer + "&user_type=" + _userType;
        }


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
                    // console.log(result.clients)
                    if (result.status) {
                        setinclients(result.clients)
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

    const getSession = () => {
        let _cid = localStorage.getItem('selectedClient');

        let _hw = 1;

        let url = API_URL+"/sessions?cid=" + _cid + "&hw=" + _hw;


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
                        setsesstion(result.sessions)
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

    const updateSelectClient = () => {
        localStorage.setItem('selectedClient', clientSelected.current.value);
        getSession()
        Homeworklist();

    }
 

    const updateselectedSecssion = () => {
        localStorage.setItem('selectedSession', sessionSelected.current.value);
        setSelectedSession(sessionSelected.current.value)
         
    }



    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }
    return (
        <div className="">
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                    <div className="head-demoreport">
                        <h3>View Completed Client Homework</h3>
                        <div className="back-icon-wrp">
                            <Link to="/view/manageform" className="backbtn-icon">
                                <img src={backIcon} alt="backicon" />
                                <span>Back</span>
                            </Link>
                        </div>
                    </div>
                    <div className="filter-mrb">
                   
                        <div className="row">
                      
                        <div className="col-lg-3">
                                <div className="trainerbox">
                                    <div className="trainer-c"><p>{t("trainer")}:</p></div>
                                    <div className="padding-box">
                                        <div className="main-checkbox">

                                            <div className="checkbox-wrp">
                                                <div class="custom-radios">
                                                    <input type="checkbox" id="6" onChange={getTrainers} ref={trainerActive} defaultChecked={(selectedtrainerActive === "true" ? true : false)} />
                                                    <label for="6">
                                                        <span className="redious">
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="caption-cheeckbox">
                                                <p>{t("Active")}</p>
                                                </div>
                                            </div>
                                              <div className="checkbox-wrp">
                                                <div class="custom-radios">
                                                    <input type="checkbox" id="7" onChange={getTrainers} ref={trainerInactive} defaultChecked={(selectedtrainerInactive === "true" ? true : false)} />
                                                    <label for="7">
                                                        <span className="redious">
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="caption-cheeckbox">
                                                    <p>{t("Inactive")}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="select-client">
                                            <select ref={trainerSelected} onChange={updateSelectTrainer}  >
                                                <option className="selected-bold">Choose a trainer</option>
                                                <option className="selected-bold" value={"all"}>All trainers</option>
                                                {
                                                    trainers.map((items) =>
                                                        <option className="selected-bold" selected={items.id == selectedTrainer ? true : false} value={items.id}>
                                                            {items.firstname} {items.lastname}
                                                        </option>)
                                                }



                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="trainerbox">
                                    <div className="trainer-c"><p>Client:</p></div>
                                    <div className="padding-box">
                                        <div className="main-checkbox">

                                            <div className="checkbox-wrp">
                                                <div class="custom-radios">
                                                    <input type="checkbox" id="color-8" onChange={getClients} ref={clientActive} defaultChecked={(selectedclientActive === "true" ? true : false)} />
                                                    <label for="color-8">
                                                        <span className="redious">
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="caption-cheeckbox">
                                                    <p>Active</p>
                                                </div>
                                            </div>

                                            <div className="checkbox-wrp">
                                                <div class="custom-radios">
                                                    <input type="checkbox" id="color-10" onChange={getClients} ref={clientInactive} defaultChecked={(selectedclientInactive === "true" ? true : false)} />
                                                    <label for="color-10">
                                                        <span className="redious">
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="caption-cheeckbox">
                                                    <p>Inactive</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="select-client">
                                            <select ref={clientSelected} onChange={updateSelectClient}>
                                                <option>Choose a client</option>

                                                {
                                                    clients.length > 0 && clients.map((client, i) =>
                                                        <option selected={client.id == selectedClient ? true : false} value={client.id}>
                                                            {client.firstname} {client.lastname}
                                                        </option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="trainerbox">
                                    <div className="trainer-c"><p>Session:</p></div>
                                    <div className="padding-box">

                                        <div className="select-client mrt-select">
                                            <select ref={sessionSelected} onChange={updateselectedSecssion}>
                                                <option value={"null"}>Choose a session</option>
                                                {
                                                    sesstion.map((sesstion, i) =>
                                                        <option selected={sesstion.id == selectedSession ? true : false} value={sesstion.id}>
                                                            {sesstion.name}
                                                        </option>)
                                                }

                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                    <Modal isOpen={deleteModal} toggle={deleteToggleModal} className="connect-box" centered={true}>
                        <ModalHeader toggle={deleteToggleModal}><span className="ml-1 roititle font-weight-bold">Delete</span></ModalHeader>
                        <ModalBody>
                            <div className="modal-p">
                                <div className="right-circle cancel-circle"><img src={closeicon} /></div>
                                <h4>Are you sure?</h4>
                                <p>Do you really wish to delete this uploaded homework assignment?</p>
                                <div className="wrp-delete-btn">
                                    <div className="cancel-btn1" ><a onClick={deleteToggleModal}>Cancel</a></div>
                                    <div className="delete-btn1"><a onClick={deletehomeworkasignment}>Delete</a></div>
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


            <Modal isOpen={successModal} toggle={successToggleModal} className="connect-box" centered={true}>
                            <ModalHeader toggle={successToggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                            <ModalBody>
                                <div className="modal-p">
                                    <p>Uploaded assignment deleted successfully.</p>
                                </div>
                            </ModalBody>

                        </Modal>

                </div>
            </div>

        </div>
    )
}

export default Viewcompletedclientwork;