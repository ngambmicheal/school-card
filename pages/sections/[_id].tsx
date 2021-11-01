import { useEffect, useState } from "react"
import Section from "../../models/section"
import Link from 'next/link';
import api from "../../services/api";
import SectionInterface from "../../models/section";
import Modal from 'react-modal';
import { customStyles } from "../../services/constants";
import { useRouter } from "next/dist/client/router";

export default function Sections(){
    const [sections, setSections] = useState<Section[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const router = useRouter()
    const {_id:schoolId} = router.query;

    useEffect(() => {
        if(schoolId)
        getSections()
    }, [schoolId]);


    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const getSections= () => {
        api.getSchoolSections(schoolId).then(({data:{data}} : any) => {
            setSections(s =>data)
        })
    }

    const saveSection = (student:any) => {
        api.saveSection(student).then(() => getSections())
        closeModal();
    }

    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une section </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>School</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map(section => {
                       return  <tr key={section._id}>
                            <td>{section.name}</td>
                            <td>{section.school?.name} </td>
                            <td><Link href={`/sections/${section._id}`}>Voir</Link></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>

            <CreateClassModal closeModal={closeModal} save={saveSection} modalIsOpen={modalIsOpen} />
        </>
    )
}

type CreateClassModalProps = {
    modalIsOpen:boolean,
    closeModal: () => void,
    save:(student:any) => void
}
export function CreateClassModal({modalIsOpen, closeModal, save}:CreateClassModalProps){
    const [section, setSection] = useState<SectionInterface>({ name:''});

    function handleChange(e:any) {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setSection(inputData => ({
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
            contentLabel="Add Section"
          >
            <div className='modal-body'>
            <h2 >Hello</h2>
            <button onClick={closeModal}>close</button>
                <div className='form-group'>
                    <label>Name </label>
                    <input className='form-control' name='name' value={section?.name} onChange={handleChange}></input>
                </div>

                <div className='from-group'>
                    <button onClick={() =>save(section)} className='btn btn-success'>Save</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}

