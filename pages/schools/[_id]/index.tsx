import { useEffect, useState } from "react"
import Classe from "../../../models/classe"
import Link from 'next/link';
import api from "../../../services/api";
import ClasseInterface from "../../../models/classe";
import Modal from 'react-modal';
import { customStyles } from "../../../services/constants";
import { useRouter } from "next/dist/client/router";
import SectionInterface from "../../../models/section";
import { CSVLink } from "react-csv";
import { helperService } from "../../../services";
import { useSession } from "next-auth/react";
import useSchool from "../../../hooks/useSchool";

export default function Classes(){
    const [classes, setClasses] = useState<Classe[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [sections, setSections] = useState<SectionInterface[]>([])
    const session = useSession();

    const router = useRouter()
    const {_id:schoolId} = router.query;

    useEffect(() => {
        if(schoolId){
            getClasses()
        }

        api.getSections().then(({data:{data}} : any) => {
            setSections(data)
        })

    }, [schoolId]);


    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const getClasses= () => {
        api.getSchoolClasses(schoolId).then(({data:{data}} : any) => {
            setClasses(s =>data)
        })
    }

    const saveClasse = (student:any) => {
        api.saveClasse(student).then(() => getClasses())
        closeModal();
    }

    const deleteClass = (classId:string) => {
        if(confirm('Are you sure to delete?'))
          api.deleteClasse(classId).then(() => getClasses())
      }
  

    const chooseSchool = () => {
        helperService.saveSchoolId(schoolId as unknown as string)
        window.location.reload();
    }
    const headers =  [
        { label: "Nom", key: "name" },
        { label: "Ecole", key: "school.name" },
        { label: "Section", key: "section"}
      ];

    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter une classe </button>
            <CSVLink data={classes} headers={headers} className='btn btn-dark mx-3' filename={"liste-des-classes-csv"+new Date().getFullYear()+".csv"}>
            Telecharcher Csv
            </CSVLink>
            <Link href={`/schools/${schoolId}/settings`}><button className="btn btn-dark mx-2">Settings</button></Link>

            <br/>

            <h4 className="h3">Classes</h4>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>School</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map(classe => {
                       return  <tr key={classe._id}>
                            <td>{classe.name}</td>
                            <td>{classe.school?.name} </td>
                            <td><Link href={`/classes/${classe._id}`}>Voir</Link> { session.data &&  <a className="delete-action"  onClick={() =>deleteClass(classe._id as string)}> | Delete</a> }</td>
                        </tr>
                    })
                    }
                </tbody>
            </table>

            <CreateClassModal closeModal={closeModal} save={saveClasse} modalIsOpen={modalIsOpen} sections={sections} schoolId={schoolId}/>
        </>
    )
}

type CreateClassModalProps = {
    modalIsOpen:boolean,
    closeModal: () => void,
    save:(student:any) => void,
    sections:SectionInterface[],
    schoolId:any
}
export function CreateClassModal({modalIsOpen, closeModal, save,sections, schoolId}:CreateClassModalProps){
    const [classe, setClasse] = useState<ClasseInterface>({ name:'',teacher:'', school:helperService.getSchoolId()??undefined});

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
            <button className='btn btn-secondary end' onClick={closeModal}>close</button>
                <div className='form-group'>
                    <label>Name </label>
                    <input className='form-control' name='name' value={classe?.name} onChange={handleChange}></input>
                </div>

                <div className='form-group my-3'>
                    <label>Section</label>

                    <select className='form-control' name='section'  onChange={handleChange} >
                        <option value=''> Choisir </option>
                        {sections.map(school => {
                            return (<option key={school._id} value={school._id}> {school.name} </option>)
                        })}
                    </select>
                </div>

                <div className='from-group'>
                    <button onClick={() =>save(classe)} className='btn btn-success'>Save</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}

