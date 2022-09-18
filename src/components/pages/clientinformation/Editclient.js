import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import edit from '../../images/edit.png'
import checks from '../../images/checks.png'
import Delete from '../../images/delete.png';
import closeicon from '../../images/closeicon.png';
import { API_URL } from '../../../config';
import backIcon from "../../images/back.png";

import Cross from '../../images/cross.png';

const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));

const Editclient = () => {

    const accessToken = localStorage.getItem('accessToken');
    const selectedTrainer = localStorage.getItem('selectedTrainer');
    const selectedGroup = localStorage.getItem('selectedGroup');
    const userId = localStorage.getItem('user_id');
    const [clients, setinclients] = useState([]);
    const [data, setData] = useState([]);
    const [trainers, settrainers] = useState([]);
    const trainerSelected = useRef();
    const [itemId, setItemId] = useState(null);
    const [deleteModal, setdeleteModal] = useState(false);
    const deleteToggleModal = () => setdeleteModal(!deleteModal);
    let _userId = localStorage.getItem('user_id');
    let _userType = 3
    let _trainer = false;


    const [status, setStatus] = useState(0);
    const [statusModal, setStatusModal] = useState(false);
    const statusToggleModal = () => setStatusModal(!statusModal);



    const [statssuccessModal, setstatssuccessModal] = useState(false);
    const statussuccessToggleModal = () => setstatssuccessModal(!statssuccessModal);

    const [successModal, setsuccessModal] = useState(false);
    const successToggleModal = () => setsuccessModal(!successModal);

    const classes = useStyles();

    useEffect(() => {
        getClients();
        getTrainer();

        const interval = setInterval(()=>{
            getClients();
        },3000);
        return()=> clearInterval(interval);

    }, []);

    const deleteClient = () => {
        let id = itemId;
        fetch(API_URL + "/client/delete/" + id,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                getClients(); 
                setdeleteModal(!deleteModal)
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

    const getTrainer = () => {
        fetch(API_URL + "/trainers?user_id=" + userId,
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
                    settrainers(resp.trainers);



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

    const openStatusPopUp = (id,status) => {
        setItemId(id);
        setStatus(status)
        setStatusModal(true)

    }
    const updateSelectTrainer = () => {

        localStorage.setItem('selectedTrainer', trainerSelected.current.value);

        getClients()
    }


    
    const updateClient = () => {

        let id = itemId;
        let url = API_URL+"/client/activate/" + id ;

        if(status == 1){
            url = API_URL+"/client/deactivate/" + id ;
        }
        fetch(url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                getClients();
                setStatusModal(!statusModal)
                setstatssuccessModal(true)
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }



        })
    }

    const getClients = () => {

        let selectedTrainer = localStorage.getItem('selectedTrainer');
        if (selectedTrainer == "all") {
            selectedTrainer = _userId;
            _trainer = false;
        }
        else {
            _trainer = true;
        }

        fetch(API_URL + "/clients?user_id=" + selectedTrainer + "&trainer=" + _trainer + "&user_type=3",

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
                    resp.clients.map((v, i) => {
                        _temp.push({
                            firstname: v.firstname,
                            lastname: v.lastname,
                            email: v.email,
                            status: v.status == 1 ? "Active" : "Inactive",
                            telephone: v.telephone,
                            actions: <p> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Edit" placement="top"><a href={"/edit/client/" + v.id} className="downloadimg" ><img src={edit} /></a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title={(v.status == 1 ? "Deactivate" : "Activate")}  placement="top"><a onClick={() => openStatusPopUp(v.id,v.status)} className="downloadimg"><img src={(v.status == 1 ? Cross : checks)} /></a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Delete" placement="top"><a onClick={() => openItemPopUp(v.id)} className="downloadimg"><img src={Delete} /></a></Tooltip></p>
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
            title: "First Name", field: "firstname"
        },
        {
            title: "Last Name", field: "lastname"
        },
        {
            title: "Email", field: "email"
        },
        {
            title: "Status", field: "status"
        },
        
        {
            title: <span className="text-right">Actions</span>, field: "actions",align: "right"
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
                        <h3>Clients</h3>
                        <div className="back-icon-wrp">
                            <Link to="/viewcreate" className="backbtn-icon">
                                <img src={backIcon} alt="backicon" />
                                <span>Back</span>
                            </Link>
                        </div>
                    </div>
                    <div className="choose-trainer">
                        <label>Trainer</label>
                        <select ref={trainerSelected} onChange={updateSelectTrainer} className="choose-trainerselectopt">

                            <option selected={"all" == selectedTrainer ? true : false} value={"all"}>All trainers</option>

                            {
                                trainers.map((items, i) => {
                                    return (
                                        <option selected={items.id == selectedTrainer ? true : false} value={items.id}>
                                            {items.firstname} {items.lastname}
                                        </option>
                                    )
                                })
                            }

                        </select>
                    </div>
                    <div className="wrp-bankform">
                        <div style={{ maxWidth: '100%' }}>
                            <MaterialTable
                                options={{
                                    search: true,
                                    showTitle: false,
                                    toolbar: true,
                                    pageSize: 15,

                                    pageSizeOptions: [5, 10, 20, 50, 150, 200]
                                }}
                                columns={columns}
                                data={data}
                                title=""
                            />

                        </div>
                    </div>

                    <Modal isOpen={statusModal} toggle={statusToggleModal} className="connect-box" centered={true}>
                    <ModalHeader toggle={statusToggleModal}><span className="ml-1 roititle font-weight-bold">{(status == 1 ? "Deactivate" : "Activate")}</span></ModalHeader>
                    <ModalBody>
                        <div className="modal-p">
                            {/* <div className="right-circle cancel-circle"><img src={(status == 1 ? Cross : checks)} /></div> */}
                            <h4>Are you sure?</h4>
                            <p>Do you really wish to {(status == 1 ? "deactivate" : "activate")} this client?</p>
                            <div className="wrp-delete-btn">
                                <div className="cancel-btn1" ><a onClick={statusToggleModal}>Cancel</a></div>
                                <div className="delete-btn1"><a onClick={updateClient}>{(status == 1 ? "Deactivate" : "Activate")}</a></div>
                            </div>
                        </div>
                    </ModalBody>

                </Modal>
                
                <Modal isOpen={statssuccessModal} toggle={statussuccessToggleModal} className="connect-box" centered={true}>
                            <ModalHeader toggle={statussuccessToggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                            <ModalBody>
                                <div className="modal-p">
                                    <p>Client status updated successfully.</p>
                                </div>
                            </ModalBody>

                        </Modal>

                    <Modal isOpen={deleteModal} toggle={deleteToggleModal} className="connect-box" centered={true}>
                        <ModalHeader toggle={deleteToggleModal}><span className="ml-1 roititle font-weight-bold">Delete</span></ModalHeader>
                        <ModalBody>
                            <div className="modal-p">
                                <div className="right-circle cancel-circle"><img src={closeicon} /></div>
                                <h4>Are you sure?</h4>
                                <p>Do you really wish to delete this client?</p>
                                <div className="wrp-delete-btn">
                                    <div className="cancel-btn1" ><a onClick={deleteToggleModal}>Cancel</a></div>
                                    <div className="delete-btn1"><a onClick={deleteClient}>Delete</a></div>
                                </div>
                            </div>
                        </ModalBody>

                    </Modal>

                    <Modal isOpen={successModal} toggle={successToggleModal} className="connect-box" centered={true}>
                            <ModalHeader toggle={successToggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                            <ModalBody>
                                <div className="modal-p">
                                    <p>Client deleted successfully.</p>
                                </div>
                            </ModalBody>

                        </Modal>
                </div>
            </div>

        </div>
    )
}

export default Editclient;