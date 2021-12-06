import { useRouter } from "next/dist/client/router";
import React from 'react';
import { useEffect, useState } from "react";
import CompetenceInterface from "../../../models/competence";
import { courseSchema } from "../../../models/course";
import api from "../../../services/api";
import logo from '../../../public/logo.png'
import { act } from "./[_id]";
import  { checkSvg } from "../../../services/constants";


export default function coursesPage(){
    const [competences, setCompetences] = useState<CompetenceInterface[]>([])
    const [results, setResults] = useState<any>({})
    const [email, setEmail] = useState('');

    const router = useRouter();
    const {_id:resultsId} = router.query;

    useEffect(() => {
        if(results.exam_id){
            api.getSchoolCompetences({school:results.exam_id.class_id.school, report_type:results.exam_id.class_id.section.report_type}).then(({data:{data}} : any) => {
                setCompetences(s => data);
            })
        }
    }, [results])

    useEffect(() => {
        if(resultsId){
            api.getResults(resultsId).then(({data:{data}} : any) => {
                setResults(data)
            })
        }
    }, [resultsId])

    const getCompetencesLenght = (competence:CompetenceInterface) => {
        let total = 0; 
        console.log(total);
        competence.subjects && competence.subjects.map(s => {
            total+= s.courses?.length ?? 0  
            total+=1;
        })
        return total; 
    }

    const printResults = () => {
        window.open(`/api/exams/results-mat/print-result?result=${resultsId}`,'_blank')
    }
    return (
        <>
           <button className='btn btn-success mx-2' onClick={printResults}> Imprimer </button>
           <button className='btn btn-success mx-2'> Envoyer au Parent </button>
           <input placeholder='parent email' width={100} />
           <table className='table2'>
               <tr>
                   <th>
                         REPUBLIQUE DU CAMEROUN <br />
                        Paix - Travail - Patrie <br />
                        GROUPE SCOLAIRE BILINGUE PRIVE  <br />
                        LAIC LA SEMENCE  <br />
                        BP: 1661 DOUALA BANGUE <br />
                        TEL: (237) 33 08 95 82/699717529 <br />
                   </th>
                   <th className=''>
                       <img src='/logo.png' height={200} />
                   </th>
                   <th className=''>
                        REPUBLIC OF CAMEROON  <br />
                        Peace - Work - Father/land  <br />
                        GROUPE SCOLAIRE BILINGUE PRIVE LAIC LA SEMENCE  <br />
                        P.O Box : 1661 DOUALA-BANGUE  <br />
                        Tel : (237) 33089582 <br />
                   </th>
               </tr>
           </table>

    <div >
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


            OBSERVATION : .............................................................................................................................................................................................................................<br /> 
                        ...............................................................................................................................................................................................................................................................

            <br />
            <table style={{width:'100%'}} className='table1'>
                <tr>
                    <th>L'ENSEIGNANTE</th>
                    <th>LA DIRECTION</th>
                    <th>LE PARENT</th>
                </tr>
                <tr style={{minHeight:'150px'}}>
                    <td  style={{height:'100px'}}>

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