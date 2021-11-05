import CompetenceInterface from "../../models/competence";
import logo from '../../public/logo.png';
import path from 'path';
import fs from 'fs';
import SubjectInterface from "../../models/subject";

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
}

export  function base64_encode(file:string) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}



export default function resultsActions(competences:CompetenceInterface[], results:any ) {
    const im = path.resolve('public/logo.png')
    const img = base64_encode(im);
    const totalUsers = 0; 
    console.log(img)

    const getSubjectTotal = (subject:SubjectInterface) => {
        let total = 0 ; 
        subject.courses?.map(c => {
            total+=parseInt(results[`subject_${c._id}`]??0);
        })

        const app = getAppreciation(total, 20);

        return {total, app}
    }

    return (
        <>
    <table className='table2'>
    <tr>
        <th className='center' style={{width:'33%'}}>
              <b>REPUBLIQUE DU CAMEROUN</b> <br />
                <i> Paix - Travail - Patrie </i> <br />
             <b>GROUPE SCOLAIRE BILINGUE PRIVE  <br />
             LAIC LA SEMENCE</b>  <br />
             <i>BP: 1661 DOUALA BANGUE</i> <br />
             <i>TEL: (237) 33 08 95 82/699717529</i> <br />
        </th>
        <th className='' style={{width:'33%'}}>
            <img src={`data:image/jpeg;base64, ${img}`} height={100} />
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
    BULLETIN D'EVALUATION 2021/2022
</div>

<div>
<table className='table1'>
 <thead>
     <tr>
         <th>NOMS ET PRENOMS</th>
         <th colSpan={3}>{ results.student?.name }</th>
     </tr>
     <tr>
         <th>DATE DE NAISSANCE</th>
         <th className='th'></th>
         <th>SEXE</th>
         <th></th>
     </tr>
     <tr>
         <th>CLASSE</th>
         <th className='th'>  </th>
         <th>ENSEIGNANT</th>
         <th className='th'></th>
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
                                         return( 
                                             <>
                                             <tr>
                                                 {!subjectIndex && !courseIndex&& <td rowSpan={getCompetencesLenght(competence)}> {competence.name} </td> }
                                                 {!courseIndex && <td rowSpan={(subject.courses?.length??1)+1}> {subject.name}  </td>  }
                                                 <td>{course.name} </td>
                                                 <td>{results.exam_id?.[`point_${course._id}`]}</td>
                                                 <td>{results[`subject_${course._id}`] ?? 0}</td> 
                                                 {!courseIndex && <td rowSpan={(subject.courses?.length??1)+1}> {to.app}  </td>  }
                                                 </tr>
                                             </>
                                         )
                                         })}

                                             <tr>
                                                 <th>Total </th>
                                                 <th> </th>
                                                 <th>{to.total}</th> 
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
    COTES : NA =Non Acquis, ECA=en cours d’Acquisition, A+=Expert
    </div>

    <table>
        <tr>
            <th>

            </th>
            <th rowSpan={5}>
                Observation 
            </th>
        </tr>
        <tr>
            <td>TOTAL : </td>
        </tr>
        <tr>
            <td>Moyenne : {}/20 </td>
        </tr>
        <tr>
            <td>Rang : {} / {totalUsers}</td>
        </tr>
    </table>

    <table>
        <tr>
            <th>Visa du parent</th>
            <th>Visa du parent</th>
            <th>Chef de l'etablissement </th>
        </tr>
    </table>
</>
);
}