
import ExamInterface from "../../models/exam";
import ExamResultInterface from "../../models/examResult";
import TermInterface from "../../models/terms";
import { bgEn } from "../jsx/enBg";
import {thBG } from "../jsx/other";
import { base64_encode } from "../jsx/resultsActions";
import { getTotalExam } from "../jsx/resultsDynamicActions";
import { getTotal } from "../jsx/resultsUiStats";


export default function AttestationMaternelleFr(result:ExamResultInterface, term:ExamInterface ) {
 

    return (
        <div style={{  
            backgroundImage: "url(" + thBG + ")",
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
            {/* <div className="fran">
                <h2 style={{
                        lineHeight:'50px',
                        fontWeight: 'normal'
                    }}>Je soussignée Mme, <span style={{ fontWeight: 'bolder', fontSize: '40px', color: '#000065', fontFamily: 'Bradley Hand ITC', marginLeft: '30px'}}>DASSI Armande</span></h2>
                <h2 style={{
                        lineHeight:'50px',
                        fontWeight: 'normal'
                    }}>
                    Directrice du Groupe Scolaire Bilingue Privé Laïc La SEMENCE atteste que l'eleve <br />
                    <div style={{ fontWeight: 'bolder', fontSize: '60px', color: '#000065', fontFamily: 'Bradley Hand ITC', textAlign: 'center'}}>{result.student.name}</div>
                    a suivi avec succes le Cycle Maternel et est promu(e) en ce jour au Cycle Primaire.
                </h2>
            </div> */}
            <div className="anglais">
                <h2 style={{
                        fontWeight: 'normal'
                    }}>I the undersigned Madam, <span style={{ fontWeight: 'bolder', fontSize: '40px', color: '#000065', fontFamily: 'Bradley Hand ITC', marginLeft: '30px'}}>DASSI Armande</span></h2>
                    <h2 style={{
                        fontWeight: 'normal',
                        lineHeight: '40px'
                    }}>
                     Headmistress of Groupe Scolaire Bilingue Privé Laïc La SEMENCE, certifies that the child
                    <div style={{ fontWeight: 'bolder', marginLeft: '30px', fontSize: '60px', color: '#000065', fontFamily: 'Bradley Hand ITC', textAlign: 'center'}}>{result.student.name}</div>
                    has successfully completed Nursery Course and is promoted to the Primary Cycle.
                </h2>
            </div>
          </div>
        </div>
    )
}