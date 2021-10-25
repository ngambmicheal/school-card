import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import CourseInterface from "../../models/course";
import SubjectInterface from "../../models/subject";
import api from "../../services/api";
import { customStyles } from "../../services/constants";
import Modal from 'react-modal'
import Link from 'next/link'
import Subjects from "../subjects";
import StudentInterface from "../../models/student";
import ExamResultInterface from "../../models/examResult";

export default function examDetails(){
    const [exam, setExam] = useState<SubjectInterface>()
    const [courses, setCourses] = useState<CourseInterface[]>([])
    const [subjects, setSubjects] = useState<SubjectInterface[]>([])
    const [students, setStudents] = useState<StudentInterface[]>([])
    const [results, setResults] = useState<any>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const router = useRouter();
    const {_id:examId} = router.query;

    useEffect(()=>{
        if(examId){
            api.getExam(examId).then(({data:{data}}) => {
                setExam(data)
            })

            api.getExamResults(examId).then(({data:{data}}) => {
                setResults(data)
            })

            api.getSubjects().then(({data:{data}}) => {
                setSubjects(s => data);
            })

            api.getStudents().then(({data:{data}}) => {
                setStudents(s => data);
            } )

        }
    }, [examId])

    return (
        <>
            <div className='py-3'>
                <h3>Matiere :  </h3>
            </div>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une sous matiere </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Nom</th>
                        {subjects && subjects.map(s=> {
                            return <th key={s._id}> {s.name} </th>
                        })}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                { results && subjects.length && results.map( result=> {
                    return <ExamResult  key={`exam-${result._id}`} result={result} subjects={subjects} />
                })}
                </tbody>
            </table>
        </>
    )
}

export function ExamResult({subject, result, subjects}:{subjects:SubjectInterface[], result:ExamResultInterface|any, subject:SubjectInterface}){

    const [total, setTotal] = useState(0);
    const [res, setRes] = useState(result);

    useEffect(() => {
        getTotal();
        api.updateExamResult(res)
    }, [res])

    const getTotal = () => {
       const tot:any =  Object.values(res).reduce((a:any, b:any) => {
           if(a && typeof a !== 'number'){
               a = 0; 
               console.log(a)
           }
           const c = parseInt(b);
           if(c && typeof c !== NaN && c.toString().length<3){
               console.log(c)
                return a + c; 
           }
           else return a + 0; 
       });
       setTotal(s => tot)
    }
    
    const handleChange = (e) => {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setRes(inputData => ({
          ...inputData,
          [key]: value
        }))
    }
   return  <tr>
        <td>{result?.student?.name}</td>
        {subjects.map(subject => {
            return subject._id && <td key={subject._id}> <input type='number' name={`subject_${subject._id}`} style={{width:'50px'}} value={res[`subject_${subject._id}`]} onChange={handleChange} />  </td>
        })}
        <td>{total}</td>
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
