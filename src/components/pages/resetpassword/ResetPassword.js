import React, { Component, useEffect, useState,useRef } from 'react';
import { Link, useParams, Router,useNavigate } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, Row } from 'reactstrap';
import { API } from "../../../config";


const ResetPassword = (props) => {

    const {token} = useParams();
    const password = useRef();
    const [passwordError, setPasswordError] = useState("")
    const [pass, setPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [successfulResetpassModel, setSuccessfulResetpassModel] = useState(false);
    const successfulResetpassModalToggle = () => setSuccessfulResetpassModel(!successfulResetpassModel);

    useEffect(() => {

    }, [])

    const Checkvalidate = (e)=> {
        const confpass = e.target.value;
        setConfirmPass(confpass);
        if(pass != confpass){
            setPasswordError("password should be match");
        }else{
            setPasswordError("");
        }
    }

    const ResttPass = ()=>{
        let data ={};
        data['pass'] = password.current.value;
        data['resetpassword'] = token;
        
      
       
        fetch(API+"/update/password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
        
                },
                body:JSON.stringify(data)
            }).then((response) => {
                if (response.status == 200) {
                    response.json().then((resp) => {
                        console.log("results", resp);
                        
                    });
                }
                else {
                    alert("invalid login")
                }
               
            })
    
          
       
    }

    return (
        <div>
            <div className="reset-password-bg">
                <div className="container">
                    <div className="login-content">
                        <ul className="reset-input-list">
                            <li><input placeholder="Enter New Password" type="text" value={pass} name='pass' onChange={(e) => setPass(e.target.value) } /></li>
                            <li><input placeholder="Enter Confirm Password" type="text" value={confirmPass} onChange={(e) => Checkvalidate(e) } ref={password} />
                            <p className='match-pass'>{passwordError}</p>
                            </li>
                            <li>
                                <div className="submit-btn-reset" onClick={() => { ResttPass(); successfulResetpassModalToggle();}}><button>Submit</button></div>
                            </li>
                        </ul>
                    </div>
                </div>
                
            </div>
            <Modal isOpen={successfulResetpassModel} toggle={successfulResetpassModalToggle} centered={true}>
                <ModalHeader toggle={successfulResetpassModalToggle}><span className="ml-1 roititle">Successfully Reset your Password</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">
                        <p><a href="/">Click here to back Home page</a></p>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );

}


export default ResetPassword;

