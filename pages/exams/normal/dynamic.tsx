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
import ExamInterface from "../../../models/exam";
import { toast } from "@chakra-ui/toast";
import TermInterface from "../../../models/terms";
import { CSVLink } from "react-csv";

export const getSubjectTotal = (result:ExamResultInterface|any) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('subject_')){
            sum+=parseFloat(parseFloat(result[el]).toFixed(2))
        }
    }
    return sum;
}

export default function examDetails(){
    const [exam, setExam] = useState<ExamInterface>()
    const [term, setTerm] = useState<TermInterface>()
    const [courses, setCourses] = useState<CourseInterface[]>([])
    const [subjects, setSubjects] = useState<SubjectInterface[]>([])
    const [students, setStudents] = useState<StudentInterface[]>([])
    const [results, setResults] = useState<any>([])

    const [points, setPoints] = useState(0);
    const [ImportIsOpen, setImportIsOpen] = useState(false);

    const router = useRouter();
    const {term_id:examId} = router.query;

    useEffect(()=>{
        if(examId){

            api.getTerm(examId).then(({data:{data}} : any) => {
                setTerm(data)
                setExam(data.exams[0])
            })

            api.getTermResult(examId).then(({data:{data}} : any) => {
                setResults(data)
            })
        }
    }, [examId])


    useEffect(()=>{
        if(exam?._id){
            api.getSchoolSubjects({school:term.class.school, report_type:term.class.section.report_type}).then(({data:{data}} : any) => {
                setSubjects(s => data);
            })
        }
    },[exam])


    useEffect(() => {
        if(results && exam){
            getTotalPoints();
        }
    }, [results])

    const printResults = () => {
        window.open(`/api/exams/dynamic/${term?.report_type?.toLocaleLowerCase()}?term_id=${examId}`, '_blank')
    }

    const printStats = () => {
        window.open(`/api/exams/dynamic/${term?.report_type?.toLocaleLowerCase()}-stats?term_id=${examId}`, '_blank')
    }

    useEffect(() => {
        if(exam?._id){

            api.updateExam(exam._id, exam).then(({data:{data}} : any) => {
                //setExam(data)
            })
        }
    }, [exam])

    const handleChange = (e) => {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setExam(inputData => ({
          ...inputData,
          [key]: value
        }))

        getTotalPoints()

    }

    const deleteResult = (resultId:string) => {
        api.deleteResult(resultId).then(() => {
            api.getExamResults(examId).then(({data:{data}} : any) => {
                setResults(data)
            })
        })
    }

    const importResults = (file:File|null) => {
        api.importResultsNormal({
            file: file,
            exam_id:examId,
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
        for(const el in exam){
            if(el.includes('point_')){
                sum+=parseFloat(parseFloat(exam[el]).toFixed(2))??0
                console.log(exam[el])
            }
        }
       setPoints(s => sum)
    }

    const getRank = () => {
        api.calculateTerm(examId)
    }

    const printTD = () => {
        window.open(`/api/exams/td/${term?.report_type?.toLocaleLowerCase()}?term_id=${examId}`, '_blank')
    }

    const [resultsCsv, setResultsCsv] = useState<any>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [headers, setHeaders] = useState<any>([])
    
    function getCsvData(){
        console.log(results)
        let data = results.map((result:any) => {
            const total = getSubjectTotal(result);
            return {
                ...result, 
                total, 
                average: ((total / points) * 20).toFixed(2) 
            }
        })

        setResultsCsv(data);
    }

    function getHeaders(){
        let headers = [
            {label:'Number', key:'student.number'},
            {label:'Name',   key: 'student.name'}
        ]
    
        subjects.map(subject => {
            headers.push({
                label: subject.name, 
                key: `subject_${subject._id}`
            })
        })

        headers = [...headers, ...[
            {label: 'Total', key:'total'},
            {label: 'Moyenne', key:'average'},
            {label: 'Rang', key:'rank'}
        ]]

        setHeaders(headers);
    }

    useEffect(() => {
        getCsvData();
        getHeaders();
    }, [subjects, results, points])


    return (
        <>
            <div className='py-3'>
                <h3>Classe : {term?.class?.name} </h3>
                <h4>TRIMESTRE : {term?.name} </h4>
            </div>

            <button className='mx-3 btn btn-success' onClick={() => printResults()} > Imprimer Resultats </button>
           
            <button className='mx-3 btn btn-success' onClick={() => getRank()} > Calculer </button>
           
           <button className='mx-3 btn btn-dark' onClick={() => printStats(true)} > Imprimer Statistics</button>

           <button className='mx-3 btn btn-dark' onClick={() => printTD()} > Imprimer Tableau D</button>
          
           {resultsCsv.length && <CSVLink  data={resultsCsv} headers={headers} className='btn btn-dark mx-3' filename={`statistics-${term?.class?.name}-${term?.name}.csv`}>
                Telecharcher Csv
            </CSVLink>
            }

            <table className='table '>
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Nom</th>
                        {subjects && subjects.map(s=> {
                            return <th key={s._id}> <input type='number' name={`point_${s._id}`} style={{width:'50px'}} value={exam[`point_${s._id}`]} onChange={handleChange} /> {s.name} </th>
                        })}
                        <th>Total / {points} </th>
                        <th>Moyenne</th>
                        <th>Rank</th>
                        <th>Tableau d'honneur</th>
                        <th>Ignorer</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { results && subjects.length && results.map( result=> {
                    return <ExamResult  key={`exam-${result._id}`} result={result} subjects={subjects} points={points} deleteResult={deleteResult} />
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
        <th> <td><input type='checkbox' name='ignore' checked={res.ignore==true}  onClick={handleChange} /></td> </th>
        <th> <Link href={`/api/exams/results-normal/dynamic-print?term_id=${res.term_id}&student_id=${res.student._id}`}>Imprimer</Link> | <a href='javascript:void(0)' onClick={() =>deleteResult(res._id)}> Delete</a> </th>
    </tr>
}