import { useEffect, useState } from "react"
import Competence from "../../models/competence"
import Link from 'next/link';
import api from "../../services/api";
import CompetenceInterface from "../../models/competence";
import { customStyles } from "../../services/constants";
import Modal from 'react-modal';
import SchoolInterface from "../../models/school";
import { report_types } from "../sections";

export default function Competences(){
    const [competences, setCompetences] = useState<Competence[]>([])
    const [schools, setSchools] = useState<SchoolInterface[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        getCompetences();

        api.getSchools().then(({data:{data}, status} : any) => {
            setSchools(data)
        })
    }, []);

    const getCompetences = () => {
        api.getCompetences().then(({data:{data}} :any) => {
            setCompetences(s =>data)
        })
    }

    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const saveCompetence = (competence:any) => {
        api.saveCompetences(competence).then(() => getCompetences())
        closeModal();
    }

    const deleteCompetence = (id:any) => {
        api.deleteCompetence(id).then(() => getCompetences())
    }

    function handleChange(e:any, competence_id:string) {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        api.updateCompentence({_id:competence_id, report_type:e.target.value})
      }
      


    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une Competence </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Type de Bulletin</th>
                        <th>Slug</th>
                        <th>Ecole</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {competences.map(competence => {
                       return  <CompetenceRow deleteCompetence={deleteCompetence} compt={competence} />
                    })
                    }
                </tbody>
            </table>

            <CreateCompetenceModal modalIsOpen={modalIsOpen} closeModal={closeModal} save={saveCompetence} schools={schools}  /> 
        </>
    )
}

type CreateCompetenceModalProps = {
    modalIsOpen:boolean,
    class_id?:any,
    closeModal: () => void,
    save:(student:any) => void,
    schools: SchoolInterface[]
}
export function CreateCompetenceModal({modalIsOpen, closeModal, save, class_id, schools}:CreateCompetenceModalProps){
    const [student, setStudent] = useState<CompetenceInterface>({name:'', school:''});

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
            <h2 >Ajouter une Competence </h2>
            <button onClick={closeModal}>fermer</button>
                <div className='form-group'>
                    <label>Nom </label>
                    <input className='form-control' name='name' value={student?.name} onChange={handleChange}></input>
                </div>

                <div className='form-group'>
                    <label>Ecole</label>
                    <select className='form-control' name='school' value={student?.school} onChange={handleChange} >
                        {schools.map(school => {
                            return (<option key={school._id} value={school._id}> {school.name} </option>)
                        })}
                    </select>
                </div>

                <div className='from-group'>
                    <button onClick={() =>save(student)} className='btn btn-success' disabled={!student.school}>Enregistrer</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}


type CompetenceProps = {
    compt:CompetenceInterface,
    deleteCompetence:(id:any) => void, 
}


export function CompetenceRow({compt, deleteCompetence}:CompetenceProps){
    const [competence, setCompetence] = useState(compt); 
    const [hasUpdated, setHasUpdated] = useState(false)
  
  
    function handleChange(e:any) {
      const key = e.target.name
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
  
      setCompetence(inputData => ({
        ...inputData,
        [key]: value
      }))
      setHasUpdated(true)
    }
  
    const updateCompentence = () => {
      api.updateCompentence(competence).then(() => {
        setHasUpdated(false)
      })
    }
  
    return (
        <tr key={competence._id}>
            <td>{competence._id}</td>
            <td>  <input className='form-control' type='text' name='name' value={competence?.name} onChange={handleChange} />  </td>
            <td>
                <select className='form-control' name='report_type'  onChange={handleChange} >
                    <option value=''> Choisir </option>
                    {report_types.map(type => {
                        return (<option key={type} value={type} selected={type==competence.report_type}> {type} </option>)
                    })}
                </select>
            </td>
            <td>  <input className='form-control' type='text' name='slug' value={competence?.slug} onChange={handleChange} />  </td>
            <td>{competence.school?.name}</td>
            <td> {hasUpdated && <a href='javascript:void(0)'  onClick={() =>updateCompentence()}>Update | </a> }<Link href={`competences/${competence._id}`}>Voir</Link> | <a href='javascript:void(0)'  onClick={() =>deleteCompetence(competence._id)}>Delete</a></td>
        </tr>
      )
  }
