import React, { Component, useEffect, useRef, useState } from 'react';
import { Row, Col, Container, Button, ModalHeader, ModalFooter, Modal, ModalBody } from "reactstrap";
import { Radio } from 'antd';
import ReactTooltip from 'react-tooltip';
// import Draggable from "react-draggable";
import { Link, useParams, Router } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { csv, image } from 'd3';
import Header from '../../component/Header';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import InputColor from 'react-input-color';
import { trim } from 'jquery';
import { setTextRange } from 'typescript';
import { API_URL } from '../../../config';
import arrowHeadRight from '../../images/turn_arrow.png'
import Draggable from 'react-draggable';
const Chart = (props) => {
    // console.log("props",props)
    const session = props.session;
    const record = props.record; 
    const [xAxis, setXaxis] = useState([]);
    const [yAxis2, setYAxis2] = useState([]);
    const {showclock} = useParams() ; 
    const sessionDate = props.sessionDate ; 
    const [textTooltip, setTextTooltip] = useState([]);
    const [statistics,setStatistics] = useState([]);
    // alert(new Date(parseInt(props.xmin)));
    let Utz = new Date().getTimezoneOffset() ; 
    const [tableView , setTableView] = useState(props.showSignalStat); 
    // Utz = Utz*60*1000 ; 
    useEffect(() =>{
        // // console.log("signal sat" , props.showSignalStat)
        if(!props.showSignalStat)
        {
            setTableView(props.showSignalStat)
        }
    },[props.showSignalStat])
    
const [unitArray, setunitArray] = useState({
    pco2wave : ["mmHg", "kPa" , "%" ],
    petco2 : ["mmHg", "kPa" , "%" ],
    bpmhistory : [],
    pco2b2b : ["mmHg", "kPa" , "%" ],
    capin : ["mmHg", "kPa" , "%" ],
    capnia : ["mmHg", "kPa" , "%" ],
    gpmhistory : [],
    aborted_expmhistory : [],
    bholdpmhistory : [],
    relativevpm : [],
    aborted_expm : [],
    bhpm : [],
    b2b2hr : ["bpm"],
    hrhistory : ["bpm"],
    rsahistory : ["bpm"],
    b2brsa : ["bpm"],
    bpm : [],
    hf_avg : ["ms"],
    b2brr_wave : ["ms"],
    arousal_avg : ["ms"],
    tone_avg : ["%"] , 
    reserve_avg : ["%"],
    vlf_avg : ["%"],
    lf_avg : ["%"],
    emg1_avg : ["uV"],
    emg2_avg : ["uV"],
    emg3_avg : ["uV"],
    emg4_avg : ["uV"],
    emg1_wave : ["uV"],
    emg2_wave : ["uV"],
    emg3_wave : ["uV"],
    emg4_wave : ["uV"]
});

const rawSignals = ["pco2wave","petco2","bpmhistory","pco2b2b","capin","capnia"] ;

    const [xAxisMin, setXaxisMin] = useState(props.xmin == 0 ? props.xmin :  new Date(parseInt(props.xmin*1e3))); 
    if(props.signal == "pco2wave"  ){
        // // console.log("newMin", new Date(parseInt(props.xmin*1e3)));
    }
    const [xAxisMax, setXaxisMax] = useState(props.xmax == "full" ? props.xmax :  new Date(parseInt(props.xmax*1e3))); 
    const [yAxisMin, setYaxisMin] = useState(parseFloat(props.ymin));  
    const [yAxisMax, setYaxisMax] = useState(parseFloat(props.ymax));
    const unit = useRef(0);
    const [color, setColor] = useState(props.color);
    const group = props.group;
    const clientSerial = props.clientSerial;
    const [reportComment,setReportComment] = useState(null);
    // alert(props.color)
    const [type, setType] = useState(props.type);
    const showActualTime = props.showActualTime ; 
    // // console.log("other" , JSON.parse(props.otherConfig))
    const otherConfig = props.otherConfig ? JSON.parse(props.otherConfig) : {
        xrange: 0, 
        units: (unitArray[props.signal][0] ? unitArray[props.signal][0] : ""),
        annotation:  1 ,
        grid: 1,
        inverty: 2,
        yposition: 1,
        lineType: "solid",
        stat: "median",
        tline: "dot",
        tcolor: "#FF0000",
        tthick: 1 ,
        tvalue: 35,
    };
    const [yAxis, setYaxis] = useState([]);
    const [yAxisOg, setYAxisOg] = useState([]);
    const [csvFile, setCsvFile] = useState([]);
    
    const accessToken = localStorage.getItem('accessToken');
    const [value, setValue] = useState(props.thick); 
    const [thresholdvalue ,setThresholdvalue] = useState(otherConfig.tvalue);
    const [thresholdthick ,setThresholdthick] = useState(otherConfig.tthick);
    const [thresholdtLine ,setThresholdtLine] = useState(otherConfig.tline);
    const [thresholdtcolor ,setThresholdtcolor] = useState(otherConfig.tcolor ? otherConfig.tcolor : "#FFFF00");
    
    const [point, setPoint] = useState(25);
    const [xrange, setXRange] = useState(otherConfig.xrange);
    const [rowHeight, setRowHeight] = useState("30px")
    const [taskMarkers,setTaskMarkers] = useState([]) ; 
    const [textAnnotations,setTextAnnotations] = useState((props.comment == "{}" || props.comment == "[]" || props.comment == null ? [] :  JSON.parse(props.comment))) ; 
    const [currentPoint,setCurrentPoint] = useState(null) ; 
    const [currentAnnotation,setCurrentAnnotation] = useState(null) ; 
    
    // const [liveAnnotation,setLiveAnnotation] = useState([]) ; 
    const [images , setImages] = useState([])
    let  liveAnnotation = [] ; 
    const [graphModal, setgraphModal] = useState(false);
    const toggleGraphModal = () => setgraphModal(!graphModal);

    const [trehSoldModal, settrehSoldModal] = useState(false);
    const toggletrehSoldModal = () => settrehSoldModal(!trehSoldModal);

    const [signalModal, setsignalModal] = useState(false);
    const toggleSignalModal = () => setsignalModal(!signalModal);

    const [tableModal, setTableModal] = useState(false);
    const toggleTableModal = () => setTableModal(!tableModal);
    
    const [commentModal, setCommentModal] = useState(false);
    const toggleCommentModal = () => setCommentModal(!commentModal);

    const [updateCommentModal, setUpdateCommentModal] = useState(false);
    const toggleUpdateCommentModal = () => setUpdateCommentModal(!updateCommentModal);
    // const [showSignalStat ,setShowSignalStat ] = useState(props.showSignalStat) ; 
    const showSignalStat  = props.showSignalStat ; 

    const [annotationtModal, setannotationtModal] = useState(false);
    const toggleannotationtModal = () => setannotationtModal(!annotationtModal);
    const [play, setPlay] = useState(false);
    const [dragMode, setDragMode] = useState('pan');
    
    const [modal,setModal] = useState({
        range:otherConfig.xrange,
        units:otherConfig.units,
        annotation: otherConfig.annotation,
        grid: otherConfig.grid,
        invert: otherConfig.inverty,
        position: otherConfig.yposition,
        showGrid : true
    })
    const [signalModalData,setSignalModalData] = useState({
        signalType:props.type == "line" ? 1 :   props.type == "bar"  ? 2 : 3,
        disabledType : props.type == "line" ? true :  false,
        stat: otherConfig.stat , 
        signal : 1
    })
    const [average,setAverage] = useState(30)
    const [comment,setComment] = useState((props.comment == "{}" || props.comment == "[]" || props.comment == null ? [] :JSON.parse(props.comment)))
    const [signalLinetype , setSignalLinetype] = useState(otherConfig.lineType)
    // const [hideThresholdLine,setHideThresholdLine] = useState(true)
    const [showThresholdLine,setShowThresholdLine] = useState(false)
    const setConfig = props.setConfig ; 
    const setStats = props.setStats ; 
    
    const [signalName, setSignalName] = useState({
        pco2wave : "Raw PCO<sub>2</sub>",
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
        b2b2hr : "Beat to Beat heart rate",
        hrhistory : "Heart rate History",
        rsahistory : "RSA History",
        b2brsa : "Beat to Beat RSA",
        bpm : "Breaths/min",
        hf_avg : "HF Band",
        b2brr_wave : "Tachograph of RR",
        arousal_avg : "Activation",
        tone_avg : "Parasympathetic Tone" , 
        reserve_avg : "Parasympathetic Reserve",
        vlf_avg : "VLF Band",
        lf_avg : "LF Band",
        emg1_avg : "EMG 1 Average",
        emg2_avg : "EMG 2 Average",
        emg3_avg : "EMG 3 Average",
        emg4_avg : "EMG 4 Average",
        emg1_wave : "EMG 1 Raw Wave",
        emg2_wave : "EMG 2 Raw Wave",
        emg3_wave : "EMG 3 Raw Wave",
        emg4_wave : "EMG 4 Raw Wave"
})
   

    let playTimer ; 

    let zommDeviation = 0.02
    const [length,setLength]  = useState(0)
    let colorCodes = {} ; 
    colorCodes['BR-18'] = "#d3d3d3"
    colorCodes['BR-12'] = "#FFFF00"
    colorCodes['BR-6'] = "#FFF000"
    colorCodes['Paused'] = "#FF0000"
    useEffect(() => {
        // super(props);
        // // console.log("max" ,xAxisMax)
      
    }, [xAxis, yAxis,textAnnotations,signalModalData])

    useEffect(() => {
        let _temp = {
            color : color.hex  ? color.hex : color,
            type : type,
            signal: props.signal,
            avg : average,
            xmin : new Date(xAxisMin).getTime(),
            thick : value,
            xextreme : new Date(xAxis[xAxis.length-1]).getTime(),
            xmax : xAxisMax == "full" ? new Date(xAxis[xAxis.length-1]).getTime() : new Date(xAxisMax).getTime(),
            ymin : yAxisMin,
            ymax : yAxisMax,
            record : record,
            graph_order : props.graph_order,
            comment : comment,
            row : props.row,
            clientSerial : null,
            col : props.col,
            xrange: xrange, 
            units: modal.units,
            annotation: modal.annotation,
            grid: modal.grid,
            inverty: modal.invert,
            yposition: modal.position,
            lineType: signalLinetype,
            thresholdtLine: thresholdtLine,
            thresholdtcolor: thresholdtLine,
            stat: signalModalData.stat,
            thresholdthick: thresholdthick,
            thresholdvalue: thresholdvalue
        }
        group  ? clientSerial ?  setConfig(clientSerial,_temp) : setConfig(props.profile.name,_temp) : props.multi ?  setConfig(props.signal+"_"+props.session,_temp) : setConfig(props.signal,_temp)
    },[color,type,average,xAxisMin,value,xAxisMax,yAxisMin,yAxisMax,record,comment,signalLinetype,modal]);

    useEffect(() => {
        // super(props);
        clearInterval(playTimer);
        getAlldata();
       
    }, [])

    useEffect(() => {
        let _t =[] ;
        // super(props);
       yAxis2.map((v,i) => {
            _t.push(thresholdvalue);
            if(i == (yAxis2.length - 1) ){
                setYAxis2(_t);
            }
       })
       
    }, [thresholdvalue])


    const getMax = (arr) => {
        let len = arr.length;
        let max = -Infinity;
    
        while (len--) {
            max = arr[len] > max ? arr[len] : max;
        }
        return max;
    }
    const getCsv = () => {
        fetch(API_URL+"/session/data?session_id=" + session + "&signal_name=" + props.signal,
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
                        setCsvFile(resp.sessions[0].sessiondata)
                        getData(resp.sessions[0].sessiondata,otherConfig.stat)
                    }


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

    const getAlldata = () => {
        fetch(API_URL+"/session/data/type?session_id=" + session + "&type=2",
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
                if (resp.sessions[0]) {
                                  liveAnnotation = "["+resp.sessions[0].sessiondata+"]" ; 
                                //   // console.log(resp.sessions[0]);
                                  liveAnnotation = JSON.parse(liveAnnotation);
                                //   liveAnnotation =
                               
                    getCsv();
                }
                else{
                    getCsv();

                }


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
    async function getData(_csvFile,_stat) {
        let _x = [];
        let _toolText=[];
        let _y = [];
        let _tempY = []; 
        let _threshold = [];
        let _tempStats = [] ;

        let _npauseTime = 0 ; 
        let _length = 0 ;
        let _pauseTime = 0 ; 
        // let userTimeOffset = 0 ; 
        let userTimeOffset = new Date().getTimezoneOffset() ; 
        
        userTimeOffset = userTimeOffset*60*1000 ; 
        // alert(userTimeOffset);
        if(userTimeOffset > 0 || userTimeOffset < -60*60*1000){
            userTimeOffset += dstOffset()*60*1000  ; 
        }
         
        // alert(userTimeOffset);
 
        
    //    alert(userTimeOffset);
          let _allTasks = [] ; 
          let _allAnnotation = [] ; 
          let lastTask  ; 
        //   // console.log(userTimeOffset);
        // csv('//capno-data.s3.amazonaws.com/' + _csvFile).then(data => {
        csv('//capno-data.s3.amazonaws.com/' + _csvFile).then(data => {
            // // console.log(data);
            // let _tasks = {} ; 
            let _temptask = [] ; 
            let _taskArray = [] ; 
            let _recordArray = [] ; 
            let _tempAnnotation = textAnnotations ; 
            let _tempImages = [] ; 
            let lastRecord  ; 
            let firstRecord = 0   ; 
            let recId = 0 ; 
            let prevRecord = 0 ; 
            let vfirstRecord = 0 ;
            let endTask  = 0 ;
        // // console.log(data[0]);
            data.map((v, i) => {
                if(i == 0 || v.x != data[i-1].x ){
                
                    if(v.z > 0 && vfirstRecord == 0 && v.x > 0){

                       
                        vfirstRecord = v.x ; 
                  
                
                   }

            //     if(v.z > 0 && record != 'all'  && v.x > 0 ){

                       
            //         firstRecord = v.x ; 
              
            
            // }
                // _x.push(new Date(v.x));
                if(v.z > 0 && (record == 'all' || record == v.r) && v.x > 0 ){
                lastRecord = v.x ; 
                
                if(firstRecord == 0 ){

                       
                        firstRecord = v.x ; 
                  
                
                }

               
              
                if(_npauseTime > 0){
                    _pauseTime  += _npauseTime ; 
                }

                let xData = new Date(parseInt((((v.x) - firstRecord) + (userTimeOffset) ) - _pauseTime  ))

                if(showclock == 1){
                let _getHours = sessionDate.split("-");
                _getHours = _getHours[1].split(":");
                _getHours = parseInt(_getHours[0])*60*60*1000 + parseInt(_getHours[1])*60*1000 ; 
                xData = new Date(parseInt((((v.x) - vfirstRecord) + _getHours + (userTimeOffset) ) - _pauseTime  ))

                }

                 
                // // console.log("First Data "+props.signal , firstRecord)
                // // console.log("First Record "+props.signal , firstRecord)
                
                    _length = parseInt(v.x - firstRecord - _pauseTime) ;
                    // // console.log(_length)
                    _x.push(xData);
                    _toolText.push(signalName[props.signal])
                    // // console.log()
                    if(group){
                        // console.log('which y', v['y'+(props.index+1)+'_median'])
                        _y.push(parseFloat(v['y'+(props.index+1)+'_median']));
                        // let yt = parseFloat(v['y'+(props.index+1)+'_median']) ; 
                        let yt ;
                        if(_stat == "median"){
                            yt = parseFloat(v['y'+(props.index+1)+'_median']) ;  
                        }
                        else if(_stat == "mean"){
                            yt = parseFloat(v['y'+(props.index+1)]) ;  
                        }
                        else if(_stat == "sd"){
                           yt = parseFloat(v['y'+(props.index+1)+'_std']) ;  
                         
                        }
                        if(otherConfig.units == "kPa"){
                            _tempY.push(yt*0.133322);
                        }
                        else if(otherConfig.units == "%"){
                            _tempY.push(yt/100);
            
                        }
                        else if(otherConfig.units == "mmHg"){
                            _tempY.push(yt);
            
                        }
                        else {
                            _tempY.push(yt);
            
                        }
                        _threshold.push(thresholdvalue);



                    }
                    else{

                        let yt ;
                        if(_stat == "median"){
                            yt = parseFloat(v.median) ;  
                        }
                        else if(_stat == "mean"){
                            yt = parseFloat(v.y) ;  
                        }
                        else if(_stat == "sd"){
                            yt = parseFloat(v.std) ;  
                        }
                        if(rawSignals.includes(props.signal)){
 
                        if(otherConfig.units == "kPa"){
                            _tempY.push(yt*0.133322);
                        }
                        else if(otherConfig.units == "%"){
                            _tempY.push(yt/100);
            
                        }
                        else if(otherConfig.units == "mmHg"){
                            _tempY.push(yt);
            
                        }
                        else {
                            _tempY.push(yt);
            
                        }
                    }
                    else{
                        _tempY.push(yt);
                    }
                        if(yt == 0 && i > 0 ){
                            yt = _y[i-1] ;
                        }
                        _threshold.push(thresholdvalue);
                        _y.push(yt);
                    }

                    _tempStats.push({
                        x : xData.getHours()+":"+xData.getMinutes()+":"+xData.getSeconds()+":"+xData.getMilliseconds(),
                        mean : parseFloat(v.y).toFixed(2),
                        median : parseFloat(v.median).toFixed(2),
                        sd : parseFloat(v.std).toFixed(2),
                    }) 
                
                    if( v.r != prevRecord ){
                        recId++ ; 
                        let _recName = "Rec - "+recId ; 
                        _recordArray.push([xData,v.rname == "Normal" ? _recName : v.rname  ]);
                      
                        
                    }
                    prevRecord = v.r

                    
                    if(v.rname != "Normal" ){
                        
                      
                        if( _taskArray.length > 0 ){
                            // // console.log(v);
                            if(data[i+1]){
                                if(lastTask != data[i+1].text){
                                    // _taskArray[0] = xData;
                                    // _taskArray.push(xData)
                                    _taskArray.push(lastTask)
                                    _taskArray.push(lastTask)
                                    // // console.log("task",_taskArray);
                                    _taskArray.push(xData)
        
                                    // _tasks[] = _taskArray
                                    endTask = _allTasks.length ; 
                                    _allTasks.push(_taskArray);
                                    _allAnnotation.push(_taskArray);
                                    _taskArray = [] ; 
                                }
                            }
                           else  if(i == data.length - 1 ){
                            // // console.log(v);
                            // _taskArray[0] = xData;
                            // _taskArray.push(xData)
                            _taskArray.push(lastTask)
                            _taskArray.push(lastTask)
                            _taskArray.push(xData)
                            // // console.log("task",_taskArray);
                            endTask = _allTasks.length
                            // _tasks[] = _taskArray
                            _allTasks.push(_taskArray);
                            _allAnnotation.push(_taskArray);
                            _taskArray = [] ; 
                            }
                        }
                        else if(v.z > 1 && _taskArray.length == 0){
                            lastTask =  v.text ; 
                            _taskArray.push(xData)

                            // // console.log(lastTask);
                            // _taskArray.push(xData)
                             
                        }
                       
                    }
                if(_npauseTime > 0){
                        // let xpData = new Date(parseInt((((v.x) - firstRecord - 2000) + (userTimeOffset) ) - _pauseTime  ))
                        let _pTime = parseInt(_npauseTime/1000) ; 
                        let _ptasks = [xData,xData,_pTime+"s Pause","Paused"]
                        _allAnnotation.push(_ptasks);
                        _allTasks.push(_ptasks);
                        _ptasks = [] ;
                }
                _npauseTime = 0 ; 
               

                }
                else if(v.z == 0 && _x.length > 0){
                    _npauseTime  = parseInt(v.x) -  parseInt(lastRecord) ; 
                }
              
                
                if (i == (data.length - 1)) {
                    // alert("here");
                // // console.log(_x.length)
                // // console.log("records",_recordArray)
                _recordArray.map((v,i) => {
                    // let _xPer = new Date(_x[_x.length - 1]).getTime() - new Date(_x[0]).getTime() ;
                    // _xPer = _xPer*0.015 ; 
                    // _tempImages.push({
                    //     source: arrowHeadRight,
                    //     xref: "x",
                    //     yref: "y",
                    //     x: v[0],
                    //     y: yAxisMax-(yAxisMax*0.1),
                    //     sizex: (_xPer > 5000 ? 5000 : 3000 ),
                    //     sizey: 100,
                    //     xanchor: "left",
                    //     yanchor: "bottom",
                    //     pointNum: 1
                    // })
                _temptask.push(
                    {
                        type: 'rect',
                        // x-reference is assigned to the x-values
                        xref: 'x',
                        // y-reference is assigned to the plot paper [0,1]
                        yref: 'paper',
                        x0: v[0],
                        y0: 0,
                        x1: v[0] ,
                        y1: 1,
                        // fillcolor: "#000" ,
                        opacity: 1,
                        line: {
                            color: 'rgb(255, 0, 0)',
                            width: 1,
                            dash:'dot'
                        },
                        
            
                    }
                    
                );
                })

                
                if(_allTasks.length == 0){
                    
                    liveAnnotation.map((v,i) => {
                      
                        let xAnnTime = new Date(parseInt(((parseInt(v.x) - firstRecord) + (userTimeOffset) ) - _pauseTime  ));
                        // // console.log("I ma here")
                            // // console.log(parseInt(((parseInt(annData.x) - firstRecord) + (userTimeOffset) ) - _pauseTime  ));
                            _temptask.push(
                                {
                                    type: 'rect',
                                    // x-reference is assigned to the x-values
                                    xref: 'x',
                                    // y-reference is assigned to the plot paper [0,1]
                                    yref: 'paper',
                                    x0: xAnnTime ,
                                    y0: 0,
                                    x1: xAnnTime ,
                                    y1: 3,
                                    // fillcolor: "#000" ,
                                    opacity: 1,
                                    line: {
                                        color: 'rgb(255, 0, 0)',
                                        width: 1,
                                        dash:'dot'
                                    },
                                    name: v.z,
                                    
                        
                                }
                                
                            );

                           if(i == (liveAnnotation.length - 1)){
                           
                            setTaskMarkers(_temptask);
                           }

                        })
                    // // console.log(_temptask)
                 
             
                }


                    _allTasks.map((v,i) => {
                        // console.log(props.signal,v[2],v)
                        if(v[3] == "Paused" ){
                            _temptask.push(
                                {
                                    type: 'rect',
                                    // x-reference is assigned to the x-values
                                    xref: 'x',
                                    // y-reference is assigned to the plot paper [0,1]
                                    yref: 'paper',
                                    x0: v[0] ,
                                    y0: 0,
                                    x1: v[1] ,
                                    y1: 3,
                                    opacity: 0.5,
                                    line: {
                                        width: 0.5
                                    },
                                    name: v[2],
    
                                }
                            );
                        }
                        else{
                            _temptask.push(
                                {
                                    type: 'rect',
                                    // x-reference is assigned to the x-values
                                    xref: 'x',
                                    // y-reference is assigned to the plot paper [0,1]
                                    yref: 'paper',
                                    x0: v[0] ,
                                    y0: 0,
                                    x1: v[0] ,
                                    y1: 3,
                                    opacity: 0.5,
                                    line: {
                                        width: 1
                                    },
                                    name: v[2],
    
                                }
                            );

                            if(i == endTask){
                                // console.log("End Task",v)
                                _temptask.push(
                                    {
                                        type: 'rect',
                                        // x-reference is assigned to the x-values
                                        xref: 'x',
                                        // y-reference is assigned to the plot paper [0,1]
                                        yref: 'paper',
                                        x0: v[3] ,
                                        y0: 0,
                                        x1: v[3] ,
                                        y1: 3,
                                        opacity:1,
                                        line: {
                                            width: 1
                                        },
                                        name: v[2],
        
                                    }
                                );
                            }

                           
                        }
                        




                        if(i == (_allTasks.length - 1)){
                            if(liveAnnotation.length == 0){
                                setTaskMarkers(_temptask);
                                

                            }
                            liveAnnotation.map((v,i) => {
                              
                                let xAnnTime = new Date(parseInt(((parseInt(v.x) - firstRecord) + (userTimeOffset) ) - _pauseTime  ));
                                // // console.log("I ma here")
                                    // // console.log(parseInt(((parseInt(annData.x) - firstRecord) + (userTimeOffset) ) - _pauseTime  ));
                                    _temptask.push(
                                        {
                                            type: 'rect',
                                            // x-reference is assigned to the x-values
                                            xref: 'x',
                                            // y-reference is assigned to the plot paper [0,1]
                                            yref: 'paper',
                                            x0: xAnnTime ,
                                            y0: 0,
                                            x1: xAnnTime ,
                                            y1: 3,
                                            // fillcolor: "#000" ,
                                            opacity: 1,
                                            line: {
                                                color: 'rgb(255, 0, 0)',
                                                width: 1,
                                                dash:'dot'
                                            },
                                            name: v.z,
                                            
                                
                                        }
                                        
                                    );
    
                                   if(i == (liveAnnotation.length - 1)){
                                   
                                    setTaskMarkers(_temptask);
                                   }
    
                                })
                            // // console.log(_temptask)
                         
                     
                        }
                

                    } )
                    let ymax= getMax(_y) ;

                    if(yAxisMax == 0){
                        
                        if(ymax == 0){
                            setYaxisMax(5)

                        }
                        else{
                        ymax += ymax*0.25 ;
                        setYaxisMax(ymax)

                        }

                    }

                    if(record == "all" ){
                    _recordArray.map((v,i) => {
                        // if(i > 0 ){
                        _tempAnnotation.push(
                            {
                                xref: 'x',
                                yref: 'y',
                                x: new Date(new Date(v[0]).getTime()) ,
                                y: yAxisMax-(yAxisMax*0.022),  
                                textangle: 0,
                                text: '',
                                showarrow: true,
                                arrowhead: 1,
                                ax: -20, 
                                bgcolor: "#fff",
                                ay:0,
                                arrowcolor: "#FF0000",                 
                            },
                          
                        );
                        _tempAnnotation.push(
                            {
                                xref: 'x',
                                yref: 'y',
                                x: new Date(new Date(v[0]).getTime() + 1000) ,
                                y: yAxisMax-(yAxisMax*0.18),  
                                textangle: 270,
                                text: v[1],
                                showarrow: false,
                                arrowhead: 1,
                                ax: 0, 
                                bgcolor: "#fff",
                                ay:0,
                                arrowcolor: "#FF0000",                 
                            },
                          
                        );
                        // }
                    })
                }
                    if(_allAnnotation.length == 0 ){
                        liveAnnotation.map((v,i) => {
                              
                            let xAnnTime = new Date(parseInt(((parseInt(v.x) - firstRecord) + (userTimeOffset) ) - _pauseTime  ))
                                // // console.log(parseInt(((parseInt(annData.x) - firstRecord) + (userTimeOffset) ) - _pauseTime  ));
                                _tempAnnotation.push(
                                    {
                                        
                                        xref: 'x',
                                        yref: 'y',
                                        x: xAnnTime ,
                                        y: 40,  
                                        textangle: 0,
                                        text: v.z,
                                        showarrow: true,
                                        arrowhead: 10,
                                        ax: 25,
                                        bgcolor: "#fff",
                                        arrowcolor: "#FF0000", 
                                        
                                        ay:0
                            
                                    }
                                    
                                );

                               if(i == (liveAnnotation.length - 1)){
                                 
                                   setTextAnnotations(_tempAnnotation);                                 
                               }
                            })
                    }

                    _allAnnotation.map((v,i) => {
                        // // console.log(v)
                        if(v[3] == "Paused" ){
                            
                            _tempAnnotation.push(
                                {
                                    xref: 'x',
                                    yref: 'y',
                                    x: v[0] ,
                                    y: ymax-(ymax*0.1),  
                                    textangle: 0,
                                    text: v[2],
                                    showarrow: true,
                                    arrowhead: 10,
                                    ax: 45, 
                                    bgcolor: "#fff",
                                    ay:0,
                                    arrowcolor: "#FF0000", 
                        
                                }
                            );
                        }
                        else{
                            _tempAnnotation.push(
                                {
                                    xref: 'x',
                                    yref: 'y',
                                    x: v[0] ,
                                    y:  (ymax == 0 ? 2 : ymax-(ymax*0.6)),  
                                    textangle: 270,
                                    text: v[2],
                                    showarrow: false,
                                    arrowhead: 0,
                                    ax: 5,
                                    bgcolor: "#000000",
                                    arrowcolor: "#FF0000", 
                                    font:  {
                                        color: "#fff" ,
                                    },
                                    ay:5
                        
                                }
                            );
                        }
                        




                        if(i == (_allAnnotation.length - 1)){
                                                //   // console.log("annotation",_tempAnnotation);
                                                // alert(liveAnnotation.length)
                            liveAnnotation.map((v,i) => {
                              
                            let xAnnTime = new Date(parseInt(((parseInt(v.x) - firstRecord) + (userTimeOffset) ) - _pauseTime  ))
                                // // console.log(parseInt(((parseInt(annData.x) - firstRecord) + (userTimeOffset) ) - _pauseTime  ));
                                _tempAnnotation.push(
                                    {
                                        xref: 'x',
                                        yref: 'y',
                                        x: xAnnTime ,
                                        y: 40,  
                                        textangle: 0,
                                        text: v.z,
                                        showarrow: true,
                                        arrowhead: 10,
                                        ax: 25,
                                        bgcolor: "#fff",
                                        arrowcolor: "#FF0000", 
                                        
                                        ay:0
                            
                                    }
                                    
                                );

                               if(i == (liveAnnotation.length - 1)){
                                 
                                   setTextAnnotations(_tempAnnotation);                                 
                               }

                            })
                        }
                

                    } )

                    if(_allAnnotation.length == 0){
                        setTextAnnotations(_tempAnnotation);                                 

                    }

                    setLength(_length);
                    setImages(_tempImages)
                    setTextTooltip(_toolText);
                    setYAxis2(_threshold)
                    if(average == 30){
                        // console.log("axis x" , _x.length)
                        // console.log("axis y" , _tempY.length)
                        setYaxis(_tempY);
                        setXaxis(_x);
                    }
                    else{
                        let _data =  calculate_history_sample([_x,_tempY],average)
                        setYaxis(_data[1]);
                        setXaxis(_data[0]);
                    }
                   

                    setYAxisOg(_y);
                    if(props.signal == "capin"){
                        
                        let ymin= Math.min(..._y) ;
                     
                            ymin -= ymin*0.25 ;
                            setYaxisMin(ymin)
 

                    }
                    // console.log("signal x:"+props.signal,_x)
                     
                    if( props.signal != "pco2wave"  && props.signal != "pco2b2b"  && props.signal != "capin" && props.signal != "b2b2hr" && props.signal != "b2brsa" ){
                        setStats(props.signal,_tempStats)
                    setStatistics(_tempStats)

                    }

                  
                    // plotGraph(_x,_y);

                }
            }
            })
            // // console.log(data)
        })

    }


    const handleColor = (e) => {
            // console.log(e);
    }


    const toogleTableView = () => {
        // setShowSignalStat(!showSignalStat);
        setTableView(!tableView);

}
    

    const handleInitial = (e) => {
        // reset();
//         // console.log(e);
//     let userTimeOffset = new Date().getTimezoneOffset() ; 
//     // //    alert(userTimeOffset);
//     userTimeOffset = userTimeOffset*60*1000 ; 
// // console.log("initial" , new Date(e.layout.xaxis.range[0]))
// // console.log("initial" , new Date(e.layout.xaxis.range[1]))
        if(props.xmin == 0 ){
            setXaxisMin(new Date(xAxis[0]))
        }  
//         else{
            
//             setXaxisMin(new Date(parseFloat(xAxisMin)))
//             // alert(parseFloat(xAxisMin+userTimeOffset));
//             // alert(new Date(xAxisMin))

//         }

        if(props.xmax == "full" ){
            setXaxisMax(new Date(new Date(xAxis[xAxis.length - 1])));
        }
//         else{
//             setXaxisMax(new Date(xAxisMax+userTimeOffset))

//         }


         

       
}

    const handleRelayout = (e) => {
        setXRange('')
        if(new Date(e['xaxis.range[0]']) < new Date(xAxis[0])){
            let _diff = xAxisMax - xAxisMin ; 
            setXaxisMin(new Date(xAxis[0]))
        }
        else  if(new Date(e['xaxis.range[1]']) > new Date(xAxis[xAxis.length-1])){
            let _diff = xAxisMax - xAxisMin ; 
            setXaxisMax(new Date(xAxis[xAxis.length-1]))
            setXaxisMin(new Date(xAxis[xAxis.length-1] - _diff )) ;
        }
        else if(new Date(e['xaxis.range[1]']) < new Date(xAxis[0])){
            setXaxisMax(new Date(xAxis[xAxis.length - 1]))
            setXaxisMin(new Date(xAxis[0]))
        }
        else{
            setXaxisMin(new Date(e['xaxis.range[0]']))
            setXaxisMax(new Date(e['xaxis.range[1]']))
        }
}

useEffect(() => {    
        moveGraph()
},[play,xAxisMax,xAxisMin])

const zoomIn = () => {
    let _deviation = zommDeviation*length ; 
    // console.log(_deviation);
    // console.log(length);
    // console.log(xAxisMin)
    
    // let userTimeOffset = new Date().getTimezoneOffset() ; 
    // //    alert(userTimeOffset);
    // userTimeOffset = userTimeOffset*60*1000 ; 
    let _diff = new Date(xAxisMax).getTime() -  new Date(xAxisMin).getTime() ; 
    if(_diff > _deviation && _diff > 60000){
        let _newXaxisMin = new Date(xAxisMin).getTime() + _deviation  ; 
        // console.log(new Date(_newXaxisMin)  );
        setXaxisMin(new Date(_newXaxisMin))
    
     
        let _newXaxisMax = new Date(xAxisMax).getTime() - _deviation  ; 
        setXaxisMax(new Date(_newXaxisMax))
    }
    else{
        // console.log("Max Zoom Reached");
    }
   
 
    
}


const zoomOut = () => {
    let _deviation = zommDeviation*length ; 
    // // console.log(_deviation);
    // // console.log(length);
    // // console.log(new Date(xAxisMin))
    
    // let userTimeOffset = new Date().getTimezoneOffset() ; 
    // //    alert(userTimeOffset);
    // userTimeOffset = userTimeOffset*60*1000 ; 
    let _diff = new Date(xAxisMax).getTime() -  new Date(xAxisMin).getTime() ; 
    if(_diff < length){
        let _newXaxisMin = new Date(xAxisMin).getTime() - _deviation  ; 
        // console.log(new Date(_newXaxisMin)  );
        setXaxisMin(new Date(_newXaxisMin))
    
     
        let _newXaxisMax = new Date(xAxisMax).getTime() + _deviation  ; 
        setXaxisMax(new Date(_newXaxisMax))
    }
    else{
        // console.log("Max Zoom Reached");
    }
   
 
    
}




const moveForward = () => {
     
    // // console.log(_deviation);
    // // console.log(length);
    // // console.log(new Date(xAxisMin))
    
    let userTimeOffset = new Date().getTimezoneOffset() ; 
    //    alert(userTimeOffset);
    userTimeOffset = userTimeOffset*60*1000 ; 
    let _diff = new Date(xAxisMax).getTime() -  new Date(xAxisMin).getTime() ; 
    let _newMin =  new Date(xAxisMin).getTime() + _diff ; 
    _newMin = new Date(_newMin) ;
    if(_newMin < new Date(xAxis[0])){
        setXaxisMin(new Date(xAxis[0]))
    }
    else if(_newMin >= new Date(xAxis[xAxis.length - 1])){
      

        _newMin =  new Date(xAxis[xAxis.length - 1]).getTime() - _diff ; 
  
        setXaxisMin(_newMin)
    }
    else{
        setXaxisMin(_newMin)
    }
    let _newMax =  new Date(xAxisMax).getTime() + _diff ; 
    _newMax =  new Date(_newMax)  ; 
    if(_newMax >= xAxis[xAxis.length - 1]){
        setXaxisMax(new Date(xAxis[xAxis.length - 1]))
    }
    else{
        setXaxisMax(_newMax)
    }
   
 
    
}
    

const reset = () => {
    
    setXaxisMin(new Date(xAxis[0]))
    setXaxisMax(new Date(xAxis[xAxis.length - 1]))
    setPlay(false);

 
    
}
    

const moveBackward = () => {
    
  
    
    let userTimeOffset = new Date().getTimezoneOffset() ; 
    //    alert(userTimeOffset);
    userTimeOffset = userTimeOffset*60*1000 ; 
    let _diff = new Date(xAxisMax).getTime() -  new Date(xAxisMin).getTime() ; 
    let _newMin =  new Date(xAxisMin).getTime() - _diff ; 
    _newMin = new Date(_newMin) ;
    // console.log("Newmin C" , _newMin);
    // // console.log("OGmin" , _newMin);
    // console.log("Newmin O" , new Date(xAxis[0]));
    if(_newMin <= new Date(xAxis[0])){
        // // console.log("Newmin R" ,"true")
        // // console.log("Newmin S" ,xAxisMin)
        // // console.log("Newmin Y" ,xAxis)
        setXaxisMin(new Date(xAxis[0]))
    }
    else if(_newMin >= new Date(xAxis[xAxis.length - 1])){
      

        _newMin =  new Date(xAxis[xAxis.length - 1]).getTime() - _diff ; 
  
        setXaxisMin(_newMin)
    }
    else{
        setXaxisMin(_newMin)
    }
    let _newMax =  new Date(xAxisMax).getTime() - _diff ; 
    _newMax =  new Date(_newMax)  ; 
    if(_newMax >= xAxis[xAxis.length - 1]){
        // console.log("this is set 1");
        setXaxisMax(new Date(xAxis[xAxis.length - 1]))
    }
    else if(_newMax <= new Date(xAxis[0])){
    _newMax =  new Date(xAxis[0]).getTime() + _diff ; 
 
        setXaxisMax(_newMax)
    }

    else{
       
        setXaxisMax(_newMax)
    }
   
 
    
}
    


const moveGraph = () => {
    
        // console.log("Checking")
        // console.log(play)

        if(play){
            // console.log("Playing")
            let _diff = 30; 
            let _xAxisMin = xAxisMin
            let _newMin =  new Date(_xAxisMin).getTime() + _diff ; 

            _newMin = new Date(_newMin) ;
          
            let _xAxisMax = xAxisMax
       
            let _newMax =  new Date(_xAxisMax).getTime() + _diff ; 
            _newMax =  new Date(_newMax)  ; 
            if(_newMax > xAxis[xAxis.length - 1]){
                setXaxisMax(new Date(xAxis[xAxis.length - 1]))
            }
            else{
                // console.log(_newMin);
                // console.log(_newMax);
                setXaxisMax(_newMax)
                setXaxisMin(_newMin)
               

            }
        }
      
 
}

// // console.log("xAxis",xAxisMax)
    
const handlePlay = () => {
  
    setPlay(true);
   
}

const handleSelection = () => {
    if(dragMode == 'pan'){
        setDragMode('zoom')
    }   
    else{
        setDragMode('pan')
    }
}
  
const handlePause = () => {

    setPlay(false);


}  


const calculate_history_sample = (data,sample) => {
    let first = data[0][0];
    var num =  sample/30 ;
     var next = num - 1 ;
    var newdataX = [] ;
    var newdataY = [] ;
    if(sample == 30){
        newdataX = data[0] ;
        newdataY = data[1] ;
    return [newdataX,newdataY];

    }
    else{
        var totalsum = 0 ;
        var c = 1 ;
         first = 0 ;
        for(var i = 0 ; i < data[0].length ;  i++   ){
            if(first == 0){
                first = i ;
            }
            if(i < next ){
                c++ ;
                totalsum += parseFloat(data[1][i]) ;
            }
            else if(i == next || i == (data[0].length - 1)){
                totalsum += parseFloat(data[1][i]) ;
                
                // console.log(totalsum);
            var avgvalue = parseFloat(totalsum / num);
            // // console.log(data[i][0]);
            // // console.log(avgvalue);
            newdataX.push(data[0][i-(num - 1)]);
            newdataY.push(avgvalue);
         
            next = next + num ;
            totalsum = 0 ;
        
            c = 1 ;
            }           
            if(i == (data[0].length - 1)){
    // // console.log("Average" , [newdataX,newdataY]);

                return [newdataX,newdataY];
            }
    }
    }
}
 

const handleUnitChange = (e) => {
 
        let {value=""}=e.target||{}
             setModal(prevState =>({
               ...prevState,
                 units:value 
             }))
             let _temp = [] ; 
        yAxisOg.map((v,i) => {
            if(value == "kPa"){
                _temp.push(v*0.133322);
            }
            else if(value == "%"){
                _temp.push(v/100);

            }
            else if(value == "mmHg"){
                _temp.push(v);

            }

            if(i == (yAxisOg.length -1) ){
           
                   let _data =  calculate_history_sample([xAxis,_temp],average)
                    setYaxis(_data[1]);
                    setXaxis(_data[0]);
                
                
            }

        })
    }
 

const handleAnnotations = e => {
    let {value = "" } = e.target || {}
    setModal(prevState=>({
        ...prevState,
        annotation : value
    }))
}
const handleXaxisWiindow = e => {
    let {value = "" } = e.target || {}
    setModal(prevState=>({
        ...prevState,
        xwindow : value
    }))
}

const handleGridLine = e => {
    let {value = "" } = e.target || {}
    if(value == 1){
        setModal(prevState=>({
            ...prevState,
            showGrid : true,
            grid : value
        }))
    }else{
        setModal(prevState=>({
            ...prevState,
            showGrid : false,
            grid : value
        }))
    }
    
}

const handleInvert = e => {
    let {value = "" } = e.target || {}
    if(value===1){
        setYaxisMax(yAxisMin)
        setYaxisMin(yAxisMax)
    }else{
        setYaxisMin(yAxisMax)
        setYaxisMax(yAxisMin)
    } 
    setModal(prevState=>({
        ...prevState,
        invert : value
    }))    
}

const handleYaxisPosition = e => {
    let {value = "" } = e.target || {}   
    if(value == 1){
        setXaxisMax(xAxisMin)
        setXaxisMin(xAxisMax)
    }else{
        setXaxisMin(xAxisMax)
        setXaxisMax(xAxisMin)
    } 

    setModal(prevState=>({
        ...prevState,
        position : value
    })) 
}

const xAxisRange = (event) =>{
    let {value = ""} = event.target || {}
    if(value == "0"){
           
    setXaxisMin(new Date(xAxis[0]))
    setXaxisMax(new Date(xAxis[xAxis.length - 1]))
    }
    else if(value != "0"){
        let _deviation = value*60000
        let xAxisMilisecond = new Date(xAxisMin).getTime() + _deviation
        setXaxisMax(new Date(xAxisMilisecond))
    }

}


const handleSignalStat = e => {
    let {value = ""} = e.target || {}
        setSignalModalData(prevState=>({
            ...prevState, 
            stat : value
        }))   
        // setTimeout(() => {
            getData(csvFile,value) ; 
        // }, 3000);
       
    }

    // useEffect(() => {
    //     // console.log(signalModalData.stat);
    //    getData(csvFile,signalModalData.stat) ;    
    //     },[showActualTime])
    
 

const handleSignalType = e => {
    let {value = ""} = e.target || {}
    if(value == 2){
        setSignalModalData(prevState=>({
            ...prevState,
            disabledType : false,
            signalType : value
        }))   
        setType("bar")
    }
    else if(value == 3){
        setSignalModalData(prevState=>({
            ...prevState,
            disabledType : false,
            signalType : value
        }))   
        setType("obar")
    }
    else{
        setSignalModalData(prevState=>({
            ...prevState,
            disabledType : true,
            signalType : value
        }))  
        setType("line")
    }
}

const dstOffset = (date = new Date()) => {
    const january = new Date(date.getFullYear(), 11, 20).getTimezoneOffset();
    const july = new Date(date.getFullYear(), 6, 20).getTimezoneOffset();
    // console.log("Jan Time" , january);
    // console.log("July Time" , july);
    let max = Math.max(january, july);
    let min = Math.min(january, july);
    return Math.abs(min - max);
  }

const handleLine = (e) => {
    let {value = ""} = e.target || {}

    if(value == 1){
        setSignalModalData(prevState=>({
            ...prevState,
            signal : value
        })) 
        setSignalLinetype("solid")
    }else if (value == 2){
        setSignalModalData(prevState=>({
            ...prevState,
            signal : value
        }))
        setSignalLinetype("dot")
    }else if(value == 3){
        setSignalModalData(prevState=>({
            ...prevState,
            signal : value
        }))
        setSignalLinetype("dashdot")
    }
}
 

const hideThreshold = event => {
    let {value = "" } = event.target || {}
    setShowThresholdLine(value)        
 
}

const handleClick = event => {
    
    // console.log("clicl",event)
    setReportComment(null);
    // setCurrentPoint(event)
    setCommentModal(true);
    setCurrentPoint(event.points[0])
    // // console.log("clicked", event.points)
}

const addComment = () => {
    
    let _tempAnnotation = 
        {
            xref: 'x',
            yref: 'y',
            x: currentPoint.x ,
            y: currentPoint.y,  
            textangle: 270,
            text: reportComment,
            font: {
                color: '#ffffff'
              },
            showarrow: true,
            bgcolor: "#FF0000",
            arrowcolor: "#FF0000", 
            arrowhead: 10,
            ax: 30, 
            ay: 0,
            captureevents: true

        };
        

   let _oldAnnotation = textAnnotations ; 
   _oldAnnotation.push(_tempAnnotation) ; 
   setTextAnnotations(_oldAnnotation) ; 
   setCommentModal(false)
   setComment(_oldAnnotation)

}

const handleAnnotationClick = (e) => {
    // console.log(e)
    setCurrentAnnotation(e);
    setUpdateCommentModal(true)
    setReportComment(e.annotation.text)

}



const updateComment = () => {
    let _oldAnnotation = textAnnotations ; 

    _oldAnnotation.splice(currentAnnotation.index, 1); // 2nd parameter means remove one item only
    setTextAnnotations(_oldAnnotation) ; 
    setUpdateCommentModal(false)


    let _tempAnnotation = 
        {
            xref: 'x',
            yref: 'y',
            x: new Date(currentAnnotation.annotation.x) ,
            y: currentAnnotation.annotation.y,  
            textangle: 270,
            text: reportComment,
            font: {
                color: '#ffffff'
              },
            showarrow: true,
            bgcolor: "#FF0000",
            arrowcolor: "#FF0000", 
            arrowhead: 10,
            ax: 30, 
            ay: 0,
            captureevents: true

        };
        
 
   _oldAnnotation.push(_tempAnnotation)  ; 
   // console.log("new" , _oldAnnotation) ;
   setTextAnnotations(_oldAnnotation) ; 
   setComment(_oldAnnotation)
 

}

const handleThresholdValue = (e) => {
    
    setYAxis2([e.target.value])
    setThresholdvalue(e.target.value)
}

const deleteComment = () => {

   let _oldAnnotation = textAnnotations ; 

   _oldAnnotation.splice(currentAnnotation.index, 1); // 2nd parameter means remove one item only
 
   setComment(_oldAnnotation)
   setTextAnnotations(_oldAnnotation) ; 
   setUpdateCommentModal(false)

}

const handletTline = (e) => {
    setThresholdtLine(e.target.value)
}

const handleKeypress = (e) => {
    // console.log("Relayouting",e)
}
    return (
        <div >
                                <ReactTooltip />
        
           
            {   
                xAxis.length > 0 && yAxis.length > 0 &&
             <> 
                
                <div     style={{ width:  "100%" , maxWidth:"100%", height:  (props.row == '1/2' ? (eval(props.row) * 70 + "vh") : (eval(props.row) * 66 + "vh") )  } }>
                  <ul className="top-filter-left">
                        <li>
                            <div className='colorsqr' style={{backgroundColor: color}}></div>
                        </li>
                        <li>
                        <span dangerouslySetInnerHTML={{__html : (props && signalName[props.signal] ? modal.units != "" ? signalName[props.signal]+"<span style='font-size:10px'> ("+modal.units+")</span>" : signalName[props.signal] : null )}} ></span>
                        
                        {
                            group &&
                           
                          <span data-tip="Client name" dangerouslySetInnerHTML={{__html : props && "- " + (clientSerial ? clientSerial : props.profile['name'] ) }} ></span>
                         


                        }
                        </li>
                  </ul>
                <ul className="top-filter" data-html2canvas-ignore="true">
                    <li data-tip="Graph Settings"><a  onClick={toggleGraphModal}><i class="fa fa-line-chart" aria-hidden="true"></i></a></li>
                    <li data-tip="Signal Settings"><a   onClick={toggleSignalModal}><i class="fa fa-signal" aria-hidden="true"></i></a></li>
                    <li data-tip="Threshold Settings"><a   onClick={toggletrehSoldModal}><i class="fa fa-area-chart" aria-hidden="true"></i></a></li>
                 <li data-tip="Zoom in"><a onClick={zoomIn}><i class="fa fa-search-plus"></i></a></li>
                    <li data-tip="Zoom out"><a onClick={zoomOut}><i class="fa fa-search-minus"></i></a></li>
                    <li data-tip="Move Backward"><a onClick={moveBackward}><i class="fa fa-arrow-left"></i></a></li>

                    <li data-tip="Move Forward"><a onClick={moveForward}><i class="fa fa-arrow-right"></i></a></li>
                    {
                        play ? 
                    <li data-tip="Pause"><a onClick={handlePause}><i class="fa fa-pause"></i></a></li>
                    :
                        <li data-tip="Play"><a onClick={handlePlay}><i class="fa fa-play"></i></a></li>                     
                    }
                    <li data-tip="Toggle Selection Mode"  className={(dragMode == 'zoom' ? "highlighted" : "" )}  ><a onClick={handleSelection}><i class="fa fa-arrows-h"></i></a></li>
                    <li data-tip="Reset Graph"><a onClick={reset}><i class="fa fa-undo"></i></a></li>
                    {
                         props.signal != "pco2wave"  && props.signal != "pco2b2b"  && props.signal != "capin" && props.signal != "b2b2hr" && props.signal != "b2brsa" &&
                         <li data-tip="Toggle Table"><a  onClick={toogleTableView }><i class="fa fa-table" aria-hidden="true"></i></a></li>

                    }
                   {/*   <li><a  onClick={toggleannotationtModal}><i class="fa fa-comment"></i></a></li> */}
                </ul>
{/* 
                <ul className="right-filter">
                    <li><a onClick={zoomIn}><i class="fa fa-search-plus"></i></a></li>
                    <li><a onClick={zoomOut}><i class="fa fa-search-minus"></i></a></li>
                    <li><a onClick={moveForward}><i class="fa fa-arrow-right"></i></a></li>
                    <li><a onClick={moveBackward}><i class="fa fa-arrow-left"></i></a></li>
                    <li><a onClick={handlePlay}><i class="fa fa-play"></i></a></li>
                    <li><a onClick={handlePause}><i class="fa fa-pause"></i></a></li>
                    <li><a onClick={reset}><i class="fa fa-undo"></i></a></li>
                    <li><a  onClick={toggleTableModal}><i class="fa fa-thermometer-full" aria-hidden="true"></i></a></li>
                    <li><a  onClick={toggleannotationtModal}><i class="fa fa-comment"></i></a></li>
                </ul> */}

                {/* unit modal */}
               {/* {// console.log(xAxisMin)} */}




                <Plot className="plot-charts"
                onClick={handleClick}
                onRelayout={handleRelayout}
                
                //  onRedraw={handleKeypress}
                onClickAnnotation={handleAnnotationClick}
                //  onUpdate={handleRelayout}
                //  onKeyDown={() => handleKeypress}
                onInitialized={handleInitial}
                    data={[
                        {  
                            x: xAxis,
                            y: yAxis,
                            text: textTooltip,
                       
                            marker: { 
                            color:  type == "obar" ?  color.hex ? color.hex+"43" : color+"43" : color ,
                            line: {
                                color: color,
                                dash: signalLinetype,
                                width: value
                            },
                        },
                        line: {
                            color: color,
                            dash: signalLinetype,
                            width: value
                        },
                            textposition: "none",
                            type:  type == "obar" ? "bar" : type,
                            
                            hovertemplate: '<b>'+ ((  props.signal != "pco2wave"  && props.signal != "pco2b2b"  && props.signal != "capin" && props.signal != "b2b2hr" && props.signal != "b2brsa") ?  signalModalData.stat.toUpperCase() : 'Raw Data' ) +'</b><br><i>Y</i>: %{y:.2f}' +
                            '<br><b>X</b>: %{x}<br>' +
                            '<extra></extra>',
                        },
                        {  
                            x: xAxis,
                            y: yAxis2,
                            mode:  'lines',
                            marker: { color:  thresholdtcolor },
                            textposition: "none",
                            type:  'lines',
                            line: {
                                dash: thresholdtLine,
                                width: thresholdthick
                            } ,
                            hoverinfo: "skip",
                            showlegend: false,
                            visible: showThresholdLine

                           
                        },
                    ]}
                    layout={{
                        revision : 0,
                        yaxis: {rangemode: 'tozero'},
                        xaxis: {rangemode: 'tozero'},
                        hovermode: true,
                        images: images,
                        dragmode: dragMode, 
                        showlegend: false,
                        shapes: modal.annotation === 1 ? taskMarkers : [],
                        xaxis :{
                            type: "date",
                            tickformat: "%H:%M:%S",
                            ticktext: ["-", "tick", "tick", "-"],
                            range: [
                                xAxisMin,
                                xAxisMax  ,
                            ],
                            ticks: "outside",
                            tickcolor: "#000",
                            zeroline: false, 
                            showgrid: modal.showGrid,

                            // visible : false
                        },
                        yaxis : {
                            range: (modal.units === "mmHg" || modal.units === "") ? [yAxisMin, yAxisMax] : [yAxisMin,(yAxisMax+yAxisMax*0.13)],
                            fixedrange: true,
                            showgrid: modal.showGrid,
                            side : modal.position == "1" ? "left" : "right"
                        },
                        bargap: 0,
                        
                        annotations: modal.annotation === 1 ? textAnnotations : [],
                // autosize: true,
                        margin: {
                            l: 30,
                            r: 30,
                            b: 20,
                            t: 0,
                            pad: 0
                        },
                        padding: {
                            top: 0
                        },
                        autosize: true
                    }}
                    config={{
			        	displayModeBar: false,  
                        scrollZoom: true,
                        autosize: true,
                         
                        doubleClick:false,
                        transition: {
                            duration: 50,
                            easing: 'cubic-in-out'
                          },
                    }}

                />
                {/* {xAxis[0]} */}

          

                 <Modal isOpen={tableModal} toggle={toggleTableModal} className="modal-box-wrp" centered={true}>
                    <ModalHeader toggle={toggleTableModal}><span className="ml-1 roititle modal-head">Change Y-Scale Unit for <span dangerouslySetInnerHTML={{__html : props && signalName[props.signal]}} ></span></span></ModalHeader>
                    <ModalBody>
                        <ul className="range-list">
                            <li>
                                <div className="range-content-wrp">
                                    <div className="range-c-child1">
                                        <p>Y-axis unit:</p>
                                    </div>
                                    <div className="range-c-child2">
                                        <p><input type="radio" name="unit" defaultChecked={unit == 0 ? true : false} value={0} ref={unit} onChange={handleUnitChange}  /><label for="yes">mmHg</label> <input type="radio" className="mrl-input" defaultChecked={unit.current == 1 ? true : false} value={1} onChange={handleUnitChange}  ref={unit}  name="unit"   /><label for="no">kPa</label> <input type="radio" className="mrl-input" name="unit" value={2} onChange={handleUnitChange}  ref={unit}  defaultChecked={unit.current == 2 ? true : false}  /><label for="no">Percentage</label></p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </ModalBody>

                </Modal>                 

                {/* unit modal */}

                {/* annotations modal */}

                <Modal isOpen={annotationtModal} toggle={toggleannotationtModal} className="modal-box-wrp" centered={true}>
                    <ModalHeader toggle={toggleannotationtModal}><span className="ml-1 roititle modal-head">Configure Annotations Visibility for <span dangerouslySetInnerHTML={{__html : props && signalName[props.signal]}} ></span></span></ModalHeader>
                    <ModalBody>
                        <ul className="range-list">
                            <li>
                                <div className="range-content-wrp">
                                    <div className="range-c-child1">
                                        <p>Show Live Annotations:</p>
                                    </div>
                                    <div className="range-c-child2 range-c-child2s">
                                        <p><input type="radio" id="yes" name="selector" /><label for="yes">Yes</label> <input type="radio" className="mrl-input" id="no" name="selector" /><label for="no">No</label></p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="range-content-wrp">
                                    <div className="range-c-child1">
                                        <p>Show Report Annotations:</p>
                                    </div>
                                    <div className="range-c-child2 range-c-child2s">
                                        <p><input type="radio" id="yes" name="selector" /><label for="yes">Yes</label> <input type="radio" className="mrl-input" id="no" name="selector" /><label for="no">No</label></p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </ModalBody>

                </Modal>

                {/* annotations modal */}

                {/* trehsold modal */}
                <Draggable handle=".handle">
                    
                <Modal isOpen={trehSoldModal}  toggle={toggletrehSoldModal} className="modal-box-wrp" centered={true}>
                    
                    <ModalHeader  className='handle' toggle={toggletrehSoldModal}><span className="ml-1 roititle modal-head">Threhsold Settings(<span dangerouslySetInnerHTML={{__html : props && signalName[props.signal]}} ></span>)</span></ModalHeader>
                    <ModalBody>
                        <ul className="range-list">
                        <li>
                            <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Show Threshold Line</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                    <Radio.Group onChange={hideThreshold} value={showThresholdLine} >
                                                <Radio value={true} style={{marginRight : "20px"}} > Yes </Radio>
                                                <Radio value={false} style={{marginRight : "20px"}} > No </Radio>                                              
                                            </Radio.Group>
 
                                        </Col>
                                </Row>
                            </li>
                            {/* {
                                showThresholdLine &&
                                <> */}
                            <li>
                            <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Value</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                      
                                    <RangeSlider
                                            min={yAxisMin}
                                            max={yAxisMax}
                                            value={thresholdvalue}
                                            onChange={(e) => setThresholdvalue(e.target.value)}
                                            tooltip={null}
                                          
                                             

                                        />
                                
                                 
                                        </Col>
                                </Row>
                            </li>
                            <li>
                                <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Line Width</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                    
                                        <RangeSlider
                                            min={1}
                                            max={10}
                                            value={thresholdthick}
                                            tooltip={null}
                                            onChange={(e) => setThresholdthick(e.target.value)}
                                        />
                                
                                    </Col>
                                </Row>
                            </li>
                            <li>
                                <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Line Type</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                  
                                            <Radio.Group
                                                onChange={handletTline}
                                                value={thresholdtLine}
                                                
                                            >
                                            <Radio value={"solid"} style={{marginRight : "20px"}} > Solid </Radio>
                                                <Radio value={"dot"} style={{marginRight : "20px"}} > Dotted </Radio>
                                                <Radio value={"dashdot"} > Dashed </Radio>
                                            </Radio.Group>
                                         
                                    </Col>
                                </Row>
                            </li>
                                   
                            <li>
                            <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Color</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                      
                                    <div  >
                                      
                                        <InputColor
                                            initialValue={(thresholdtcolor.hex ? thresholdtcolor.hex : otherConfig.tcolor)}
                                            onChange={setThresholdtcolor}
                                            placement="right"
                                            style={{width: "100%"}}
                                        />
                                        </div>
                                     
                                     </Col>
                                </Row>
                            </li>
                            {/* </>

                            } */}

                        </ul>
                    </ModalBody>

                </Modal>
                </Draggable>

                {/* trehsold modal */}

                {/* signal modal */}
                <Draggable handle=".handle">

                <Modal isOpen={signalModal} toggle={toggleSignalModal} className="modal-box-wrp" centered={true}>
                    <ModalHeader className='handle'  toggle={toggleSignalModal}><span className="ml-1 roititle modal-head">Signal Setting (<span dangerouslySetInnerHTML={{__html : props && signalName[props.signal]}} ></span>)</span></ModalHeader>
                    <ModalBody>
                        <ul className="range-list">
                            <li>
                            <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Name</span>
                                        </Col>
                                    <Col lg={7} xl={7}>
                                        <div className="raw-pcos"><p dangerouslySetInnerHTML={{__html : props && signalName[props.signal]}}></p></div>
                                        </Col>
                                </Row>
                            </li>

                            {/* <li>
                                <div className="range-content-wrp">
                                    <div className="range-c-child1">
                                        <p>Hide Signal</p>
                                    </div>
                                    <div className="range-c-child2">
                                        <p><input type="radio" id="yes" name="selector" /><label for="yes">Yes</label> <input type="radio" className="mrl-input" id="no" name="selector" /><label for="no">No</label></p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="range-content-wrp">
                                    <div className="range-c-child1">
                                        <p>Show Peak Marker</p>
                                    </div>
                                    <div className="range-c-child2">
                                        <p><input type="radio" id="yes" name="selector" /><label for="yes">Yes</label> <input type="radio" className="mrl-input" id="no" name="selector" /><label for="no">No</label></p>
                                    </div>
                                </div>
                            </li> */}
                          {
                     props.signal != "pco2wave"  && props.signal != "pco2b2b"  && props.signal != "capin" && props.signal != "b2b2hr" && props.signal != "b2brsa"  &&       
                     <>                  
                     <li>
                     <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Data Point Size</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                         <select 
                                            style={{width:"100%"}}
                                      
                                            onChange={(e)=>{
                                     
                                                let {value=""}=e.target||{}
                                                     
                                                     setAverage(value);
                                                     let _data =   calculate_history_sample([xAxis,yAxis],value)
                                                     
                                                     setXaxis(_data[0]);
                                                     setYaxis(_data[1]);

                                             }}
                                             value={average}

                                        >
                                            <option value="30">30 Seconds</option>
                                            <option value="60">60 Seconds</option>
                                            <option value="90">90 Seconds</option>
                                            <option value="120">120 Seconds</option>
                                           
                                            {/* <option value="0">Custom</option> */}
                                        </select>
                                          </Col>
                                </Row>
                                       </li>   
                             <li>
                                <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Signal Data</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                        
                                            <Radio.Group
                                                onChange={handleSignalStat}
                                                value={signalModalData.stat}
                                            >
                                                <Radio value={"mean"}> Mean</Radio>
                                                <Radio  style={{marginLeft : "20px"}} value={"median"}> Median</Radio>
                                                {/* <Radio style={{marginLeft : "20px"}} value={"sd"}> SD</Radio> */}
                                            </Radio.Group>
                                      
                                    </Col>
                                </Row>
                            </li>
                            </>
}
                            <li>
                                <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Signal Type</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                        
                                            <Radio.Group
                                                onChange={handleSignalType}
                                                value={signalModalData.signalType}
                                            >
                                                <Radio value={1}> Line</Radio>
                                                <Radio style={{marginLeft : "20px"}} value={2}> Bar</Radio>
                                                <Radio style={{marginLeft : "20px"}} value={3}> Outline Bar</Radio>
                                            </Radio.Group>
                                      
                                    </Col>
                                </Row>
                            </li>
                            {signalModalData.disabledType && <li>
                                <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Signal Line Type</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                  
                                            <Radio.Group
                                                onChange={handleLine}
                                                value={signalModalData.signal}
                                            >
                                                <Radio value={1} style={{marginRight : "20px"}} > Solid </Radio>
                                                <Radio value={2} style={{marginRight : "20px"}} > Dotted </Radio>
                                                <Radio value={3} > Dashed </Radio>
                                            </Radio.Group>
                                         
                                    </Col>
                                </Row>
                            </li>}
                           <li>
                                <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Line Width</span>
                                        </Col>
                                    <Col lg={7} xl={7}>
                                        <RangeSlider
                                            min={1}
                                            max={10}
                                            value={value}
                                            onChange={changeEvent => setValue(changeEvent.target.value)}
                                        />
                                   </Col>
                                </Row>
                            </li> 
                            {/* {signalModalData.disabledType && <li>
                                <div className="range-content-wrp">
                                    <div className="range-c-child1">
                                        <p>Sample Point Size</p>
                                    </div>
                                    <div className="range-c-child2">
                                        <RangeSlider
                                            value={point}
                                            onChange={changeEvent => setPoint(changeEvent.target.value)}
                                        />
                                    </div>
                                </div>
                            </li>}    */}
                            <li>
                            <Row justify="space-between" style={{height: rowHeight}}>
                                    <Col lg={5} xl={5}>
                                        <span>Color</span>
                                        </Col>
                                    <Col lg={7} xl={7}>
                                        <div  >
                                        <InputColor
                                            initialValue={(color.hex ? color.hex : props.color)}
                                            onChange={setColor}
                                            placement="right"
                                            style={{width: "100%"}}
                                        />
                                        </div>
                                         
                                        </Col>
                                </Row>
                            </li>
                        </ul>
                    </ModalBody>

                </Modal>
                </Draggable>


                {/* signal modal */}

                {/* graph modal */}
                <Draggable handle=".handle">

                <Modal isOpen={graphModal} toggle={toggleGraphModal} className="modal-box-wrp" centered={true}>
                    <ModalHeader className='handle'  toggle={toggleGraphModal}><span className="ml-1 modal-head roititle">Graph Setting (<span dangerouslySetInnerHTML={{__html : props && signalName[props.signal]}} ></span>)</span></ModalHeader>
                    <ModalBody>
                        <ul className="range-list">
                            <li>
                            <Row justify="space-between">
                                    <Col lg={5} xl={5}>
                                        <span>X -axis Range</span>
                                        </Col>
                                    <Col lg={7} xl={7}>
                                        <select 
                                            style={{width:"100%"}}
                                      
                                            onChange={(e)=>{
                                                xAxisRange(e)
                                                let {value=""}=e.target||{}
                                                     setModal(prevState =>({
                                                       ...prevState,
                                                         range:value 
                                                     }))
                                                     setXRange(value)
     
                                             }}
                                             value={xrange}

                                        >
                                            <option value="0">Full Length</option>
                                            <option value="1">1 Minute</option>
                                            <option value="2">2 Minutes</option>
                                            <option value="5">5 Minutes</option>
                                            <option value="10">10 Minutes</option>
                                            <option value="15">15 Minutes</option>
                                            <option value="20">20 Minutes</option>
                                            <option value="30">30 Minutes</option>
                                            <option value="60">60 Minutes</option>
                                            <option value="">Custom</option>
                                        </select>
                                       
                                    </Col>
                                    </Row>
                            </li>
                            {
                            unitArray[props.signal].length > 0 &&
                            <li>
                            <Row justify="space-between">
                                    <Col lg={5} xl={5}>
                                        <span>Units</span>
                                        </Col>
                                    <Col lg={7} xl={7}>
                                        <select
                                        style={{width:"100%"}}
                                        onChange={handleUnitChange}
                                        value={modal.units}
                                        >
                                            {
                                                unitArray[props.signal].map((v,i) => {
                                                    return (
                                                        <option value={v}>{v}</option>

                                                        )
                                                })
                                              
                                            }
                                           
                                        </select>
                                       
                                        </Col>
                                    </Row>
                            </li>
}
                            <li>
                                <Row justify="space-between">
                                    <Col lg={5} xl={5}>
                                        <span>Show Annotations</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                        
                                            <Radio.Group
                                                onChange={handleAnnotations}
                                                value={modal.annotation}
                                            >
                                                <Radio value={1}> Yes</Radio>
                                                <Radio style={{marginLeft : "20px"}} value={2}> No</Radio>
                                            </Radio.Group>
                                        
                                    </Col>
                                </Row>
                            </li> 
                            <li>
                                 <Row justify="space-between">
                                    <Col lg={5} xl={5}>
                                        <span>Show Grid Line</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                         
                                            <Radio.Group 
                                                onChange={handleGridLine}
                                                value={modal.grid}
                                            >
                                                <Radio value={1}> Yes</Radio>
                                                <Radio style={{marginLeft : "20px"}} value={2}> No</Radio>
                                            </Radio.Group>
                                        
                                    </Col>
                                </Row>
                            </li>
                            <li>
                                <Row justify="space-between">
                                    <Col lg={5} xl={5}>
                                        <span>Invert Y-Axis</span>
                                    </Col> 
                                    <Col lg={7} xl={7}>
                                        
                                            <Radio.Group
                                                onChange={handleInvert}
                                                value={modal.invert}
                    
                                            >
                                                <Radio value={1}> Yes</Radio>
                                                <Radio style={{marginLeft : "20px"}} value={2}> No</Radio>
                                            </Radio.Group>
                                       
                                    </Col>
                                </Row>
                            </li>
                            <li>
                            <Row justify="space-between">
                                    <Col lg={5} xl={5}>
                                        <span>Min/Max Y-Axis</span>
                                        </Col> 
                                    <Col lg={7} xl={7}>
                                        <div className="wrp-axis">
                                            <div className='min-axis'>
                                                <input placeholder='0' value={yAxisMin} onChange={(e) => {
                                                    let {value = ""} = e.target
                                                    setYaxisMin(value)
                                                }}/>
                                                <span>Min</span>
                                            </div>
                                            <div className='max-axis'>
                                                <input placeholder='0' value={yAxisMax} onChange={(e) => {
                                                    let {value = ""} = e.target
                                                    setYaxisMax(parseFloat(value))
                                                }}/>
                                                <span>Max</span>
                                            </div>
                                        </div>
                                        </Col>
                                </Row>
                            </li>
                            <li>
                                <Row justify="space-between">
                                    <Col lg={5} xl={5}>
                                        <span>Y-Axis Position</span>
                                    </Col>
                                    <Col lg={7} xl={7}>
                                      
                                            <Radio.Group
                                                onChange={handleYaxisPosition}
                                                value={modal.position}
                                            >
                                                <Radio value={1}> Left</Radio>
                                                <Radio style={{marginLeft : "20px"}} value={2}> Right</Radio>
                                            </Radio.Group>
                                      
                                    </Col>
                                </Row>
                            </li>
                        </ul>
                    </ModalBody>
                </Modal> 
                </Draggable>

                {/* comment modal start */}         
                <Draggable handle=".handle">
                <Modal className='handle'  isOpen={commentModal} toggle={toggleCommentModal} className="modal-box-wrp" centered={true}>
                <ModalHeader toggle={toggleCommentModal}><span className="ml-1 roititle modal-head">Add Comment</span></ModalHeader>
                        <ModalBody>
                           <textarea rows="8" style={{width: "100%"}} value={reportComment} onChange={(e) => setReportComment(e.target.value) } ></textarea>
                           
                        <div className='d-flex justify-content-around mt-3'>
                            <button className='lightbtn w-100'  onClick={toggleCommentModal} >Cancel</button>
                            <button className='darktbtn w-100 ml-1'  onClick={addComment} >Add Comment</button>
                        </div>
                        </ModalBody>
                            
                    </Modal>
                </Draggable>

                {/* comment modal end*/}                              


                      {/* update comment modal start */}      
                <Draggable handle=".handle">

                      <Modal isOpen={updateCommentModal} toggle={toggleUpdateCommentModal} className="modal-box-wrp" centered={true}>
                <ModalHeader className='handle'  toggle={toggleUpdateCommentModal}><span className="ml-1 roititle modal-head">Update Comment</span></ModalHeader>
                        <ModalBody>
                           <textarea rows="8" style={{width: "100%"}} value={reportComment} onChange={(e) => setReportComment(e.target.value) } ></textarea>
                           
                        <div className='d-flex justify-content-around mt-3'>
                            <button className='lightbtn w-100'  onClick={deleteComment} >Delete Comment</button>
                            <button className='darktbtn w-100 ml-1'  onClick={updateComment} >Update Comment</button>
                        </div>
                        </ModalBody>
                            
                    </Modal>
                </Draggable>

                {/* update comment modal end*/}                              


                {/* <Modal>
                    
                </Modal> */}

                </div>
                {
                  (  props.signal != "pco2wave"  && props.signal != "pco2b2b"  && props.signal != "capin" && props.signal != "b2b2hr" && props.signal != "b2brsa") && ( showSignalStat || tableView)  ?
                          <table className='table table-resposnive table-hover statTable mt-5' style={{display: (showSignalStat || tableView)  ? "" : "none" }} >
                                        <thead className='thead-dark'>
                                            <tr>
                                                <th>X</th>
                                                <th>Mean {modal.units == "" ? "" : "("+modal.units+")"}</th>
                                                <th>Median {modal.units == "" ? "" : "("+modal.units+")"}</th>
                                                <th>SD {modal.units == "" ? "" : "("+modal.units+")"}</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                
                
                                            {
                                                 statistics.length > 0 && statistics.map((v,i) => {
                                                    return (
                                                        <tr>
                                                        <td>{v.x}</td>
                                                        <td>{v.mean}</td>
                                                        <td>{v.median}</td>
                                                        <td>{v.sd}</td>            
                                                        </tr>
                            
                                                    )
                
                                                })
                                            }
                                        </tbody>
                
                                    </table>
                                    :null
                }
                </>
            }
            {
                (xAxis.length == 0 || yAxis.length == 0) &&

                <div className="wrp-chart-loader">
                    <div class="loading">
                        <div class="loading-1"></div>
                        <div class="loading-2"></div>
                        <div class="loading-3"></div>
                        <div class="loading-4"></div>
                    </div>
                </div>
            }
                                    </div>

    )
}

export default Chart;