import CompetenceInterface from "../../models/competence";
import fs from 'fs';
import SubjectInterface from "../../models/subject";
import { logo } from "./image";
import ExamResultInterface from "../../models/examResult";
import ExamInterface from "../../models/exam";
import TermInterface from "../../models/terms";
import AnnualExamInterface from "../../models/annualExam";
import { addNumbers } from "../../utils/actions";

const getCompetencesLenght = (competence:CompetenceInterface) => {
    let total = 0; 
    competence.subjects && competence.subjects.map(s => {
        total += s.courses?.length ?? 0  
        total += 1;
    })
    return total; 
}

export const getGeneralAverage = (results:ExamResultInterface[], totalPoints:number) => {
    let total=0; 
    results.forEach(result => {
        total+=(getTotal(result)/totalPoints)
    })

    return (total / results.length) * 20;
}

let comT:string[] = [];
const getCompetenceAppreciation = (value:number, total:number, competenceName:string='')  => {
    if(total==20){
        if(value < 10){
            if(comT.indexOf(competenceName)<0) comT.push(competenceName)
            return 'NA';
        }
        if(value < 15)
            return 'ECA';
        if(value < 18) 
            return 'A'; 
        if(value < 21) 
            return 'A+';
    }
    if(total==30){
        if(value <= 15){
            if(comT.indexOf(competenceName)<0) comT.push(competenceName)
            return 'NA';
        } 
        if(value < 22)
            return 'ECA';
        if(value < 26) 
            return 'A'; 
        if(value < 31) 
            return 'A+';
    }
    if(total==40){
        if(value <= 20){
            if(comT.indexOf(competenceName)<0) comT.push(competenceName)
            return 'NA';
        } 
        if(value < 30)
            return 'ECA';
        if(value < 35) 
            return 'A'; 
        if(value < 41) 
            return 'A+';
    }
}

export  function base64_encode(file:string) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

export function excludedClass(className:string, course_id:string){
   
   if( course_id == "617a3e0add1ff771217ce4ed" && (className.toLocaleLowerCase().includes('cp'))){
       return false;
   }
   else return true;
}


const getTotal = (result:any) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('subject_')){
            sum=addNumbers(sum, result[el]);
        }
    }
    return sum; 
}

export const getTotalExam = (result:any) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('point_')){
            sum=addNumbers(sum, result[el]??0);
        }
    }
    return sum; 
}
 

