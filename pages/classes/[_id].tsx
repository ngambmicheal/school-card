import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react"
import ClasseInterface from "../../models/classe"
import StudentInterface from "../../models/student";
import api from "../../services/api";
import Modal from 'react-modal';
import Link from 'next/link'
import { customStyles } from "../../services/constants";
import ExamInterface from "../../models/exam";
import getCsvColumns from '../../utils/getCsvColumns'
import FileUpload, { validateFiles } from '../../components/dropzone'
import {
useToast,
} from '@chakra-ui/react'
import {
    DeepMap,
    FieldError,
    useForm,
    UseFormRegister,
    UseFormSetValue,
  } from 'react-hook-form'


export default function ClasseDetails(){
    const [classe, setClasse] = useState<ClasseInterface>()
    const [students, setStudents] = useState<StudentInterface[]>([]);
    const [exams, setExams] = useState<ExamInterface[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [examIsOpen, setExamIsOpen] = useState(false);
    const [ImportIsOpen, setImportIsOpen] = useState(false);
    const router = useRouter()
    const {_id:classeId} = router.query;

    useEffect(()=>{
        if(classeId){
            api.getClasse(classeId).then(({data:{data}} : any) => {
                setClasse(data);
            })
            getStudents();
            getExams();
        }
    }, [classeId])
    

    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const getStudents = () => {
        api.getClasseStudents(classeId).then(({data:{data}} : any) =>{
            setStudents(data)
        })
    }

    const saveStudent = (student:any) => {
        api.saveStudent(student).then(() => getStudents())
        closeModal();
    }

    const deleteStudent = (studentId:string) => {
      api.deleteStudent(studentId).then(() => getStudents())
    }

    const deleteExam = (examId:string) => {
      api.deleteExam(examId).then(() => getExams())
    }

    const importStudent = () => {

    }

    const closeExamModal = () => {
        setExamIsOpen(s => false);
    }

    const closeImportModal = () => {
        setImportIsOpen(s => false);
    }

    const getExams = () => {
        api.getClasseExams(classeId).then(({data:{data}} : any) =>{
            setExams(data)
        })
    }

    const saveExam = (exam:any) => {
        api.saveExam(exam).then(() => getExams())
        closeExamModal();
    }

    const downloadToCsv = () => {
      api.downloadToCsv(classeId)
    }

    const downloadToPdf = () => {
      api.downloadToPdf(classeId)
    }
    

    return (
        <>
            <div className=''>
                Name : {classe?.name}
            </div>

            <button onClick={downloadToCsv} className='btn btn-secondary mx-3'> Download to CSV </button>
            <button onClick={downloadToPdf} className='btn btn-secondary mx-2'> Download to Pdf </button>
            
            <h3 className='mt-3'>Exams  <span className='pull-right'><button className='btn btn-xs btn-success' onClick={() =>setExamIsOpen(s => true)}>Add Exam</button></span></h3>

            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Exam Type Maternelle</th>
                        <th>Exam Type Normal </th>
                        <th>Exam Type Competence</th> 
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map(exam => {
                    return <tr key={exam._id}>
                        <td> {exam.name} </td>
                        <td> <Link href={`/exams/mat/${exam._id}`}>Mat</Link></td>
                        <td> <Link href={`/exams/${exam._id}`} >View</Link> </td>
                        <td> <Link href={`/exams/ui/${exam._id}`} >UI</Link> </td>
                        <td> <a href='javascript:void(0)'  onClick={() =>deleteExam(exam._id)}>Delete</a> </td>
                    </tr>
                    })
                }   
                </tbody>
            </table>

            {classeId && <CreateExamModal modalIsOpen={examIsOpen} closeModal={closeExamModal} save={saveExam} class_id={classeId} /> }



            <h3 className='mt-3'>Students  
                <span className='pull-right'>
                    <button className='btn btn-xs btn-success mx-3' onClick={() =>setModalIsOpen(s => true)}>Add Student</button>
                    <button className='btn btn-xs btn-success mx-2' onClick={() =>setImportIsOpen(s => true)}> <i className='fa fa-upload'></i> Importer Eleve</button>
                </span>
            </h3>

            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>No </th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Sex</th>
                        <th>Age</th> 
                        <th>Lieu</th>
                        <th> Action </th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => {
                    return <StudentRow stud={student} key={student._id} deleteStudent={deleteStudent} />
                    })
                }   
                </tbody>
            </table>

            {classeId && <CreateStudentModal modalIsOpen={modalIsOpen} closeModal={closeModal} save={saveStudent} class_id={classeId} totalUsers={students.length} /> }
            {classeId && <ImportStudents modalIsOpen={ImportIsOpen} closeModal={closeImportModal} save={importStudent} class_id={classeId} />}

        </>
    )
}

type StudentProps = {
  stud:StudentInterface,
  deleteStudent:(id:string) => void, 
}

export function StudentRow({stud, deleteStudent}:StudentProps){
  const [student, setStudent] = useState(stud); 
  const [hasUpdated, setHasUpdated] = useState(false)


  function handleChange(e:any) {
    const key = e.target.name
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value

    setStudent(inputData => ({
      ...inputData,
      [key]: value
    }))
    setHasUpdated(true)
  }

  const updateStudent = () => {
    api.updateStudent(student).then(() => {
      setHasUpdated(false)
    })
  }

  return (
    student._id && <tr >
            <td>  <input style={{width:'50px'}} type='number' name='number' value={student?.number} onChange={handleChange} />  </td>
            <td>  <input className='form-control' type='text' name='name' value={student?.name} onChange={handleChange} />  </td>
            <td>  <input  style={{width:'150px'}} className='form-control' type='number' name='phone' value={student?.phone} onChange={handleChange}></input></td>
            <td>  <input  style={{width:'50px'}} type='text' name='sex' value={student?.sex} onChange={handleChange}></input></td>
            <td>  <input  style={{width:'150px'}} className='form-control' type='text' name='dob' value={student?.dob} onChange={handleChange}></input></td>
            <td>  <input  style={{width:'150px'}} type='text' name='place' value={student?.place} onChange={handleChange}></input></td>
            <td>  {hasUpdated && <a href='javascript:void(0)'  onClick={() =>updateStudent()}>Update</a> }  | <a href='javascript:void(0)'  onClick={() =>deleteStudent(student._id)}>Delete</a></td>
        </tr>
    )
}

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

