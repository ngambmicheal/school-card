import { useEffect, useState } from "react"
import School from "../../models/school"
import Link from 'next/link';
import api from "../../services/api";
import SchoolInterface from "../../models/school";
import { customStyles } from "../../services/constants";
import Modal from 'react-modal';
import { helperService } from "../../services";

export default function Schools(){
    const [schools, setSchools] = useState<School[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        getSchools();
    }, []);

    const getSchools = () => {
        api.getSchools().then(({data:{data}} :any) => {
            setSchools(s =>data)
        })
    }

    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const saveSchool = (school:any) => {
        api.saveSchools(school).then(() => getSchools())
        closeModal();
    }

    const chooseSchool = (schoolId:string) => {
        helperService.saveSchoolId(schoolId); 
        window.location = '/schools/'+schoolId
      }

    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une ecole </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {schools.map(school => {
                       return  <tr key={school._id}>
                            <td>{school.name}</td>
                            <td><i className="glyphicon glyphicon-eye"></i><a href='#' onClick={() => school._id && chooseSchool(school._id)}> Choisir </a></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>

            <CreateSchoolModal modalIsOpen={modalIsOpen} closeModal={closeModal} save={saveSchool}  /> 
        </>
    )
}

type CreateSchoolModalProps = {
    modalIsOpen:boolean,
    class_id?:any,
    closeModal: () => void,
    save:(student:any) => void
}
export function CreateSchoolModal({modalIsOpen, closeModal, save, class_id}:CreateSchoolModalProps){
    const [student, setStudent] = useState<SchoolInterface>({name:''});

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
            <h2 >Ajouter une ecole</h2>
            <button onClick={closeModal}>fermer</button>
                <div className='form-group'>
                    <label>Nom </label>
                    <input className='form-control' name='name' value={student?.name} onChange={handleChange}></input>
                </div>

                <div className='from-group'>
                    <button onClick={() =>save(student)} className='btn btn-success'>Enregistrer</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}
