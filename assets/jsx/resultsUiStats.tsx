import ExamResultInterface from "../../models/examResult";
import CompetenceInterface from "../..//models/competence";
import ExamInterface from "../../models/exam";
import { useState } from "react";

export const getTotalPoints = (exam:ExamInterface) => { 
    let sum = 0; 
    console.log(sum)
    for(const el in exam){
        if(el.includes('point_')){
            sum+=parseInt(exam[el])??0
        }
    }
  
    return sum;
}

export const getTotal = (result:ExamResultInterface) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('subject_')){
            sum+=parseInt(result[el])??0;
        }
    }
   return sum; 
}

export const getTotals = (competences:CompetenceInterface[]) => {
    competences.map(c => {
        c.subjects?.map(s => {
            res[`total_${s._id}`] = s.courses?.map(cc => res[`subject_${cc._id}`]).reduce(reducer,0);
        })
    })
}


export default function resultsUiStats(exam:ExamInterface, competences:CompetenceInterface[], results: ExamResultInterface[]){

    const points = getTotalPoints(exam);
    return (
        <>
            <div className='py-3'>
                <h3>Classe : {exam?.class_id?.name} </h3>
                <h4>Examen : {exam?.name} </h4>
            </div>

            <table className='table1' >
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Nom</th>
                        {competences && competences.map(s=> {
                            return <th key={s._id} colSpan={s.subjects?.length*4}> {s.slug} </th>
                        })}
                        <th>Total</th>
                        <th>Moyenne</th>
                        <th>Rang</th>
                    </tr>
                    <tr>
                        <th>

                        </th>
                        <th> </th>
                        {competences && competences.map(competence=> {
                            return competence.subjects?.map(subject => {
                                return <th key={subject._id} colSpan={subject.courses?.length+1} > {subject.slug || subject.name} </th>
                            })
                        })}
                    </tr>
                    <tr>
                        <th>

                        </th>
                        {competences && competences.map(competence=> {
                            return competence.subjects?.map(subject => {
                                return (
                                    <>
                                        {subject.courses?.map(course => {
                                        return <th key={course._id} > 
                                                    {course.name} 
                                                </th>
                                        })}
                                    <th> Total</th>
                                    </>
                                )
                            })
                        })}
                        <th>{points} </th>
                        <th>Moyenne</th>
                        <th>Rank</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { results && competences.length && results.map( result=> {
                    return <ExamResult  key={`exam-${result._id}`} result={result} competences={competences} exam={exam} points={points} />
                })}
                </tbody>
            </table>
        </>
    )
}

const reducer = (previousValue:any, currentValue:any) => parseInt(previousValue??0) + parseInt(currentValue??0)

export function ExamResult({ result, competences, exam, points}:{competences:CompetenceInterface[], result:ExamResultInterface|any, exam:any, points:any}){

    const total = getTotal(result);

    const calculateSubTotal = () => {
        getTotals();
    }


   return  <tr>
        <td>{result?.student.number}</td>
        <td>{result?.student?.name}</td>
        {competences && competences.map(competence=> {
            return competence.subjects?.map(subject => {
                return (
                    <>
                        {subject.courses?.map(course => {
                                return course._id && <td key={course._id}> {result[`subject_${course._id}`]}</td>
                        })}
                    <th> {result[`total_${subject._id}`]} </th>
                    </>
                )
            })
        })}
        <td>{total}</td>
        <th> { ((total / points) * 20).toFixed(2) } / 20 </th>
        <th> {result.rank}</th>
    </tr>
}
