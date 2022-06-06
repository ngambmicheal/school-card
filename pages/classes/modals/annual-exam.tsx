import { useState } from "react";
import ExamInterface from "../../../models/exam";
import Modal from 'react-modal';
import { customStyles } from "../../../services/constants";
import TermInterface, { reportType } from "../../../models/terms";
import api from "../../../services/api";

type CreateExamModalProps = {
    modalIsOpen:boolean,
    class_id?:any,
    closeModal: () => void,
    save:(student:any) => void
}
export function CreateExamModal({modalIsOpen, closeModal, save, class_id}:CreateExamModalProps){
    const [exam, setExam] = useState<ExamInterface>({class_id, name:''});

    function handleChange(e:any) {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setExam(inputData => ({
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
            contentLabel="Add Exam"
          >
            <div className='modal-body'>
            <h2 >Hello</h2>
            <button onClick={closeModal}>close</button>
                <div className='form-group'>
                    <label> Name </label>
                    <input className='form-control' name='name' value={exam?.name} onChange={handleChange}></input>
                </div>

                <div className='from-group'>
                    <button onClick={() =>save(exam)} className='btn btn-success'>Save</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}


type AnnualExamModalProps = {
  modalIsOpen:boolean,
  class_id?:any,
  closeModal: () => void,
  save:(student:any) => void, 
  terms:TermInterface[],
  report_type:reportType | undefined
}
export function AnnualExamModal({modalIsOpen, closeModal, save, class_id, terms, report_type}:AnnualExamModalProps){
  const [termSelected, setTermSelected] = useState<string[]>([]);
  const [name, setName] = useState('')

  function handleTermChange(e:any) {
      const key:string = e.target.name
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      const ex = value? [...termSelected, key] : termSelected.filter(e => e != key)
      setTermSelected(ex)
    }

  function handleChange(e:any) {
    const key = e.target.name
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setName(value)
  }
    
  
  const generate = () => {
    api.saveAnnualExam({report_type, terms:termSelected, name, class:terms[0].class?._id??terms[0].class }).then(()=>{
      closeModal()
    })
  }

    
  return (
      <div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="select Exams"
        >
          <div className='modal-body'>
          <h2 >Ajoute Trimestre</h2>
          <div>
            <div className='form-group'>
              <input type='' className='form-control' onChange={handleChange} />
            </div>
            <table style={{width:'100%'}} className='table1'>
              <tr>
                <th>Select</th>
                <th>Exam</th>
              </tr>
             {terms.map(exam => {
               return  (<tr>
                        <td><input type='checkbox' name={exam._id} onChange={handleTermChange}></input></td>
                        <td>{exam.name}</td>
                      </tr>
               )
             })} 
            </table>
            </div>

            <br />

            <button className='btn btn-success' onClick={generate} disabled={termSelected.length<2}> Generer </button>
            <button className='btn btn-dark' onClick={closeModal}>close</button>
          </div>
        </Modal>
      </div>
    );
}


export default function () {
  return '';
}