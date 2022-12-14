import ExamResultInterface from "../../models/examResult";
import CompetenceInterface from "../..//models/competence";
import ExamInterface from "../../models/exam";
import { useState } from "react";
import SubjectInterface from "../../models/subject";
import { getGeneralAverage } from "./resultsActions";
import { getFloat } from "../../utils/calc";

export const getTotalPoints = (exam:ExamInterface) => { 
    let sum = 0; 
    console.log(sum)
    for(const el in exam){
        if(el.includes('point_')){
            sum+=getFloat(exam[el])??0
        }
    }
  
    return sum;
}

export const getTotal = (result:ExamResultInterface) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('subject_')){
            sum+=getFloat(result[el]??0);
        }
    }
   return sum; 
}

export const getTotals = (subject:SubjectInterface, result:ExamResultInterface) => {
    let total = 0; 
            subject.courses?.map(cc => {
                total+=getFloat(result[`subject_${cc._id}`] ?? 0); 
            })
    return total; 
}

export const getAdmis = (total:number, results:ExamResultInterface[] ) => {
    const half = total/2; 
    const admisResults = results.filter(result => (getTotal(result)) >=half );
    const admis = admisResults.length;
    const failed = results.length - admis; 

    return {admis: admis, failed, percent: (admis/results.length) * 100};
}


export default function resultsUiStats(exam:ExamInterface, competences:CompetenceInterface[], results: ExamResultInterface[], statResults:ExamResultInterface[]){

    const points = getTotalPoints(exam);
    const statsResults = statResults.filter(s => getTotal(s) >0 );
    const stat = getAdmis(points, statsResults);
    return (
        <>
            <div className='py-3'>
                <h3>Classe : {exam?.class_id?.name} </h3>
                <h4>Examen : {exam?.name} </h4>
            </div>

            <table className='table1' >
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        {competences && competences.map(s=> {
                            return <th key={s._id} colSpan={s.subjects?.length*4}> {s.slug || s.name} </th>
                        })}
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>
                            N
                        </th>
                        <th>Nom</th>
                        {competences && competences.map(competence=> {
                            return competence.subjects?.map(subject => {
                                return <th key={subject._id} colSpan={subject.courses?.length+1} > {subject.slug || subject.name} </th>
                            })
                        })}
                    </tr>
                    <tr>
                        <th>

                        </th>
                        <th>

                        </th>
                        {competences && competences.map(competence=> {
                            return competence.subjects?.map(subject => {
                                return (
                                    <>
                                        {subject.courses?.map(course => {
                                        return <th key={course._id} > 
                                                    {course.name.substr(0,3)} 
                                                </th>
                                        })}
                                    <th> Tot</th>
                                    </>
                                )
                            })
                        })}
                        <th>Totaux / {points} </th>
                        <th>Moyenne</th>
                        <th>Rang</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { results && competences.length && results.map( result=> {
                    return <ExamResult  key={`exam-${result._id}`} result={result} competences={competences} exam={exam} points={points} />
                })}
                </tbody>
            </table>

        <div style={{marginTop:'60px', fontSize:'20px'}}>
                <table>
                    <tr>
                        <th>

                        </th>
                        <th>

                        </th>
                    </tr>
                    <tr>
                        <td> Effectif :  </td>
                        <td> {results.length}</td>
                    </tr>
                    <tr>
                        <td> Composant : </td> 
                        <td> {statsResults.length} </td> 
                    </tr>
                    <tr>
                        <td> Admis : </td>
                        <td> {stat.admis} </td>
                    </tr>

                    <tr>
                        <td> Echoue : </td>
                        <td style={{color:'red'}}> {stat.failed} </td>
                    </tr>

                    <tr>
                        <td> % Reussite : </td>
                        <td > {stat.percent.toFixed(2) } </td>
                    </tr>
                    <tr>
                        <td> Moyenne du 1er : </td>
                        <td > { ((getTotal(statsResults[0])/ points) * 20).toFixed(2) } </td>
                    </tr>
                    <tr>
                        <td> Moyenne du dernier :  </td>
                        <td style={{color:'red'}}> { ((getTotal(statsResults[statsResults.length-1])/ points) * 20).toFixed(2) } </td>
                    </tr>
                    <tr>
                        <td> Moyenne General de la classe</td>
                        <td> { getGeneralAverage(statResults, points).toFixed(2) }  </td>
                    </tr>
                </table>
        </div>

        <br /> <br /> <br />

        <div style={{pageBreakAfter:"always"}}>

            <table>
                <thead>
                    <tr>
                            
                        <th>
                            Nom
                        </th>
                        <th>
                            Rang
                        </th>
                        <th>
                            Moyenne
                        </th>
                        <th> 
                            Total / {points}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {statResults.map(statResult => {
                        const total = getTotal(statResult);
                        return (
                            <tr>
                               <td>{statResult.student?.name}</td>    
                               <td>{statResult.rank}</td>  
                               <td>{  ((total / points) * 20).toFixed(2) } /20</td>
                               <td style={{textAlign:'right'}}> {total} </td>
                            </tr> 
                        )
                    })}
                </tbody>
            </table>
        </div>
        </>
    )
}

const reducer = (previousValue:any, currentValue:any) => getFloat(previousValue??0) + getFloat(currentValue??0)

export function ExamResult({ result, competences, exam, points}:{competences:CompetenceInterface[], result:ExamResultInterface|any, exam:any, points:any}){

    const total = getTotal(result);

   return  <tr>
        <td>{result?.student?.number}</td>
        <td>{result?.student?.name} </td>
        {competences && competences.map(competence=> {
            return competence.subjects?.map(subject => {
                return (
                    <>
                        {subject.courses?.map(course => {
                                return course._id && <td key={course._id}> {result[`subject_${course._id}`]}</td>
                        })}
                    <th>  {getTotals(subject, result)} </th>
                    </>
                )
            })
        })}
        <td>{total}</td>
        <th> { ((total / points) * 20).toFixed(2) } / 20 </th>
        <th> {result.rank}</th>
    </tr>
}
