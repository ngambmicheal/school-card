import CompetenceInterface from "../../models/competence";
import fs from 'fs';
import SubjectInterface from "../../models/subject";
import { logo } from "./image";

const getCompetencesLenght = (competence:CompetenceInterface) => {
    let total = 0; 
    competence.subjects && competence.subjects.map(s => {
        total+= s.courses?.length ?? 0  
        total+=1;
    })
    return total; 
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
            sum+=parseInt(result[el]);
        }
    }
    return sum; 
}

const getTotalExam = (result:any) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('point_')){
            sum+=parseInt(result[el]);
        }
    }
    return sum; 
}


export default function resultsActions(competences:CompetenceInterface[], results:any, totalUsers:number ) {

    const getSubjectTotal = (subject:SubjectInterface) => {
        let total = 0 ; 
        let pointTotal = 0;
        subject.courses?.map(c => {
            total+=parseInt(results[`subject_${c._id}`]??0);
            pointTotal+=parseInt(results.exam_id[`point_${c._id}`]??0);
        })

        const app = getAppreciation(total, pointTotal);

        return {total, app, pointTotal}
    }

    const totalMarks = getTotal(results)
    const totalPoints = getTotalExam(results?.exam_id)

    return (
        <>
    <table className='table2'>
    <tr>
        <th className='center' style={{width:'33%'}}>
              <b>REPUBLIQUE DU CAMEROUN</b> <br />
                <i> Paix - Travail - Patrie </i> <br />
             <b>GROUPE SCOLAIRE BILINGUE <br/> 
             PRIVE LAIC LA SEMENCE</b>  <br />
             <i>BP: 1661 DOUALA BANGUE</i> <br />
             <i>TEL: (237) 33 08 95 82/699717529</i> <br />
        </th>
        <th className='' style={{width:'33%'}}>
            <img src={`data:image/jpeg;base64, ${logo}`} height={100} />
        </th>
        <th className='center' style={{width:'33%'}}>
            <b> REPUBLIC OF CAMEROON</b>  <br />
             <i>Peace - Work - Father/land</i>  <br />
            <b> GROUPE SCOLAIRE BILINGUE PRIVE LAIC LA SEMENCE </b> <br />
             <i> P.O Box : 1661 DOUALA-BANGUE </i>  <br />
             <i> Tel : (237) 33089582 </i> <br />
        </th>
    </tr>
</table>

<div className='center' >
    BULLETIN D'EVALUATION - {results.exam_id?.name} - 2021/2022
</div>

<div>
<table className='table1'>
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

 <table className='table1'>
     <thead>
     <tr>
         <th rowSpan={2} style={{width:'100px'}}>
             COMPETENCE
         </th>
         <th rowSpan={2} className='th'>
             SOUS-COMPETENCE
         </th>
         <th >
             UNITE D'APPRENTISSAGE
         </th>
         <th colSpan={3}>
             UA1
         </th>
     </tr>
     <tr>
         <th>
             EVALUATION
         </th>
         <th>
             MAX 
         </th>
         <th>
             NOTES
         </th>
         <th>
             COTE
         </th>
     </tr>
     </thead>
     <tbody>
     {competences && competences.map(competence=> {
                 return (
                     <>                                    
                         {
                             competence.subjects?.map((subject, subjectIndex) => {

                                const to = getSubjectTotal(subject);
                                 return (
                                     <> 
                                         {subject.courses?.map((course, courseIndex) => {

                                             const isExcluded = !excludedClass(results.exam_id.class_id?.name, subject._id);
                                         return( 
                                             <>
                                             <tr>
                                                 {!subjectIndex && !courseIndex&& <td rowSpan={getCompetencesLenght(competence)}> {competence.name} </td> }
                                                 {!courseIndex && <td rowSpan={(subject.courses?.length??1)+1}> {subject.name}  </td>  }
                                                 <td>{!isExcluded ? course.name :''} </td>
                                                 <td>{ !isExcluded ?results.exam_id?.[`point_${course._id}`] :'--'}</td>
                                                 <td>{ !isExcluded ?results[`subject_${course._id}`] ?? 0 : '--'}</td> 
                                                 {!courseIndex && <td rowSpan={(subject.courses?.length??1)+1}> { !isExcluded ?to.app :'--'}  </td>  }
                                                 </tr>
                                             </>
                                         )
                                         })}

                                             <tr>
                                                 <th>Total </th>
                                                 <th> {!isExcluded ?to.pointTotal:'--'}</th>
                                                 <th>{!isExcluded ?to.total:'--'}</th> 
                                             </tr>
                                     </>
                                 )
                             })
                         }
                     </>
                 ) 
             })}

        <table className='table1'>
            <tr>
                <th>TOTAL DES POINTS</th>
                <th colSpan={4}>20</th>
                <th colSpan={4}>30</th>
                <th colSpan={4}>40</th>
            </tr>
            <tr>
                <th>MOYENNES</th>
                <th>0-10</th>
                <th>11-14</th>
                <th>15-17</th>
                <th>18-20</th>
                <th>0-15</th>
                <th>16.5-21</th>
                <th>12.5-25.5</th>
                <th>26-40</th>
                <th>0-20</th>
                <th>22-28</th>
                <th>30-34</th>
                <th>36-40</th>
            </tr>
            <tr>
                <th>APPRECIATIONS (COTES)</th>
                <th>NA</th>
                <th>ECA</th>
                <th>A</th>
                <th>A+</th>
                <th>NA</th>
                <th>ECA</th>
                <th>A</th>
                <th>A+</th>
                <th>NA</th>
                <th>ECA</th>
                <th>A</th>
                <th>A+</th>
            </tr>
        </table>
     </tbody>
 </table>

    <div className='center'>
        <p style={{fontSize:'12px'}}>COTES : NA =Non Acquis, ECA=en cours d’Acquisition, A=Acquis, A+=Expert</p>
    </div>

    <table style={{width:'100%',margin:'20px'}}>
        <tr>
            <th align='center'>

            </th>
            <th rowSpan={5}>
                Observation 
                <br />
                <br />
                {getAppreciation(Math.round((totalMarks / totalPoints)*20),20)}
            </th>
        </tr>
        <tr>
            <td>TOTAL : {totalMarks} / {totalPoints} </td>
        </tr>
        <tr>
            <td>Moyenne : { ((totalMarks / totalPoints) * 20).toFixed(2) } /20 </td>
        </tr>
        <tr>
            <td>Rang : {results.rank} / {totalUsers}</td>
        </tr>
    </table>

    <table style={{width:'100%', 'margin':'20px', marginTop:'30px'}}>
        <tr>
            <th>Visa du parent</th>
            <th>Visa de L'Enseignant </th>
            <th>Chef de l'etablissement </th>
        </tr>
    </table>
</>
);
}