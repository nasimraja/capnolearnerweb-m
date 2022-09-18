import React, { Component, useEffect, useRef, useState } from 'react';
import { Link, useParams, Router } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import ReactExport from "react-export-excel";
import ReactTooltip from 'react-tooltip';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";

//import { ContactPageSharp } from '@mui/icons-material';
const ChartExportedHeader = (props) => {
    const accessToken = localStorage.getItem('accessToken');
    //const [sessions, setsessions] = useState([]);
    const sessionid = localStorage.getItem('selectedSession');
    const [records, setrecords] = useState([]);
    // const [sessionDate, setsessionDate] = useState([]);
    const [clientName, setClientName] = useState([]);
    const [trainerName, setTrainerName] = useState([]);
    const sessioninfo = props.sessioninfo ; 
    const setrequestProcessingModal  = props.setrequestProcessingModal ; 
    const setrequestProcesedModal  = props.setrequestProcesedModal ; 
    const showHeader = props.showHeader ; 
    const reportconfig = useRef();
    const exportExcel = props.exportExcel ; 
    const graphs = props.graphs ;
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
    const setShowSignalStat = props.setShowSignalStat ;
    const showSignalStat = props.showSignalStat ;

    const { config, session, record } = useParams();
    // const [selectfolder, setselectfolder] = useState(false)
    // const [Showfiles, setShowfiles] = useState(false)
    //  const [selectedfiles, setselectedfiles] = useState([])
    //const [fileSelected, setfileSelected] = useState([])
    const fileupload = props.fileupload;
    const signalStat = props.signalStat ; 
    const [liveNotes,setLiveNotes] = useState(props.sessioninfo.session  ? props.sessioninfo.session.notes : []) ; 

    const [notesModal, setNotesModal] = useState(false);
    const notesModalToggle = () => setNotesModal(!notesModal);



    useEffect(() => {
        // console.log("mydata" , signalStat);
    },[signalStat])
    const downloadImage = props.downloadImage;
    useEffect(() => {
        // Report();
        getRcord();
        // clientnameUpdate();
        // SaveImage();
    }, []);
    const getRcord = () => {
        fetch("https://capno-api.herokuapp.com/api/session/record?session_id=" + sessionid,
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
    // const Report = () => {
    //     fetch("https://capno-api.herokuapp.com/api/configured/report?type=1",
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
    //                 // console.warn("result", resp);
    //                 setsessions(resp.sessions)
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
    // const clientnameUpdate = () => {
    //     fetch("https://capno-api.herokuapp.com/api/session/info?session_id=" + sessionid,
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
    //                 console.warn("result", resp);
    //                 setsessioninfo(resp.session)
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
    const reportconfigupdate = () => {
        let _configId = reportconfig.current.value;
        window.location.href = "/create/report/" + _configId
    }
    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const viewManual = () => {
        window.open('https://capnolearning.com/manualpdf/Operating%20Manual%20P6.0%20-%20April%2026.pdf','Manual','height=768,width=500');
    }
    // const choosefolder = (event) => {
    //     setselectfolder(true)
    //     setShowfiles(true)
    //     setselectedfiles([])
    //     var files = event.target.files;
    //     // console.log("files result", files)
    //     var temp = [];
    //     for (var i = 0; i < files.length; i++) {
    //         //temp.push(files[i].webkitRelativePath);
    //         temp.push(files[i].name);
    //         // console.log("array result", temp);
    //     };
    //     setselectedfiles(temp);
    // };
    // const ChooseFolder = (event) => {
    //     file = event.target.file[0]
    //     // console.log("check file", file)
    // }


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

            doc.text(sessioninfo.session.data, 35, 25)
            // doc.text(sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_firstname, 23, 30);
            // doc.text(sessioninfo[0].trainer_firstname+ " " + sessioninfo[0].trainer_lastname, 25, 35);
            // doc.text(trainerName, 25, 35);
            doc.setFont(undefined, 'bold');
            doc.text("Session Date:", 10, 25)
            // doc.text("Client:", 10, 30);
            // doc.text("Trainer:", 10, 35);
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
    
    const saveScreenshot = () => {
        // // console.log(sessioninfo);
        setrequestProcessingModal(true) ; 
        html2canvas(document.getElementById("exported-chart")).then(function (canvas) {

          
            const doc = new jsPDF();
            let dataimg = canvas.toDataURL('image/png')
          

            for (let pageNumber = 1; pageNumber <= doc.getNumberOfPages(); pageNumber++) {
                doc.setPage(pageNumber)
                doc.setTextColor(0, 0, 0);
                doc.text('Capnolearning Report', 10, 10,
                    { styles: { fontSize: 20, fontWeight: 'bold' } })
                doc.setDrawColor(0, 0, 0);
                doc.line(10, 15, 600, 15);
                doc.setFontSize(10)

                doc.text(sessioninfo.session.date, 35, 25)
                // doc.text(sessioninfo[0].client_firstname+ " " + sessioninfo[0].client_firstname, 23, 30);
                // doc.text(sessioninfo[0].trainer_firstname+ " " + sessioninfo[0].trainer_lastname, 25, 35);
                // doc.text(trainerName, 25, 35);
                doc.setFont(undefined, 'bold');
                doc.text("Session Date:", 10, 25)
                doc.text("Client:", 10, 30);
                doc.text("Trainer:", 10, 35);
                // doc.setFont(undefined, 'bold')
                doc.addImage(dataimg, 5, 45, 200, 110);
            }
    
           setTimeout(() => {
            doc.save("PDF Report - "+sessioninfo.session.date   + ".pdf");
            setrequestProcessingModal(false) ; 
            // () ;
            setrequestProcesedModal(true) ;
            
           }, 5000);
            


        });

    }


    return (
        <div className="bg-c-header">
                                <ReactTooltip />

            <div className="wrp-chart-header">
                <div className="chart-header-c1">
                    <div className="wrp-action">
                        <div className="action-opt" >
                            <p>Actions Options</p>
                            <ul className='action-list2 whiteicon' >
                            {
                               showHeader && sessioninfo.session && 
                                   
                                <li>
                                <ExcelFile filename={"Statistics - "+sessioninfo.session.date} element={<a href="javascript:void" data-title="Session date" onClick={exportExcel} data-tip="Export session data as Excel Sheet."   ><i class="fa fa-upload whiteicon" aria-hidden="true"></i></a>}>
                               
                                    {
                                       graphs.map((v,i) => {
                                        //       // console.log("excel data "+v.signal_name , signalStat[v.signal_name] );
                                        // if( v.signal_name != "pco2wave"  && v.signal_name != "pco2b2b"  && v.signal_name != "capin" && v.signal_name != "b2b2hr" && v.signal_name != "b2brsa" ){
                                          return (

                                    <ExcelSheet data={signalStat[v.signal_name] ? signalStat[v.signal_name] : [] } name={v.signal_name}>
                                        <ExcelColumn label="X" value="x"/>
                                        <ExcelColumn label="Mean" value="mean"/>
                                        <ExcelColumn label="Median" value="mean"/>
                                        <ExcelColumn label="Standard Deviation" value="sd"/>
                                    </ExcelSheet>                                          )
                                        // }
                                        
                                      })
                                    }
              
                
            </ExcelFile>
            </li>
 
}

                                  {/* <li><a href="#"><i class="fa fa-sticky-note" aria-hidden="true"></i></a></li> */}
                                <li data-tip="Save Report as PDF"><a href="javascript:void"   onClick={saveScreenshot}><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></li>
                                {/* <li><a href="#" for="file"><i class="fa fa-download" aria-hidden="true"></i></a>
                                </li> */}
                                <li data-tip="Load Different Client/Session">
                                    <label for="icon"><i class="fa fa-download whiteicon" aria-hidden="true"></i>
                                    </label>
                                    <input type="file" id="icon" name=" " style={{ display: "none" }} onChange={fileupload} webkitdirectory="true"
                                    />
                                </li>
                                {/* <li><a href="#"><i class="fa fa-sliders" aria-hidden="true"></i></a></li> */}
                                {/* <li><a href="#"><i class="fa fa-bookmark" aria-hidden="true"></i></a></li> */}
                            </ul>
                        </div>
                        <div className="view-opt" >
                            <p>Viewing Options</p>
                            <ul className='action-list3 whiteicon'>
                            
                                <li data-tip="View live session notes"><a onClick={notesModalToggle} href="javascript:void" ><i class="fa fa-file" aria-hidden="true"></i></a></li>
                                <li data-tip="View session images PDF"><a href="javascript:void" onClick={downloadImage}><i class="fa fa-image" aria-hidden="true"></i></a></li>
                                {/* <li><a href="#"><i class="fa fa-video-camera" aria-hidden="true"></i></a></li>
                                <li><a href="#"><i class="fa fa-step-backward" aria-hidden="true"></i></a></li> */}
                                <li data-tip="Toogle signals satistics"><a href="javascript:void" onClick={() => setShowSignalStat(!showSignalStat)}><i class="fa fa-table"></i></a></li>
                                <li data-tip="View help documenyt"><a href="javascript:void"  onClick={viewManual}><i class="fa fa-question-circle" aria-hidden="true"></i></a></li>
                                {/* <li><a href="javascript:void"><i class="fa fa-clock-o" aria-hidden="true"></i></a></li> */}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="chart-header-c3">
                    <ul className="username-list">
                    <li data-tip="Name of client">
                        {
                        sessioninfo.session &&
 
                                <a href="javascript:void"><i class="fa fa-user" aria-hidden="true"></i>{sessioninfo.session.client}</a>
                          
                        }
                    
                        </li>
                        <li data-tip="Name of trainer">
                        { 
                         sessioninfo.session &&
                
                                <a href="javascript:void"><i class="fa fa-user-md" aria-hidden="true"></i> {sessioninfo.session.trainer} </a>
                         
                        }
                  
                        </li>
                     <li data-tip="Session date">
                        {
                        sessioninfo.session &&    
                               <a href="javascript:void"><i class="fa fa-calendar" aria-hidden="true"></i> {sessioninfo.session.date}</a>
                         
                        }
                   
                        </li>
                    </ul>
                </div>
                <div className="chart-header-c4">
                    <div className=''>
                        {/* <p><input className="form-control" onClick={fileupload} type="file" webkitdirectory="true" directory
                        /></p> */}
                    </div>
                    <div className="dashboard-back " >
                        <Link to="/"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i> Dashboard</Link>
                    </div>
                </div>
            </div>

            <Modal isOpen={notesModal} toggle={notesModalToggle} className="modal-box-wrp" centered={true}>
                        <ModalHeader toggle={notesModalToggle}><span className="ml-1 roititle modal-head"> Live Session Notes</span></ModalHeader>
                        <ModalBody>
                           <p id="liveNotes">{liveNotes && liveNotes.length > 0 ?
                               liveNotes.map((v,i) => {
                                   return(
                                    <p dangerouslySetInnerHTML={{__html: v.sessiondata}}></p>
                                   )
                               })
                            : "No notes available."}</p>
                            
                        <div className='d-flex justify-content-around mt-3'>
                            <button className='lightbtn w-100'  onClick={notesModalToggle} >Cancel</button>
                            {
                               liveNotes && liveNotes.length > 0 &&
                            <button className='darktbtn w-100 ml-1'  onClick={downloadNotesPDF} >Download PDF</button>
                            }
                        </div>
                        </ModalBody>

                    </Modal>

        </div>
    )
}
export default ChartExportedHeader