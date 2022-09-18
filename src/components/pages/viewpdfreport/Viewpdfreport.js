import React, {useEffect,useState} from "react";
import {Link,useParams, Router} from 'react-router-dom';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

import Header from '../../component/Header';
import Filter from '../../component/Filter';
import Sidebar from '../../component/Sidebar';
import { API_URL } from "../../../config";


const Viewpdfreport = () =>{

    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const [pdfs, setpdfs] = useState([]);
    const [multiplepdfs, setmultiplePdf] = useState([]);
    const [sessionNotes, setSessionNotes] = useState([]);
    const [homeworkdata,setHomeworkdata] = useState([])
    const [grouplist,setGrouplist] = useState([])
    
    const sessionid = localStorage.getItem('selectedSession');
    const Clientid = localStorage.getItem('selectedClient');
    const [selectedClient,setSelectedClient] = useState() ;
    const [selectedSession,setSelectedSession] = useState() ;
    const [selectedGroup,setselectedGroup] = useState() ;
    const [selectedHomework,setselectedHomework] = useState();
    const [selectedStandard,setselectedStandard] = useState();
    
    const [userType,setUserType] = useState() ;
  

    

    useEffect(() => {

        setInterval(() => {
            setSelectedClient(localStorage.getItem('selectedClient'));
            setSelectedSession(localStorage.getItem('selectedSession'));
            setselectedGroup(localStorage.getItem('selectedGroup'));
            setselectedHomework(localStorage.getItem('selectedHomework'));
            setselectedStandard(localStorage.getItem('selectedStandard'));
        //    // console.log(selectedSession);
           setUserType(localStorage.getItem('userType'));
        }, 1000);

    }, []); 

    useEffect(() => {
        Singlesession();
        Multisession();
        pdfReportNote()
        homeworkdatalist()
        groupdatalist()
    },[selectedSession,selectedClient,selectedGroup,selectedHomework,selectedStandard])
      
    const Singlesession = () => {
        fetch(API_URL+"/report/single/pdf?session_id=" + sessionid,
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
                    setpdfs(resp.pdfs);
                   
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
        fetch(API_URL+"/report/multiple/pdf?client_id=" + Clientid,
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
                    setmultiplePdf(resp.pdfs);
                   

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

    const pdfReportNote = () => {
        fetch(API_URL+"/report/notes?session_id=" + sessionid,
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
                    console.warn("result", resp);
                   
                    setSessionNotes(resp.notes)

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

    const homeworkdatalist = () => {


        fetch(API_URL + "/report/single/pdf?session_id=" + sessionid,
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
                   setHomeworkdata(resp.pdfs);

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


    const groupdatalist = () => {


        fetch(API_URL + "/report/single/pdf?session_id=" + sessionid,
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
                    setGrouplist(resp.pdfs)


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
                            
                                <div className="create-list-box"><Link to={(pdfs.length == 0 || selectedSession === "" ||selectedSession === "null" || selectedGroup === "true" || selectedHomework === "true" || selectedClient === "" ) ? "": "/pdf/session/data/report/single" } className={(pdfs.length == 0 || (selectedSession === "" ||selectedSession === "null" || selectedGroup === "true" || selectedHomework === "true" || selectedClient === "") ) ? "deactivate": "" }> {t('pdf-Session-Data-Reports')}</Link></div>
                            </li>
                            <li>
                                <div className="create-list-box"><Link to={(multiplepdfs.length == 0 || selectedClient === "" || selectedGroup === "true" || selectedSession !== "" ||selectedSession !== "null" ) ? "": "/pdf/session/data/report/multi" } className={(multiplepdfs.length == 0 || selectedClient === "" || selectedGroup === "true" || selectedSession !== "") ? "deactivate": "" }>{t('pdf-Multi-session-Data-Reports')}</Link></div>
                            </li>
                            <li>
                                <div className="create-list-box"><Link to={(grouplist.length == 0 || selectedSession === "" || selectedGroup === "false" || selectedSession === "" ||selectedSession === "null" || selectedHomework === "true" ) ? "": "/pdf/session/data/report/group" } className={(grouplist.length == 0 || selectedSession === "" ||selectedSession === "null" || selectedGroup === "false" || selectedSession === "" || selectedHomework === "true" ) ? "deactivate": "" }> {t('pdf-Group-Session-Data-Reports')} </Link></div>
                            </li>
                            <li>
                                <div className="create-list-box"><Link to={(homeworkdata.length == 0 || selectedSession === "" ||selectedSession === "null" || selectedHomework === "false") ? "": "/pdf/session/data/report/homework" } className={(homeworkdata.length == 0 ||selectedSession === "null" || selectedSession === "" || selectedHomework === "false") ? "deactivate": "" }>{t('Client-Homework-Data-Session')}</Link></div>
                            </li>
                            <li>
                                <div className="create-list-box"><Link to={(sessionNotes.length == 0 || (selectedSession === "" ||selectedSession === "null" || selectedGroup === "true" || selectedHomework === "true" || selectedClient === "") ) ? "": "/pdf/sessetion/report/notes" } className={(sessionNotes.length == 0 || (selectedSession === "" ||selectedSession === "null" || selectedGroup === "true" || selectedHomework === "true" || selectedClient === "") ) ? "deactivate": "" }>{t('Session-Report-Notes')}</Link></div>
                            </li>
                       </ul>
                   </div>
              
            </div>
        </div>
     </div>

    )
}

export default Viewpdfreport;