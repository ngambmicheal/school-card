
import ExamResultInterface from "../../models/examResult";
import TermInterface from "../../models/terms";
import { priEn } from "../jsx/priEn";
import { base64_encode } from "../jsx/resultsActions";
import { getTotalExam } from "../jsx/resultsDynamicActions";
import { getTotal } from "../jsx/resultsUiStats";


export default function thEn(result:ExamResultInterface, term:TermInterface ) {

    const totalMarks = getTotal(result)
    const totalPoints = term.exams?.length ? getTotalExam(term.exams[0]) : 0;
    const average = ((totalMarks / totalPoints) * 20).toFixed(2) 

    return (
        <div style={{  
            backgroundImage: "url(" + priEn + ")",
            // backgroundImage: "url("+ thBg + ")",
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
                    fontSize: '22px',
                    fontWeight: 'normal',
                    display: 'flex',
                    justifyContent: 'center'
                }}
                >
            <div className="d">
                <h2 style={{
                        fontWeight: 'normal'
                    }}>
                    I, the undersigned Mrs, <span style={{ fontWeight: 'bolder', fontSize: '40px', color: '#000065', fontFamily: 'Bradley Hand ITC', marginLeft: '30px'}}>DASSI Armande</span>
                </h2>
                <h2 style={{
                        fontWeight: 'normal'
                    }}>
                    Headmistress    of    GSBPL   La   SEMENCE    attests   that   the   pupil <br />
                    <div style={{ fontWeight: 'bolder', fontSize: '60px', color: '#000065', fontFamily: 'Bradley Hand ITC', textAlign: 'center'}}>{result.student.name}</div>
                    has successfully completed the primary cycle this school year.
                    In witness whereof this Attestation has been awarded to serve and assert the rights where necessary.

                </h2>
            </div>
          </div>
        </div>
    )
}