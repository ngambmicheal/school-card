
import ExamResultInterface from "../../models/examResult";
import TermInterface from "../../models/terms";
import { th_en, th_fr } from "../jsx/image";
import { base64_encode } from "../jsx/resultsActions";
import { getTotalExam } from "../jsx/resultsDynamicActions";
import { getTotal } from "../jsx/resultsUiStats";


export default function thEn(result:ExamResultInterface, term:TermInterface ) {

    const totalMarks = getTotal(result)
    const totalPoints = term.exams?.length ? getTotalExam(term.exams[0]) : 0;
    const average = ((totalMarks / totalPoints) * 20).toFixed(2) 

    return (
        <div style={{  
            backgroundImage: "url('data:image/png;base64," + th_en + "')",
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
            <h2> The pupil<b style={{color:'#020066', fontWeight:900}}>{result.student.name}</b> of the class <b style={{color:'#020066',fontWeight:900}}>{term.class?.name} </b>  deserved to be inscribed on the honor roll for his conduct and work during the  <b style={{color:'#020066',fontWeight:900}}> {term.name} </b>  with an average of  <b style={{color:'#020066',fontWeight:900}}> {average} / 20 </b> </h2>
          </div>
        </div>
    )
}