export const getOnlySubjectTotal = (subject:SubjectInterface, results:ExamResultInterface) => {
    let total = 0 ; 
    subject.courses?.map(c => {
        total=addNumbers(total, results[`subject_${c._id}`]??0);
    })
    return total
}
export default function resultsAnnualActions(competences:CompetenceInterface[], results:any, totalUsers:number, statsResults:ExamResultInterface[], examResults:ExamResultInterface[], exams:TermInterface[], term:AnnualExamInterface ) {
    comT = [];
    const examWithPoint = exams[0].exams as ExamInterface[];
    const getSubjectTotal = (subject:SubjectInterface) => {
        let total = 0 ; 
        let pointTotal = 0;
        subject.courses?.map(c => {
            total=addNumbers(total, results[`subject_${c._id}`]??0);
            pointTotal=addNumbers(pointTotal, (examWithPoint[0][`point_${c._id}`]??0));
        })

        const app = getCompetenceAppreciation(total, pointTotal, subject.slug);

        return {total, app, pointTotal}
    }

    const totalMarks = getTotal(results);
    const totalPoints = getTotalExam(examWithPoint[0])
    const average = (totalMarks / totalPoints) * 20;

    const total1Marks = examResults.length ? getTotal(examResults[0]) : 0;
    const total2Marks = examResults.length ? getTotal(examResults[1]) : 0;
    const total3Marks = examResults.length>2 ? getTotal(examResults[2]) : 0;

    return (
        <>
    <div className="bg-logo"></div>
    <table className='table2' style={{fontSize:'14px'}}>
    <tr>
        <th className='center' style={{width:'40%'}}>
              <b>REPUBLIQUE DU CAMEROUN</b> <br />
                <i> Paix - Travail - Patrie </i> <br />
             <b>GROUPE SCOLAIRE BILINGUE PRIVE LAIC LA SEMENCE</b>  <br />
             <i>BP: 1661 DOUALA TEL: (237) 699717529/33089582</i> <br />
        </th>
        <th className='' style={{width:'20%'}}>
            <img src={`data:image/jpeg;base64, ${logo}`} height={100} />
        </th>
        <th className='center' style={{width:'40%'}}>
            <b> REPUBLIC OF CAMEROON</b>  <br />
             <i>Peace - Work - Father/land</i>  <br />
            <b> GROUPE SCOLAIRE BILINGUE PRIVE LAIC LA SEMENCE </b> <br />
             <i>P.O Box:1661 DOUALA TEL: (237) 699717529/33089582</i> <br />
        </th>
    </tr>
</table>

<div className='center' style={{fontSize:'20px', margin:'20px'}} >
    BULLETIN D'EVALUATION : {term.name}  2022/2023
</div>

<div>
<table className='table1' style={{fontSize:'20px'}} >
 <thead>
     <tr>
         <th colSpan={2}>NOMS ET PRENOMS</th>
         <th colSpan={4}>{ results.student?.name }</th>
     </tr>
     <tr>
         <th colSpan={2}>DATE DE NAISSANCE</th>
         <th colSpan={2}>{results.student?.dob}</th>
         <th colSpan={1}>SEXE</th>
         <th>{results.student?.sex}</th>
     </tr>
     <tr>
         <th colSpan={1}>CLASSE</th>
         <th > {term?.class?.name} </th>
         <th>EFFECTIF</th>
         <th>{totalUsers}</th>
         <th>ENSEIGNANT(E)</th>
         <th >{term?.class?.teacher}</th>
     </tr>
 </thead>
</table>
</div>

 <table className='table1' style={{fontSize:'20px'}}>
     <thead>
     <tr>
         <th rowSpan={2} style={{width:'250px'}}>
             COMPETENCES
         </th>
         <th rowSpan={2}  style={{width:'350px'}}>
             SOUS-COMPETENCES
         </th>
         <th colSpan={2}>
             UA
         </th>
         {exams.map((exam, index) => {
            return <th>
               {exam.slug}
            </th>
            })
        }
        <th colSpan={2}>{term?.name}</th>
     </tr>
     <tr>
         <th>
             EVAL
         </th>
         <th>
             SUR 
         </th>
         {exams.map((exam, index) => {
                        return< th>
                                    NOTES
                                </th>
                        })
                    }
         <th>
             NOTES
         </th>
         <th>
             COTE
         </th>
     </tr>
     </thead>
     <tbody style={{maxHeight:'80%'}}>
     {competences && competences.map((competence, competenceIndex) => {
                 return (
                     <>                                    
                         {
                             competence.subjects?.map((subject, subjectIndex) => {

                                const to = getSubjectTotal(subject);
                                const isExcluded = !excludedClass(term.class?.name, subject._id);
                                 return (
                                     <> 
                                         {subject.courses?.map((course, courseIndex) => {
                                         return( 
                                             <>
                                             <tr>
                                                 {!subjectIndex && !courseIndex&& <th style={{width:'150px'}} rowSpan={getCompetencesLenght(competence)}> {competence.name} </th> }
                                                 {!courseIndex && <td  style={{width:'150px'}} rowSpan={(subject.courses?.length??1)+1}> {subject.name}  </td>  }
                                                 <td>{!isExcluded ? (course.name.includes('Savoir')? 'SE' : course.name) :''} </td>
                                                 <td>{ !isExcluded ?examWithPoint[0][`point_${course._id}`] :'--'}</td>
                                                 {examResults.map((result, index) => {
                                                    return <>
                                                                <td>{result[`subject_${course._id}`]? Number(result[`subject_${course._id}`]).toFixed(2) : 0}</td> 
                                                            </>
                                                    })
                                                }

                                                 <td>{ !isExcluded ?results[`subject_${course._id}`] ?? 0 : '--'}</td> 
                                                 {!courseIndex && <td rowSpan={(subject.courses?.length??1)+1}> { !isExcluded ?to.app :'--'}  </td>  }
                                                 </tr>
                                             </>
                                         )
                                         })}

                                             <tr>
                                                 <th>Total </th>
                                                 <th> {!isExcluded ?to.pointTotal:'--'}</th>
                                                 {examResults.map((result, index) => {
                                                    return <>
                                                                <td>{getOnlySubjectTotal(subject, result).toFixed(2) ?? 0}</td> 
                                                            </>
                                                    })
                                                }
                                                 <th>{!isExcluded ?to.total.toFixed(2):'--'}</th> 
                                             </tr>
                                             { ( competenceIndex==2 && (subjectIndex +1  == competence.subjects?.length) )&& <><tr style={{border:'none !important', pageBreakAfter:'always' }}><td colSpan={0} style={{border:'white 1px inset'}} > <div style={{pageBreakAfter:'always' }}> </div ></td></tr></>}
                                     </>
                                 )
                             })
                         }
                     </>
                 ) 
             })}

    </tbody>
    </table>

    <div className='center'>
        <p style={{fontSize:'20px'}}>COTES : NA = Non Acquis, ECA = En Cours d’Acquisition, A = Acquis, A+ = Expert</p>
    </div>

    <table style={{fontSize:'25px', width:'100%'}} className='table1'>
        <tr>
            <th>TOTAL </th>
            <th> {totalMarks} / {totalPoints} </th>
            <th>COTES</th>
            <th colSpan={2}>Conseil de Classe</th>
        </tr>
        <tr>
            <td>Moyenne</td>
            <td> { ((totalMarks / totalPoints) * 20).toFixed(2) } /20 </td>
            <td rowSpan={6}>  {getCompetenceAppreciation(Math.round((totalMarks / totalPoints)*20),20)} </td>
            <td> Avertissement Conduite </td>
            <td style={{fontSize:'15px'}}>  <input type='checkbox' /> Oui <input type='checkbox' /> Non  </td>
        </tr>
        <tr>
            <td>Rang </td>
            <td>  {results.rank} / {totalUsers} </td>
            <td> Avertissement Travail </td>
            <td> {average<12? 'Oui' : 'Non'}  </td>
        </tr>
        <tr>
            {/* <td>Moyenne generale</td>
            <td> { getGeneralAverage(statsResults, totalPoints).toFixed(2) }  /20 </td> */}
            <td>Moyenne du premier</td>
            <td>   { ((getTotal(statsResults[0])/ totalPoints) * 20).toFixed(2) } / 20 </td>
            <td> Encouragements </td>
            <td> {average>12? 'Oui' : 'Non'}  </td>
        </tr>
        <tr>
            <td>Moyenne du dernier</td>

            <td>{ ((getTotal(statsResults[statsResults.length-1])/ totalPoints) * 20).toFixed(2) } /20  </td>
            <td> Tableau d'honneur </td>
            <td > { results.th ? 'Oui' :  'Non'} </td>
        </tr>
        {/* <tr>
            <td> </td>
            <td colSpan={2}> </td>
        </tr> */}
        {exams.length>1 && <><tr>
            <td>Moyenne du {exams[0].slug} </td>
            <td>  { ((total1Marks / totalPoints) * 20).toFixed(2) } /20 </td>
            <td>Moyenne du {exams[1].slug} </td>
            <td> { ((total2Marks / totalPoints) * 20).toFixed(2) } /20 </td>
            </tr>
            <tr>
                <td> Moyenne du {exams[2].slug}</td>
                <td>  { ((total3Marks / totalPoints) * 20).toFixed(2) } /20 </td>
                <td>{average > 10 ? 'Admis en classe de' : 'Redouble la classe de'}</td>
                <td>{average > 10 ? term.class?.promoted : term.class?.name }</td>
            </tr>
        </>
        }
        <tr>
            <td colSpan={2}> Observation de l'enseignant(e)</td>
            <td>Visa parent</td>
            <td colSpan={2}>Visa du chef d'établissement</td>
        </tr>
        <tr>
            <td colSpan={2} style={{minHeight:'100px', fontSize:'14px'}}> 
                <i>Des efforts s'imposent dans les compétences suivantes</i>
                <br />
                <ul style={{listStyle: 'none', textAlign:'left'}}>
                    {comT.length > 0 ? comT.map(s => {
                        return <li>{s}</li>
                    }) : <li style={{fontStyle:'italic', fontSize:'18px', marginBottom:'30px'}}>RAS</li>}
                </ul>
            </td>
            <td></td>
            <td colSpan={2}></td>
        </tr>
        {/* <tr>
            <td>

            </td>
            <td>

            </td>
            <td>

            </td>
        </tr> */}
    </table>


</>
);
}