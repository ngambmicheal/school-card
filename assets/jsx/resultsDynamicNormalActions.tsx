import CompetenceInterface from "../../models/competence";
import fs from 'fs';
import SubjectInterface from "../../models/subject";
import { logo } from "./image";
import ExamResultInterface from "../../models/examResult";
import { getSubjectTotal } from "../../pages/exams/[_id]";
import { getGeneralAverage } from "./resultsActions";
import ExamInterface from "../../models/exam";
import TermInterface from "../../models/terms";
import { getFloat } from "../../utils/calc";

let comT:string[] = [];

const getAppreciation = (value:number, total:number, displayName:boolean=false, competenceName:string='')  => {
    if(total==20){
        if(value < 11){ 
            if(comT.indexOf(competenceName)<0) comT.push(competenceName)
            return displayName? 'Not Acquired' :'NA';
        }
        if(value < 15)
            return displayName ? 'SIA': 'SIA';
        if(value < 18) 
            return displayName? 'Acquired': 'A'; 
        if(value < 21) 
            return displayName? 'Expert' : 'A+';
    }
    if(total==30){
        if(value <= 15) 
            return 'NA';
        if(value < 22)
            return 'ECA';
        if(value < 26) 
            return 'A'; 
        if(value < 31) 
            return 'A+';
    }
    if(total==40){
        if(value <= 20) 
            return 'NA';
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
            sum+=getFloat(result[el]??0);
        }
    }
    return sum; 
}

const getTotalExam = (result:any) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('point_')){
            sum+=getFloat(result[el]??0);
        }
    }
    return sum; 
}


export default function resultsDynamicNormalActions(subjects:SubjectInterface[], results:any, totalUsers:number, statsResults:ExamResultInterface[], examResults:ExamResultInterface[], exams:ExamInterface[], term:TermInterface ) {

    comT = [];

    const totalMarks = getFloat(getTotal(results));
    const totalPoints = getTotalExam(exams[0])
    const average = (totalMarks / totalPoints) * 20;

    const total1Marks = examResults.length ? getTotal(examResults[0]) : 0;
    const total2Marks = examResults.length ? getTotal(examResults[1]) : 0;

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
             <i>P.O Box:1661 DOUALA TEL: (237) 699717529/33089582 </i> <br />
        </th>
    </tr>
</table>

<div className='center' style={{fontSize:'25px', margin:'30px 0'}} >
    REPORT CARD : {term?.name} 2023/2024
</div>

<div>
<table className='table1' style={{fontSize:'20px', marginBottom:'40px'}} >
 <thead>
     <tr>
         <th colSpan={2}>NAME AND SURNAME</th>
         <th colSpan={4}>{ results.student?.name }</th>
     </tr>
     <tr>
         <th colSpan={2}>DATE OF BIRTH</th>
         <th colSpan={2}>{results.student?.dob}</th>
         <th colSpan={1}>SEX</th>
         <th>{results.student?.sex}</th>
     </tr>
     <tr>
         <th colSpan={1}>CLASS</th>
         <th > {term?.class?.name}  </th>
         <th>Enrolment</th>
         <th>{totalUsers}</th>
         <th>TEACHER</th>
         <th > {term?.class?.teacher} </th>
     </tr>
 </thead>
</table>
</div>

            <table className='table1' style={{fontSize:'20px'}}>
                <thead>
                <tr>
                    <th  colSpan={2}>
                        SUBJECTS
                    </th>
                    <th  >
                        MAX
                    </th>
                    {exams.map((exam, index) => {
                        return <th>
                        {exam.name.substr(0,4)}
                        </th>
                        })
                    }
                    <th >
                        TERM1
                    </th>
                    <th colSpan={2}>
                        APPRECIATION CODE
                    </th>
                </tr>
                </thead>
                <tbody>

                    {subjects?.map((subject, subjectIndex) => {
                        return (
                            <> 
                                    <tr>
                                        <td colSpan={2}> {subject.name} </td>
                                        <td>{exams[0][`point_${subject._id}`]}</td>
                                        {examResults.map((result, index) => {
                                            return <>
                                                        <td>{result[`subject_${subject._id}`] ?? 0}</td> 
                                                    </>
                                            })
                                        }
                                        <td>{results[`subject_${subject._id}`] ?? 0}</td> 
                                        <td>{getAppreciation((results[`subject_${subject._id}`] ?? 0), 20, false, subject.name)}</td>
                                        </tr>
                                    </>
                                )
                            })}
                </tbody>
            </table>

        
            <div className='center'>
        <p style={{fontSize:'20px', margin:'30px 0'}}>CODES : NA = Not Acquired, SIA= Skill In Acquisition, A = Acquired, A+ = Expert</p>
    </div>

    <table style={{fontSize:'25px', width:'100%'}} className='table1'>
        <tr>
            <th>Total </th>
            <th> {totalMarks} / {totalPoints} </th>
            <th>Observations</th>
            <th colSpan={3}>Class Council</th>
        </tr>
        <tr>
            <td>Average</td>
            <td> { ((totalMarks / totalPoints) * 20).toFixed(2) } /20 </td>
            <td rowSpan={5}>  {getAppreciation(Math.round((totalMarks / totalPoints)*20),20)} </td>
            <td> Conduct Warning</td>
            <td  style={{fontSize:'15px'}}>  <input type='checkbox' /> Yes <input type='checkbox' /> No  </td>
        </tr>
        <tr>
            <td>Rank </td>
            <td>  {results.rank} / {totalUsers} </td>
            <td> Warning</td>
            <td> {average<12? 'Yes' : 'No'}   </td>
        </tr>
        <tr>
            {/* <td>General Average</td>
            <td> { getGeneralAverage(statsResults, totalPoints).toFixed(2) }  /20 </td> */}
            <td>Highest Average</td>
            <td>   { ((getTotal(statsResults[0])/ totalPoints) * 20).toFixed(2) } / 20 </td>
            <td> Encouragements </td>
            <td>  {average>12? 'Yes' : 'No'}   </td>
        </tr>
        <tr>
            <td>Lower Average</td>
            <td> { ((getTotal(statsResults[statsResults.length-1])/ totalPoints) * 20).toFixed(2) } /20  </td>
            <td> Honour Roll</td>
            <td > { results.th ? 'Yes' :  'No'}</td>
        </tr>
        {/* <tr>
            <td> </td>
            <td colSpan={2}> </td>
        </tr> */}
           {exams.length>1 && <tr>
            <td> {exams[0].name.substr(0,4)} Average </td>
            <td>  { ((total1Marks / totalPoints) * 20).toFixed(2) } /20 </td>
            <td> {exams[1].name.substr(0,4)} Average </td>
            <td> { ((total2Marks / totalPoints) * 20).toFixed(2) } /20 </td>
        </tr>
        }
        <tr>
            <td colSpan={2}> Teacher's Visa</td>
            <td>Parent's Visa</td>
            <td colSpan={2}>Headteachers Visa</td>
        </tr>
        <tr>
            <td colSpan={2} style={{minHeight:'100px', fontSize:'14px'}}> 
                <i>Efforts should be done in the following</i>
                <br />
                <ul style={{listStyle: 'none', textAlign:'left'}}>
                    {comT.length > 0 ? comT.map(s => {
                        return <li>{s}</li>
                    }) : <li style={{fontStyle:'italic', fontSize:'18px', marginBottom:'30px'}}>Nothing to report</li>}
                </ul>
            </td>
            <td></td>
            <td colSpan={2}></td>
        </tr>
    </table>

</>
);
}