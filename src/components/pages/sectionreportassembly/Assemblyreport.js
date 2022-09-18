import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Header from '../../component/Header';
import Filter from '../../component/Filter';
import Sidebar from '../../component/Sidebar';
import { API_URL } from "../../../config";
import backIcon from "../../images/back.png";
import generateCalendar from "antd/lib/calendar/generateCalendar";

const Assemblyreport = () => {

    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const sessionid = localStorage.getItem('selectedSession');
    const Clientid = localStorage.getItem('selectedClient');
    // const selectedSession = localStorage.getItem('selectedSession');
    
    const [showsessiondate, setShowsessiondate] = useState(false)
    const [showSessionForm, setShowSessionForm] = useState(false)
    
    const [sessionForm, setSessionForm] = useState(false)
    const [generalForm, setGeneralForm] = useState(false)
    const handleClick = () => setShowsessiondate(!showsessiondate)
    const [completedForm, setCompletedForm] = useState(false)
    const handleCompleteForm = () => {
        setCompletedForm(!completedForm)
        // setSessionForm(!sessionForm);
        // setGeneralForm(!generalForm)
    }
    const [pdfdata, setPdfdata] = useState([]);
    const [formsName, setFormsName] = useState([])
    const [practionerformsName, setPractionerFormsName] = useState([])
    const [livenotesinput, setlivenotesinput] = useState(false);
    const [liveimagesinput, setliveimagesinput] = useState(false);
    const [reportnotesinput, setreportnotesinput] = useState(false);
    const [completeform, setCompleteform] = useState(false);
    const [selected, setSelected] = useState([]);
    const [selectedClient, setSelectedClient] = useState([]);
    const [selectedPractionar, setSelectedPractionar] = useState([]);
    const [loaderModal, setLoaderModal] = useState(false);
    const loaderToggleModal = () => setLoaderModal(!loaderModal);

    const [liveNotes, setLivenotes] = useState([]);
    const [reportNotes, setReportNotes] = useState([]);
    const [liveImages, setLiveImages] = useState([]);
    const [completedForms, setCompletedForms] = useState([]);


    const navigate = useNavigate();
    const pdfnames = useRef();
    const livenotes = useRef();
    const liveimages = useRef();
    const reportsnote = useRef();
    const cforms = useRef();


    useEffect(() => {
        Singlesession();
        getclientformName();
        getPractionerformName();
        ViewlivesessionImages();
        Viewlivesessionnotes();
        getReportNotes()
    }, []);

    // console.log("sessionid", sessionid)
    // console.log("Clientid", Clientid)



    function unCheck() {
        var x = document.getElementsByClassName("checkbox");
        for (i = 0; i < x.length; i++) {
            x[i].checked = false;
            x[i].value = 0;
        }
    }

    const practionarNumberArray = [];
    var practionarlength = selectedPractionar.length;

    for (var i = 0; i < practionarlength; i++) {
        practionarNumberArray.push(parseInt(selectedPractionar[i]));
    }

    const checkboxHandleclient = (event) => {

        const { checked, value } = event.currentTarget;

        setSelectedClient(
            prev => checked
                ? [...prev, value]
                : prev.filter(val => val !== value)
        );



    }

    const clientNumberArray = [];
    var clientlength = selectedClient.length;

    for (var i = 0; i < clientlength; i++) {
        clientNumberArray.push(parseInt(selectedClient[i]));
    }
    const checkboxHandlePractional = (event) => {

        const { checked, value } = event.currentTarget;

        setSelectedPractionar(
            prev => checked
                ? [...prev, value]
                : prev.filter(val => val !== value)
        );



    }


    const PdfnumberArray = [];
    var Pdflength = selected.length;

    for (var i = 0; i < Pdflength; i++) {
        PdfnumberArray.push(parseInt(selected[i]));
    }

    const checkboxHandle = (event) => {

        const { checked, value } = event.currentTarget;

        setSelected(
            prev => checked
                ? [...prev, value]
                : prev.filter(val => val !== value)
        );



    }
    const saveAssemblyreport = () => {
        // alert("jiio")
        // console.log("what data hahahah");

        const clientandpractionararray = clientNumberArray.concat(practionarNumberArray)

        let data = {};
        data['reportids']  = [] ;
        data['forms']  = [] ;
        data['lnotes']  = "" ;
        data['limages']  = "" ;
        data['rnotes']  = "" ;
        data['cforms']  = "" ;

       
        
        data['session'] = sessionid;
        if(PdfnumberArray.length > 0){
            data['reportids'] = PdfnumberArray;
        }
        if(clientandpractionararray.length > 0){
            data['forms'] = clientandpractionararray;
        }
        if(liveNotes.length > 0){
            data['lnotes'] = livenotes.current.value;

        }
        if(liveImages.length > 0){
            data['limages'] = liveimages.current.value;
        }
        if(reportNotes.length > 0){
            data['rnotes'] = reportsnote.current.value;
        }
    console.log("data" ,(data['lnotes']  == "" ||  data['lnotes']  == "0"))
        data['cforms'] = formsName.length > 0 && cforms.current.value;
        if(data['reportids'].length ==  0  && (data['lnotes']  == "" ||  data['lnotes']  == "0") &&  (data['limages'] == "" || data['limages'] == "0") && (data['rnotes']  == "" && data['rnotes']  == "0") && (data['cforms']  == "" || data['cforms']  == "0") ){
            alert("Please make a selection")
            return false;
        }
        else{


        fetch(API_URL + "/save/assembly/report", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status == 200) {
                response.json().then((resp) => {
                    // console.log("results", resp);
                    navigate("/edit/assembly/report/" + resp.id)
                    setLoaderModal(false)

                });
            }
            else {
                console.log("network error")
            }

        })

    }




    }

    

    const Singlesession = () => {


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
                    let _temp = [];
                    setPdfdata(resp.pdfs)
                     

                    // let len = pdfs.length;
                    //   console.warn(len);


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
    // const getpdfname = () => {

    //     fetch(API_URL + "/assembly/session/report/" + sessionid,
    //         {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'x-access-token': accessToken,
    //             },
    //         }
    //     ).then((response) => {
    //         if (response.status == 200) {
    //             response.json().then((resp) => {

    //                 setPdfdata(resp.data);



    //             });
    //         }
    //         else if (response.status == 401) {
    //             logout()
    //         }
    //         else {
    //             console.log("network error")
    //         }


    //     })
    // }

    const getclientformName = () => {

        fetch(API_URL + "/get/client/formname/" + Clientid,
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

                    setFormsName(resp.data);

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

    const getPractionerformName = () => {



        fetch(API_URL + "/get/practioner/formname/" + Clientid + "/" + sessionid,
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

                    setPractionerFormsName(resp.data);
                    resp.data.length > 0 && resp.data.map((value, i) => {
                        if(value.sessid == sessionid){
                            setShowSessionForm(true)
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

 
    const getReportNotes = () => {
        let url = API_URL + "/view/report/notes/"+sessionid ; 
       
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
            response.json().then((resp) => {
             
                    // setReportDetails(resp.details);
                    if(resp.success){
                        setReportNotes(resp.data) ;

                    }
            
            })
        }
    })
    }


    
    const Viewlivesessionnotes = () => {

        let dataType = 4;

        fetch(API_URL + "/get/live/session/info/" + sessionid + "/" + dataType,
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
                    if(resp.success){
                        setLivenotes(resp.data)
                    }
                    
                    // Viewlivenote(_clientName, _trainerName, resp.dataimg, _sessionDate)  

                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                alert("network error")
            }


        })


    }


    
    
    const ViewlivesessionImages = () => {

        let dataType = 3;

        fetch(API_URL + "/get/live/session/info/" + sessionid + "/" + dataType,
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
                    // setLivenotes(resp.data)
                    if(resp.success){
                        setLiveImages(resp.data)
                    }
                    // Viewlivenote(_clientName, _trainerName, resp.dataimg, _sessionDate)  

                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                alert("network error")
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
                    <div className="back-icon-wrp">
                        <Link to="/section/report/assembly" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>Back</span>
                        </Link>
                    </div>
                    <div className="assembly-box">

                        <div className="assembly-content">
                            <h3>{t("Session-Assembly-Reports")}</h3>
                            <p>{t("assembly-report-p")}</p>
                            <p>{t("assembly-report-p2")}</p>
                        </div>
                        <ul className="assembly-list">
                            <li><p>{t("a-SUMMARY-at-the-top-of-the-Report")}</p></li>
                            <li><p>{t("(2) a DESCRIPTION at the bottom of each SESSION IMAGE, and")}</p></li>
                            <li><p>{t("a-DESCRIPTION-at-the-bottom-of-each-DATA-REPORT-GRAPH")}</p></li>
                            {/* <li><p>{t("(a-)a-SUMMARY-at-the-top-of-the-Report")}</p></li> */}
                        </ul>

                        <ul className="checkbox-assemblylist">
                            {
                                pdfdata.length > 0 &&
                                <li><p><input type="checkbox" onClick={handleClick} className="checkbox" /> Session Data (saved PDF files)</p></li>
                            }

                            {
                                showsessiondate &&

                                pdfdata.length > 0 && pdfdata.map((v, i) => {
                                    return (
                                        <li className="mrl-pdf"><p><input type="checkbox" onChange={checkboxHandle} value={v.id} ref={pdfnames} className="checkbox" /> {v.pdf_name}</p></li>
                                    )
                                })

                            }
                            {
                                liveNotes.length > 0  &&
                                <li><p><input type="checkbox" value={livenotesinput == true ? 1 : 0} onChange={() => setlivenotesinput(!livenotesinput)} ref={livenotes} className="checkbox" /> Live Session Notes</p></li>
                            }
                            {
                                liveImages.length > 0 &&
                            <li><p><input type="checkbox" value={liveimagesinput == true ? 1 : 0} onChange={() => setliveimagesinput(!liveimagesinput)} ref={liveimages} className="checkbox" /> Live Session Images</p></li>                                
                            }
                            {
                                reportNotes.length > 0 &&
                                <li><p><input type="checkbox" value={reportnotesinput == true ? 1 : 0} onChange={() => setreportnotesinput(!reportnotesinput)} ref={reportsnote} className="checkbox" /> Report Session Notes</p></li>
                            }
                            {formsName.length > 0 &&

                                <li><p><input type="checkbox" value={completeform == true ? 1 : 0} onChange={() => setCompleteform(!completeform)} ref={cforms} onClick={handleCompleteForm} className="checkbox" /> Completed Forms</p></li>
                            }
                        </ul>
                        {
                            completedForm &&
                            <ul className="checkbox-assemblylist mt-0">

                            <li className="mrl-pdf"><p><input type="checkbox"  onChange={() => setGeneralForm(!generalForm)} value={'1'}  className="checkbox" /> General Forms</p></li>
                            {
                                 showSessionForm && 
                            <li className="mrl-pdf"><p><input type="checkbox" onChange={() => setSessionForm(!sessionForm)} value={'2'} className="checkbox" /> Session Forms</p></li>
                        }

                            </ul>
                            }
                            {
                                generalForm &&
                                <>
                                <p className="flowing-paragraph">The following are a list of FORMS completed by you and/or your Client, not specific to the selected session. Check off the Forms you wish to include in the Report.</p>
                                <ul className="checkbox-assemblylist">

                                    {
                                        formsName.length > 0 && formsName.map((v, i) => {
                                            return (
                                                <li><p><input type="checkbox" onChange={checkboxHandleclient} value={v.id} className="checkbox" /> {v.forms} </p></li>
                                            )
                                        })
                                    }

{
                                       
                                      practionerformsName.length > 0 && practionerformsName.map((value, i) => {
                                        if(value.form_name ==  9 || value.form_name == 11 || value.form_name == 12){
                                            return (
                                                <li><p><input type="checkbox" onChange={checkboxHandlePractional} value={value.id} className="checkbox" /> {value.forms} </p></li>
                                            )
                                            }
                                        })
                                    }
                                    </ul>
                                    </>
                                
                                }
                                {
                                    sessionForm &&
                                    <>
                                    <p className="flowing-paragraph">The following are a list of FORMS completed by you and/or your Client, specific to the selected session. Check off the Forms you wish to include in the Report.</p>
                                    <ul className="checkbox-assemblylist">
    


                                    {
                                        practionerformsName.length > 0 && practionerformsName.map((value, i) => {
                                            if(value.sessid == sessionid){
                                            return (
                                                <li><p><input type="checkbox" onChange={checkboxHandlePractional} value={value.id} className="checkbox" /> {value.forms} </p></li>
                                            )
                                            }
                                        })
                                    }


                                </ul>
                            </>
                        }
                        <div className="assembly-btn-wrp">
                            <div className="assembly-btn"><a href="javascript:void" onClick={()=>{saveAssemblyreport(); loaderToggleModal()}}>{t("Create/Save-Report")}
                               
                            </a></div>
                            <div className="assembly-btn ml-assembly"><a href="javascript:void" onClick={() => unCheck()}>{t("Clear-Selections")}</a></div>

                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={loaderModal} toggle={loaderToggleModal} className="connect-box" centered={true}>
                <ModalHeader toggle={loaderToggleModal}><span className="ml-1 roititle modal-head">Request processing...</span></ModalHeader>
                <ModalBody>
                    <p className='text-center'>Your request is getting processed. Please wait.</p>
                    <div className="wrp-chart-loader">
                        <div class="loading">
                            <div class="loading-1"></div>
                            <div class="loading-2"></div>
                            <div class="loading-3"></div>
                            <div class="loading-4"></div>
                        </div>
                    </div>
                </ModalBody>

            </Modal>
        </div>
    )
}

export default Assemblyreport;