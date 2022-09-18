import React, { Component, useEffect, useRef, useState } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { API_URL } from '../../config';
import ReactTooltip from 'react-tooltip';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import ReactExport from "react-export-excel";
import { csv } from 'd3';


const ChartHeader = (props) => {
    const accessToken = localStorage.getItem('accessToken');
    const [sessions, setsessions] = useState([]);
    const sessionid = localStorage.getItem('selectedSession');
    const clientId = localStorage.getItem('selectedClient');
    
    const [records, setrecords] = useState([]);
    const [sessionDate, setsessionDate] = useState([]);
    const [clientName, setClientName] = useState([]);
    const [trainerName, setTrainerName] = useState([]);
    const [sessioninfo, setsessioninfo] = useState([]);
    const setSessionDate = props.setSessionDate ; 
    const [alternate, setAlternate] = useState([]);
    const [pdfReportName, setPdfReportName] = useState(null);
    
    const [emgAvg, setEmgAvg] = useState(false);
    const [emgRaw, setEmgRaw] = useState(false);

    const group = props.group;
    const reportconfig = useRef();
    const alternateconfig = useRef();
    const reportRecord = useRef();
    
    const { config, session, record ,currentConfig ,showclock } = useParams();
    const [notesModal, setNotesModal] = useState(false);
    const notesModalToggle = () => setNotesModal(!notesModal);

    const [liveNotes,setLiveNotes] = useState(null) ; 

    const [zoomModal, setZoomModal] = useState(false);
    const zoomModalToggle = () => setZoomModal(!zoomModal);

    
    const [savePdfModal, setSavePdfModal] = useState(false);
    const savePdfModalToggle = () => setSavePdfModal(!savePdfModal);

    const [zoomRecording,setZoomRecording] = useState(null) ; 


    const [takeNotesModal, setTakeNotesModal] = useState(false);
    const takeNotesToggle = () => setTakeNotesModal(!takeNotesModal);
 
    const showActualTime = props.showActualTime ;

    const setShowSignalStat = props.setShowSignalStat ;
    const showSignalStat = props.showSignalStat ;
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
    
    const userId = localStorage.getItem('user_id');

    const setSavingReportConfirmation = props.setSavingReportConfirmation ; 
 


    const setNotes = props.setNotes ; 
    const notes = props.notes ; 
    const exportExcel = props.exportExcel ; 
    const graphs = props.graphs ; 
    const showHeader = props.showHeader ; 

    const signalStat = props.signalStat ; 
    const saveReportConfig = props.saveReportConfig; 
    const setrequestProcessingModal  = props.setrequestProcessingModal ; 
    const setrequestProcesedModal  = props.setrequestProcesedModal ; 
    useEffect(() => {
        // // console.log("mydata" , signalStat);
    },signalStat)
    useEffect(() => {
        Report();
        getRcord();
        clientnameUpdate();
        getLiveNotes() ; 
        getAlternate() ;
  

        
        // getZoomRecording() ; 
        // getScreenshort();

    }, []);

    useEffect(() => {
        // getAlternate() ;

    })

  
    const viewManual = () => {
        window.open('https://capnolearning.com/manualpdf/Operating%20Manual%20P6.0%20-%20April%2026.pdf','Manual','height=768,width=500');
    }

    
    const getCsv = () => {
        fetch(API_URL+"/session/data?session_id=" + sessionid + "&signal_name=emg3_wave",
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
                        getData(resp.sessions[0].sessiondata,"raw")
                    }


                });
            }
            else if (response.status == 401) {
                logout()
            }
            else {
                alert("network error")
            }
        })


            fetch(API_URL+"/session/data?session_id=" + sessionid + "&signal_name=emg1_avg",
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
                        getData(resp.sessions[0].sessiondata,"avg")
                    }


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


        async function getData(_csvFile,_stat) {
           
            
            //   // console.log(userTimeOffset);
            csv('//capno-data.s3.amazonaws.com/' + _csvFile).then(data => {
                if(data.length > 2){
                    if(_stat == 'avg'){
                        setEmgAvg(true);
                    }
                    else if(_stat == 'raw'){
                        setEmgRaw(true)
                    }
                }
        })
    }


    const saveScreenshotPDF = () => {
        // // console.log(sessioninfo);
        setrequestProcessingModal(true) ; 
        html2canvas(document.getElementById("chart-table")).then(function (canvas) {

            let session_id = session;
            let type = 0;
            let status = 1;

            let dataimg = canvas.toDataURL('image/png')
            const doc = new jsPDF();

            for (let pageNumber = 1; pageNumber <= doc.getNumberOfPages(); pageNumber++) {
                doc.setPage(pageNumber)
                doc.setTextColor(0, 0, 0);
                doc.text('Capnolearning Report', 10, 10,
                    { styles: { fontSize: 20, fontWeight: 'bold' } })
                doc.setDrawColor(0, 0, 0);
                doc.line(10, 15, 600, 15);
                doc.setFontSize(10)

                doc.text(sessioninfo[0].name, 35, 25)
                doc.text(sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_firstname, 23, 30);
                doc.text(sessioninfo[0].trainer_firstname+ " " + sessioninfo[0].trainer_lastname, 25, 35);
                // doc.text(trainerName, 25, 35);
                doc.setFont(undefined, 'bold');
                doc.text("Session Date:", 10, 25)
                doc.text("Client:", 10, 30);
                doc.text("Trainer:", 10, 35);
                // doc.setFont(undefined, 'bold')
                doc.addImage(dataimg, 5, 45, 200, 110);
            }
            let pdf_name = sessioninfo[0].name + "-" +pdfReportName + ".pdf" ; 
           setTimeout(() => {
            
            let formData = {    
                'data':  dataimg,
                'session_id': session_id,
                'pdf_name' : pdf_name,
                'status': status,
                'type': type    
                } ;

            fetch(API_URL + "/save/screenshot", {
                method: 'POST',
                headers: {  
                     'Content-Type': 'application/json',
                     'x-access-token': accessToken,
                },
                body: JSON.stringify(formData),
            }).then((result) => {
                result.json().then((resp) => {
                    setrequestProcessingModal(false) ; 
                    // () ;
                    setrequestProcesedModal(true) ;

                })
            })
          
            
           }, 5000);
            


        });

    }
    const saveScreenshot = () => {
        // // console.log(sessioninfo);
        setrequestProcessingModal(true) ; 
        html2canvas(document.getElementById("chart-table")).then(function (canvas) {

            let session_id = session;
            let type = 0;
            let status = 1;

            let dataimg = canvas.toDataURL('image/png')
            const doc = new jsPDF();

            for (let pageNumber = 1; pageNumber <= doc.getNumberOfPages(); pageNumber++) {
                doc.setPage(pageNumber)
                doc.setTextColor(0, 0, 0);
                doc.text('Capnolearning Report', 10, 10,
                    { styles: { fontSize: 20, fontWeight: 'bold' } })
                doc.setDrawColor(0, 0, 0);
                doc.line(10, 15, 600, 15);
                doc.setFontSize(10)

                doc.text(sessioninfo[0].name, 35, 25)
                doc.text(sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_firstname, 23, 30);
                doc.text(sessioninfo[0].trainer_firstname+ " " + sessioninfo[0].trainer_lastname, 25, 35);
                // doc.text(trainerName, 25, 35);
                doc.setFont(undefined, 'bold');
                doc.text("Session Date:", 10, 25)
                doc.text("Client:", 10, 30);
                doc.text("Trainer:", 10, 35);
                // doc.setFont(undefined, 'bold')
                doc.addImage(dataimg, 5, 45, 200, 110);
            }
    
           setTimeout(() => {
            doc.save(sessioninfo[0].name + "-" +pdfReportName + ".pdf");
            setrequestProcessingModal(false) ; 
            // () ;
            setrequestProcesedModal(true) ;
            
           }, 5000);
            


        });

    }

    const saveReport = () => {

        setSavingReportConfirmation(true) ; 

        // // console.log("report data",props.signalConfig)
     
    }
 


    // const getScreenshort = () => {
    //     fetch(API_URL + "/get/screenshort/" + session,
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
    //                 setsessionDate(resp.sessionDate)
    //                 setClientName(resp.firstname + " " + resp.lastname)
    //                 setTrainerName(resp.data[0].firstname + " " + resp.data[0].lastname)

    //             });
    //         }
    //         else if (response.status == 401) {
    //             logout()
    //         }
    //         else {
    //             alert("network error")
    //         }


    //     })


    // }

        const getLiveNotes = () => {
        fetch(API_URL+"/session/data/type?session_id=" + sessionid + "&type=4",
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
                    setLiveNotes(resp.sessions)

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
    
    
    const [signalName, setSignalName] = useState({
        pco2wave : "PCO<sub>2</sub> Waveform",
        petco2 :  "PetCO<sub>2</sub> History",
        bpmhistory : "Breaths/min History",
        pco2b2b : "PCO<sub>2</sub> breath to breath",
        capin : "Capnia Index",
        capnia : "Capnia Index History",
        gpmhistory : "Gasps/min History",
        aborted_expmhistory : "Aborted exhales/min History",
        bholdpmhistory : "Breath-holds/min History",
        relativevpm : "Relative Volume/per min History",
        aborted_expm : "Aborted exhales/min History",
        bhpm : "Breath-holds/min",
        b2b2hr : "Beat to beat heart rate",
        hrhistory : "Heart rate History",
        rsahistory : "RSA History",
        b2brsa : "Beat to Beat RSA",
        bpm : "Breaths/min",
        hf_avg : "Tachograph of RR",
        b2brr_wave : "Arousal",
        arousal_avg : "Parasympathetic Tone",
        tone_avg : "Parasympathetic Reserve" , 
        reserve_avg : "VLF Band",
        vlf_avg : "LF Band",
        lf_avg : "HF Band",
        emg1_avg : "EMG 1 Average",
        emg2_avg : "EMG 2 Average",
        emg3_avg : "EMG 3 Average",
        emg4_avg : "EMG 4 Average",
        emg1_wave : "EMG 1 Raw Wave",
        emg2_wave : "EMG 2 Raw Wave",
        emg3_wave : "EMG 3 Raw Wave",
        emg4_wave : "EMG 4 Raw Wave"
})

    const getRcord = () => {
        fetch(API_URL+"/session/record?session_id=" + sessionid,
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
                    setrecords(resp.records)

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

    

    
    const getAlternate = () => {
        fetch(API_URL+"/get/single/alertnate/report/config/"+config+"/"+userId+"/1",
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
                    setAlternate(resp.reports)

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

    const Report = () => {
        let url = API_URL+"/configured/report?type=1" ; 
        if(group){
            url = API_URL+"/configured/report?type=2" ;
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
                alert("network error")
            }


        })
    }

    const clientnameUpdate = () => {
        fetch(API_URL+"/session/info?session_id=" + sessionid,
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
                    console.warn("recording", resp);
                    setsessioninfo(resp.session)
                    setSessionDate(resp.session[0].name)
                    setZoomRecording(resp.session[0].zoom_link)

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

    
    const moveClock = () => {
        let moveClock = (showclock == 0 ? 1 : 0);
        let config = reportconfig.current.value;

        window.location.href = "/create/report/" + moveClock + "/" + config + "/" + session + "/" + record + "/" + config ; 
    }

    const reportconfigupdate = () => {
        let _configId = reportconfig.current.value;
        window.location.href = "/create/report/" + showclock + "/" + _configId + "/" + session + "/all/" + _configId ; 
    }

    const reportconfigalternateupdate = () => {
        let _configId = alternateconfig.current.value;
        if(group){
            window.location.href = "/create/group/report/" + showclock + "/" + config + "/" + session + "/" + record + "/" + _configId ; 
        }
        else{
            window.location.href = "/create/report/" + showclock + "/" + config + "/" + session + "/" + record + "/" + _configId ; 

        }

    }
    const reportrecordupdate = () => {
        let _configId = reportconfig.current.value;
        let _reportRecord = reportRecord.current.value;
        if(group){
            window.location.href = "/create/group/report/" + showclock + "/" + _configId + "/" + session + "/" + _reportRecord + "/" + _configId ; 
        }
        else{
        window.location.href = "/create/report/" + showclock + "/" + _configId + "/" + session + "/" + _reportRecord + "/" + currentConfig ; 

        }

    }
    

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const downloadNotesPDF = () => {
        setrequestProcessingModal(true);
        const doc = new jsPDF();

        for (let pageNumber = 1; pageNumber <= doc.getNumberOfPages(); pageNumber++) {
            doc.setPage(pageNumber)
            doc.setTextColor(0, 0, 0);
            doc.text('Capnolearning Report', 10, 10,
                { styles: { fontSize: 20, fontWeight: 'bold' } })
            doc.setDrawColor(0, 0, 0);
            doc.line(10, 15, 600, 15);
            doc.setFontSize(10)

            doc.text(sessioninfo[0].name, 35, 25)
            doc.text(sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_firstname, 23, 30);
            doc.text(sessioninfo[0].trainer_firstname+ " " + sessioninfo[0].trainer_lastname, 25, 35);
            // doc.text(trainerName, 25, 35);
            doc.setFont(undefined, 'bold');
            doc.text("Session Date:", 10, 25)
            doc.text("Client:", 10, 30);
            doc.text("Trainer:", 10, 35);
            doc.text("Live Session Notes:", 10, 45);
            doc.setFont(undefined, 'normal');
            
            var splitTitle = doc.splitTextToSize(document.getElementById("liveNotes").innerHTML, 270);
            var pageHeight = doc.internal.pageSize.height;
           
            var y = 50;
            for (var i = 0; i < splitTitle.length; i++) {                
                if (y > 280) {
                    y = 10;
                    doc.addPage();
                }
                // // console.log("line" , splitTitle[i])
                doc.text(splitTitle[i].replace(/(<([^>]+)>)/gi, "") , 10, y);
                y = y + 3;
            }
        }
 
        doc.save("Live Session Notes - "+sessioninfo[0].name + "-" + sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_lastname + ".pdf");
        setrequestProcessingModal(false);
        setrequestProcesedModal(true);
          
    }

    const viewNotesPDF = () => {
        setrequestProcessingModal(true) ;
        

        let dataType = 4;

        fetch(API_URL + "/get/live/session/notes/" + sessionid + "/" + dataType,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
    
                ).then(res => res.blob())
                .then(response => {
                    //Create a Blob from the PDF Stream
    
                    const file = new Blob([response], {
                        type: "application/pdf"
                    });
                    //Build a URL from the file
                    const fileURL = URL.createObjectURL(file);
                    // Open the URL on new Window
                    window.open(fileURL);
        setrequestProcessingModal(false) ;

                    // download(fileURL);
    
                })
  
    }
    
    const viewNotesPDFOld = () => {
        setrequestProcessingModal(true);
        const doc = new jsPDF();

        for (let pageNumber = 1; pageNumber <= doc.getNumberOfPages(); pageNumber++) {
            doc.setPage(pageNumber)
            doc.setTextColor(0, 0, 0);
            doc.text('Capnolearning Report', 10, 10,
                { styles: { fontSize: 20, fontWeight: 'bold' } })
            doc.setDrawColor(0, 0, 0);
            doc.line(10, 15, 600, 15);
            doc.setFontSize(10)

            doc.text(sessioninfo[0].name, 35, 25)
            doc.text(sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_firstname, 23, 30);
            doc.text(sessioninfo[0].trainer_firstname+ " " + sessioninfo[0].trainer_lastname, 25, 35);
            // doc.text(trainerName, 25, 35);
            doc.setFont(undefined, 'bold');
            doc.text("Session Date:", 10, 25)
            doc.text("Client:", 10, 30);
            doc.text("Trainer:", 10, 35);
            doc.text("Live Session Notes:", 10, 45);
            doc.setFont(undefined, 'normal');
            
            var splitTitle = doc.splitTextToSize(document.getElementById("liveNotes").innerHTML, 270);
            var pageHeight = doc.internal.pageSize.height;
           
            var y = 50;
            for (var i = 0; i < splitTitle.length; i++) {                
                if (y > 280) {
                    y = 10;
                    doc.addPage();
                }
                // // console.log("line" , splitTitle[i])
                doc.text(splitTitle[i].replace(/(<([^>]+)>)/gi, "") , 10, y);
                y = y + 3;
            }
        }
 
        window.open(doc.output('bloburl'))

        // doc.output("Live Session Notes - "+sessioninfo[0].name + "-" + sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_lastname + ".pdf");
        setrequestProcessingModal(false);
        setrequestProcesedModal(true);
          
    }

    const getPreviousSessionPDF = () => {
        setrequestProcessingModal(true);

             fetch(API_URL + "/get/previous/screenshot/"+session+"/"+clientId,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
        ).then((response) => {
            if (response.success) {
                response.json().then((resp) => {

                    if(resp.data.length > 0 ){
                        
                    const doc = new jsPDF();

                    for (let pageNumber = 1; pageNumber <= doc.getNumberOfPages(); pageNumber++) {
                        doc.setPage(pageNumber)
                        doc.setTextColor(0, 0, 0);
                        doc.text('Capnolearning Report', 10, 10,
                            { styles: { fontSize: 20, fontWeight: 'bold' } })
                        doc.setDrawColor(0, 0, 0);
                        doc.line(10, 15, 600, 15);
                        doc.setFontSize(10)
        
                        doc.text(sessioninfo[0].name, 35, 25)
                        doc.text(sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_firstname, 23, 30);
                        doc.text(sessioninfo[0].trainer_firstname+ " " + sessioninfo[0].trainer_lastname, 25, 35);
                        // doc.text(trainerName, 25, 35);
                        doc.setFont(undefined, 'bold');
                        doc.text("Session Date:", 10, 25)
                        doc.text("Client:", 10, 30);
                        doc.text("Trainer:", 10, 35);
                        // doc.setFont(undefined, 'bold')
                        doc.addImage(resp.data[0].data, 5, 45, 200, 110);
                    }
                    setrequestProcessingModal(false);
                    setrequestProcesedModal(true);
                         window.open(doc.output('bloburl'))

                    // doc.save("PDF Report - "+resp.data[0].pdf_name + "-" + sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_lastname + ".pdf");
            
                }
                else{
        setrequestProcessingModal(false);
       

                    alert("No PDF found for previous session")
                }

                });
            }
           
            else {
        setrequestProcessingModal(false);
        alert("No PDF found for previous session")

            }


        })


    }


    
    const ViewlivesessionImage = () => {
        setrequestProcessingModal(true) ;
        

        let dataType = 3;

        fetch(API_URL + "/get/live/sessionimage/download/" + sessionid + "/" + dataType,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            }
    
                ).then(res => res.blob())
                .then(response => {
                    //Create a Blob from the PDF Stream
    
                    const file = new Blob([response], {
                        type: "application/pdf"
                    });
                    //Build a URL from the file
                    const fileURL = URL.createObjectURL(file);
                    // Open the URL on new Window
                    window.open(fileURL);
        setrequestProcessingModal(false) ;

                    // download(fileURL);
    
                })
  

       
    }
    
    const Viewliveimg = (_clientName,_trainerName, _image, _sessionDate,_pdfname)=>{
      
        const doc = new jsPDF();
        for (let pageNumber = 1; pageNumber <= doc.getNumberOfPages(); pageNumber++) {
            doc.setPage(pageNumber)
        doc.setTextColor(0, 0, 0);
        doc.text('Capnolearning Report', 10, 10,
            {styles:{ fontSize: 20,fontWeight: 'bold'}})
        doc.setDrawColor(0, 0, 0);
        doc.line(10, 15, 600, 15);
        doc.setFontSize(10)
        
        doc.text(_sessionDate ,35,25)
        doc.text( _clientName,23,30);
        doc.text( _trainerName,25,35);
        doc.setFont(undefined, 'bold');
        doc.text("Session Date:" ,10,25)
        doc.text("Client:" ,10,30);
        doc.text("Trainer:",10,35);
        // doc.setFont(undefined, 'bold')
        _image.map((v,i) => {
            doc.addImage(v.sessiondata, 5, 45,200,110);
            doc.addPage();
        } )   
   
        }
    
        window.open(doc.output('bloburl'))
        setrequestProcessingModal(false);
        setrequestProcesedModal(true);
    }
    
    // // console.log("excel data",signalStat)
    // signalStat.map((v,i)=>{
    // // console.log("excel data",v)

    // })
    return (
        <div className="bg-c-header">
                                <ReactTooltip />
            <div className="wrp-chart-header">
                <div className="chart-header-c1" style={{width: "20%"}}>
                    <div className="wrp-action">
                        <div className="action-opt" style={{width: "38%"}}>
                            <p>Actions Options</p>
                            <ul className='action-list'>
                          
                                 {
                                  !group &&  sessioninfo.length >  0 && showHeader &&
                                   
                                <li>
                                <ReactTooltip />

                                <ExcelFile filename={"Statistics - "+sessioninfo[0].name + "-" + sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_lastname  } element={<a href="javascript:void" onClick={exportExcel} data-tip="Export statistics to Excel."   ><i class="fa fa-upload" aria-hidden="true"></i></a>}>
                               
                                    {
                                       graphs.map((v,i) => {
                                            //   // console.log("excel data "+v.signal_name );
                                   
                                          return (

                                    <ExcelSheet data={signalStat[v.signal_name] ? signalStat[v.signal_name] : [] } name={v.signal_name}>
                                        <ExcelColumn label="X" value="x"/>
                                        <ExcelColumn label="Mean" value="mean"/>
                                        <ExcelColumn label="Median" value="median"/>
                                        <ExcelColumn label="Standard Deviation" value="sd"/>
                                    </ExcelSheet>                                          )
                                  
                                        
                                      })
                                    }
              
                
            </ExcelFile>
            </li>
 
}
                                <li><a href="javascript:void" onClick={takeNotesToggle} data-tip="Take report notes."><i class="fa fa-sticky-note" aria-hidden="true"></i></a></li>
                                <li><a href="javascript:void" data-tip="Export report as PDF." onClick={savePdfModalToggle}><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></li>
                                {
                                !group && 
                                <li><a href="javascript:void" onClick={saveReportConfig} data-tip="Save as alternate configuration."><i class="fa fa-sliders" aria-hidden="true"></i></a></li>
}
                                <li><a href="javascript:void" onClick={saveReport} data-tip="Save as report."><i class="fa fa-bookmark" aria-hidden="true"></i></a></li>
                            </ul>
                        </div>
                        <div className="view-opt" style={{width: "50%"}}>
                            <p>Viewing Options</p>
                            <ul className='action-list'>
                                <li><a href="javascript:void" onClick={notesModalToggle} data-tip="View session notes"><i class="fa fa-file-text" aria-hidden="true"></i></a>
                                </li>
                                <li><a href="javascript:void" onClick={ViewlivesessionImage} data-tip="View live session images"><i class="fa fa-image" aria-hidden="true"></i></a></li>

                                <li><a href="javascript:void" onClick={zoomModalToggle} data-tip="View zoom recording"><i class="fa fa-video-camera" aria-hidden="true"></i></a></li>
                                <li><a href="javascript:void" onClick={getPreviousSessionPDF} data-tip="View PDF of previous session"><i class="fa fa-step-backward" aria-hidden="true"></i></a></li>
                               {
                                !group && 
                                <li><a href="javascript:void" onClick={() => setShowSignalStat(!showSignalStat)} data-tip="Toggle all signal statistics"><i class="fa fa-table"></i></a></li>
                               }
                                  <li data-tip="Switch time format">
                      
                      <a href="javascript:void">  <i class="fa fa-clock-o" aria-hidden="true" onClick={moveClock}  data-tip='Switch time format'></i> 
                      </a>
                   
               
               </li>
                                <li><a href="javascript:void" onClick={viewManual} data-tip="View help document"><i class="fa fa-question-circle" aria-hidden="true"></i></a></li>
                                
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="chart-header-c2">
                    <div className="wrp-select-row">
                        <div className="select-row">
                            <select className="selected-raw-c" onChange={reportconfigupdate} ref={reportconfig}>

                                {
                                    sessions.map((sessions) => {
                                        if((sessions.id == 46 && emgAvg) || (sessions.id == 47 && emgRaw) || (sessions.id != 46 && sessions.id != 47) ){
                                        return (
                                            <option selected={sessions.id == config ? true : false} value={sessions.id} dangerouslySetInnerHTML={{__html: sessions.name}} ></option>
                                        )
                                        }

                                    })
                                }

                            </select>
                        </div>
                        {
                            !group &&
                           
                        <div className="select-row">
                            <select onChange={reportconfigalternateupdate} ref={alternateconfig}>
                                <option value={config} selected={config == currentConfig ? "selected" : "" } >Default</option>
                                {
                                    alternate.length > 0 && alternate.map((v,i) => {
                                        return (
                                            <option value={v.id} selected={v.id == currentConfig ? "selected" : "" }>{v.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                         
                        }
                        <div className="select-row">
                            <select value={record} onChange={reportrecordupdate} ref={reportRecord}>
                                <option value={'all'}   >All Records</option>

                                {
                                    records.map((records) => {
                                        return (
                                            <option value={records.number}>{records.name}</option>
                                        )
                                    })
                                }

                            </select>
                        </div>
                    </div>
                </div>
                <div className="chart-header-c3">
                    <ul className="username-list">
                    <li data-tip="Name of client">
                        {sessioninfo.map((clientName) => {
                            return (
                                <a href="javascript:void"><i class="fa fa-user" aria-hidden="true"></i>{clientName.client_firstname} {clientName.client_lastname}</a>
                            )
                        }
                        )}
                        </li>
                        <li data-tip="Name of trainer">
                        {sessioninfo.map((trainerName) => {
                            return (
                                <a href="javascript:void"><i class="fa fa-user-md" aria-hidden="true"></i> {trainerName.trainer_firstname} {trainerName.trainer_lastname}</a>
                            )
                        }
                        )}
                        </li>
                     <li data-tip="Session date">
                        {sessioninfo.map((sessionName) => {
                            return (
                               <a href="javascript:void"><i class="fa fa-calendar" aria-hidden="true"></i> {sessionName.name}  
                               </a>
                            )
                        }
                        )}
                        </li>
                          
                    </ul>
                </div>
                <div className="chart-header-c4">
                    <div className="dashboard-back">
                        <Link to="/"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i> Dashboard</Link>
                    </div>
                </div>
            </div>

            

            <Modal isOpen={takeNotesModal} toggle={takeNotesToggle} className="modal-box-wrp" centered={true}>
                <ModalHeader toggle={takeNotesToggle}><span className="ml-1 roititle modal-head">Take Report Notes</span></ModalHeader>
                        <ModalBody>
                           <textarea rows="8" style={{width: "100%"}} value={notes} onChange={(e) => setNotes(e.target.value) } ></textarea>
                           
                        </ModalBody>

                    </Modal>

                    <Modal isOpen={notesModal} toggle={notesModalToggle} className="modal-box-wrp" centered={true}>
                        <ModalHeader toggle={notesModalToggle}><span className="ml-1 roititle modal-head"> Live Session Notes</span></ModalHeader>
                        <ModalBody>
                           <p id="liveNotes">{liveNotes && liveNotes.length > 0 ?
                            
                                    <p dangerouslySetInnerHTML={{__html: liveNotes[0].sessiondata}}></p>
                                  
                            : "No notes available."}</p>
                            
                        <div className='d-flex justify-content-around mt-3'>
                            <button className='lightbtn w-100'  onClick={notesModalToggle} >Cancel</button>
                            {
                               liveNotes && liveNotes.length > 0 &&
                            <button className='darktbtn w-100 ml-1'  onClick={viewNotesPDF} >View PDF</button>
                            }
                        </div>
                        </ModalBody>

                    </Modal>
                    <Modal isOpen={zoomModal} toggle={zoomModalToggle} className="modal-box-wrp" centered={true}>
                        <ModalHeader toggle={zoomModalToggle}><span className="ml-1 roititle modal-head">Zoom Recording</span></ModalHeader>
                        <ModalBody>
                           <p>{zoomRecording ?
                                <a href={zoomRecording} target="_blank" >Open zoom recording in new tab.</a>
                            : "No zoom recording available."}</p>
                        </ModalBody>

                    </Modal>
                    <Modal isOpen={savePdfModal} toggle={savePdfModalToggle} className="modal-box-wrp" centered={true}>
                        <ModalHeader toggle={savePdfModalToggle}><span className="ml-1 roititle modal-head"> PDF Report</span></ModalHeader>
                        <ModalBody>
                        <p className=''>Please enter the name of PDF you want to save.</p>
                        <div class="input-group mb-3">
                              <div class="input-group-prepend">
     <span class="input-group-text" id="basic-addon1">{sessioninfo[0] ? sessioninfo[0].name: ""}</span>
  </div>
  <input type="text" class="form-control" value={pdfReportName} onChange={(e) => setPdfReportName(e.target.value)} placeholder="Report Name" aria-label="Report Name" aria-describedby="basic-addon1" />
</div>
                            
                        <div className='d-flex justify-content-around mt-3'>
                            <button className='lightbtn w-100'  onClick={saveScreenshotPDF} >Save PDF</button>
                           
                            <button className='darktbtn w-100 ml-1'  onClick={saveScreenshot} >Download PDF</button>
                           
                        </div>
                        </ModalBody>

                    </Modal>
        </div>
    )
}

export default ChartHeader

