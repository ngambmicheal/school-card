import { useEffect, useState } from "react";
import StudentInterface from "../../../models/student";
import Modal from 'react-modal'
import { customStyles } from "../../../services/constants";

type CreateStudentModalProps = {
    modalIsOpen:boolean,
    totalUsers:number,
    class_id?:any,
    closeModal: () => void,
    save:(student:any) => void
}
export function CreateStudentModal({modalIsOpen, closeModal, save, class_id, totalUsers}:CreateStudentModalProps){
    const [student, setStudent] = useState<StudentInterface>({class_id, name:'', number:(totalUsers+1).toString()});

    function handleChange(e:any) {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setStudent(inputData => ({
          ...inputData,
          [key]: value
        }))
      }

      useEffect(()=>{
        setStudent(inputData => ({
          ...inputData,
          number: (totalUsers+1).toString(),
          name:'',
          dob:''
        }))
      }, [totalUsers]);

      
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
                    <label>Numero </label>
                    <input className='form-control' type='number' name='number' value={student?.number} onChange={handleChange}></input>
                </div>
                <div className='form-group'>
                    <label>Name </label>
                    <input className='form-control' name='name' value={student?.name} onChange={handleChange}></input>
                </div>
                <div className='form-group'>
                    <label>Phone </label>
                    <input className='form-control' name='phone' value={student?.phone} onChange={handleChange}></input>
                </div>
                <div className='form-group'>
                    <label>Sex </label>
                    <input className='form-control' name='sex' value={student?.sex} onChange={handleChange}></input>
                </div>
                <div className='form-group'>
                    <label>Date </label>
                    <input className='form-control' name='dob' value={student?.dob} onChange={handleChange}></input>
                </div>
                <div className='from-group'>
                    <button onClick={() =>save(student)} className='btn btn-success'>Save</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}


export default function NothingName() {
  return '';
}