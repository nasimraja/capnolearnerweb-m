import React, { Component, useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom'
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import sidebarmenu1 from '../images/sidebarmenu1.png'
import { API_URL } from "../../config";

const Filter = () => {

    // const [trainerActive, setTrainerActive] = useState(true);
    // const [trainerInactive, setTrainerInactive] = useState(false);
    // const [active2, setactive2] = useState(false);
    // const [inactivetrainers, setinactivetrainers] = useState("");
    // const [group, setgroup] = useState("");
    const { t } = useTranslation();
    const [clients, setinclients] = useState([]);
    const [trainers, settrainers] = useState([]);
    const [sesstion, setsesstion] = useState([]);
    const trainerActive = useRef()
    const trainerInactive = useRef()
    const clientActive = useRef()
    const clientInactive = useRef()
    const trainerSelected = useRef()
    const groupSelected = useRef()
    const clientSelected = useRef()
    const cid = useRef()
    const cid2 = useRef()
    const sessionSelected = useRef()

    const userId = localStorage.getItem('user_id');
    const selectedTrainer = localStorage.getItem('selectedTrainer');
    const selectedClient = localStorage.getItem('selectedClient');
    const selectedSession = localStorage.getItem('selectedSession');
    const selectedGroup = localStorage.getItem('selectedGroup');
    const selectedtrainerActive = localStorage.getItem('selectedtrainerActive');
    const selectedtrainerInactive = localStorage.getItem('selectedtrainerInactive');
    const selectedclientActive = localStorage.getItem('selectedclientActive');
    const selectedclientInactive = localStorage.getItem('selectedclientInactive');
    const [selectedHomework,setselectedHomework] = useState(localStorage.getItem('selectedHomework'));
    const [selectedStandard,setselectedStandard] = useState(localStorage.getItem('selectedStandard'));

    
    const userType = localStorage.getItem('userType');

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        setInterval(() => {
    
            setselectedHomework(localStorage.getItem('selectedHomework'));
            setselectedStandard(localStorage.getItem('selectedStandard'));

        }, 1000);

       

    }, []);

    useEffect(() => {
        if (userId && userType == 1) {
            getTrainers();
        }
        if (selectedTrainer && (userType == 1 || userType == 2)) {
            getClients();
        }
        if (selectedClient) {
            getSession()
         
        }

        // getSession();


    }, [])

    const getTrainers = () => {
        setinclients([])

        let url = API_URL + "/trainers?user_id=" + userId + "&status=2";
        // // console.log(trainerActive);
        let _trainerActive = trainerActive.current.checked;
        let _trainerInactive = trainerInactive.current.checked;

        if (trainerActive.current.checked) {
            localStorage.setItem('selectedtrainerActive', true);
        }
        else {
            localStorage.setItem('selectedtrainerActive', false);

        }
        if (trainerInactive.current.checked) {
            localStorage.setItem('selectedtrainerInactive', true);
        }
        else {
            localStorage.setItem('selectedtrainerInactive', false);

        }

        if (_trainerActive && !_trainerInactive) {
            url = API_URL + "/trainers?user_id=" + userId + "&status=1";;
        }
        else if (!_trainerActive && _trainerInactive) {
            url = API_URL + "/trainers?user_id=" + userId + "&status=0";
        }
        else if (_trainerActive && _trainerInactive) {
            url = API_URL + "/trainers?user_id=" + userId;
        }
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
                    // console.log(result.trainers)
                    if (result.status) {
                        settrainers(result.trainers)
                        // getClients();
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


    const getClients = () => {
        setsesstion([]);
        let _userId = localStorage.getItem('selectedTrainer');
        let _selectedGroup = localStorage.getItem('selectedGroup');
        let _userType = 3
        let _groupSelected = _selectedGroup === "true" ? true : false;
        let _trainer = true;
        if (_userId == "all") {
            _trainer = false;
            _userId = localStorage.getItem('user_id');

        }


        localStorage.setItem('selectedGroup', false);
        if (_groupSelected) {
            localStorage.setItem('selectedGroup', true);
            _userType = 4;
        }

        if (clientActive.current.checked) {
            localStorage.setItem('selectedclientActive', true);
        }
        else {
            localStorage.setItem('selectedclientActive', false);

        }
        if (clientInactive.current.checked) {
            localStorage.setItem('selectedclientInactive', true);
        }
        else {
            localStorage.setItem('selectedclientInactive', false);

        }
        let url = API_URL + "/clients?user_id=" + _userId + "&status=2&trainer=" + _trainer + "&user_type=" + _userType;

        let _clientActive = clientActive.current.checked;
        let _clientInactive = clientInactive.current.checked;


        if (_clientActive && !_clientInactive) {
            url = API_URL + "/clients?user_id=" + _userId + "&status=1&trainer=" + _trainer + "&user_type=" + _userType;
        }
        else if (!_clientActive && _clientInactive) {
            url = API_URL + "/clients?user_id=" + _userId + "&status=0&trainer=" + _trainer + "&user_type=" + _userType;
        }
        else if (_clientActive && _clientInactive) {
            url = API_URL + "/clients?user_id=" + _userId + "&trainer=" + _trainer + "&user_type=" + _userType;
        }


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
                    // console.log(result.clients)
                    if (result.status) {
                        setinclients(result.clients)
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
    
    const getSession = () => {
        const _cid = localStorage.getItem('selectedClient');

        let _homework = cid.current.checked;
        let _standard = cid2.current.checked;

        let _hw;
        if(_standard){
             _hw = 0;
        }

        if (!_homework && !_standard) {
            _hw = 5;
        }
       

        if (_homework) {
            _hw = 1;
        }
        if (cid.current.checked) {
            setselectedHomework(true)   ;
            localStorage.setItem('selectedHomework', true);
        }
        else {
            setselectedHomework(false)   ;

            localStorage.setItem('selectedHomework', false);

        }


        if (cid2.current.checked) {
            setselectedStandard(true)   ;
            localStorage.setItem('selectedStandard', true);
        }
        else {
            setselectedStandard(false)   ;

            localStorage.setItem('selectedStandard', false);

        }


     

        if(_homework && _standard){
            let url = API_URL + "/sessions/by/client?cid=" + _cid;
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
                        // // console.log(result.sessions)
                        
                            setsesstion(result.sessions)
                           
    
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
           
        }else{
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
                            setsesstion(result.sessions)
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


        
    }


    //    trainer check react
    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }
    const updateSelectClient = () => {
        localStorage.setItem('selectedClient', clientSelected.current.value);
        localStorage.setItem('selectedSession', null);

        getSession()
    }
    const updateSelectTrainer = () => {
        localStorage.setItem('selectedTrainer', trainerSelected.current.value);
        localStorage.setItem('selectedClient', null);

        getClients()
    }
    const updateselectedSecssion = () => {
        localStorage.setItem('selectedSession', sessionSelected.current.value);
        
    }
    const Reset = () => {
        localStorage.setItem('selectedClient', null);
        localStorage.setItem('selectedSession', null);
        localStorage.setItem('selectedTrainer', userId);
        getClients();

    }

    const handleGroup = () => {
        localStorage.setItem('selectedSession', null);
        localStorage.setItem('selectedClient', null);
        if (groupSelected.current.checked) {
            localStorage.setItem('selectedGroup', true);
        }
        else {
            localStorage.setItem('selectedGroup', false);

        }
        getClients();
    }

    // console.warn(trainers);
    return (
        <div>
            <div className="reset-wrp">
                <div className="reset-child1">
                    <p>{t("choose-slient-sessions-p")}</p>
                </div>
                <div className="reset-child2">
                    <button onClick={Reset} className="reset">{t('Reset')}</button>
                </div>
            </div>
            <div className="wrp-step-box">
                {
                    userType == 1 &&
                    <div className="step-box">
                        <div className="step-trainers-box">
                            <p>{t('Trainer-box')}</p>
                        </div>
                        <div className="main-checkbox">

                            <div className="checkbox-wrp">
                                <div class="custom-radios">
                                    <input type="checkbox" id="active" onChange={getTrainers} ref={trainerActive} defaultChecked={(selectedtrainerActive === "true" ? true : false)}
                                    />
                                    <label for="active">
                                        <span className="redious">
                                        </span>
                                        <b className="lactive">{t('Active')}</b>
                                    </label>
                                </div>


                            </div>
                            <div className="checkbox-wrp">
                                <div class="custom-radios">
                                    <input type="checkbox" id="inactive" onChange={getTrainers} ref={trainerInactive} defaultChecked={(selectedtrainerInactive === "true" ? true : false)} />
                                    <label for="inactive">
                                        <span className="redious">
                                        </span>
                                        <b className="lactive">{t('Inactive')}</b>
                                    </label>
                                </div>

                            </div>
                        </div>
                        <div className="select-client">
                            <select ref={trainerSelected} onChange={updateSelectTrainer}  >
                                <option className="selected-bold">{t('Choose-a-trainer')}</option>
                                <option value={"all"} className="selected-bold">All trainers</option>
                                {
                                    trainers.map((items) =>
                                        <option className="selected-bold" selected={items.id == selectedTrainer ? true : false} value={items.id}>
                                            {items.firstname} {items.lastname}
                                        </option>)
                                }

                            </select>
                        </div>
                        <div className="step-smallbox">
                            <p>{t('Step-1')}</p>
                        </div>
                    </div>



                }

                {
                    (userType == 2 || userType == 1) &&

                    <div className="step-box">
                        <div className="step-trainers-box">
                            <p>{t("CLIENTS")}</p>
                        </div>
                        <div className="main-checkbox">
                            
                            <div className="checkbox-wrp">
                                <div class="custom-radios">
                                    <input type="checkbox" id="color-9" value="color-9" onChange={getClients} ref={clientActive} defaultChecked={(selectedclientActive === "true" ? true : false)} />
                                    <label for="color-9">
                                        <span className="redious">
                                        </span>
                                    </label>
                                </div>
                                <div className="caption-cheeckbox">
                                    <p>Active</p>
                                </div>
                            </div>
                            <div className="checkbox-wrp">
                                <div class="custom-radios">
                                    <input type="checkbox" id="color-10" value="color-10" onChange={getClients} ref={clientInactive} defaultChecked={(selectedclientInactive === "true" ? true : false)} />
                                    <label for="color-10">
                                        <span className="redious">
                                        </span>
                                    </label>
                                </div>
                                <div className="caption-cheeckbox">
                                    <p>Inactive</p>
                                </div>
                            </div>
                            <div className="checkbox-wrp">
                                <div class="custom-radios">
                                    <input type="checkbox" id="color-8" value="color-8" onChange={handleGroup} ref={groupSelected} defaultChecked={(selectedGroup === "true" ? true : false)} />
                                    <label for="color-8">
                                        <span className="redious">
                                        </span>
                                    </label>
                                </div>
                                <div className="caption-cheeckbox">
                                    <p>{t('Group')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="select-client">
                            <select ref={clientSelected} onChange={updateSelectClient}>

                                {
                                    selectedGroup == "true"? <option className="selected-bold">Choose a Group</option>: <option className="selected-bold">{t('Choose-a-client')}</option>
                                }
                                

                                {
                                    clients.length > 0 && clients.map((client, i) =>
                                        <option className="selected-bold" selected={client.id == selectedClient ? true : false} value={client.id}>
                                            {client.firstname} {client.lastname}
                                        </option>)
                                }
                            </select>
                        </div>
                        <div className="step-smallbox">
                            <p>{t('Step')} {userType == 1 ? 2 : 1}</p>
                        </div>
                    </div>



                }

                <div className="step-box">
                    <div className="step-trainers-box">
                        <p>{t("SESSIONS")}</p>
                    </div>
                    <div className="main-checkbox">
                    <div className="checkbox-wrp">
                        <div class="custom-radios">
                            <input type="checkbox" id="cid2" onChange={getSession} ref={cid2} defaultChecked={(selectedStandard === "true" ? true : false)} />
                            <label for="cid2">
                                <span className="redious">
                                </span>
                            </label>
                        </div>
                        <div className="caption-cheeckbox">
                            <p>{t('Standard')}</p>
                        </div>
                    </div>
                    <div className="checkbox-wrp">
                        <div class="custom-radios">
                            <input type="checkbox" id="cid" onChange={getSession} ref={cid} defaultChecked={(selectedHomework === "true" ? true : false)} />
                            <label for="cid">
                                <span className="redious">
                                </span>
                            </label>
                        </div>
                        <div className="caption-cheeckbox">
                            <p>{t('Home-Work-Session')}</p>
                        </div>
                    </div>
                    </div>
                    
                    <div className="select-client">
                        <select ref={sessionSelected} onChange={updateselectedSecssion}>
                            <option className="selected-bold" value={""}>{t('Choose-a-session')}</option>
                            {
                                sesstion.map((sesstion, i) =>
                                    <option className="selected-bold" selected={sesstion.id == selectedSession ? true : false} value={sesstion.id}>
                                        {sesstion.name} {sesstion.hw == 1 ? " - HW" : ""}
                                    </option>)
                            }

                        </select>
                    </div>
                    <div className="step-smallbox">
                        <p>{t("Step")} {userType == 1 ? 3 : userType == 2 ? 2 : 1}</p>
                    </div>
                </div>

            </div>


        </div>
    );
}

export default Filter;