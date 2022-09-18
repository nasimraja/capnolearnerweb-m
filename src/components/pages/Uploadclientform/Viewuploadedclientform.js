import React, { Component, useEffect, useRef, useState } from "react";
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
import Delete from '../../images/delete.png';
import closeicon from '../../images/closeicon.png';
import { API_URL, SERVER_URL } from "../../../config";
import backIcon from "../../images/back.png";


const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));

const Viewuploadedclientform = () => {
    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const selectedClient = localStorage.getItem('selectedClient');
    const [data, setdata] = useState([]);
    const [itemId, setItemId] = useState(null);
    const [clients, setinclients] = useState([]);
    const [trainers, settrainers] = useState([]);
    const [currentForm, setCurrentForm] = useState("all");
    
    const [sesstion, setsesstion] = useState([]);
    const [blankform, setblankform] = useState([]);
    const [showSessionbox, setShowSessionbox] = useState(false);
    const trainerActive = useRef()
    const formname = useRef()
    const formFile = useRef()
    const clientSelected = useRef()
    const trainerInactive = useRef()
    const clientActive = useRef()
    const clientInactive = useRef()
    const trainerSelected = useRef()
    const [successModal, setsuccessModal] = useState(false);
    const successToggleModal = () => setsuccessModal(!successModal);

    const [loaderModal, setLoaderModal] = useState(false);
    const loaderToggleModal = () => setLoaderModal(!loaderModal);

    const groupSelected = useRef()
    const cid = useRef()
    const sessionSelected = useRef()
    const userId = localStorage.getItem('user_id');
    const selectedTrainer = localStorage.getItem('selectedTrainer');
    const selectedGroup = localStorage.getItem('selectedGroup');
    const selectedtrainerActive = localStorage.getItem('selectedtrainerActive');
    const selectedtrainerInactive = localStorage.getItem('selectedtrainerInactive');
    const selectedclientActive = localStorage.getItem('selectedclientActive');
    const selectedclientInactive = localStorage.getItem('selectedclientInactive');
    const selectedHomework = localStorage.getItem('selectedHomework');
    const userType = localStorage.getItem('userType');
    const selectedSession = localStorage.getItem('selectedSession');


    const [deleteModal, setdeleteModal] = useState(false);
    const deleteToggleModal = () => setdeleteModal(!deleteModal);

   

    const classes = useStyles();

    useEffect(() => {
        
        getTrainers();
        getClients();
        blankForm();
        getSession();

        if(selectedClient != "null"){
            getclientform();
        }


    }, [selectedClient]);


    useEffect(() => {
        
      

        if(selectedClient != "null"){
            getclientform();
        }


    }, [currentForm]);


    const blankForm = () => {
        let type = 2;
        fetch(API_URL + "/forms/blank/" + type,
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
                    setblankform(resp.forms);
                    // setCurrentForm(resp.forms[0].id)


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
    const getTrainers = () => {

        let url = API_URL + "/trainers?user_id=" + userId + "&status=2";
        // // console.log(trainerActive);
        let _trainerActive = trainerActive.current.checked;
        let _trainerInactive = trainerInactive.current.checked;

       
       

        if (_trainerActive && !_trainerInactive) {
            url = API_URL + "/trainers?user_id=" + userId + "&status=1";;
        }
        else if (!_trainerActive && _trainerInactive) {
            url = API_URL + "/trainers?user_id=" + userId + "&status=0";
        }
        else if (_trainerActive && _trainerInactive) {
            url = API_URL + "/trainers?user_id=" + userId;
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
        let url = API_URL + "/clients?user_id=" + _userId + "&status=2&trainer=" + _trainer + "&user_type=" + _userType;
        let _clientActive = clientActive.current.checked;
        let _clientInactive = clientInactive.current.checked;


        if (_clientActive && !_clientInactive) {
            url = API_URL + "/clients?user_id=" + _userId + "&status=1&trainer=" + _trainer + "&user_type=" + _userType;
        }
        else if (!_clientActive && _clientInactive) {
            url = API_URL + "/clients?user_id=" + _userId + "&status=0&trainer=" + _trainer + "&user_type=" + _userType;
        }
        else if (_clientActive && _clientInactive) {
            url = API_URL + "/clients?user_id=" + _userId + "&trainer=" + _trainer + "&user_type=" + _userType;
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

    const updateSelectClient = () => {
        localStorage.setItem('selectedClient', clientSelected.current.value);
        getSession(selectedClient);
       
     
        // fetch(API_URL + "/forms/client/" + selectedClient,
        //     {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'x-access-token': accessToken,
        //         },
        //     }
        // ).then((response) => {
        //     if (response.status == 200) {
        //         response.json().then((resp) => {
        //             // console.log("result", resp);
        //             let _temp = [];
        //             resp.data.map((v, i) => {
        //                 _temp.push({
        //                     formname: v.forms,
        //                     action: <p><Tooltip classes={{
        //                         tooltip: classes.customTooltip,
                                
        //                       }} title="Download" placement="top"><a href='#' className="downloadimg tooltip2" download><img src={download} /> </a></Tooltip> <Tooltip classes={{
        //                         tooltip: classes.customTooltip,
                                
        //                       }} title="View" placement="top"><a href='#' className="downloadimg tooltip2"><img src={preveiw} /></a></Tooltip> <Tooltip classes={{
        //                         tooltip: classes.customTooltip,
                                
        //                       }} title="Delete" placement="top"><a onClick={() => openItemPopUp(v.id)} className="downloadimg tooltip2"><img src={Delete} /></a></Tooltip></p>

        //                 })
        //             })
        //             setdata(_temp);



        //         });
        //     }
        //     else if (response.status == 401) {
        //         logout()
        //     }
        //     else {
        //         console.log("network error")
        //     }


        // })
    }
    const updateSelectTrainer = () => {
        localStorage.setItem('selectedTrainer', trainerSelected.current.value);
        localStorage.setItem('selectedClient', null);
    
      
        getClients()
    }

    // const updatedselectformname = () =>{
    //     localStorage.setItem('selectedformname', formname.current.value);
    // }


    const getSession = () => {
        let _cid = localStorage.getItem('selectedClient');

        let _hw = 0;

        let url = API_URL + "/sessions?cid=" + _cid + "&hw=" + _hw;


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
    const updateselectedSecssion = () => {
        localStorage.setItem('selectedSession', sessionSelected.current.value);
    }
    const handleFormName = () => {
        let cureentId = formname.current.value;
        setCurrentForm(cureentId)
        if (cureentId == 4) {
            setShowSessionbox(true);
        }
        else {
            setShowSessionbox(false);
        }

    }

    const deleteUploadclient = () => {
        let id = itemId;
        setLoaderModal(true)

        fetch(API_URL + "/forms/client/delete/" + id,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                getclientform();
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
    const columns = [
        {
            title: "Form Name", field: "formname"
        },
        // {
        //     title: "Client Name", field: "clientname"
        // },
        {
            title: <span >Actions</span>, field: "action", align: "right"
        }
    ]
   
    const getclientform = () => {
        console.log("result ID", currentForm);

        fetch(API_URL + "/forms/client/" + selectedClient,
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
                    let _temp = [];
                    resp.data.map((v, i) => {
                        
                        if(v.form_name == currentForm || currentForm == "all"){
                           
                        _temp.push({
                            formname: v.forms,
                            action: <p><Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Download" placement="top"><a href={SERVER_URL+'/client_forms/'+v.form} target={"_blank"} className="downloadimg tooltip2" download><img src={download} /> </a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="View" placement="top"><a href={SERVER_URL+'/client_forms/'+v.form} target={"_blank"} className="downloadimg tooltip2"><img src={preveiw} /></a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Delete" placement="top"><a onClick={() => openItemPopUp(v.id)}    className="downloadimg tooltip2"><img src={Delete} /></a></Tooltip></p>

                        })
                         
                    }

                    if(i == (resp.data.length - 1)){
                        setdata(_temp);

                    }
                    })



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

    return (
        <div className="">
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                <div className="head-demoreport">
                        <h3>View Uploaded Client Forms</h3>
                        <div className="back-icon-wrp">
                            <Link to="/view/manageform" className="backbtn-icon">
                                <img src={backIcon} alt="backicon" />
                                <span>Back</span>
                            </Link>
                        </div>
                    </div>
                <div className="filter-top">
                <div className="row">
                            <div className="col-lg-4">
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
                                            <select ref={trainerSelected} onChange={updateSelectTrainer} required>
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
                            <div className="col-lg-4">
                                <div className="trainerbox">
                                    <div className="trainer-c"><p>{t("Client")}:</p></div>
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
                                                    <p>{t("Active")}</p>
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
                                                    <p>{t("Inactive")}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="select-client">
                                            <select ref={clientSelected} onChange={updateSelectClient}>
                                                <option className="selected-bold">Choose a client</option>

                                                {
                                                    clients.length > 0 && clients.map((client, i) =>
                                                        <option className="selected-bold" selected={client.id == selectedClient ? true : false} value={client.id}>
                                                            {client.firstname} {client.lastname}
                                                        </option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="trainerbox">
                                    <div className="trainer-c"><p>{t("Form-Name")}:</p></div>
                                    <div className="padding-box">

                                        <div className="select-client mrt-select">
                                            <select ref={formname} onChange={() => handleFormName()}>
                                            <option className="selected-bold" value="all" selected  >All</option>

                                                {
                                                    blankform.map((bankforms, i) => {
                                                        return (
                                                            <option className="selected-bold" value={bankforms.id} >{bankforms.forms}</option>
                                                        );
                                                    })
                                                }

                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            

                            
                        </div>
                </div>
                    
                   
                    <div className="wrp-bankform">
                        <div className="table-box">
                            <MaterialTable
                                columns={columns}
                                data={data}
                                title=""
                                options={{
                                    pageSize: 15,

                                    pageSizeOptions:[5,10,15,20]
                                }}
                                // options={{
                                //     fixedColumns: {
                                  
                                //       right: 1
                                //     }
                                //   }}
                            />

                        </div>
                    </div>

                    <Modal isOpen={deleteModal} toggle={deleteToggleModal} className="connect-box" centered={true}>
                        <ModalHeader toggle={deleteToggleModal}><span className="ml-1 roititle font-weight-bold">Delete</span></ModalHeader>
                        <ModalBody>
                            <div className="modal-p">
                                <div className="right-circle cancel-circle"><img src={closeicon} /></div>
                                <h4>Are you sure?</h4>
                                <p>Do you really wish to delete this uploaded client form?</p>
                                <div className="wrp-delete-btn">
                                    <div className="cancel-btn1" ><a onClick={deleteToggleModal}>Cancel</a></div>
                                    <div className="delete-btn1"><a onClick={deleteUploadclient}>Delete</a></div>
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
                                    <p>Uploaded form deleted successfully.</p>
                                </div>
                            </ModalBody>

                        </Modal>
                </div>
            </div>

        </div>
    )
}

export default Viewuploadedclientform;