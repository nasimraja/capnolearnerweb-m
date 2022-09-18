import React from 'react';
import Header from '../../component/Header';
import Sidebar from '../../component/Sidebar';

const Configure = () => {

        const ContentList = [
            {
                displayConetnt: "Raw PCO2, with PetCO2 & breaths/min histories"
            },
            {
                displayConetnt: "PetCO2 breath to breath, with PetCO2 & breaths/min histories"
            },
            {
                displayConetnt: "Capnia Index breath to breath, with PetCO2 & breaths/min histories"
            },
            {
                displayConetnt: "Breathing Mechanics: gasping, aborted breaths, breathholding, relative volume, & breaths/min histories"
            },
            {
                displayConetnt: "Breathing Chemistry: PetCO2 and Capnia Index histories"
            },
            {
                displayConetnt: "All Breathing signal histories (7)"
            },
            {
                displayConetnt: "Beat to beat heart rate & raw PCO2, with heart rate, RSA, & breath/min histories"
            }
            
        ]

    return(
        <div>
            <Header />
           <div className="wrp-dashbord">
             <div className="sidebar-section">
              <Sidebar />
             </div>
             <div className="right-section">
           
             <div className="create-section">
             <ul className="report-list">
                   
                   {
                       ContentList.map(function(L){
                           return(
                               <li>
                                   <div className="report-list-box">
                                       <div className="report-child1">
                                       <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option1" />
                                       </div>
                                       <div className="report-child2">
                                           <p>{L.displayConetnt}</p>
                                       </div>
                                   </div>
                               </li>
                           )
                       }

                       )
                   }

               </ul>
                      
            </div>
             </div>
         </div>
        </div>
    )
}

export default Configure;