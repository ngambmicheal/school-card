
import ExamResultInterface from "../../models/examResult";
import TermInterface from "../../models/terms";
import { tdfr } from "../jsx/thfr";
import { base64_encode } from "../jsx/resultsActions";
import { getTotalExam } from "../jsx/resultsDynamicActions";
import { getTotal } from "../jsx/resultsUiStats";


export default function thFr(result:ExamResultInterface, term:TermInterface ) {

    const totalMarks = getTotal(result)
    const totalPoints = term.exams?.length ? getTotalExam(term.exams[0]) : 0;
    const average = ((totalMarks / totalPoints) * 20).toFixed(2) 

    return (
        <div style={{  
            backgroundImage: "url(" + tdfr + ")",
            // backgroundImage: "url("+ thBg + ")",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minHeight:'100%',
            position:'relative'
          }}>

          <div  style={{
                    position: 'absolute', 
                    top: '42%',
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
                    Je soussignée Mme, <span style={{ fontWeight: 'bolder', fontSize: '40px', color: '#000065', fontFamily: 'Bradley Hand ITC', marginLeft: '30px'}}>DASSI Armande</span>
                </h2>
                <h2 style={{
                        fontWeight: 'normal'
                    }}>
                    Directrice du Groupe Scolaire Bilingue Privé Laïc La Semence atteste que l'eleve <br />
                    <div style={{ fontWeight: 'bolder', fontSize: '60px', color: '#000065', fontFamily: 'Bradley Hand ITC', textAlign: 'center'}}>{result.student.name}</div>
                    a achevé avec succès le cycle primaire au cours de cette année scolaire.
                    En foi de quoi la présente ATTESTATION lui a été décernée pour servir et valoir ce que de droit.

                </h2>
            </div>
          </div>
        </div>
    )
}