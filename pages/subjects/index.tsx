import { useEffect, useState } from "react"
import Subject from "../../models/subject"
import Link from 'next/link';
import api from "../../services/api";
import SubjectInterface from "../../models/subject";
import { customStyles } from "../../services/constants";
import Modal from 'react-modal';
import SchoolInterface from "../../models/school";
import { report_types } from "../sections";
import { helperService } from "../../services";

export default function Subjects(){
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [schools, setSchools] = useState<SchoolInterface[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        getSubjects();

        api.getSchools().then(({data:{data}} : any) => {
            setSchools(data)
        })
    }, []);

    const getSubjects = () => {
        api.getSubjects().then(({data:{data}} : any) => {
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

    const deleteSubject = (subject:any) => {
        api.deleteSubject(subject).then(() => getSubjects());
    }

    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une matière </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Slug</th>
                        <th>Type</th>
                        <th>Ecole</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map(subject => {
                       return <SubjectRow subj={subject} deleteSubject={deleteSubject} />
                    })
                    }
                </tbody>
            </table>

            <CreateSubjectModal modalIsOpen={modalIsOpen} closeModal={closeModal} save={saveSubject} schools={schools}  /> 
        </>
    )
}

type SubjectProps = {
    subj:SubjectInterface,
    deleteSubject:(id:string) => void, 
  }

  
export function SubjectRow({subj, deleteSubject}:SubjectProps){
    const [subject, setSubject] = useState(subj); 
    const [hasUpdated, setHasUpdated] = useState(false)
  
  
    function handleChange(e:any) {
      const key = e.target.name
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
  
      setSubject(inputData => ({
        ...inputData,
        [key]: value
      }))
      setHasUpdated(true)
    }
  
    const updateSubject = () => {
      api.updateSubject(subject).then(() => {
        setHasUpdated(false)
      })
    }
  
    return (
        <tr key={subject._id}>
            <td>{subject._id}</td>
            <td>  <input className='form-control' type='text' name='name' value={subject?.name} onChange={handleChange} />  </td>
            <td>  <input className='form-control' type='text' name='slug' value={subject?.slug} onChange={handleChange} />  </td>
            <td>{subject.report_type}</td>
            <td>{subject.school?.name}</td>
            <td> {hasUpdated && <a href='javascript:void(0)'  onClick={() =>updateSubject()}>Update | </a> }<Link href={`subjects/${subject._id}`}>Voir</Link>  | <a href='javascript:void(0)'  onClick={() =>deleteSubject(subject._id)}>Delete</a>  </td>
        </tr>
      )
  }


type CreateSubjectModalProps = {
    modalIsOpen:boolean,
    class_id?:any,
    closeModal: () => void,
    save:(subject:any) => void,
    schools: SchoolInterface[]
}
export function CreateSubjectModal({modalIsOpen, closeModal, save, class_id, schools}:CreateSubjectModalProps){
    const [subject, setSubject] = useState<SubjectInterface>({name:'', school:helperService.getSchoolId(), report_type:'Matiere'});

    function handleChange(e:any) {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setSubject(inputData => ({
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
            contentLabel="Add Subject"
          >
            <div className='modal-body'>
            <h2 >Ajouter une matière</h2>
            <button onClick={closeModal}>fermer</button>
                <div className='form-group'>
                    <label>Nom </label>
                    <input className='form-control' name='name' value={subject?.name} onChange={handleChange}></input>
                </div>

                <div className="form-group mt-2">
                    <label>Report Type</label>
                    <select className='form-control' name='report_type'  onChange={handleChange} >
                        <option value=''> Choisir </option>
                        {report_types.map(type => {
                            return (<option key={type} value={type} selected={type==subject.report_type} > {type} </option>)
                        })}
                    </select>

                    <div className='from-group mt-2'>
                        <button onClick={() =>save(subject)} className='btn btn-success' disabled={!subject.name || !subject.report_type}>Enregistrer</button>
                    </div>
                </div>
            </div>
          </Modal>
        </div>
      );
}
