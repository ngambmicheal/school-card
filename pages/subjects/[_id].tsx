import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import CourseInterface from "../../models/course";
import SubjectInterface from "../../models/subject";
import api from "../../services/api";
import { customStyles } from "../../services/constants";
import Modal from 'react-modal'
import Link from 'next/link'

export default function subjectDetails(){
    const [subject, setSubject] = useState<SubjectInterface>()
    const [courses, setCourses] = useState<CourseInterface[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const router = useRouter();
    const {_id:subjectId} = router.query;

    useEffect(()=>{
        if(subjectId){
            api.getSubject(subjectId).then(({data:{data}}) => {
                setSubject(data)
            })

            getCourses()
        }
    }, [subjectId])

    const getCourses= () => {
        api.getSubjectCourses(subjectId).then(({data:{data}}:any) => {
            setCourses(s =>data)
        })
    }

    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const saveCourses = (subject:any) => {
        api.saveCourses(subject).then(() => getCourses())
        closeModal();
    }

    return (
        <>
            <div className='py-3'>
                <h3>Matiere : {subject?.name}</h3>
            </div>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une sous matiere </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Points </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => {
                       return  <tr key={course._id}>
                            <td>{course._id}</td>
                            <td>{course.name}</td>
                            <td>{course.point}</td>
                            <td><Link href={`subjects/${course._id}`}>Voir</Link></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>

           {subjectId && <CreateSubjectModal modalIsOpen={modalIsOpen} closeModal={closeModal} save={saveCourses} subject={subjectId}  /> }
        </>
    )
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
