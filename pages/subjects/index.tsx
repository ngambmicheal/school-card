import { useEffect, useState } from "react"
import Subject from "../../models/subject"
import Link from 'next/link';
import api from "../../services/api";
import SubjectInterface from "../../models/subject";
import { customStyles } from "../../services/constants";
import Modal from 'react-modal';
import SchoolInterface from "../../models/school";

export default function Subjects(){
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [schools, setSchools] = useState<SchoolInterface[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        getSubjects();

        api.getSchools().then(({data:{data}}) => {
            setSchools(data)
        })
    }, []);

    const getSubjects = () => {
        api.getSubjects().then(({data:{data}}:any) => {
            setSubjects(s =>data)
        })
    }

    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const saveSubject = (subject:any) => {
        api.saveSubjects(subject).then(() => getSubjects())
        closeModal();
    }

    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une matiere </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>School</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map(subject => {
                       return  <tr key={subject._id}>
                            <td>{subject._id}</td>
                            <td>{subject.name}</td>
                            <td>{subject.school?.name}</td>
                            <td><Link href={`subjects/${subject._id}`}>Voir</Link></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>

            <CreateSubjectModal modalIsOpen={modalIsOpen} closeModal={closeModal} save={saveSubject} schools={schools}  /> 
        </>
    )
}

type CreateSubjectModalProps = {
    modalIsOpen:boolean,
    class_id?:any,
    closeModal: () => void,
    save:(student:any) => void,
    schools: SchoolInterface[]
}
export function CreateSubjectModal({modalIsOpen, closeModal, save, class_id, schools}:CreateSubjectModalProps){
    const [student, setStudent] = useState<SubjectInterface>({name:'', school:''});

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
            <h2 >Hello</h2>
            <button onClick={closeModal}>close</button>
                <div className='form-group'>
                    <label>Name </label>
                    <input className='form-control' name='name' value={student?.name} onChange={handleChange}></input>
                </div>

                <div className='form-group'>
                    <label>School</label>
                    <select className='form-control' name='school' value={student?.school} onChange={handleChange} >
                        {schools.map(school => {
                            return (<option key={school._id} value={school._id}> {school.name} </option>)
                        })}
                    </select>
                </div>

                <div className='from-group'>
                    <button onClick={() =>save(student)} className='btn btn-success' disabled={!student.school}>Save</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}
