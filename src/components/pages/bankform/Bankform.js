import React, {useEffect,useState} from "react";
import {Link,useParams, Router} from 'react-router-dom';
import { useTranslation, initReactI18next } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import MaterialTable from 'material-table';
import download from '../../images/download.png';
import preveiw from '../../images/preveiw.png';
import backIcon from "../../images/back.png";
import { jsPDF } from "jspdf";
import { API_URL } from "../../../config";

const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "black",
      fontSize: "15px"
    }
  }));

const Bankform = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [forms, setforms] = useState([]);
    const [data, setdata] = useState([]);
    const { t } = useTranslation();

    const classes = useStyles();

    

    useEffect(() => {
        PdfbankForm();

    }, []);

    

    const columns =[
        {
            title: t("Form-Name"), field: "name"
        },
        {
            title: <span className="text-right">{t("Actions")}</span>, field: "download",align: "right"
        }
       
    ]

    const PdfbankForm = () => {
        fetch(API_URL+"/forms/blank",
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
                    let _temp = [] ;
                    resp.data.map((v,i) => {
                        _temp.push({
                            name : v.forms,
                            download: <p><Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="Download" placement="top"><a href={"/forms/"+v.file} className="downloadimg tooltip2" target={"_blank"} download><img src={download} /></a></Tooltip> <Tooltip classes={{
                                tooltip: classes.customTooltip,
                                
                              }} title="View" placement="top"><a href={"/forms/"+v.file} className="downloadimg" target={"_blank"} ><img src={preveiw} /></a></Tooltip></p>
                            
                        })
                    })
                    setdata(_temp);

                  

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
    return(
        <div className="">
            <Header />
             <div className="wrp-dashbord">
                <div className="sidebar-section">
                <Sidebar />
               </div>
               <div className="right-section">
                <div className="head-demoreport">
                    <h3>{t("Blank-forms")}</h3>
                    <div className="back-icon-wrp">
                        <Link to="/view/manageform" className="backbtn-icon">
                            <img src={backIcon} alt="backicon" />
                            <span>{t("Back")}</span>
                        </Link>
                    </div>
                </div>
                <div className="wrp-bankform">
                    <div style={{ maxWidth: '100%' }}>
                        <MaterialTable
                        options={{
                            pageSize: 15,
                            pageSizeOptions:[5,10,15,20]
                        }}
                        columns={columns}
                        data={data}
                        title=""
                        />
                        
                    </div>
                </div>
               </div>
             </div>
            
        </div>
    )
}

export default Bankform;