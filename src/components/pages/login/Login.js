import { removeData } from 'jquery';
import React, { useState,useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { ModalHeader, Modal, ModalBody } from "reactstrap";
import i18n from "i18next";
import { API_URL } from '../../../config';
import { useTranslation, initReactI18next } from "react-i18next";
import user from '../../images/user.png'

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alerts, setalerts] = useState(false)
    const [Loader, setLoader] = useState(false)
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const [requiredemail, setRequiredemail] = useState(false)

    const forgootEmail = useRef();
    const [forgotModal, setforgotModal] = useState(false);
    const forgotModalToggle = () => setforgotModal(!forgotModal);
    const [SuccessModal, setSuccessModal] = useState(false);
    const SuccessModalToggle = () => setSuccessModal(!SuccessModal);
    const [unsuccessModal, setUnsuccessModal] = useState(false);
    const unsuccessModalToggle = () => setUnsuccessModal(!unsuccessModal);

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      };

    async function loginUser(event) {
        event.preventDefault()
        setalerts(false)
        setLoader(true)

        const response = await fetch(API_URL+'/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
       
       
            


        const data = await response.json()
        setLoader(false)
        // console.log( "sddssdddsf",data)

        if (data.status) {
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('associated_practioner', data.associated_practioner);
            localStorage.setItem('associated_owner', data.associated_owner);
            localStorage.setItem('session_id', data.user_id);
            localStorage.setItem('client_id', data.user_id);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('selectedGroup', false);
            localStorage.setItem('selectedtrainerActive', true);
            localStorage.setItem('selectedStandard', true);
            localStorage.setItem('selectedtrainerInactive', false);
            localStorage.setItem('selectedclientActive', true);
            localStorage.setItem('selectedclientInactive', false);
            localStorage.setItem('selectedHomework', false);
            
            localStorage.setItem('selectedTrainer', null);
            localStorage.setItem('selectedTrainerGroup', null);
            localStorage.setItem('selectedClient', data.user_id);
            localStorage.setItem('selectLanguage', null);
            // localStorage.setItem('selectedGroup', false);
            localStorage.setItem('userType', data.user_type);
            if (data.user_type == 1 || data.user_type == 2) {
                localStorage.setItem('selectedTrainer', data.user_id);
            }
            localStorage.setItem('selectedClient', null);
            localStorage.setItem('selectedSession', null);
            if (data.user_type == 3) {
                localStorage.setItem('selectedClient', data.user_id);
            }
            navigate("/");

        } else {
            setalerts(true)


        }

        // alert('Logined')
    }


    const ForgotPassword = ()=>{
        let data ={};

        data['email'] = forgootEmail.current.value;
        
        if(forgootEmail.current.value == ""){
            setRequiredemail(true)
        }
       
    
        fetch(API_URL + "/forgot/password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
        
                },
                body:JSON.stringify(data)
            }).then((response) => {
                if (response.status == 200) {
                    response.json().then((resp) => {
                        console.log("results", resp);
                        SuccessModalToggle();
                        forgotModalToggle();
                       
                        
                    });
                }else if(response.status == 400){
                    unsuccessModalToggle();
                }
                else {
                   console.log("network error")
                }
               
            })
    
          
       
    }

    console.warn('user');
    return (
        <div className='login-bg'>
            <div className="wrp-login">
                <form onSubmit={loginUser}>
                    <div className="login-content">
                        <div className="login-database">
                            <p>{ t('Login-to-CapnoTrainer-Cloud-Database')}</p>
                        </div>
                        <div className="user-img">
                            <img src={user} alt="user-img" />
                        </div>
                        <div className="wrp-label">
                            <label>{t('Email-Address')}</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Email"
                            />
                        </div>
                        <div className="wrp-label mrt-input password-input">
                            <label>Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={passwordShown ? "text" : "password"}
                                placeholder="Password"
                                
                            />
                            <p className="forgot-password"><a href="#" onClick={forgotModalToggle}>Forgot Password</a></p>
                                
                                <i className="fa fa-eye pass-eye" aria-hidden="true" onClick={togglePasswordVisiblity}></i>
                            
                        </div>
                        {
                            alerts &&
                            <p className="invalid-p">Invalid Login</p>
                        }

                        <button className="login-btn" type="submit" >Login
                            {
                                Loader && 
                                <div id="loader"></div>
                            }
                        </button>

                    </div>
                </form>
            </div>


            <Modal isOpen={forgotModal} toggle={forgotModalToggle} centered={true}>
                <ModalHeader toggle={forgotModalToggle}><span className="ml-1 roititle ">Forgot Password</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        <div>
                            <div className="wrp-label">
                                <label>Email Address</label>
                                <input
                                    ref={forgootEmail}
                                    type="email"
                                    placeholder="Email"
                                    
                                />

                                {
                                    requiredemail && <p className='require-email'>Email is Required</p>
                                }
                                
                            </div>
                            <button className="login-btn" type="submit" onClick={ForgotPassword} >submit</button>
                        </div>
                    </div>
                </ModalBody>

            </Modal>
            <Modal isOpen={SuccessModal} toggle={SuccessModalToggle} centered={true}>
                <ModalHeader toggle={SuccessModalToggle}><span className="ml-1 roititle">Submit Successfully</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        <p>Please check your email and click on reset password</p>
                    </div>
                </ModalBody>

            </Modal>
            <Modal isOpen={unsuccessModal} toggle={unsuccessModalToggle} centered={true}>
                <ModalHeader toggle={unsuccessModalToggle}><span className="ml-1 roititle">Error</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        <p>your email not exit my database</p>
                    </div>
                </ModalBody>

            </Modal>
        </div>
    );
}


export default Login;