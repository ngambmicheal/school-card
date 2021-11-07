import { useEffect, useState } from "react"
import Classe from "../../models/classe"
import Link from 'next/link';
import api from "../../services/api";
import ClasseInterface from "../../models/classe";
import Modal from 'react-modal';
import { customStyles } from "../../services/constants";
import SchoolInterface from "../../models/school";
import SectionInterface from "../../models/section";

export default function Classes(){
    const [classes, setClasses] = useState<Classe[]>([])
    const [schools, setSchools] = useState<SchoolInterface[]>([])
    const [sections, setSections] = useState<SectionInterface[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        getClasses()


        api.getSchools().then(({data:{data}} : any) => {
            setSchools(data)
        })

        api.getSections().then(({data:{data}} : any) => {
            setSections(data)
        })
    }, []);


    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const getClasses= () => {
        api.getClasses().then(({data:{data}} :any) => {
            setClasses(s =>data)
        })
    }

    const saveClasse = (student:any) => {
        api.saveClasse(student).then(() => getClasses())
        closeModal();
    }

    const deleteClasse = (studentId:string) => {
        api.deleteClasse(studentId).then(() => getClasses())
    }

    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une classe </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>School</th>
                        <th>Section</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((classe:any) => {
                       return  <tr key={classe._id}>
                            <td>{classe.name}</td>
                            <td>{classe.school?.name}</td>
                            <td>{classe.section?.name}</td>
                            <td><Link href={`classes/${classe._id}`}>Voir</Link> |  <a href='javascript:void(0)'  onClick={() =>deleteClasse(classe._id)}>Delete</a></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>

            <CreateClassModal closeModal={closeModal} save={saveClasse} modalIsOpen={modalIsOpen} schools={schools} sections={sections} />
        </>
    )
}

type CreateClassModalProps = {
    modalIsOpen:boolean,
    closeModal: () => void,
    save:(student:any) => void,
    schools: SchoolInterface[],
    sections: SectionInterface[],
}
export function CreateClassModal({modalIsOpen, closeModal, save, schools, sections}:CreateClassModalProps){
    const [classe, setClasse] = useState<ClasseInterface>({ name:'', school:''});

    function handleChange(e:any) {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setClasse(inputData => ({
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
            contentLabel="Add Classe"
          >
            <div className='modal-body'>
            <h2 >Hello</h2>
            <button onClick={closeModal}>close</button>
                <div className='form-group my-3'>
                    <label>Name </label>
                    <input className='form-control' name='name' value={classe?.name} onChange={handleChange}></input>
                </div>


                <div className='form-group my-3'>
                    <label>School</label>

                    <select className='form-control' name='school'  onChange={handleChange} >
                        <option value=''> Choisir </option>
                        {schools.map(school => {
                            return (<option key={school._id} value={school._id}> {school.name} </option>)
                        })}
                    </select>
                </div>

                <div className='form-group my-3'>
                    <label>Section</label>

                    <select className='form-control' name='section'  onChange={handleChange} >
                        <option value=''> Choisir </option>
                        {sections.filter(s => s.school?._id == classe.school).map(school => {
                            return (<option key={school._id} value={school._id}> {school.name} </option>)
                        })}
                    </select>
                </div>


                <div className='from-group'>
                    <button onClick={() =>save(classe)} className='btn btn-success' disabled={!classe.school}>Save</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}

