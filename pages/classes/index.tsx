import { useEffect, useState } from "react"
import Classe from "../../models/classe"
import Link from 'next/link';
import api from "../../services/api";
import ClasseInterface from "../../models/classe";
import Modal from 'react-modal';
import { customStyles } from "../../services/constants";

export default function Classes(){
    const [classes, setClasses] = useState<Classe[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        getClasses()
    }, []);


    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const getClasses= () => {
        api.getClasses().then(({data:{data}}:any) => {
            setClasses(s =>data)
        })
    }

    const saveClasse = (student:any) => {
        api.saveClasse(student).then(() => getClasses())
        closeModal();
    }

    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une classe </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map(classe => {
                       return  <tr key={classe._id}>
                            <td>{classe._id}</td>
                            <td>{classe.name}</td>
                            <td><Link href={`classes/${classe._id}`}>Voir</Link></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>

            <CreateClassModal closeModal={closeModal} save={saveClasse} modalIsOpen={modalIsOpen} />
        </>
    )
}

type CreateClassModalProps = {
    modalIsOpen:boolean,
    closeModal: () => void,
    save:(student:any) => void
}
export function CreateClassModal({modalIsOpen, closeModal, save}:CreateClassModalProps){
    const [classe, setClasse] = useState<ClasseInterface>({ name:''});

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
                <div className='form-group'>
                    <label>Name </label>
                    <input className='form-control' name='name' value={classe?.name} onChange={handleChange}></input>
                </div>

                <div className='from-group'>
                    <button onClick={() =>save(classe)} className='btn btn-success'>Save</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}

