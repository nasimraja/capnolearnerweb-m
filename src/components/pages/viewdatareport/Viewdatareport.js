import React, {useEffect,useState} from "react";
import {Link,useParams, Router} from 'react-router-dom';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Header from '../../component/Header';
import Filter from '../../component/Filter';
import Sidebar from '../../component/Sidebar';
import { API_URL } from "../../../config";

const Viewdatareport = () =>{
    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const [sreports, setviewsreports] = useState([]);
    const [mreports, setviewmreports] = useState([]);
 
    const sessionid = localStorage.getItem('selectedSession');
    const Clientid = localStorage.getItem('selectedClient');
    const [selectedClient,setSelectedClient] = useState() ;
    const [selectedSession,setSelectedSession] = useState() ;
    const [selectedGroup,setselectedGroup] = useState() ;
    const [selectedHomework,setselectedHomework] = useState() ;
    const [userType,setUserType] = useState() ;

    

    useEffect(() => {

        setInterval(() => {
            setSelectedClient(localStorage.getItem('selectedClient'));
            setSelectedSession(localStorage.getItem('selectedSession'));
            setselectedGroup(localStorage.getItem('selectedGroup'));
            setselectedHomework(localStorage.getItem('selectedHomework'));
        //    // console.log(selectedSession);
           setUserType(localStorage.getItem('userType'));
        }, 1000);

    }, []); 

    useEffect(() => {
        Singlesession();
        Multisession();
    },[])
      
    const Singlesession = () => {
        fetch(API_URL+"/report/single?session_id=" + sessionid,
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
                    setviewsreports(resp.reports);
                 
                   

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
    const Multisession = () => {
        fetch(API_URL+"/report/multiple?client_id=" + Clientid,
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
                    setviewmreports(resp.reports);
                   

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
        // alert("You Logout successful")
    }


    return(
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
                            
                                <div className="create-list-box"><Link to={(sreports.length == 0 || selectedSession === "" || selectedSession === "null" || selectedGroup === "true" || selectedHomework === "true" || selectedClient === "" ) ? "": "/session/data/report/single" } className={(sreports.length == 0 || (selectedSession === ""  || selectedSession === "null" ||  selectedGroup === "true" || selectedHomework === "true" || selectedClient === "") ) ? "deactivate": "" }>{t('Session-Data-Reports')}</Link></div>
                            </li>
                            <li>
                                <div className="create-list-box"><Link to={(mreports.length == 0 || selectedClient === "" || selectedGroup === "true" || selectedSession !== "" || selectedSession !== "null") ? "": "/session/data/report/multi" } className={(mreports.length == 0 || selectedClient === "" || selectedGroup === "true" || selectedSession !== "" ||selectedSession !== "null") ? "deactivate": "" }>{t('Multi-session-Data-Reports')}</Link></div>
                            </li>
                            <li>
                                <div className="create-list-box"><Link to={(sreports.length == 0 || selectedSession === "" || selectedGroup === "false" || selectedSession === "" || selectedSession === "null" ) ? "": "/session/data/report/group" } className={(sreports.length == 0 || selectedSession === "" || selectedGroup === "false" || selectedSession === "" ||selectedSession === "null" ) ? "deactivate": "" }>{t('Group-Session-Data-Reports')}</Link></div>
                            </li>
                            <li>
                                <div className="create-list-box"><Link to={( selectedSession === "" || selectedSession === "null" || selectedHomework === "false") ? "": "/session/data/report/homework" } className={(selectedSession === "" ||selectedSession === "null" || selectedHomework === "false") ? "deactivate": "" }>{t('Client-Homework-Data-Reports')}</Link></div>
                            </li>
                       </ul>
                   </div>
              
            </div>
        </div>
     </div>

    )
}

export default Viewdatareport;