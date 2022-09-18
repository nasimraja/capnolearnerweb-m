import React, { Component, useState, useEffect, useRef } from 'react';
import { Link, useParams, Router } from 'react-router-dom';


import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import tEn from '../component/language/en/EnglishLanguage.json';
import tFr from '../component/language/fr/FrenchLanguage.json'


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    
    resources: {
      en: {
        translation:tEn
      },
      fr: {
        translation:tFr
      }
    },
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

  

const Multilanguage = () => {

  const selectLanguage = localStorage.getItem('selectLanguage');
    const { t } = useTranslation();
    const language = useRef()
   

    const changeLang = () =>{
     
      localStorage.setItem('selectLanguage', language.current.value);
      localStorage.setItem('lang', i18n.changeLanguage);
        let _language = localStorage.getItem('selectLanguage');

        if (_language == 1) {
            i18n.changeLanguage('en')
        }
        if (_language == 2) {
            i18n.changeLanguage('fr')
        }
        
        
    }
    useEffect(() => {
     let currentlang = localStorage.getItem('lang');
     changeLang(currentlang);

  }, [])
    

    return(
        <div > 
            <div className="select-lang-box">
                <select onChange={changeLang} ref={language}>
                    <option selected={selectLanguage == 1? true : false} value="1">English</option>
                    <option selected={selectLanguage == 2? true : false} value="2">French</option>
                </select>
               {/* <div>
                   <button onClick={changeLang('en')}>English</button>
                   <button onClick={changeLang('fr')}>French</button>
               </div> */}
                
            </div>
 
        </div>
    );

}

export default Multilanguage;