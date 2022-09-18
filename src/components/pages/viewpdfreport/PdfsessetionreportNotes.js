import React, {useEffect,useState} from "react";
import {Link,useParams, Router} from 'react-router-dom';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
import Sidebar from '../../component/Sidebar';
import { jsPDF } from "jspdf";
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import { API_URL } from "../../../config";
import download from '../../images/download.png'
import preveiw from '../../images/preveiw.png';
import backIcon from "../../../components/images/back.png";

const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));



const PdfsessetionreportNotes = () => {
    const accessToken = localStorage.getItem('accessToken');
    const sessionid = localStorage.getItem('selectedSession');
    const [notes, senotes] = useState([]);
    const [data, setData] = useState([]);
    const classes = useStyles();
    const [loaderModal, setLoaderModal] = useState(false);
    const loaderToggleModal = () => setLoaderModal(!loaderModal);


    useEffect(() => {
        pdfReportNote();
        

    }, []);


    const pdfdata = () => {
   
      

        fetch(API_URL + "/get/pdfnotes/list/" + sessionid,
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
                    setLoaderModal(false)
                    let _clientName = resp.firstname + " " + resp.lastname ;
                    let _trainerName = resp.data[0].firstname+ " " + resp.data[0].lastname ;
                    let _sessionDate = resp.sessionDate;
                    downloadpdf(_clientName , _trainerName , resp.result,_sessionDate)

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

    const downloadpdf = (_clientName,_trainerName, _notes,_sessionDate)=>{
     
        const doc = new jsPDF();
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
        doc.setFont(undefined, 'normal');
        doc.text(_notes, 10,52);
        doc.setFontSize(13)
        doc.text('Session Report Notes', 10, 45, {styles:{ fontSize: 13,fontWeight: 'bold'}})
        doc.line(10, 47, 55, 47);
        doc.save(_sessionDate +".pdf");
    }

    const viewpdfdata = () => {

      

        fetch(API_URL + "/get/pdfnotes/list/" + sessionid,
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
                    setLoaderModal(false)
                    let _clientName = resp.firstname + " " + resp.lastname ;
                    let _trainerName = resp.data[0].firstname+ " " + resp.data[0].lastname ;
                    let _sessionDate = resp.sessionDate;
                    viewpdf(_clientName , _trainerName , resp.result,_sessionDate)

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

    const viewpdf = (_clientName,_trainerName, _notes,_sessionDate)=>{
     
        const doc = new jsPDF();
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
        doc.setFont(undefined, 'normal');
        doc.text(_notes, 10,52);
        doc.setFontSize(13)
        doc.text('Session Report Notes', 10, 45, {styles:{ fontSize: 13,fontWeight: 'bold'}})
        doc.line(10, 47, 55, 47);
        window.open(doc.output('bloburl'))
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
                    let _temp = [] ;
                    resp.notes.map((v,i) => {
                        
                        _temp.push({
                            reportName : v.sessiondate + " - " + v.name,
                           
                            actions : <p><Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="View" placement="top"><a href='#' onClick={() => {viewpdfdata(); loaderToggleModal()}} className="downloadimg"><img src={preveiw} /></a></Tooltip>,<Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Download" placement="top"><a href='javascript:void' onClick={() => {pdfdata(); loaderToggleModal()}} className="downloadimg"><img src={download} /></a></Tooltip></p>
                        })
                    })
                    setData(_temp);

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

    

    const columns =[
        {
            title: "Report Name", field: "reportName"
        },
        
        {
            title: <span className="text-right">Actions</span>, field: "actions",align: "right"
        }
    ]


    return(
        <div className="">
            <Header />
             <div className="wrp-dashbord">
                <div className="sidebar-section">
                <Sidebar />
               </div>
               <div className="right-section">
              
                <div className="head-demoreport">
                    <h3>Session Report Notes</h3>
                    <div className="back-icon-wrp">
                        <Link to="/view/pdf/report" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>Back</span>
                        </Link>
                    </div>
                </div>
                <div className="wrp-bankform">
                    <div style={{ maxWidth: '100%' }}>
                        <MaterialTable
                        columns={columns}
                        data={data}
                        options={{
                            pageSize: 15,

                            pageSizeOptions:[5,10,15,20]
                        }}
                        title=""
                        />
                        
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

export default PdfsessetionreportNotes;