import CompetenceInterface from "../../models/competence";
import fs from 'fs';
import SubjectInterface from "../../models/subject";
import { logo } from "./image";
import ExamResultInterface from "../../models/examResult";
import { act } from "../../pages/exams/mat/[_id]";
import { checkSvg } from "../../services/constants";

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
            sum+=parseFloat(result[el]);
        }
    }
    return sum; 
}

const getTotalExam = (result:any) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('point_')){
            sum+=parseFloat(result[el]);
        }
    }
    return sum; 
}


export default function resultsMatActions(competences:CompetenceInterface[], results:any, totalUsers:number, statsResults:ExamResultInterface[] ) {

    const getSubjectTotal = (subject:SubjectInterface) => {
        let total = 0 ; 
        let pointTotal = 0;
        subject.courses?.map(c => {
            total+=parseFloat(results[`subject_${c._id}`]??0);
            pointTotal+=parseFloat(results.exam_id[`point_${c._id}`]??0);
        })

        const app = getAppreciation(total, pointTotal);

        return {total, app, pointTotal}
    }

    const totalMarks = getTotal(results)
    const totalPoints = getTotalExam(results?.exam_id)

    return (
        <>
    <table className='table2' style={{fontSize:'14px'}}>
    <tr>
        <th className='center' style={{width:'40%'}}>
              <b>REPUBLIQUE DU CAMEROUN</b> <br />
                <i> Paix - Travail - Patrie </i> <br />
             <b>GROUPE SCOLAIRE BILINGUE PRIVE LAIC LA SEMENCE</b>  <br />
             <i>BP: 1661 DOUALA TEL: (237) 33089582/699717529</i> <br />
        </th>
        <th className='' style={{width:'20%'}}>
            <img src={`data:image/jpeg;base64, ${logo}`} height={100} />
        </th>
        <th className='center' style={{width:'40%'}}>
            <b> REPUBLIC OF CAMEROON</b>  <br />
             <i>Peace - Work - Father/land</i>  <br />
            <b> GROUPE SCOLAIRE BILINGUE PRIVE LAIC LA SEMENCE </b> <br />
             <i>P.O Box:1661 DOUALA TEL: (237) 33089582/699717529 </i> <br />
        </th>
    </tr>
</table>

<div className='center' style={{fontSize:'20px', margin:'20px'}} >
    BULLETIN D'EVALUATION - {results.exam_id?.name} - 2021/2022
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
         <th > {results.exam_id?.class_id?.name} </th>
         <th>Effectif</th>
         <th>{totalUsers}</th>
         <th>ENSEIGNANT</th>
         <th >{results.exam_id?.class_id?.teacher}</th>
     </tr>
 </thead>
</table>
</div>
<table className='table1' style={{fontSize:'20px'}} >
                <thead>
                <tr>
                    <th rowSpan={2} className="th">
                        DOMAINES
                    </th>
                    <th rowSpan={2} className="th">
                        ACTIVITES
                    </th>
                    <th colSpan={3}>
                        APPRECIATION
                    </th>
                </tr>
                <tr>
                    {act.map(at => {
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
                                            return (
                                                <> 
                                                        <tr>
                                                            {!subjectIndex && <td rowSpan={(competence.subjects?.length)??1} > {competence.name} </td> }
                                                            <td > {subject.name}  </td>  
                                                            {act.map(at => {
                                                                return <td> {at.slug == results[`subject_${subject.name}`] ? <img src={checkSvg} />:''} </td>
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


            <div style={{marginTop:'15px'}}>
                OBSERVATION : .............................................................................................................................................................................................................................<br /> 
                            ...............................................................................................................................................................................................................................................................
            </div>
            <br />
            <table style={{width:'100%', marginTop:'5px', fontSize:'20px'}} className='table1'>
                <tr>
                    <th>L'ENSEIGNANTE</th>
                    <th>LA DIRECTION</th>
                    <th>LE PARENT</th>
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