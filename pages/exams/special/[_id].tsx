import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import CourseInterface from "../../../models/course";
import SubjectInterface from "../../../models/subject";
import api from "../../../services/api";
import { customStyles } from "../../../services/constants";
import Modal from 'react-modal'
import Link from 'next/link'
import StudentInterface from "../../../models/student";
import ExamResultInterface from "../../../models/examResult";
import ExamInterface from "../../../models/exam";
import { toast } from "@chakra-ui/toast";
import { ImportResults } from "../ui/[_id]";


export const getSubjectTotal = (result:ExamResultInterface|any) => {
    let sum = 0; 
    for(const el in result){
        if(el.includes('subject_')){
            sum+=parseFloat(result[el]);
        }
    }
    return sum;
}

export default function examDetails(){
    const [exam, setExam] = useState<ExamInterface>()
    const [courses, setCourses] = useState<CourseInterface[]>([])
    const [subjects, setSubjects] = useState<SubjectInterface[]>([])
    const [students, setStudents] = useState<StudentInterface[]>([])
    const [results, setResults] = useState<any>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [points, setPoints] = useState(0);
    const [ImportIsOpen, setImportIsOpen] = useState(false);
    


    const router = useRouter();
    const {_id:examId} = router.query;

    useEffect(()=>{
        if(examId){
            api.getExam(examId).then(({data:{data}} : any) => {
                setExam(data)
            })

            api.getExamResults(examId).then(({data:{data}} : any) => {
                setResults(data)
            })

            api.getStudents().then(({data:{data}} : any) => {
                setStudents(s => data);
            } )

        }
    }, [examId])

    useEffect(()=>{
        if(exam?._id){
            api.getSchoolSubjects({school:exam.class_id.school, report_type:exam.class_id.section.report_type}).then(({data:{data}} : any) => {
                setSubjects(s => data);
            })
        }
    },[exam])


    useEffect(() => {
        if(results && exam){
            console.log('thi si sht efile')
                setExam(inputData => ({
                    ...inputData,
                    loaded: 'yes'
                  }))
                getTotalPoints();
                console.log('this is me')
        }
    }, [results])

    const printResults = () => {
        window.open('/api/exams/results-normal/'+examId, '_blank')
    }

    const printStats = () => {
        window.open('/api/exams/stats-normal?exam_id='+examId, '_blank')
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
                sum+=parseFloat(exam[el])??0
                console.log(exam[el])
            }
        }
       setPoints(s => sum)
    }

    const getRank = () => {
            api.getExamResults(examId).then(({data:{data}} : any) => {
                const sortedData = data.sort((a, b) => {
                    let lA = getSubjectTotal(a); 
                    let lB = getSubjectTotal(b); 

                    if(lA < lB) return 1; 
                    if(lA > lB) return -1; 
                    return 0; 
                } )

                sortedData.map((item, index) => {
                    item.rank = index+1; 
                    api.updateExamResult(item);

                    if(index==data.lenght-1){ 
                        window.location = window.location
                    }
                })
            })
    }




    return (
        <>
            <div className='py-3'>
                <h3>Classe : {exam?.class_id?.name} </h3>
                <h4>Examen : {exam?.name} </h4>
            </div>

            <button className='mx-3 btn btn-success' onClick={() => printResults()} > Imprimer Resultats </button>
           
           <button className='mx-3 btn btn-success' onClick={() => getRank()} > get Rank</button>

           <button className='mx-3 btn btn-success' onClick={() => setImportIsOpen(true)} > Upload Results</button>
          
           <button className='mx-3 btn btn-dark' onClick={() => printStats(true)} > Imprimer Statistics</button>
          

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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { results && subjects.length && results.map( result=> {
                    return <ExamResult  key={`exam-${result._id}`} result={result} subjects={subjects} points={points} deleteResult={deleteResult} />
                })}
                </tbody>
            </table>

            {examId && <ImportResults modalIsOpen={ImportIsOpen} closeModal={closeImportModal} save={importResults} />}
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
            return subject._id && <td key={subject._id}> <input type='number' name={`subject_${subject._id}`} style={{width:'50px'}} value={res[`subject_${subject._id}`]} onChange={handleChange} />  </td>
        })}
        <td>{total}</td>
        <th> { ((total / points) * 20).toFixed(2) } / 20 </th>
        <th> {res.rank}</th>
        <th> <Link href={`/exams/print?_id=${res._id}`}>Imprimer</Link> | <a href='javascript:void(0)' onClick={() =>deleteResult(res._id)}> Delete</a> </th>
    </tr>
}

type CreateSubjectModalProps = {
    modalIsOpen:boolean,
    subject?:any,
    closeModal: () => void,
    save:(student:any) => void
}
export function CreateSubjectModal({modalIsOpen, closeModal, save, subject}:CreateSubjectModalProps){
    const [student, setStudent] = useState<CourseInterface>({name:'', subject, point:5});

    function handleChange(e:any) {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setStudent(inputData => ({
          ...inputData,
          [key]: value
        }))
      }

      
    return (
        <div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Add Student"
          >
            <div className='modal-body'>

            <button onClick={closeModal}>close</button>
                <div className='form-group'>
                    <label>Name </label>
                    <input className='form-control' name='name' value={student?.name} onChange={handleChange}></input>
                </div>

                <div className='form-group'>
                    <label>Point </label>
                    <input className='form-control' name='point' value={student?.point} onChange={handleChange}></input>
                </div>

                <div className='from-group'>
                    <button onClick={() =>save(student)} className='btn btn-success'>Save</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}
