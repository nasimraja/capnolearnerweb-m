import React, { useEffect, useState } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import { useTranslation, initReactI18next } from "react-i18next";
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import backIcon from "../../../components/images/back.png";

import { API_URL } from "../../../config";
const Demodatareport = () => {

    const accessToken = localStorage.getItem('accessToken');
    const session = localStorage.getItem('selectedSession');

    const [sessions, setsessions] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        Report();


    }, []);


    const Report = () => {
        fetch(API_URL + "/configured/report?type=2",
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
                    setsessions(resp.sessions)

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
        <div className="demodata-bg">
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                    <div className="back-icon-wrp">
                        <Link to="/" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>{t("Back")}</span>
                        </Link>
                    </div>
                    <div className="groupreport-list-head">
                        <h3>{t("Pre-configured-Group-Reports")}</h3>
                    </div>
                    <ul className="groupreport-list">
                        {
                            sessions.map((sessions) => {
                                return (
                                    <li><a href={"/create/group/report/" + sessions.id + "/" + session + "/all/" + sessions.id}   >{sessions.name}</a></li>
                                )
                            }
                            )
                        }
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default Demodatareport;