export function ImportStudents({modalIsOpen, closeModal, class_id}:any){
    const [file, setFile] = useState<File|null>(null);
    const [values, setValues] = useState();
    const [submitBtn, setSubmitBtn] = useState(false)

    return <>
        <Modal 
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Add Exam">
            
            <div className='modal-body'>
                <div className='row'>
                    <UploadFile file={file} setFile={setFile} values={values}></UploadFile>
                </div>
                <div className='row'>
                    {file && <MapColumns file={file} setValue={setValues} values={values} setFile={setFile} submitBtn={submitBtn} setSubmitBtn={setSubmitBtn} /> }
                </div>
                <div className='row'>
                    {values && <Submit file={file} setFile={setFile} values={values} class_id={class_id} submitBtn={submitBtn} />}
                </div>
            </div>

        </Modal>
    </>
}

type UploadFileStepProps = {
    file: File | null
    setFile: (f: File) => void,
    values:any
  }
  
export function UploadFile(props: UploadFileStepProps) {
    const { setFile, file, } = props
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
      } = useForm<any>({
        defaultValues: { leadFieldToCsvColumn: {} },
      })
  
    const [debounce, setDebounce] = useState(true)
  
    useEffect(() => {
      setDebounce(false)
    }, [debounce])
  
    return (
        <FileUpload
          accept={'.csv'}
          register={register('file_', { validate: validateFiles })}
          onChange={(files) => {
            if (debounce) {
              setDebounce(false)
              return
            }
  
            setFile(files[0])
          }}
        >
          <div className="full-width">
            <button className='btn' style={{width:'80%', height:'80%', minWidth:'150px', minHeight:'150px'}}>
              {file ? file.name : 'Select File'}
            </button>
          </div>
        </FileUpload>
    )
  }
  
  type MapColumnsProps = UploadFileStepProps & {
    file: File,
    setValue: (s:any) => void,
    values: any,
    submitBtn:boolean,
    setSubmitBtn: (s:boolean) => void, 
  }
  
  function MapColumns(props: MapColumnsProps) {
    const { file, setValue, values, submitBtn, setSubmitBtn } = props
  
    const [csvColumns, setCsvColumns] = useState<string[]>([])
  
    useEffect(() => {
      getCsvColumns(file).then(setCsvColumns)
    }, [file])
  
    return (
        <>
        <h5>Map CSV columns to Soft Lead fields</h5>
        <table className='table'>
          <thead>
            <tr>
              <th>Field</th>
              <th>CSV Column</th>
            </tr>
          </thead>
          <tbody>
            {generateColumns({
              leadFields: ['name', 'email', 'dob', 'phone','number','sex'],
              foundFields: csvColumns,
              setValue,
              values: values,
              submitBtn:submitBtn, 
              setSubmitBtn: setSubmitBtn
            })}
                    <tr>
           <td colSpan={2}> <button className='btn btn-success' onClick={() => setSubmitBtn(true)}> Envoyer </button> </td>
        </tr>
          </tbody>
        </table>
        </>
    )
  }
  
  type GenerateColumnsProps = {
    leadFields: string[]
    foundFields: string[]
    setValue: (s:any) => void,
    values: any,
    submitBtn :boolean, 
    setSubmitBtn : (s:boolean) => void, 
  }
  
  function generateColumns(props: GenerateColumnsProps) {
    const { leadFields, foundFields, setValue, values, setSubmitBtn, submitBtn } = props
  
    return leadFields.map((f) => {
      const field = f.replace(/_/g, ' ')
  
      return (
        <>
        <tr key={`field/${field}`}>
          <td>{field}</td>
          <td>
            <select className='form-control'
              value={values && values[field]}
              onChange={(e) =>
                setValue({...values, [field]:e.target.value})
              }
            >
              <option value={undefined}></option>
              {foundFields.map((op) => (
                <option value={op} key={`field/${field}/${op}`}>
                  {op}
                </option>
              ))}
            </select>
          </td>
        </tr>

        </>
      )
    })
  }
  
  function Submit(props: UploadFileStepProps & {class_id:any, submitBtn:boolean}) {
    const { values , file, class_id, submitBtn} = props
  
    const router = useRouter()

    const toast = useToast()
  
    useEffect(() => {
      
      if(submitBtn){
        toast({
          status: 'info',
          title: 'Importing leads',
          description: 'this can take a very (very) long time... please be patient',
          isClosable: true,
        })
    
        api.importStudents({
            file: file,
            mapping: values,
            class_id:class_id,
          })
          .then((data) => {
            toast({
              status: 'success',
              title: 'Successfully imported leads',
              description: `Loaded `,
            })
    
            setTimeout(() => router.push('/soft-leads'), 2000)
          })
          .catch((e) => {
            console.log(e)
            toast({
              status: 'error',
              title: typeof e === 'string' ? e : 'Failed to import leads',
              description: e.error??e.toString(),
              isClosable: true,
            })

          })
      }
    }, [
      file,
      submitBtn
    ])
  
    return (
      <div>
          Uploading ...
      </div>
    )
  }