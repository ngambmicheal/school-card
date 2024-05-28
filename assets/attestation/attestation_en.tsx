
import ExamResultInterface from "../../models/examResult";
import TermInterface from "../../models/terms";
import { attestation_en } from "../jsx/image";
import { base64_encode } from "../jsx/resultsActions";
import { getTotalExam } from "../jsx/resultsDynamicActions";
import { getTotal } from "../jsx/resultsUiStats";


export default function attestationEn(result:ExamResultInterface, term:TermInterface, is_annual = false ) {

    const totalMarks = getTotal(result)
    const totalPoints =  is_annual ? getTotalExam(term.terms[0].exams[0]) :   term.exams?.length ? getTotalExam(term.exams[0]) : 0;
    const average = ((totalMarks / totalPoints) * 20).toFixed(2) 

    const fontSize = term.class?.school?.attestation_font_size ?? `35px`;
    const fontSizeName =  term.class?.school?.attestation_font_size_name?? `40px`;

    return (
        <div style={{  
            backgroundImage: "url('data:image/png;base64," + attestation_en + "')",
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
            <h2 style={{fontSize}}>I, the undersigned Mrs, <b style={{color:'#020066', fontWeight: 'bolder', fontSize:fontSizeName}}>DASSI Armande</b></h2>
            <h2  style={{fontSize}}>
                 Headmistress    of    GSBPL   La   SEMENCE    attests   that   the   pupil :
            </h2>
            <h2  style={{fontSize, lineHeight:'50px'}}>The pupil <b style={{color:'#020066', fontWeight:900, fontSize:fontSizeName}}>{result.student.name}</b> of the class  <b style={{color:'#020066',fontWeight:900,fontSize:fontSizeName,}}>{term.class?.name} </b> deserved to be inscribed on the honor roll for his conduct and work during the <b style={{color:'#020066',fontWeight:900, fontSize:fontSizeName,}}> {term.name} </b>   with an average of <b style={{color:'#020066',fontWeight:900, fontSize:fontSizeName,}}> {average} / 20 </b> </h2>
          </div>
        </div>
    )
}