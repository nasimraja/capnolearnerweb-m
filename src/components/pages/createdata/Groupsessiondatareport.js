import React from 'react';
import {Link,useParams, Router} from 'react-router-dom';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import download from '../../images/download.png'
import preveiw from '../../images/preveiw.png'

const Groupsessiondatareport = () => {

    const data =[
        {
            report: <a href="#">27 Jul 2021, 07:06 groutestReport</a>, Createdate: "31 Aug 2021, 12:31"
        }
       
    ]

    const columns =[
        {
            title: "Report", field: "report"
        },
        {
            title: <span className="text-right">Created Date</span>, field: "Createdate"
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
                    <h3>Session Data Reports</h3>
                    <p>SimulatedGroupTesting </p>
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
            
        </div>
    )
}

export default Groupsessiondatareport;