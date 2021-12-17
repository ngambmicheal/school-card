
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
                    top: '50%',
                    paddingLeft:'10%',
                    paddingRight:'10%',
                    transform: 'translate(-50%, -50%)',
                    textAlign:'center'
                }}
                >
            <h2>L'élève <b style={{color:'#020066', fontWeight:900}}>{result.student.name}</b> de la classe <b style={{color:'#020066',fontWeight:900}}>{term.class?.name} </b> a mérité d'être inscrit au tableau d'honneur pour sa conduite et son travail pendant le <b style={{color:'#020066',fontWeight:900}}> {term.name} </b>   avec une moyenne de <b style={{color:'#020066',fontWeight:900}}> {average} / 20 </b> </h2>
          </div>
        </div>
    )
}