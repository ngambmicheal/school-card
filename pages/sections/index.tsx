import { useEffect, useState } from "react"
import Section from "../../models/section"
import Link from 'next/link';
import api from "../../services/api";
import SectionInterface from "../../models/section";
import { customStyles } from "../../services/constants";
import Modal from 'react-modal';
import SchoolInterface from "../../models/school";

export default function Sections(){
    const [sections, setSections] = useState<Section[]>([])
    const [schools, setSchools] = useState<SchoolInterface[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        getSections();
        api.getSchools().then(({data:{data}} : any) => {
            setSchools(data)
        })

    }, []);

    const getSections = () => {
        api.getSections().then(({data:{data}} :any) => {
            setSections(s =>data)
        })
    }

    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const saveSection = (section:any) => {
        api.saveSections(section).then(() => getSections())
        closeModal();
    }

    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une section </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Ecole</th>
                        <th>Type de Bullentin</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map(section => {
                       return  <tr key={section._id}>
                            <td>{section.name}</td>
                            <td>{section.school?.name}</td>
                            <th>{section.report_type}</th>
                            <td><Link href={`sections/${section._id}`}>Voir</Link></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>

            <CreateSectionModal modalIsOpen={modalIsOpen} closeModal={closeModal} save={saveSection} schools={schools}  /> 
        </>
    )
}

type CreateSectionModalProps = {
    modalIsOpen:boolean,
    class_id?:any,
    closeModal: () => void,
    save:(student:any) => void,
    schools:SectionInterface[]
}
export function CreateSectionModal({modalIsOpen, closeModal, save, class_id, schools}:CreateSectionModalProps){
    const [student, setStudent] = useState<SectionInterface>({name:''});
    const report_types = ['Competence', 'Matiere', 'Maternelle'];

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
                    <label>Type de Bulletin</label>

                    <select className='form-control' name='report_type'  onChange={handleChange} >
                        <option value=''> Choisir </option>
                        {report_types.map(type => {
                            return (<option key={type} value={type}> {type} </option>)
                        })}
                    </select>
                </div>

                <div className='from-group'>
                    <button onClick={() =>save(student)} className='btn btn-success'>Save</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}
