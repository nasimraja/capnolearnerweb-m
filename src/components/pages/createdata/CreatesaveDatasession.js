import React, { Component, useEffect, useRef, useState } from "react";
import { Link, useParams, Router } from 'react-router-dom';
import { useTranslation, initReactI18next } from "react-i18next";
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { API_URL } from "../../../config";
import backIcon from "../../../components/images/back.png";

import { csv } from 'd3';

const CreatesaveDatasession = () => {
    const accessToken = localStorage.getItem('accessToken');
    const session = localStorage.getItem('selectedSession');
    const userId = localStorage.getItem('user_id');
    const [sessions, setsessions] = useState([]);
    const [emgAvg, setEmgAvg] = useState(false);
    const [emgRaw, setEmgRaw] = useState(false);
    const [hrv, setHrv] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        Report();
        getUser();

    }, [userId]);


    const Report = () => {
        fetch(API_URL + "/configured/report?type=1",
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
                    getCsv()
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

    const getCsv = () => {
        fetch(API_URL + "/session/data?session_id=" + session + "&signal_name=emg3_wave",
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
                    if (resp.sessions[0]) {
                        // setCsvFile(resp.sessions[0].sessiondata)
                        getData(resp.sessions[0].sessiondata, "raw")
                    }


                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                console.log("network error")
            }
        })


        fetch(API_URL + "/session/data?session_id=" + session + "&signal_name=emg1_avg",
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
                    if (resp.sessions[0]) {
                        // setCsvFile(resp.sessions[0].sessiondata)
                        getData(resp.sessions[0].sessiondata, "avg")
                    }


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


    async function getData(_csvFile, _stat) {


        //   // console.log(userTimeOffset);
        csv('//capno-data.s3.amazonaws.com/' + _csvFile).then(data => {
            if (data.length > 2) {
                if (_stat == 'avg') {
                    setEmgAvg(true);
                }
                else if (_stat == 'raw') {
                    setEmgRaw(true)
                }
            }
        })
    }

    async function getUser() {


        fetch(API_URL + "/user/profile/" + userId,
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
                    setHrv(resp.owner[0].qthird);


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
                    <div className="back-icon-wrp">
                        <Link to="/" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>{t("Back")}</span>
                        </Link>
                    </div>
                    <div className="groupreport-list-head">
                    <h3>{t("Preconfigured-Report")}</h3>

                    </div>
                    <ul className="groupreport-list">

                        {
                            sessions.map((sessions) => {
                                if ((sessions.id == 46 && emgAvg) || (sessions.id == 47 && emgRaw) || (sessions.id != 46 && sessions.id != 47)) {

                                    return (
                                        <li><a href={"/create/report/0/" + sessions.id + "/" + session + "/all/" + sessions.id} dangerouslySetInnerHTML={{ __html: sessions.name }} ></a></li>
                                    )
                                }
                            }
                            )
                        }


                    </ul>
                </div>
            </div>

        </div>
    )
}

export default CreatesaveDatasession;