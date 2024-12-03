
import ExamResultInterface from "../../models/examResult";
import TermInterface from "../../models/terms";
import { th_fr } from "../jsx/image";
import { base64_encode } from "../jsx/resultsActions";
import { getTotalExam } from "../jsx/resultsDynamicActions";
import { getTotal } from "../jsx/resultsUiStats";


export default function thFr(result:ExamResultInterface, term:TermInterface ) {

    const totalMarks = getTotal(result)
    const totalPoints = term.exams?.length ? getTotalExam(term.exams[0]) : 0;
    const average = ((totalMarks / totalPoints) * 20).toFixed(2) 

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
            <h2 style={{fontSize: '35px'}}>Je soussignée, Mme <b style={{color:'#020066', fontWeight: 'bolder', fontSize: '40px'}}>DASSI Armande</b></h2>
            <h2  style={{fontSize: '35px'}}>
                Directrice du Groupe Scolaire Bilingue Privé Laïc La Semence atteste que :
            </h2>
            <h2  style={{fontSize: '35px', lineHeight:'45px'}}>L'élève <b style={{color:'#020066', fontWeight:900, fontSize: '40px'}}>{result.student.name}</b> de la classe <b style={{color:'#020066',fontWeight:900, fontSize: '40px'}}>{term.class?.name} </b> a mérité d'être inscrit au tableau d'honneur pour sa conduite et son travail pendant le <b style={{color:'#020066',fontWeight:900, fontSize: '40px'}}> {term.name} </b>   avec une moyenne de <b style={{color:'#020066',fontWeight:900, fontSize: '40px'}}> {average} / 20 </b> </h2>
          </div>
        </div>
    )
}