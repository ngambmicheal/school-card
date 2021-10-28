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
import CompetenceInterface from "../../../models/competence";

export default function examDetails(){
    const [exam, setExam] = useState<SubjectInterface>()
    const [courses, setCourses] = useState<CourseInterface[]>([])
    const [competences, setCompetences] = useState<CompetenceInterface[]>([])

    const [students, setStudents] = useState<StudentInterface[]>([])
    const [results, setResults] = useState<any>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

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

            api.getCompetences().then(({data:{data}} : any) => {
                setCompetences(s => data);
            })

            api.getStudents().then(({data:{data}} : any) => {
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
            <table className='table table-striped' >
                <thead>
                    <tr>
                        <th>Nom</th>
                        {competences && competences.map(s=> {
                            return <th key={s._id} colSpan={s.subjects?.length*4}> {s.name?.substring(0,40)} </th>
                        })}
                        <th>Total</th>
                    </tr>
                    <tr>
                        <th>

                        </th>
                        {competences && competences.map(competence=> {
                            return competence.subjects?.map(subject => {
                                return <th key={subject._id} colSpan={subject.courses?.length+1} > {subject.name?.substring(0,30)} </th>
                            })
                        })}
                    </tr>
                    <tr>
                        <th>

                        </th>
                        {competences && competences.map(competence=> {
                            return competence.subjects?.map(subject => {
                                return (
                                    <>
                                        {subject.courses?.map(course => {
                                        return <th key={course._id} > {course.name} </th>
                                        })}
                                    <th> Total </th>
                                    </>
                                )
                            })
                        })}
                    </tr>
                </thead>
                <tbody>
                { results && competences.length && results.map( result=> {
                    return <ExamResult  key={`exam-${result._id}`} result={result} competences={competences} />
                })}
                </tbody>
            </table>
        </>
    )
}

export function ExamResult({ result, competences}:{competences:CompetenceInterface[], result:ExamResultInterface|any}){

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
        {competences && competences.map(competence=> {
            return competence.subjects?.map(subject => {
                return (
                    <>
                        {subject.courses?.map(course => {
                                return course._id && <td key={course._id}> <input type='number' name={`subject_${course._id}`} style={{width:'50px'}} value={res[`subject_${course._id}`]} onChange={handleChange} />  </td>
                        })}
                    <th> Total </th>
                    </>
                )
            })
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
