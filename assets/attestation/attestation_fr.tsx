
import ExamResultInterface from "../../models/examResult";
import TermInterface from "../../models/terms";
import { th_fr } from "../jsx/image";
import { base64_encode } from "../jsx/resultsActions";
import { getTotalExam } from "../jsx/resultsDynamicActions";
import { getTotal } from "../jsx/resultsUiStats";


export default function attestationFr(result:ExamResultInterface, term:TermInterface ) {

    const totalMarks = getTotal(result)
    const totalPoints = term.exams?.length ? getTotalExam(term.exams[0]) : 0;
    const average = ((totalMarks / totalPoints) * 20).toFixed(2) 

    const fontSize = term.class?.school?.attestation_font_size ?? `35px`;
    const fontSizeName =  term.class?.school?.attestation_font_size_name ?? `40px`;

    console.log({
        fontSize, 
        fontSizeName,
        term: term.class?.school
    })

    return (
        <div style={{  
            backgroundImage: "url('data:image/png;base64," + th_fr + "')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minHeight:'100%',
            position:'relative'
          }}>

          <div  style={{
                    position: 'absolute', 
                    top: '40%',
                    paddingLeft:'8%',
                    paddingRight:'10%',
                    transform: 'translate(-50%, -50%)',
                    // textAlign:'center',
                    lineHeight:'40px'
                }}
                >
            <h2 style={{fontSize}}>Je soussignée, Mme <b style={{color:'#020066', fontWeight: 'bolder', fontSize: fontSizeName}}>DASSI Armande</b></h2>
            <h2  style={{fontSize}}>
                Directrice du Groupe Scolaire Bilingue Privé Laïc La Semence atteste que :
            </h2>
            <h2  style={{fontSize, lineHeight:'45px'}}>L'élève <b style={{color:'#020066', fontWeight:900, fontSize: fontSizeName}}>{result.student.name}</b> de la classe <b style={{color:'#020066',fontWeight:900, fontSize: fontSizeName}}>{term.class?.name} </b> a mérité d'être inscrit au tableau d'honneur pour sa conduite et son travail pendant le <b style={{color:'#020066',fontWeight:900, fontSize: fontSizeName}}> {term.name} </b>   avec une moyenne de <b style={{color:'#020066',fontWeight:900, fontSize: fontSizeName}}> {average} / 20 </b> </h2>
          </div>
        </div>
    )
}