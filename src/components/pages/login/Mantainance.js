import { removeData } from 'jquery';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import i18n from "i18next";
import { API_URL } from '../../../config';
import { useTranslation, initReactI18next } from "react-i18next";
import user from '../../images/user.png'

const Mantainance = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alerts, setalerts] = useState(false)
    const [Loader, setLoader] = useState(false)
    const navigate = useNavigate();

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

    console.warn('user');
    return (
        <div className='login-bg'>
            <div className="wrp-login">
                <form onSubmit={loginUser}>
                    <div className="login-content">
                        <div className="login-database">
                            {/* <p>{ t('Login-to-CapnoTrainer-Cloud-Database')}</p> */}
                            <p>Site is under Mantainance</p>
                        </div>
                        {/* <div className="user-img">
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
                        <div className="wrp-label mrt-input">
                            <label>Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"
                            />
                        </div> */}
                        {
                            alerts &&
                            <p className="invalid-p">Invalid Login</p>
                        }

                        {/* <button className="login-btn" type="submit" >Login
                            {
                                Loader && 
                                <div id="loader"></div>
                            }
                        </button> */}

                    </div>
                </form>
            </div>
        </div>
    );
}

 
export default Mantainance;