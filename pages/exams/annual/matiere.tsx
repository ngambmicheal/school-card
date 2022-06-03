import { useRouter } from "next/dist/client/router";
import React from 'react';
import { useEffect, useState } from "react";
import CompetenceInterface from "../../../models/competence";
import { courseSchema } from "../../../models/course";
import api from "../../../services/api";
import logo from '../../../public/logo.png'
import { getSubjectTotal } from "../[_id]";
import SubjectInterface from "../../../models/subject";


export default function coursesPage(){
    const [subjects, setSubjects] = useState<SubjectInterface[]>([])
    const [results, setResults] = useState<any>({})
    const [email, setEmail] = useState('');
    

    const router = useRouter();
    const {_id:resultsId} = router.query;

    useEffect(() => {
        if(results?._id){
            api.getSchoolSubjects({school:results.exam_id.class_id.school, report_type:results.exam_id.class_id.section.report_type}).then(({data:{data}} : any) => {
                setSubjects(s => data);
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


    const printResults = () => {
        window.open(`/api/exams/results-normal/print-result?result=${resultsId}`,'_blank')
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
                        SUBJECTS
                    </th>
                    <th rowSpan={2} className="th">
                        MAX
                    </th>
                    <th className='th'>
                        AVERAGE
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
                                        <td>{subject.name} </td>
                                        <td>{results.exam_id?.[`point_${subject._id}`]}</td>
                                        <td>{results[`subject_${subject._id}`] ?? 0}</td> 
                                        <td></td>
                                        </tr>
                                    </>
                                )
                            })}
                        <tr>
                            <th>Total </th>
                            <th>{getSubjectTotal(results)}</th> 
                        </tr>
                </tbody>
            </table>
        </>
    );
}