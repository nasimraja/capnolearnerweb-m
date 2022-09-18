import React, { Component, useState, useEffect, useRef } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import Delete from '../../images/delete.png'
import edit from '../../images/edit.png';
import right from '../../images/right.png';
import closeicon from '../../images/closeicon.png';
import { API_URL } from '../../../config';
import backIcon from "../../images/back.png";


const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));

const Hardwareprofile = () => {

    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('user_id');
    const [hardwareprofiles, setHardwareprofiles] = useState([]);
    
    const [devicee5data, setDevice5data] = useState([]);
    const [data, setData] = useState([]);
    const updatedevice = useRef();
    const [registerModal, setregisterModal] = useState(false);
    const registerToggleModal = () => setregisterModal(!registerModal);
    const [successModal, setsuccessModal] = useState(false);
    const successToggleModal = () => setsuccessModal(!successModal);
    const serialKey = useRef();
    const [itemId, setItemId] = useState(null);
    const [deleteModal, setdeleteModal] = useState(false);
    const deleteToggleModal = () => setdeleteModal(!deleteModal);
    const [error, setError] = useState(false);

    const [serialkeyModal, setSerialkeyModal] = useState(false);
    const serialkeyToggleModal = () => setSerialkeyModal(!serialkeyModal);
    const [updateDivce5Modal, setUpdateDivce5Modal] = useState(false);
    const updateDivce5ModalToggleModal = (id) => {
        setItemId(id)
        setUpdateDivce5Modal(!updateDivce5Modal)
    };
    const [updateSuccessModal, setUpdateSuccessModal] = useState(false);
    const UpdateSuccessToggleModal = () => setUpdateSuccessModal(!updateSuccessModal);
    const classes = useStyles();

    useEffect(() => {
        get5Device();
        // get6Device();
        
        

    }, []);





    const columns = [
        {
            title: "Serial Number", field: "name"
        },
        {
            title: "Date Activated", field: "date",align: "right"
        },
       
    ]

    function saveRegisterdevice5() {

        let data = {};

        data['serial_key'] = serialKey.current.value;
        data['owner_id'] = userId;
        data['status'] = 1;

        if (serialKey.current.value == "") {
            setError(true);
            return false;
        }

        fetch(API_URL + "/device/five/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status == 201) {
                response.json().then((resp) => {
                    // console.log("results", resp);
                    successToggleModal();
                    get5Device();
                    registerToggleModal();

                });
            }
            else if (response.status == 200) {
                serialkeyToggleModal();
                registerToggleModal();
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        })



    }

    const handleSerialkey = () => {
        setError(false)
    }

    const updatedType = () => {
        let _device = updatedevice.current.value;
        console.log("_device",_device)

        if (_device == 1) {
            get5Device();
        }
        else {
            get6Device();
        }


    }
    const get5Device = () => {
        fetch(API_URL + "/device/five/profile/" + userId,
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
                    
                    let _temp = [];
                    resp.hardwareprofiles.map((v, i) => {
                        _temp.push({
                            name: v.serial_key,
                            date: new Date(v.date_activated * 1000).toLocaleString(),

                            // actions: <p> <Tooltip classes={{
                            //     tooltip: classes.customTooltip,
                                
                            //   }} title="Edit" placement="top"><a className="downloadimg" onClick={() => {updateDivce5ModalToggleModal(v.id)}}><img src={edit} /></a></Tooltip> 
                            //   <Tooltip classes={{
                            //     tooltip: classes.customTooltip,}} title="Delete" placement="top"><a onClick={() => openItemPopUp(v.id)} className="downloadimg"><img src={Delete} /></a></Tooltip></p>
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
    const get6Device = () => {
        fetch(API_URL + "/device/six/profile/" + userId,
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
                    let _temp = [];
                    resp.hardwareprofiles.map((v, i) => {
                        _temp.push({
                            name: v.serial_key,

                            date: new Date(v.date_activated * 1000).toLocaleString(),
                            // actions: <p><a href='#' className="downloadimg"><img src={Delete} /></a> <a href='#' className="downloadimg"><img src={edit} /></a></p>
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

   

    function Updatedevice5() {
        let id = itemId;
       
        let data = {};

        data['serial_key'] = serialKey.current.value;
        data['status'] = 1;

        if (serialKey.current.value == "") {
            setError(true);
            return false;
        }

        fetch(API_URL + "/device/five/update/" + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {
                    // console.log("results", resp);
                    UpdateSuccessToggleModal()
                    get5Device();


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

    const delete5device = () => {
        let id = itemId;

        fetch(API_URL + "/device/five/delete/" + id,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                get5Device();
                setdeleteModal(!deleteModal)

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
        setdeleteModal(!deleteModal)
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
                        <h3>Hardware Profiles</h3>
                        <div className="back-icon-wrp">
                            <Link to="/viewcreate" className="backbtn-icon">
                                <img src={backIcon} alt="backicon" />
                                <span>Back</span>
                            </Link>
                        </div>
                    </div>
                    <div className="row mrb-option">
                        <div className="col-lg-3">
                            <div className="client-input">
                                <p>Instruments Type</p>
                                <select onChange={updatedType} ref={updatedevice}>
                                    <option value="1">CapnoTrainer® 5.0 Instruments</option>
                                    <option value="2">CapnoTrainer® 6.0 Instruments</option>
                                    

                                </select>
                            </div>
                        </div>
                        <div className="col-lg-6"></div>
                        <div className="col-lg-3">
                            <Modal isOpen={successModal} toggle={successToggleModal} className="connect-box" centered={true}>
                                <ModalHeader toggle={successToggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                                <ModalBody>
                                    <div className="modal-p">
                                        <div className="right-circle"><img src={right} /></div>
                                        <h4>Saved!</h4>
                                        <p>Serial Number has been Added Successfully</p>
                                    </div>
                                </ModalBody>

                            </Modal>
                            <Modal isOpen={registerModal} toggle={registerToggleModal} className="connect-box" centered={true}>
                                <ModalHeader toggle={registerToggleModal}><span className="ml-1 roititle font-weight-bold">Register 5.0 Device</span></ModalHeader>
                                <ModalBody>
                                    <div className="modal-p">

                                        <input placeholder="Write Serial key" ref={serialKey} onChange={handleSerialkey} />
                                        {error && <p className='error-message'>Please Write Serial Key</p>}
                                        <div className="btn-s-submit">
                                            <button type="submit" onClick={saveRegisterdevice5}>Submit</button>
                                        </div>
                                    </div>
                                </ModalBody>

                            </Modal>
                            {/* <div className="registerdevice-btn"><a href="#" onClick={registerToggleModal}>Register 5.0 Device</a></div> */}
                        </div>
                    </div>
                    <div className="wrp-bankform">
                        <div style={{ maxWidth: '100%' }}>
                            <MaterialTable
                                options={{
                                    search: true,
                                    showTitle: false,
                                    toolbar: true,
                                    pageSize: 15,


                                    pageSizeOptions:[5,10,20,50,150,200]
                                }}
                                columns={columns}
                                data={data}
                                title=""
                            />

                        </div>
                    </div>
                    <Modal isOpen={deleteModal} toggle={deleteToggleModal} className="connect-box" centered={true}>
                        <ModalHeader toggle={deleteToggleModal}><span className="ml-1 roititle font-weight-bold">Delete</span></ModalHeader>
                        <ModalBody>
                            <div className="modal-p">
                                <div className="right-circle cancel-circle"><img src={closeicon} /></div>
                                <h4>Are You Sure?</h4>
                                <p>Do you really want to delete this record?</p>
                                <div className="wrp-delete-btn">
                                    <div className="cancel-btn1" ><a onClick={deleteToggleModal}>Cancel</a></div>
                                    <div className="delete-btn1"><a onClick={delete5device}>Delete</a></div>
                                </div>
                            </div>
                        </ModalBody>

                    </Modal>
                </div>
            </div>
            <Modal isOpen={serialkeyModal} toggle={serialkeyToggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={serialkeyToggleModal}><span className="ml-1 roititle font-weight-bold">Serial Number</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        <p>A device with same serial is already registered</p>
                    </div>
                </ModalBody>

            </Modal>

            <Modal isOpen={updateDivce5Modal} toggle={updateDivce5ModalToggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={updateDivce5ModalToggleModal}><span className="ml-1 roititle font-weight-bold">Update 5.0 Device</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        
                        <input placeholder="Write Serial key"  ref={serialKey} onChange={handleSerialkey} />
                        {error && <p className='error-message'>Please Write Serial Key</p>}
                        <div className="btn-s-submit">
                            <button type="submit" onClick={()=>{{Updatedevice5(); updateDivce5ModalToggleModal()}}} >Update</button>
                        </div>
                    </div>
                </ModalBody>

            </Modal>
            <Modal isOpen={updateSuccessModal} toggle={UpdateSuccessToggleModal} className="connect-box" centered={true}>
                                <ModalHeader toggle={UpdateSuccessToggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                                <ModalBody>
                                    <div className="modal-p">
                                        <div className="right-circle"><img src={right} /></div>
                                        <h4>Saved!</h4>
                                        <p>Hardware Profile updated Successfully</p>
                                    </div>
                                </ModalBody>

                            </Modal>
        </div>
    )
}

export default Hardwareprofile;