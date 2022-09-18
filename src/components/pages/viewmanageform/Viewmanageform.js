import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Header from '../../component/Header';
import Filter from '../../component/Filter';
import Sidebar from '../../component/Sidebar';
import { API_URL } from "../../../config";

const Viewmanageform = () => {

    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const [selectedClient, setSelectedClient] = useState();
    const [selectedSession, setSelectedSession] = useState();
    const Clientid = localStorage.getItem('selectedClient');
    const sessionid = localStorage.getItem('selectedSession');
    const [forms, setforms] = useState([]);
    const [trainerforms, settrainerforms] = useState([]);
    const selectedtrainerActive = localStorage.getItem('selectedtrainerActive');
    const [clientlength, setClientlength] = useState([]);
    const [trainerLength, setTrainerLength] = useState([]);

    const [selectedHomework,setselectedHomework] = useState('selectedHomework');
    const [homeworklist, setHomeworklist] = useState([])
    const [userType, setUserType] = useState();
    const [sessionLength, setSessionLength] = useState([]);
    


console.log("selectedClient",selectedClient)
console.log("Clientid",Clientid)
    useEffect(() => {
        setInterval(() => {
            setSelectedClient(localStorage.getItem('selectedClient'));
            setSelectedSession(localStorage.getItem('selectedSession'));
            setselectedHomework(localStorage.getItem('selectedHomework'));
            setUserType(localStorage.getItem('userType'));
        }, 1000);

       
    }, []);

    useEffect(() => {
       

        if(selectedClient !== "null"){
            getclientform();
            viewtrainerform();
            Homeworklist();
        getSession();

        }
        

    }, [selectedClient,selectedSession]);






    const getclientform = () => {
        fetch(API_URL + "/forms/client/" + selectedClient,
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
                    setClientlength(resp.data);



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

    const viewtrainerform = () => {
        fetch(API_URL + "/forms/trainer/" + selectedClient,
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
                    // // console.log("result", resp);
                    let _temp = [] ;
                    resp.data.map((v,i) => {
                        if(v.sessid == selectedSession || v.sessid == null){
                            _temp.push(v)
                        }
                        if(i == (resp.data.length - 1)){
                            setTrainerLength(_temp);
                        }


                    })



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


    
    const getSession = () => {
        const _cid = localStorage.getItem('selectedClient');
 
         let   _hw = 1;
          
     
 
            let url = API_URL + "/sessions?cid=" + _cid + "&hw=" + _hw;
            fetch(url,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': accessToken,
                    },
                }
    
            ).then((response) => {
                if (response.status == 200) {
                    response.json().then((result) => {
                        // // console.log(result.sesstion)
                        if (result.status) {
                            setSessionLength(result.sessions)
                            // // console.log(setsesstion)
                        }
    
    
                        else {
                            alert("no data error")
                        }
    
                    })
                }
                else if (response.status == 401) {
                    logout()
                }
                else {
                    alert("network error")
                }
    
    
            }).catch(err => {
                // // console.log(err)
    
            })
     


        
    }

    const Homeworklist = () => {
        fetch(API_URL + "/homework/client/" + sessionid,
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

                    setHomeworklist(resp.data);



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

    const setHomework = () => {
        if(selectedHomework === "false" && sessionLength.length > 0){
            localStorage.setItem("selectedHomework" , true)
            localStorage.setItem("selectedStandard" , false)
            localStorage.setItem("selectedSession" , null)
            window.location.reload()
        }

    }

    const logout = () => {
        localStorage.clear();
        // alert("You Logout successful")
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
                                <div className="create-list-box"><Link to="/bankform">{t('Download-Fill-in-PDF-Blank-Forms')}</Link></div>
                            </li>
                            <br />
                            <li>
                                <div className="create-list-box"><Link to={(selectedClient === "" || selectedClient === "Choose a Client") ? "" : "/upload/client/form"} className={((selectedClient === "" || selectedClient === "Choose a Client")) ? "deactivate" : ""}>{t('Upload-Completed-Client-Forms')}</Link></div>
                            </li>
                            <li>
                                <div className="create-list-box"><Link to={(clientlength.length == 0) ? "" : "/view/uploaded/client/form"} className={(clientlength.length == 0) ? "deactivate" : ""} >{t('View-Completed-Client-Forms')}</Link></div>
                            </li>
                            <br />
                            <li>
                                <div className="create-list-box"><Link to={(selectedClient === "" || selectedClient === "Choose a Client") ? "" : "/upload/trainner/form"} className={(selectedClient === "" || selectedClient === "Choose a Client") ? "deactivate" : ""}>{t('Upload-Completed-Trainer-Forms')}</Link></div>
                            </li>
                           
                            <li>
                                <div className="create-list-box"><Link to={(trainerLength.length == 0) ? "" : "/view/uploaded/trainer/form"} className={(trainerLength.length == 0) ? "deactivate" : ""}>{t('View-Completed-Trainer-Forms')}</Link></div>
                            </li>
                            <br />
                           
                            <li>
                                <div className="create-list-box"  onClick={ () => setHomework() }><Link to={(selectedHomework === "false" || selectedSession === "" || sessionLength.length == 0) ? "" : "/upload/homework/asignment"} className={(selectedHomework === "false" || selectedSession === "" || sessionLength.length == 0) ? "deactivate" : ""}>{t('Upload-Homework-Assignment')}</Link></div>
                            </li>
                            <li>
                                <div className="create-list-box" onClick={ () => setHomework() }><Link  to={(selectedHomework === "false" || selectedSession === "" || selectedSession === "null" || sessionLength.length == 0 || homeworklist.length == 0) ? "" : "/view/completed/client/work"} className={(selectedHomework === "false" || selectedSession === "" || selectedSession === "null" || sessionLength.length == 0 || homeworklist.length == 0) ? "deactivate" : ""}>{t('View-Homework-Assignment')}</Link></div>
                            </li>

                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Viewmanageform;