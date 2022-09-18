import React, {useEffect,useRef,useState} from 'react';
import {Link,useParams, Router} from 'react-router-dom';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import download from '../../images/download.png'
import preveiw from '../../images/preveiw.png'
import { API_URL } from '../../../config';

const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));

const Recording = () => {
    
    const { t } = useTranslation();
    const accessToken = localStorage.getItem('accessToken');
    const [recordings, setrecordings] = useState([]);
    const [data, setData] = useState([]);
    const classes = useStyles();


    useEffect(() =>{
        Recordings();

    },[]);

    const Recordings = () =>{

        fetch(API_URL+"/recording/distributor",
        
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
                    let _temp = [];
                    resp.recordings.map((v,i) => {
                        _temp.push({
                            recordingname: v.recording_name,
                            recordingtype: v.recording_type,
                            status: v.status == 1 ? "Active" : "Inactive",
                            action : <p> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="View" placement="top"><a href={v.recording} target={"_blank"} className="downloadimg"><img src={preveiw} /></a></Tooltip></p>
                        })
                    })
                    setData(_temp);
                   

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
        window.location.reload();
    }

    
    const columns =[
        {
            title: t('Recording-Name'), field: "recordingname"
        },
        // {
        //     title: t('Recording-Type'), field: "recordingtype"
        // },
        {
            title: t('Status'), field: "status"
        },
        {
            title: <span className="text-right">{t('Actions')}</span>, field: "action",align: "right"
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
                    <h3>{ t('Recording-by-Distributors')}</h3>
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

export default Recording;