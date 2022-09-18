
import { update } from "plotly.js";
import React, { Component, useEffect, useRef, useState } from "react";
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";

import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

import { Link, useParams, Router } from 'react-router-dom';
import Header from '../../component/Header';
import Sidebar from '../../component/Sidebar';
import { API_URL } from "../../../config";

const Subscriptionmanagement = () => {




    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('user_id');
    const [owner, setOwner] = useState([]);
    const [autoupdate, setAutoUpdate] = useState(0);
    const [autorenew, setAutoRenew] = useState(0);
    const [successModal, setsuccessModal] = useState(false);
    const successToggleModal = () => setsuccessModal(!successModal);

    useEffect(() => {
        getOwnerProfile();
    }, [])

    const getOwnerProfile = () => {
        fetch(API_URL + "/owner/profile/" + userId,
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
                    setOwner(resp.owner[0]);


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
    const subscriptionSave = (_autorenew, _autoupdate) => {
        let data = {};

        data['autoupdate'] = _autoupdate;
        data['autorenew'] = _autorenew;


        fetch(API_URL + "/owner/subscription/update/" + userId, {
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

                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }
            // alert("Updated")

        })

    }
    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const handleAutoUpdate = (v) => {
        setAutoUpdate(v);

        subscriptionSave(autorenew, v);


    }

    const handleAutorenew = (v) => {
        setAutoRenew(v);

        subscriptionSave(v, autoupdate);


    }


    return (
        <div>
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">

                    <div className="subscription-content">
                        <h3>Your subscription expiration date is: xx MONTH xxxx</h3>
                        <div className="software-updated-wrp">
                            <div className="software-updt-child1">
                                <h3>{t('Auto-software-update')}</h3>

                            </div>
                            <div className="software-updt-child1">
                                {
                                    owner.autoupdate >= 0 ?
                                        <div className="checkbox-wrp">

                                            <div className="radio-input"><input class="form-check-input" onChange={() => handleAutoUpdate(0)} type="radio" defaultChecked={owner.autoupdate == 0 ? true : false} value="0" name="autoaupdate" /><span>No</span></div>
                                            <div className="radio-input"> <input class="form-check-input" name="autoaupdate" type="radio" defaultChecked={owner.autoupdate == 1 ? true : false} value="1" onChange={() => handleAutoUpdate(1)} /><span>Yes</span></div>



                                        </div>
                                        :
                                        null
                                }


                            </div>
                        </div>

                        <ul className="anual-renew-list">
                            <li><h3>Annual Subscription renewal rates:</h3></li>
                            <li><p>$175.00 per year for a single instrument.</p></li>
                            <li><p>$60.00 per year for each additional instrument</p></li>

                        </ul>

                        <div className="renew-wrp">
                        <p>{t('Click-here-to')} <a href="#">{t('RENEW')}</a> {t('now')}.</p>
                        <div className="software-updated-wrp">
                            <div className="software-updt-child1">
                                <h3>Automatic subscription renewal:</h3>
                            </div>
                            <div className="software-updt-child1">
                                {
                                    owner.autorenew >= 0 ?
                                        <div className="checkbox-wrp">
                                            <div className="radio-input"> <input class="form-check-input" name="autorenew" type="radio" defaultChecked={owner.autorenew == 1 ? true : false} value="1" onChange={() => handleAutorenew(1)} /><span>Yes</span></div>
                                            <div className="radio-input"><input class="form-check-input" onChange={() => handleAutorenew(0)} type="radio" defaultChecked={owner.autorenew == 0 ? true : false} value="0" name="autorenew" /><span>No</span></div>


                                            {/* <div className="radio-input"><input class="form-check-input" onChange={() => handleAutorenew(0)} type="radio" defaultChecked={owner.autorenew == 0? true : false} value="0" name="autorenew" /><span>{t('no')}</span></div>
                           <div className="radio-input"> <input class="form-check-input" name="autorenew" type="radio" defaultChecked={owner.autorenew == 1? true : false} value="1" onChange={() => handleAutorenew(1)} /><span>{t('yes')}</span></div> */}

                                            {/* <div className="radio-input"><input class="form-check-input" onChange={() => handleAutorenew(0)} type="radio" defaultChecked={owner.autorenew == 0? true : false} value="0" name="autorenew" /><span>{t('no')}</span></div>
                           <div className="radio-input"> <input class="form-check-input" name="autorenew" type="radio" defaultChecked={owner.autorenew == 1? true : false} value="1" onChange={() => handleAutorenew(1)} /><span>{t('yes')}</span></div> */}

                                        </div>
                                        :
                                        null
                                }

                            </div>
                        </div>
                        </div>

                        <div className="notification-c">
                            <p>If you choose to auto-renew, you will receive two emails, 30 days and 10 days before your expiration date, with a link for payment by credit card or PayPal.</p>
                            <h3>If you fail to renew your subscription, three thigs will happen:</h3>
                            <div className="notify-step-p">
                                <p>(1) Your software will no longer update.</p>
                                <p>(2) Your access to live tech support will terminate.</p>
                                <p>(3) You will no longer be able to save data to your Cloud account, although you will continue to have access to your existing data.</p>

                            </div>
                           <div className="mebership-status">
                           <p><b>{t('Membership-Status')}</b> Active (<b>{t('Expiry-Date')}</b>: March 7,2022).</p>
                           </div>
                        </div>

                    </div>
                </div>
            </div>

            <Modal isOpen={successModal} toggle={successToggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={successToggleModal}><span className="ml-1 roititle font-weight-bold">Successfull</span></ModalHeader>
                <ModalBody>
                    <div className="modal-p">

                        <p>Subscription Updated Successfully</p>
                    </div>
                </ModalBody>

            </Modal>
        </div>
    )
}

export default Subscriptionmanagement;