import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import CourseInterface from "../../../models/course";
import SubjectInterface from "../../../models/subject";
import api from "../../../services/api";
import { customStyles } from "../../../services/constants";
import Modal from 'react-modal'
import Link from 'next/link'
import Subjects from "../../subjects";
import StudentInterface from "../../../models/student";
import ExamResultInterface from "../../../models/examResult";
import TermInterface from "../../../models/terms";
import { toast } from "@chakra-ui/toast";
import AnnualEInterface from "../../../models/annualExam";

export const getSubjectTotal = (result:ExamResultInterface|any) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('subject_')){
            sum+=parseFloat(result[el]);
        }
    }
    return sum;
}

export default function termDetails(){
    const [term, setTerm] = useState<TermInterface>()
    const [annualExam, setAnnualE] = useState<AnnualEInterface>()
    const [courses, setCourses] = useState<CourseInterface[]>([])
    const [subjects, setSubjects] = useState<SubjectInterface[]>([])
    const [students, setStudents] = useState<StudentInterface[]>([])
    const [results, setResults] = useState<any>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [points, setPoints] = useState(0);
    const [ImportIsOpen, setImportIsOpen] = useState(false);

    const router = useRouter();
    const {annualExam_id:termId} = router.query;

    useEffect(()=>{
        if(termId){

            api.getAnnualExam(termId).then(({data:{data}} : any) => {
                setAnnualE(data)
                setTerm(data.terms[0])
            })

            api.getAnnualExamResult(termId).then(({data:{data}} : any) => {
                setResults(data)
            })
        }
    }, [termId])


    useEffect(()=>{
        if(term?._id){
            api.getSchoolSubjects({school:annualExam.class.school, report_type:annualExam.class?.section?.report_type}).then(({data:{data}} : any) => {
                setSubjects(s => data);
            })
        }
    },[term])


    useEffect(() => {
        if(results && term){
            getTotalPoints();
        }
    }, [results])

    const printResults = () => {
        window.open(`/api/terms/annual/${annualExam?.report_type?.toLocaleLowerCase()}?annualExam_id=${termId}`, '_blank')
    }

    const printStats = () => {
        window.open(`/api/terms/annual/${annualExam?.report_type?.toLocaleLowerCase()}-stats?annualExam_id=${termId}`, '_blank')
    }

    useEffect(() => {
        if(term?._id){

            // api.updateTerm(term._id, term).then(({data:{data}} : any) => {
            //     //setTerm(data)
            // })
        }
    }, [term])

    const handleChange = (e) => {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setTerm(inputData => ({
          ...inputData,
          [key]: value
        }))

        getTotalPoints()

    }

    const deleteResult = (resultId:string) => {
        api.deleteResult(resultId).then(() => {
            api.getExamResults(termId).then(({data:{data}} : any) => {
                setResults(data)
            })
        })
    }

    const importResults = (file:File|null) => {
        api.importResultsNormal({
            file: file,
            term_id:termId,
          })
          .then((data) => {
            toast({
              status: 'success',
              title: 'Successfully imported leads',
              description: `Loaded `,
            })
    
            setTimeout(() => router.push('/soft-leads'), 2000)
          })
          .catch((e) => {
            console.log(e)
            toast({
              status: 'error',
              title: typeof e === 'string' ? e : 'Failed to import leads',
              description: e.error??e.toString(),
              isClosable: true,
            })

          })
    }   

    const closeImportModal = () => {
        setImportIsOpen(s => false);
    }

    const getTotalPoints = () => { 
        let sum = 0; 
        console.log(sum)
        for(const el in term){
            if(el.includes('point_')){
                sum+=parseFloat(term[el])??0
                console.log(term[el])
            }
        }
       setPoints(s => sum)
    }

    const getRank = () => {
        api.calculateAnnualExam(termId)
    }

    const printTD = () => {
        window.open(`/api/terms/td/${annualExam?.report_type?.toLocaleLowerCase()}?annualExam_id=${termId}`, '_blank')
    }



    return (
        <>
            <div className='py-3'>
                <h3>Classe : {annualExam?.class?.name} </h3>
                <h4>TRIMESTRE : {annualExam?.name} </h4>
            </div>

            <button className='mx-3 btn btn-success' onClick={() => printResults()} > Imprimer Resultats </button>
           
            <button className='mx-3 btn btn-success' onClick={() => getRank()} > Calculer </button>
           
           <button className='mx-3 btn btn-dark' onClick={() => printStats(true)} > Imprimer Statistics</button>

           <button className='mx-3 btn btn-dark' onClick={() => printTD()} > Imprimer Tableau D</button>
          

            <table className='table '>
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Nom</th>
                        {subjects && subjects.map(s=> {
                            return <th key={s._id}> <input type='number' name={`point_${s._id}`} style={{width:'50px'}} value={term[`point_${s._id}`]} onChange={handleChange} /> {s.name} </th>
                        })}
                        <th>Total / {points} </th>
                        <th>Moyenne</th>
                        <th>Rank</th>
                        <th>Tableau d'honneur</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { results && subjects.length && results.map( result=> {
                    return <ExamResult  key={`term-${result._id}`} result={result} subjects={subjects} points={points} deleteResult={deleteResult} />
                })}
                </tbody>
            </table>

      </>
    )
}

export function ExamResult({result, subjects, points, deleteResult}:{subjects:SubjectInterface[], result:ExamResultInterface|any, points:number, deleteResult:(resultId:string)=>void }){

    const [total, setTotal] = useState(0);
    const [res, setRes] = useState(result);
    const [hasLoaded, setHasLoaded] = useState(false);


    useEffect(() => {
        setTotal(getSubjectTotal(res))
        if(hasLoaded){
            api.updateExamResult(res)
        }
        setHasLoaded(true);
    }, [res])

    
    const handleChange = (e) => {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setRes(inputData => ({
          ...inputData,
          [key]: value
        }))
    }
   return  <tr>
        <td>{result?.student?.number}</td>
        <td>{result?.student?.name}</td>
        {subjects.map(subject => {
            return subject._id && <td key={subject._id}> <input type='number' name={`subject_${subject._id}`} style={{width:'50px'}} value={res[`subject_${subject._id}`]} onChange={handleChange} readOnly disabled />  </td>
        })}
        <td>{total}</td>
        <th> { ((total / points) * 20).toFixed(2) } / 20 </th>
        <th> {res.rank}</th>
        <th><input type='checkbox' name='th' checked={res.th==true}  onClick={handleChange} /></th>
        <th> <Link href={`/api/terms/results-normal/annual-print?annualExam_id=${res.annualExam_id}&student_id=${res.student._id}`}>Imprimer</Link> | <a href='javascript:void(0)' onClick={() =>deleteResult(res._id)}> Delete</a> </th>
    </tr>
}