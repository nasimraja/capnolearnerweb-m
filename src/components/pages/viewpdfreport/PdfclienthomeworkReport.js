import React, {useEffect,useState} from "react";
import {Link,useParams, Router} from 'react-router-dom';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import download from '../../images/download.png'
import preveiw from '../../images/preveiw.png'
import { API_URL } from "../../../config";
import { jsPDF } from "jspdf";

const PdfclienthomeworkReport = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [data, setData] = useState([]);
    const sessionid = localStorage.getItem('selectedSession');
    const Clientid = localStorage.getItem('selectedClient');

    useEffect(() => {
      
            Singlesession();


    }, []);

    const pdfdata = (sid) => {

       

        fetch(API_URL + "/pdf/list/" + sid,
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
                   
                    let _clientName = resp.firstname + " " + resp.lastname ;
                    let _trainerName = resp.data[0].firstname+ " " + resp.data[0].lastname ;
                    downloadpdf(_clientName , _trainerName , resp.result)

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

    const downloadpdf = (_clientName,_trainerName, _image)=>{
     
        const doc = new jsPDF();
        doc.setTextColor(0, 0, 0);
        doc.text('Capnolearning Report', 10, 10,
            {styles:{ fontSize: 20,fontWeight: 'bold'}})

        doc.setDrawColor(0, 0, 0);
        doc.line(10, 15, 600, 15);
        doc.setFontSize(10)
        doc.text("Trainer Name:" + " " + _trainerName ,10,28);
        doc.text("Client Name:" + " " + _clientName ,10,23);
        doc.addImage(_image, 5, 40,200,115);
      
        doc.save("a4.pdf");
    } 


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
                    let _temp = [] ;
                    resp.pdfs.map((v,i) => {
                        
                        _temp.push({
                            report : v.pdf_name,
                            Createdate : new Date(v.added_on).toLocaleString(),
                            Actions : <p><a href="javascript:void" onClick={() => pdfdata(v.id)} className="downloadimg" target="_blank"><img src={preveiw} /></a>,<a href='javascript:void' onClick={() => pdfdata(v.id)} className="downloadimg"><img src={download} /></a></p>
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
            title: "Report", field: "report"
        },
        {
            title: <span className="text-right">Created Date</span>, field: "Createdate"
        },
        {
            title: <span className="text-right">Actions</span>, field: "Actions"
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
                    <h3>Client Homework Session Data Reports</h3>
                    <p>SimulatedGroupTesting </p>
                </div>
                <div className="wrp-bankform">
                    <div style={{ maxWidth: '100%' }}>
                        <MaterialTable
                        columns={columns}
                        data={data}
                        title=""
                        options={{
                            pageSize: 15,

                            pageSizeOptions:[5,10,15,20]
                        }}
                        />
                        
                    </div>
                </div>
               </div>
             </div>
            
        </div>
    )
}

export default PdfclienthomeworkReport;