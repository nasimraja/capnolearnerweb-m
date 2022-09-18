import React, { Component, useState, useEffect, useRef } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import right from '../../images/right.png';
import { API_URL } from '../../../config';
import backIcon from "../../images/back.png";

const Clientinformation = () => {
    const accessToken = localStorage.getItem('accessToken');
    const firstname = useRef()
    const lastname = useRef()
    const gender = useRef()
    const age = useRef()
    const education = useRef()
    const profession = useRef()
    const telephone = useRef()
    const email = useRef()
    const complaint = useRef()
    const address = useRef()
    const city = useRef()
    const zipcode = useRef()
    const state = useRef()
    const country = useRef()
    const [successModal, setsuccessModal] = useState(false);
    const successToggleModal = () => setsuccessModal(!successModal);
    const [client, setclient] = useState({});
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    let _userId = localStorage.getItem('user_id');
    let _userType = 3
    let _trainer = false;
    const [Loader, setLoader] = useState(false)
    const [fillallfieldmodal, setFillallfieldModal] = useState(false);
    const fillallfieldtoggleModal = () => setFillallfieldModal(!fillallfieldmodal);
    const [emailalreadyExitmodal, setEmailalreadyExitmodal] = useState(false);
    const EmailalreadyExittoggleModal = () => setEmailalreadyExitmodal(!emailalreadyExitmodal);
    const [error, setError] = useState(false);
    const [loaderModal, setLoaderModal] = useState(false);
    const loaderToggleModal = () => setLoaderModal(!loaderModal);
    

    const { id } = useParams();

    useEffect(() => {
        getClient();
        getCountry();
    }, [])

    const getClient = () => {
        fetch(API_URL + "/client/profile/" + id,
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
                    setclient(resp.client[0]);
                    getState(resp.client[0].country)
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




    function saveClientinfo() {
        setLoader(true)
        let data = {};

        data['firstname'] = firstname.current.value;
        data['lastname'] = lastname.current.value;
        data['gender'] = gender.current.value;
        data['age'] = age.current.value;
        data['education'] = education.current.value;
        data['profession'] = profession.current.value;
        data['telephone'] = telephone.current.value;
        data['email'] = email.current.value;
        data['complaint'] = complaint.current.value;
        data['address'] = address.current.value;
        data['city'] = city.current.value;
        data['zipcode'] = zipcode.current.value;
        data['state'] = state.current.value;
        data['country'] = country.current.value;

        if (firstname.current.value == "" || lastname.current.value == "" || age.current.value == "" || education.current.value == "" || profession.current.value == "" || telephone.current.value == "" || email.current.value == "" || complaint.current.value == "" || address.current.value == "" || zipcode.current.value == "" || state.current.value == "" || country.current.value == "") {
            fillallfieldtoggleModal();
           
            return false;
        }else{
            setLoaderModal(true)
        }

        fetch(API_URL + "/client/update/" + id, {
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
            else if (response.status == 400) {
                setLoaderModal(false)
                EmailalreadyExittoggleModal();
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }


        })



    }

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
      }

    const handleEmail = ()=>{
        if (!isValidEmail(email.current.value)) {
            setError(true);
          } else {
            setError(false);
          }
    }

    const getCountry = () => {
        fetch(API_URL + "/countries",
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
                    setCountries(resp.countries);

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
    const getState = (countryid) => {



        fetch(API_URL + "/states?country_id=" + countryid,
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
                    setStates(resp.states);

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

    const handleCountryUpdate = () => {
        getState(country.current.value)
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
                        <h3>Client Information</h3>
                        <div className="back-icon-wrp">
                            <Link to="/list/client" className="backbtn-icon">
                                <img src={backIcon} alt="backicon" />
                                <span>Back</span>
                            </Link>
                        </div>
                    </div>
                    <div className="client-info-box">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>First Name *</p>
                                        <input placeholder="Enter first name" defaultValue={client.firstname} ref={firstname} />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Last Name *</p>
                                        <input placeholder="Enter last name" defaultValue={client.lastname} ref={lastname} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="client-input">
                                        <p>Sex *</p>
                                        <select defaultValue={client.gender} ref={gender} >
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="client-input">
                                        <p>Age *</p>
                                        <input placeholder="Enter age" defaultValue={client.age} ref={age} />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Education</p>
                                        <input placeholder='Education' defaultValue={client.education} ref={education} />

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Profession *</p>
                                        <input placeholder="Enter profession" defaultValue={client.profession} ref={profession} />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Telephone *</p>
                                        <input placeholder="Enter a telephone" defaultValue={client.telephone} ref={telephone} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Email *</p>
                                        <input placeholder="Enter an email" onChange={handleEmail} defaultValue={client.email} ref={email} />
                                        {
                                            error && <p className='validemail'>invalid Email</p>
                                        }
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="client-input">
                                        <p>Password *</p>
                                        <input placeholder="Enter Password" defaultValue={client.password} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="client-input">
                                        <p>Presenting Complaint *</p>
                                        <textarea placeholder="Enter a present considiton" defaultValue={client.complaint} ref={complaint}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="client-input">
                                        <p>Address *</p>
                                        <textarea name="address" placeholder="Enter physical adderss 1" defaultValue={client.address} ref={address} ></textarea>

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="client-input">
                                        <p>City *</p>
                                        <input placeholder="Enter City" defaultValue={client.city} ref={city} />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="client-input">
                                        <p>Postal Code *</p>
                                        <input placeholder="Enter postal code" defaultValue={client.zipcode} ref={zipcode} />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="client-input">
                                        <p>State/Province *</p>
                                        <select name="state" id="state" ref={state}>
                                            <option >Choose States/Province</option>

                                            {
                                                states.map((states, i) => {
                                                    return (
                                                        <option selected={states.id == client.state ? true : false} value={states.id} >{states.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="client-input">
                                        <p>Country *</p>
                                        <select name="country" onChange={handleCountryUpdate} ref={country}>
                                            <option value="">Choose Country</option>
                                            {
                                                countries.map((countries, i) => {
                                                    return (
                                                        <option selected={client.country == countries.id ? true : false} value={countries.id}>{countries.name}</option>
                                                    )
                                                })
                                            }


                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="go-back">
                                        <Link to="/viewcreate">Go Back</Link>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <Modal isOpen={successModal} toggle={successToggleModal} className="connect-box" centered={true}>
                                        <ModalHeader toggle={successToggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                                        <ModalBody>
                                            <div className="modal-p">
                                                <div className="right-circle"><img src={right} /></div>
                                                <h4>Saved!</h4>
                                                <p>Client profile information has been updated successfully</p>
                                            </div>
                                        </ModalBody>

                                    </Modal>
                                    <div className="create-btn">
                                        <button type="submit" onClick={saveClientinfo} >Update
                                          
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

            <Modal isOpen={emailalreadyExitmodal} toggle={EmailalreadyExittoggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={EmailalreadyExittoggleModal}><span className="ml-1 roititle font-weight-bold">Error</span></ModalHeader>
                <ModalBody>
                    <div className="modal-error-p">
                        <p>Account already exist with this email</p>
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

export default Clientinformation;