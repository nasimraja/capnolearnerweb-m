import React from 'react';
import {Link,useParams, Router} from 'react-router-dom';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import download from '../../images/download.png'
import preveiw from '../../images/preveiw.png'

const PdfmultisessionReport = () => {

    const data =[
        {
            report: <a href="#">27 Jul 2021, 07:06 groutestReport</a>, Createdate: "31 Aug 2021, 12:31",download: <p><a href='#' className="downloadimg" download><img src={download} /></a> <a href='#' className="downloadimg"><img src={preveiw} /></a></p>
        }
       
    ]

    const columns =[
        {
            title: "Report", field: "report"
        },
        {
            title: <span className="text-right">Created Date</span>, field: "Createdate"
        },
        {
            title: <span className="text-right">Actions</span>, field: "download"
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
                    <h3>Multi Session Data Reports</h3>
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

export default PdfmultisessionReport;