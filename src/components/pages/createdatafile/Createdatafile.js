import React, { Component, useEffect, useRef, useState } from "react";
import { Link, useParams, Router } from 'react-router-dom';
import { useTranslation, initReactI18next } from "react-i18next";
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { API_URL } from "../../../config";
import backIcon from "../../../components/images/back.png";


const CreatesaveFilesession = () => {
    const accessToken = localStorage.getItem('accessToken');
    const session = localStorage.getItem('selectedSession');
    
     const [sessions, setsessions] = useState([]);
     const { t } = useTranslation();

    useEffect(() => {
        Exportedfile();

    }, []);
    


    const Exportedfile = () => {
        fetch(API_URL+"/configured/report?type=1",
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
                     console.warn("result fdgffsfsdf", resp);
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
                <div className="head-demoreport">
                    <h3></h3>
                    <div className="back-icon-wrp">
                        <Link to="/" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>{t("Back")}</span>
                        </Link>
                    </div>
                </div>
                    <div className="groupreport-list-head">
                        <h3>{t("Preconfigured-Report")}</h3>
                    </div>
                    <ul className="groupreport-list">

                        {
                           sessions && sessions.map((sessions) =>
                                {
                                    return(
                                        <li><a href={"/create/exported/report/"+ sessions.id   } dangerouslySetInnerHTML={{__html: sessions.name}} ></a></li>
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

export default CreatesaveFilesession;