
import ExamInterface from "../../models/exam";
import ExamResultInterface from "../../models/examResult";
import { schoolLogo } from "../jsx/semence-util";


export default function AttestationMaternelleFr(result:ExamResultInterface, term:ExamInterface ) {
 
    return (
        <div style={{  
            backgroundImage: "url('data:image/png;base64," + schoolLogo(term.class_id?.school!, 'attestation_mat') + "')",
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