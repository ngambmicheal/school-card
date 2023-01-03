import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
const en = require('../public/locales/en/translation.json')
const fr = require('../public/locales/fr/translation.json')

i18n
.use(initReactI18next) // passes i18n down to react-i18next
.init({
    resources:{
        en, 
        fr
    },
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
});