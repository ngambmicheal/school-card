import CompetenceInterface from "../../models/competence";
import fs from 'fs';
import SubjectInterface from "../../models/subject";
import { logo } from "./image";
import ExamResultInterface from "../../models/examResult";
import { getSubjectTotal } from "../../pages/exams/[_id]";
import { getGeneralAverage } from "./resultsActions";
import { getFloat } from "../../utils/calc";

let comT:string[] = [];

const getAppreciation = (value:number, total:number, displayName:boolean=false, competenceName:string='')  => {
    if(total==20){
        if(value < 10){ 
            if(comT.indexOf(competenceName)<0) comT.push(competenceName)
            return displayName? 'Not Acquired' :'NA';
        }
        if(value < 15)
            return displayName ? 'SIA': 'ECA';
        if(value < 18) 
            return displayName? 'Acquired': 'A'; 
        if(value < 21) 
            return displayName? 'Expert' : 'A+';
    }
    if(total==30){
        if(value < 15) {
            if(comT.indexOf(competenceName)<0) comT.push(competenceName)
            return 'NA';
        }
        if(value < 21)
            return 'ECA';
        if(value < 26) 
            return 'A'; 
        if(value < 31) 
            return 'A+';
    }
    if(total==40){
        if(value < 20){
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
    if(total==50){
        if(value < 25){
            if(comT.indexOf(competenceName)<0) comT.push(competenceName)
            return 'NA';
        } 
        if(value < 30)
            return 'ECA';
        if(value < 41) 
            return 'A'; 
        if(value >= 41) 
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


export default function resultsSpecialActions(subjects:SubjectInterface[], results:any, totalUsers:number, statsResults:ExamResultInterface[] ) {

    comT = [];

    const totalMarks = getTotal(results)
    const totalPoints = getTotalExam(results?.exam_id)
    const average = (totalMarks / totalPoints) * 20;

    return (
        <>
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
    BULLETIN D'EVALUATION : {results.exam_id?.name} 2021/2022
</div>

<div>
<table className='table1' style={{fontSize:'20px', marginBottom:'40px'}} >
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
         <th>EFFECTIF</th>
         <th>{totalUsers}</th>
         <th>ENSEIGNANT(E)</th>
         <th >{results.exam_id?.class_id?.teacher}</th>
     </tr>
 </thead>
</table>
</div>

            <table className='table1' style={{fontSize:'20px'}}>
                <thead>
                <tr>
                    <th  colSpan={2}>
                        MATIERES
                    </th>
                    <th  >
                        SUR
                    </th>
                    <th >
                        NOTES
                    </th>
                    <th colSpan={2}>
                        COTATIONS
                    </th>
                </tr>
                </thead>
                <tbody>

                    {subjects?.map((subject, subjectIndex) => {
                        return (
                            <> 
                                    <tr>
                                        <td colSpan={2}> {subject.name} </td>
                                        <td>{results.exam_id?.[`point_${subject._id}`]}</td>
                                        <td>{results[`subject_${subject._id}`] ?? 0}</td> 
                                        <td>{getAppreciation((results[`subject_${subject._id}`] ?? 0), results.exam_id?.[`point_${subject._id}`], false, subject.name)}</td>
                                        </tr>
                                    </>
                                )
                            })}
                </tbody>
            </table>

        
            <div className='center'>
        <p style={{fontSize:'20px', margin:'30px 0'}}>COTES : NA = Non Acquis, ECA = En Cours d’Acquisition, A = Acquis, A+ = Expert</p>
    </div>

    <table style={{fontSize:'25px', width:'100%'}} className='table1'>
        <tr>
            <th>TOTAL </th>
            <th> {totalMarks} / {totalPoints} </th>
            <th>COTES</th>
            <th colSpan={3}>Conseil de Classe</th>
        </tr>
        <tr>
            <td>Moyenne</td>
            <td> { ((totalMarks / totalPoints) * 20).toFixed(2) } /20 </td>
            <td rowSpan={4}>  {getAppreciation(Math.round((totalMarks / totalPoints)*20),20)} </td>
            <td> Avertissement Conduite </td>
            <td  style={{fontSize:'15px'}}>  <input type='checkbox' /> Yes <input type='checkbox' /> No  </td>
        </tr>
        <tr>
            <td>Rang </td>
            <td>  {results.rank} / {totalUsers} </td>
            <td> Avertissement Travail</td>
            <td> {average<12? 'Yes' : 'No'}   </td>
        </tr>
        <tr>
            {/* <td>General Average</td>
            <td> { getGeneralAverage(statsResults, totalPoints).toFixed(2) }  /20 </td> */}
            <td>Moyenne du premier</td>
            <td>   { ((getTotal(statsResults[0])/ totalPoints) * 20).toFixed(2) } / 20 </td>
            <td rowSpan={2} colSpan={1}> Encouragements </td> 
           {/* <span style={{height: "65px", background: '#000', width: '1px', color: 'transparent', position: 'absolute', bottom: '30.5%', right: '111px'}} className="sep">
                i
            </span> */}
            <td rowSpan={2} colSpan={1}> {average>12? 'Yes' : 'No'}   </td>
        </tr>
        <tr>
            <td >Moyenne du dernier</td>
            <td> { ((getTotal(statsResults[statsResults.length-1])/ totalPoints) * 20).toFixed(2) } /20  </td>
            {/* <td></td> */}
            {/* <td></td> */}
            {/* <td> Tableau d'honneur</td>
            <td  style={{fontSize:'15px'}}> <input type='checkbox' /> Yes <input type='checkbox' /> No</td> */}
        </tr>
        {/* <tr>
            <td> </td>
            <td colSpan={2}> </td>
        </tr> */}
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
    </table>

</>
);
}