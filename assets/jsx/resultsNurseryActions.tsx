import CompetenceInterface from "../../models/competence";
import fs from 'fs';
import SubjectInterface from "../../models/subject";
import { logo } from "./image";
import ExamResultInterface from "../../models/examResult";
import { checkSvg } from "../../services/constants";
import { nurseryActs } from "../../pages/exams/nursery/[_id]";
import { getFloat } from "../../utils/calc";

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

const getAppreciation = (value:number, total:number)  => {
    if(total==20){
        if(value < 11) 
            return 'NA';
        if(value < 15)
            return 'ECA';
        if(value < 18) 
            return 'A'; 
        if(value < 21) 
            return 'A+';
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


export default function resultsNurseryActions(competences:CompetenceInterface[], results:any, totalUsers:number, statsResults:ExamResultInterface[] ) {

    
    let comT:string[] = []

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

<div className='center' style={{fontSize:'25px', margin:'30px 0'}} >
    REPORT CARD : {results.exam_id?.name} 2023/2024
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
         <th > {results.exam_id?.class_id?.name} </th>
         <th>Enrolment</th>
         <th>{totalUsers}</th>
         <th>TEACHER</th>
         <th >{results.exam_id?.class_id?.teacher}</th>
     </tr>
 </thead>
</table>
</div>

<table className='table1' style={{fontSize:'20px'}} >
                <thead>
                <tr>
                    <th rowSpan={2} className="th">
                        DOMAINS
                    </th>
                    <th rowSpan={2} className="th">
                        ACTIVITY AREAS
                    </th>
                    <th colSpan={nurseryActs.length}>
                        GRADING OF COMPETENCE
                    </th>
                </tr>
                <tr>
                    {nurseryActs.map(at => {
                        return <th>{at.name} <br/> {at.slug}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {competences && competences.map(competence=> {
                            return (
                                <>                                    
                                    {
                                        competence.subjects?.map((subject, subjectIndex) => {
                                            if('NA' == results[`subject_${subject._id}`]){
                                                comT.push(subject.name);
                                            }

                                            return (
                                                <> 
                                                        <tr>
                                                            {!subjectIndex && <td rowSpan={(competence.subjects?.length)??1} > {competence.name} </td> }
                                                            <td > {subject.name}  </td>  
                                                            {nurseryActs.map(at => {
                                                                return <td> {at.slug == results[`subject_${subject._id}`] ? <img src={checkSvg} />:''} </td>
                                                            })}
                                                        </tr>
                                                </>
                                            )
                                        })
                                    }
                                </>
                            ) 
                        })}
                </tbody>
            </table>


            
            
            {
                results.exam_id?.name.toLowerCase() === '3rd TERM'.toLowerCase() ? <>
                    <div style={{marginTop:'5px'}}>
                        <span style={{fontWeight: 'bolder'}}>TERM REMARKS</span> : <span> Efforts should be done in the following : &nbsp;&nbsp;
                                        {comT.length > 0 ? 
                                                comT.map(s => {
                                                    return <span>{s}, </span>
                                                }) : 
                                        <span style={{fontStyle:'italic', fontSize:'18px', marginBottom:'30px'}}>Nothing to report</span> } 
                                    </span>
                    </div>
                    <div className="k">
                        <table>
                            <tr style={{fontWeight: 'bolder'}}>
                                <td style={{fontSize: '20px'}}>Promoted / Repeated :</td>
                                <td>
                                    PN <input type="checkbox" name="" id="" />&nbsp;&nbsp;
                                </td>
                                <td>
                                    N1 <input type="checkbox" name="" id="" />&nbsp;&nbsp;
                                </td>
                                <td>
                                    N2 <input type="checkbox" name="" id="" />&nbsp;&nbsp;
                                </td>
                                <td>
                                    CLASS 1 <input type="checkbox" name="" id="" /> 
                                </td>
                            </tr>
                        </table> 
                    </div>
                </> 
                : <div style={{margin:'15px 0'}}>
                        <span style={{fontWeight: 'bolder'}}>TERM REMARKS</span> : <span> Efforts should be done in the following :  &nbsp;&nbsp;
                                    {comT.length > 0 ? 
                                            comT.map(s => {
                                                return <span>{s}, </span>
                                            }) : 
                                    <span style={{fontStyle:'italic', fontSize:'18px', marginBottom:'30px'}}>Nothing to report</span> } 
                                </span>
                    </div>
            }

            <table style={{width:'100%', marginTop:'5px', fontSize:'20px'}} className='table1'>
                <tr>
                    <th>Class Teacher Visa</th>
                    <th>Head Master Visa</th>
                    <th>Parent Visa</th>
                </tr>
                <tr>
                    <td  style={{height:'60px'}}>

                    </td>
                    <td>

                    </td>
                    <td>

                    </td>
                </tr>   
            </table>

</>
);
}