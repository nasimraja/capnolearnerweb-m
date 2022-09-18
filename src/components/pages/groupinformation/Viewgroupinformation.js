import React, { Component, useState, useEffect, useRef } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import right from '../../images/right.png';
import Addclientname from './Addclientname';
import EditgroupProfile from '../groupinformation/EditgroupProfile';
import md5 from 'md5';
import { API_URL } from '../../../config';
import backIcon from "../../images/back.png";

const Viewgroupinformation = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [trainers, setTrainer] = useState([]);
    const [group, setgroup] = useState([]);
    const [groupProfile, setgroupProfile] = useState([]);
    const [clientList, setClientList] = useState([]);
    const [devicelist, setDeviceList] = useState({});
    const [clientCount, setClientCount] = useState(2);
    const userId = localStorage.getItem('user_id');
    const [maxclientModal, setmaxclientModal] = useState(false);
    const maxclientToggleModal = () => setmaxclientModal(!maxclientModal);
    const [minclientModal, setminclientModal] = useState(false);
    const minclientToggleModal = () => setminclientModal(!minclientModal);
    const groupName = useRef();
    const groupEmail = useRef();
    const associateTrainer = useRef();
    const associateHardwaretype = useRef();
    const [successModal, setsuccessModal] = useState(false);
    const [Loader, setLoader] = useState(false)
    const successToggleModal = () => setsuccessModal(!successModal);
    const associated_owner = localStorage.getItem('associated_owner');
    const [fillallfieldmodal, setFillallfieldModal] = useState(false);
    const fillallfieldtoggleModal = () => setFillallfieldModal(!fillallfieldmodal);
    const [loaderModal, setLoaderModal] = useState(false);
    const loaderToggleModal = () => setLoaderModal(!loaderModal);

    const { groupid } = useParams();

    useEffect(() => {
        getTrainer();
        getGroup();
        getProfileGroup();
    }, [])

    const updateGroupprofile = () => {
        setLoader(true)
        let data = {};

        data['name'] = groupName.current.value;
        data['associated_owner'] = associated_owner;
        data['associated_practioner'] = associateTrainer.current.value;
        data['email'] = groupEmail.current.value;
        data['device_type'] = associateHardwaretype.current.value;
        data['status'] = 1;
        let _temp = [];
        for (let i = 0; i < clientCount; i++) {
            _temp.push(devicelist[i + 1]);
        }
        data['devices'] = _temp;
        // // console.log(data)

        if(groupName.current.value == "" || associateTrainer.current.value == "" || groupEmail.current.value == "" || associateHardwaretype.current.value == ""){
            fillallfieldtoggleModal();
            return false;
        }else{
            setLoaderModal(true)
        }
        fetch(API_URL+"/group/update/" + groupid, {
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
                    successToggleModal();
                    setLoaderModal(false)

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

    const getGroup = () => {
        fetch(API_URL+"/group/" + groupid,
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
                    // // console.log("result", resp);
                    setgroup(resp.group[0]);



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
    const getProfileGroup = () => {
        fetch(API_URL+"/group/profile/" + groupid,
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
                    // // console.log("result", resp);
                    setgroupProfile(resp.groupProfile);




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

    const getTrainer = () => {
        fetch(API_URL+"/trainers?user_id=" + userId,
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
                    // // console.log("result", resp);
                    setTrainer(resp.trainers);



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

    const removeclient = () => {
        // let _temp = clientList;
        // _temp.push(_temp.length+1);
        // alert(_temp.length)
        if (clientCount > 2) {
            setClientCount(clientCount - 1)
        }
        else {
            minclientToggleModal();
        }
    }
    const addclient = () => {
        // let _temp = clientList;
        // _temp.push(_temp.length+1);
        // alert(_temp.length)
        if (clientCount < 6) {
            setClientCount(clientCount + 1)
        }
        else {
            maxclientToggleModal();
        }
    }

    useEffect(() => {
        let _temp = [];
        for (let i = 0; i < clientCount; i++) {
            _temp.push({
                count: i + 1
            })
            if (i == (clientCount - 1)) {
                setClientList(_temp)

            }
        }
    }, [clientCount])

    const handleClientList = (i, data) => {
        // console.log(i);
        // console.log(data);
        let _temp = devicelist
        _temp[i] = data;
        setDeviceList(_temp);
        // console.log(devicelist);
    }
    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <div className="demodata-bg">
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                    <div className="client-info-c">
                        <h3>View Group Information</h3>
                        <div className="back-icon-wrp">
                            <Link to="/edit/group" className="backbtn-icon">
                                <img src={backIcon} alt="backicon" />
                                <span>Back</span>
                            </Link>
                        </div>
                    </div>
                    <div className="client-info-box">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Group Name</p>
                                        <input disabled placeholder="Enter group name" defaultValue={group.group_name} ref={groupName} />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Group Email</p>

                                        <input disabled type="email" placeholder="Enter group email" defaultValue={group.email} ref={groupEmail} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Trainer</p>
                                        <select disabled  ref={associateTrainer}>
                                            <option>Select trainer</option>
                                            {
                                                trainers.map((trainer, i) => {
                                                    return (
                                                        <option value={trainer.id} selected={md5(trainer.id.toString()) == group.associated_practioner ? true : false}>{trainer.firstname} {trainer.lastname}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Associate Instrument Type</p>
                                        <select disabled ref={associateHardwaretype} defaultValue={group.device}>
                                            <option value="1" selected={group.device == 1 ? true : false} >Capnotrainer® 5.0 Instruments</option>
                                            <option value="2" selected={group.device == 2 ? true : false}>Capnotrainer® 6.0 Instruments</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="add-clients">
                                <h3>Add Clients</h3>
                            </div>
                            {/* {clientList.length} */}
                            {
                                groupProfile.map((v, i) => {
                                    return (
                                        <EditgroupProfile index={i + 1} data={v} />
                                    )

                                })
                            }


                            <div className="row">



                                <div className="col-lg-12">
                                    <div className="create-btn">
                                        <Link to="/viewcreate" >Go Back</Link>
                                    </div>
                                </div>
                                <div className="col-lg-6">
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
                                    {/* <div className="create-btn">
                                        <button type="submit" onClick={updateGroupprofile}>Update Group Information
                                           
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <Modal isOpen={fillallfieldmodal} toggle={fillallfieldtoggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={fillallfieldtoggleModal}><span className="ml-1 roititle font-weight-bold">Error</span></ModalHeader>
                <ModalBody>
                    <div className="modal-error-p">
                        <p>Please fill all field</p>
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

export default Viewgroupinformation;