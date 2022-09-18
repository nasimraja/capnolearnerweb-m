import React, { useEffect, useState, } from "react";
import { Link, useParams } from 'react-router-dom';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Header from '../../component/Header';
import Filter from '../../component/Filter';
import Sidebar from '../../component/Sidebar';
import { API_URL } from "../../../config";

const Sectionreportassembly = () => {

    const { t } = useTranslation()
  
    const accessToken = localStorage.getItem('accessToken');
    const [pdfs, setpdfs] = useState([]);
    const sessionid = localStorage.getItem('selectedSession');
    const [selectedClient,setSelectedClient] = useState() ;
    const [selectedSession,setSelectedSession] = useState() ;
    const [selectedGroup,setselectedGroup] = useState() ;
    const [selectedHomework,setselectedHomework] = useState() ;

    

    useEffect(() => {
        
        setInterval(() => {
            setSelectedClient(localStorage.getItem('selectedClient'));
            setSelectedSession(localStorage.getItem('selectedSession'));
            setselectedGroup(localStorage.getItem('selectedGroup'));
            setselectedHomework(localStorage.getItem('selectedHomework'));
        }, 1000);

    }, []); 

    useEffect(() => {
        assemblySessionReport();
    }, [selectedSession,selectedClient,selectedGroup,selectedHomework]);


    const assemblySessionReport = () => {
        
        fetch(API_URL +"/assembly/session/report/" + sessionid,
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
                  
                    setpdfs(resp.data);
                   
                   

                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                // alert("network error")
            }


        })
    }


    return (
        <div>
            <Header />
            <div className="wrp-dashbord">
                <div className="sidebar-section">
                    <Sidebar />
                </div>
                <div className="right-section">
                    <Filter />

                    <div className="create-section">
                        <ul className="create-list">
                            <li>
                               {/* {selectedSession} */}
                                <div className="create-list-box"><Link to={(selectedSession === "" || (selectedGroup === "true" || selectedClient === "") || selectedSession === "" || selectedSession === "null"   ) ? "": "/assemblyreport" } className={(selectedSession === "" || (selectedGroup === "true" || selectedClient === "") || selectedSession === "" ||selectedSession === "null" ) ? "deactivate": "" }>{t('Create-Session-Report')}</Link></div>
                            </li>
                            <li>
                                <div className="create-list-box"><Link to={((selectedSession === "" || (selectedGroup === "true" || selectedClient === "") || selectedSession === "" || pdfs.length == 0 ||selectedSession === "null"  ) ? "": "/view/assembly" )} className={(selectedSession === "" || (selectedGroup === "true" || selectedClient === "" ) || selectedSession === "" || pdfs.length == 0 ||selectedSession === "null" ) ? "deactivate": "" }>{t('View/Edit/Delete/Download Session Report')}</Link></div>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sectionreportassembly;