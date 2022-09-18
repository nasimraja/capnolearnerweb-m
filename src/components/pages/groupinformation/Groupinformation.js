import React, { Component, useState, useEffect, useRef } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import Addclientname from './Addclientname';
import right from '../../images/right.png';
import { API_URL } from '../../../config';
import backIcon from "../../images/back.png";

const Groupinformation = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [trainers, setTrainer] = useState([]);
    const [clientList, setClientList] = useState([]);
    const [serialList, setSerialList] = useState([]);
    
    const [devicelist, setDeviceList] = useState({});
    const [clientCount, setClientCount] = useState(2);
    const userId = localStorage.getItem('user_id');
    const [maxclientModal, setmaxclientModal] = useState(false);
    const maxclientToggleModal = () => setmaxclientModal(!maxclientModal);
    const [minclientModal, setminclientModal] = useState(false);
    const minclientToggleModal = () => setminclientModal(!minclientModal);
    const groupName = useRef();
    const groupEmail = useRef();
    const groupPassword = useRef();
    
    const associateTrainer = useRef();
    const associateHardwaretype = useRef();
    const [successModal, setsuccessModal] = useState(false);
    const successToggleModal = () => setsuccessModal(!successModal);
    const associated_owner = localStorage.getItem('associated_owner');
    const [Loader, setLoader] = useState(false);
    const [fillallfieldmodal, setFillallfieldModal] = useState(false);
    const fillallfieldtoggleModal = () => setFillallfieldModal(!fillallfieldmodal);
    const [data, setData] = useState([]);


    useEffect(() => {
        getTrainer();
      

    }, [])

    const CreateGroupprofile = () => {
        setLoader(true)
        let data = {};

        data['name'] = groupName.current.value;
        data['associated_owner'] = associated_owner;
        data['associated_practioner'] = associateTrainer.current.value;
        data['email'] = groupEmail.current.value;
        data['device_type'] = associateHardwaretype.current.value;
        data['password'] = groupPassword.current.value;
        
        let _temp = [];
        for (let i = 0; i < clientCount; i++) {
            _temp.push(devicelist[i + 1]);
        }
        data['devices'] = _temp;
        if(groupName.current.value == "" || associateTrainer.current.value == "" || groupEmail.current.value == "" || associateHardwaretype.current.value == ""  ||  groupPassword.current.value == "" || devicelist.length < 2){
            fillallfieldtoggleModal();
            setLoader(false);
            return false;
        }

     
        // // console.log(data)


        fetch(API_URL+"/group/create", {
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
                    setLoader(false)

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

    const handleClientList = (i, data,serial) => {
        // console.log(i);
        // console.log(data);
        let _tempList = serialList ;
        if(serial == ""){
            return false;
        }
        if(_tempList.includes(serial)){
            alert("Please choose a different serial number.")
            return false;
        }else{
            _tempList.push(serial);
            setSerialList(_tempList)
            let _temp = devicelist
            _temp[i] = data;
            setDeviceList(_temp);
            return true;

        }
      
    }
    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    
    const updatedType = () => {
        let _device = associateHardwaretype.current.value;
        console.log("_device",_device)

        if (_device == 1) {
            get5Device();
        }
        else if (_device == 2) {
        
            get6Device();
        }
        else{
            setData([]);
         
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
                    
                    let _temp = resp.hardwareprofiles ;
               
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
                
                    let _temp = resp.hardwareprofiles ;
               
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


    return (
        <div className="demodata-bg">
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                    <div className="client-info-c">
                        <h3>New Group Information</h3>
                        <div className="back-icon-wrp">
                            <Link to="/viewcreate" className="backbtn-icon">
                                <img src={backIcon} alt="backicon" />
                                <span>Back</span>
                            </Link>
                        </div>
                        
                    </div>
                    <div className="client-info-box">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="client-input">
                                        <p>Group Name*</p>
                                        <input placeholder="Enter group name" ref={groupName} />
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="client-input">
                                        <p>Trainer*</p>
                                        <select ref={associateTrainer}>
                                            <option>Select trainer</option>
                                            {
                                                trainers.map((trainer, i) => {
                                                    return (
                                                        <option value={trainer.id} >{trainer.firstname} {trainer.lastname}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </div>
                                </div>
                               
                            </div>
                            <div className="row">
                            <div className="col-lg-4">
                                    <div className="client-input">
                                        <p>Group Email*</p>

                                        <input type="email" placeholder="Enter group email" ref={groupEmail} />
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="client-input">
                                        <p>Group Password*</p>

                                        <input type="password" placeholder="Enter group password" ref={groupPassword} />
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="client-input">
                                        <p>Associate Instruments Type</p>
                                        <select ref={associateHardwaretype} onChange={() => updatedType()}>
                                            <option value="0">Choose instrument type</option>
                                            <option value="1">CapnoTrainer® 5.0 Instruments</option>
                                            <option value="2">CapnoTrainer® 6.0 Instruments</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                          
                            <div className="add-clients">
                                <h3>Add Clients</h3>
                            </div>
                      
                            {
                                clientList.map((v, i) => {
                                    return (
                                        <Addclientname index={v.count} list={data} handleClientList={handleClientList} />
                                    )

                                })
                            }   
 


                            <div className="row">

                                <div className="col-lg-6">
                                    <Modal isOpen={maxclientModal} toggle={maxclientToggleModal} className="connect-box" centered={true}>
                                        <ModalHeader toggle={maxclientToggleModal}><span className="ml-1 roititle font-weight-bold">Maximum client limit reached!</span></ModalHeader>
                                        <ModalBody>
                                            <div className="modal-p">

                                                {/* <h6 className='text-center'>Maximum client limit reached!</h6> */}
                                                <p>You can add a maximum of 6 clients in a group.</p>
                                            </div>
                                        </ModalBody>

                                    </Modal>
                                    {
                                data.length > 0 &&
                                    <div className="create-btn">
                                        <button type="submit" onClick={addclient}>Add Client</button>
                                    </div>
}
                                </div>
                                <div className="col-lg-6">
                                    <Modal isOpen={minclientModal} toggle={minclientToggleModal} className="connect-box" centered={true}>
                                        <ModalHeader toggle={minclientToggleModal}><span className="ml-1 roititle font-weight-bold">Minimum client limit reached!</span></ModalHeader>
                                        <ModalBody>
                                            <div className="modal-p">

                                            <p> You need to have minimum 2 clients in a group.</p>
                                            </div>
                                        </ModalBody>

                                    </Modal>
                                    {
                                            data.length > 0 &&
                                    <div className="create-btn">
                                        <button type="submit" onClick={removeclient}>Remove Client</button>
                                    </div>
                                    }

                                </div>
                                <div className="col-lg-6">
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
                                                <p>Your Form has been Submited Successfully</p>
                                            </div>
                                        </ModalBody>

                                    </Modal>
                                    <div className="create-btn">
                                        <button type="submit" onClick={CreateGroupprofile}>Create Group Profile

                                            {
                                                Loader && <div id="loader"></div>
                                            }
                                        </button>
                                    </div>
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
        </div>
    )
}

export default Groupinformation;