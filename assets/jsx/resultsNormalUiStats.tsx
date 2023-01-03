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


export default function resultsNormalUiStats(exam:ExamInterface, subjects:SubjectInterface[], results: ExamResultInterface[], statResults:ExamResultInterface[]){

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
                        <th>Number</th>
                        <th>Name</th>
                        {subjects && subjects.map(s=> {
                            return <th key={s._id}>  {s.name} </th>
                        })}
                        <th>Total / {points} </th>
                        <th>Average</th>
                        <th>Rank</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { results && subjects.length && results.map( result=> {
                    return <ExamResult  key={`exam-${result._id}`} result={result} subjects={subjects} points={points} />
                })}
                </tbody>
            </table>

        <div style={{marginTop:'30px', fontSize:'20px'}}>
                <table>
                    <tr>
                        <th>

                        </th>
                        <th>

                        </th>
                    </tr>
                    <tr>
                        <td> Effectif :  </td>
                        <td> {statResults.length}</td>
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
                        <td> { getGeneralAverage(statsResults, points).toFixed(2) }  </td>
                    </tr>
                </table>
        </div>

                <br /> <br /> <br />

        <div style={{pageBreakAfter:"always"}}>

            <table>
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Rank
                        </th>
                        <th>
                            Average
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
                            <td>{  ((total / points) * 20).toFixed(2) } / 20</td>
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

export function ExamResult({result, subjects, points}:{subjects:SubjectInterface[], result:ExamResultInterface|any, points:number }){

    const total = getTotal(result);

   return  <tr>
        <td>{result?.student?.number}</td>
        <td>{result?.student?.name}</td>
        {subjects.map(subject => {
            return subject._id && <td key={subject._id}> {result[`subject_${subject._id}`]} </td>
        })}
        <td>{total}</td>
        <th> { ((total / points) * 20).toFixed(2) } / 20 </th>
        <th> {result.rank}</th>
    </tr>
}
