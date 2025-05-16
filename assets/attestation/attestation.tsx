
import ExamInterface from "../../models/exam";
import ExamResultInterface from "../../models/examResult";
import StudentInterface from "../../models/student";
import ClasseInterface  from '../../models/classe';
import { schoolLogo } from "../jsx/semence-util";
import SchoolInterface from "../../models/school";


export default function AttestationOnly(student:StudentInterface, classe: ClasseInterface)  {

    const classeSection  = classe.section?.report_type; 
    const {logo, lang, nextLeveL} = getLogo(classeSection!, classe.school!);
    // const fontSize = classe?.school?.attestation_font_size ?? `35px`;
    // const fontSizeName = classe?.school?.attestation_font_size_name?? `40px`;

 
    return (
        <div style={{  
            backgroundImage: "url('data:image/png;base64," + logo + "')",
           // backgroundImage: "url("+ bgEn + ")",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minHeight:'100%',
            position:'relative'
          }}>

          <div  style={{
                    position: 'absolute', 
                    top: '45%',
                    left: '1%',
                    paddingLeft:'10%',
                    paddingRight:'10%',
                    textAlign:'left',
                    lineHeight:'20px',
                    fontSize: '22px',
                    fontWeight: 'normal',
                    display: 'flex',
                    justifyContent: 'center'
                }}
                >
            {lang === 'en' ?
                <div className="anglais">
                    <h2 style={{
                            fontWeight: 'normal'
                        }}>I the undersigned Madam, <span style={{ fontWeight: 'bolder', fontSize: '40px', color: '#000065', fontFamily: 'Bradley Hand ITC', marginLeft: '30px'}}>DASSI Armande</span></h2>
                        <h2 style={{
                            fontWeight: 'normal',
                            lineHeight: '40px'
                        }}>
                        Headmistress of Groupe Scolaire Bilingue Privé Laïc La SEMENCE, certifies that the child
                        <div style={{ fontWeight: 'bolder', marginLeft: '30px', fontSize: '60px', color: '#000065', fontFamily: 'Bradley Hand ITC', textAlign: 'center'}}>{student.name}</div>
                        has successfully completed Nursery Course and is promoted to the {nextLeveL}.
                    </h2>
                </div>
                :
              <div className="fran">
                <h2 style={{
                        lineHeight:'50px',
                        fontWeight: 'normal'
                    }}>Je soussignée Mme, <span style={{ fontWeight: 'bolder', fontSize: '40px', color: '#000065', fontFamily: 'Bradley Hand ITC', marginLeft: '30px'}}>DASSI Armande</span></h2>
                <h2 style={{
                        lineHeight:'50px',
                        fontWeight: 'normal'
                    }}>
                    Directrice du Groupe Scolaire Bilingue Privé Laïc La SEMENCE atteste que l'eleve <br />
                    <div style={{ fontWeight: 'bolder', fontSize: '60px', color: '#000065', fontFamily: 'Bradley Hand ITC', textAlign: 'center'}}>{student.name}</div>
                    a suivi avec succes le Cycle Maternel et est promu(e) en ce jour au {nextLeveL}.
                </h2>
            </div> 
            }
          </div>
        </div>
    )
}

const getLogo = (reportType:string, school: SchoolInterface): {logo:string, lang: 'fr' | 'en', nextLeveL:string} => { 
    switch (reportType) {
        case 'Nursery':
            return {logo: schoolLogo(school, 'attestation_nursery'), lang: 'en', nextLeveL: 'Primary Cycle'};
        case 'Maternelle':
            return  {logo:schoolLogo(school, 'attestation_mat'), lang: 'fr', nextLeveL: 'Cycle Primaire'};
        case 'Competence':
        case 'Special':
            return  {logo:schoolLogo(school, 'attestation_fr'), lang: 'fr', nextLeveL: 'Cycle Secondaire'};
        case 'Matiere':
            return  {logo:schoolLogo(school, 'attestation_en'), lang: 'en', nextLeveL: 'Secondary Cycle'};
        default:
            return {logo: schoolLogo(school, 'attestation_nursery'), lang: 'en', nextLeveL: 'Primary Cycle'};
    }
}