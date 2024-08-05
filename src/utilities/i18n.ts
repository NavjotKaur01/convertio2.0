import i18n from "i18next";
// import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
// import { reactI18nextModule } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    debug: true,
    lng: "en",
    ns: ["imageConverter", "navigation", "faq", "home"],
    fallbackLng: "en",
    returnObjects: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
