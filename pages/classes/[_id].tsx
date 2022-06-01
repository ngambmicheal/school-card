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
import TermInterface from "../../models/terms";
import { CSVLink } from "react-csv";


export default function ClasseDetails(){
    const [classe, setClasse] = useState<ClasseInterface>()
    const [students, setStudents] = useState<StudentInterface[]>([]);
    const [exams, setExams] = useState<ExamInterface[]>([]);
    const [terms, setTerms] = useState<TermInterface[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [examIsOpen, setExamIsOpen] = useState(false);
    const [dynamicExamIsOpen, setDynamicExamIsOpen] = useState(false);
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
            getTerms();
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
      if(confirm('Are you sure to delete?'))
      api.deleteStudent(studentId).then(() => getStudents())
    }

    const deleteExam = (examId:string) => {
      if(confirm('Are you sure to delete?'))
        api.deleteExam(examId).then(() => getExams())
    }

    const importStudent = () => {

    }

    const closeExamModal = () => {
        setExamIsOpen(s => false);
    }

    const closeDynamicExamModal = () => {
      setDynamicExamIsOpen(s => false);
      getTerms();
  }

    const closeImportModal = () => {
        setImportIsOpen(s => false);
    }

    const getExams = () => {
        api.getClasseExams(classeId).then(({data:{data}} : any) =>{
            setExams(data)
        })
    }

    const getTerms = () => {
      api.getTerms(classeId).then(({data:{data}}:any) => {
        setTerms(data)
      })
    }

    const deleteTerm = (term_id:any) => {
      if(confirm('Are you sure to delete?'))
      api.deleteTerm(term_id).then(() => getTerms())
    }

    const calculateTerm = (term_id:string) => {
      api.calculateTerm(term_id).then(() => {
        alert('done ')
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
    
    const studentHeaders = [
      { label: "Numero", key: "number" },
      { label: "Nom", key: "name" },
      { label: "Phone", key: 'phone'},
      { label: "Sex", key:'sex'},
      { label: "Id" , key: '_id'}
    ]

    return (
        <>
            <div className=''>
                Name : {classe?.name}
            </div>

            <button onClick={downloadToCsv} className='btn btn-secondary mx-3'> Download to CSV </button>
            <button onClick={downloadToPdf} className='btn btn-secondary mx-2'> Download to Pdf </button>
            
            <h3 className='mt-3'>Exams  
            <span className='pull-right'><button className='btn btn-xs btn-success' onClick={() =>setExamIsOpen(s => true)}>Add Exam</button></span>
            </h3>

            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Name</th>
                        {classe?.section?.report_type =='Maternelle' && <th>Exam Type Maternelle</th> }
                        {classe?.section?.report_type =='Nursery' && <th>Exam Type Nursery</th> }
                        {classe?.section?.report_type =='Matiere' && <th>Exam Type Normal </th> }
                        {classe?.section?.report_type =='Competence' && <th>Exam Type Competence</th>  }
                        {classe?.section?.report_type == 'Special' && <th>Exam Type Special</th> }
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map(exam => {
                    return <tr key={exam._id}>
                        <td> {exam.name} </td>
                        {classe?.section?.report_type =='Maternelle' &&  <td> <Link href={`/exams/mat/${exam._id}`}>Entree les donnees</Link></td> }
                        {classe?.section?.report_type =='Nursery' &&  <td> <Link href={`/exams/nursery/${exam._id}`}>Fill Marks</Link></td> }
                        {classe?.section?.report_type =='Matiere' && <td> <Link href={`/exams/${exam._id}`} >Entree les donnees</Link> </td> }
                        {classe?.section?.report_type =='Competence' &&  <td> <Link href={`/exams/ui/${exam._id}`} >Entree les donnees</Link> </td> }
                        {classe?.section?.report_type =='Special' &&  <td> <Link href={`/exams/special/${exam._id}`} >Entree les donnees</Link> </td> }
                        <td> <a href='javascript:void(0)'  onClick={() =>deleteExam(exam._id)}>Delete</a> </td>
                    </tr>
                    })
                }   
                </tbody>
            </table>

            <hr />

            <h3 className='mt-3'> Trimestre </h3>
            { exams.length && <span className='px-13'><button className='btn btn-xs btn-success' onClick={() =>setDynamicExamIsOpen(s => true)}> Ajouter Trimestre </button></span> }

            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Name</th>
                        {classe?.section?.report_type =='Maternelle' && <th>Exam Type Maternelle</th> }
                        {classe?.section?.report_type =='Nursery' && <th>Exam Type Maternelle</th> }
                        {classe?.section?.report_type =='Matiere' && <th>Exam Type Normal </th> }
                        {classe?.section?.report_type == 'Competence' && <th>Exam Type Competence</th> }
                        {classe?.section?.report_type == 'Special' && <th>Exam Type Special</th> }
                        <th>Action</th>

                    </tr>
                </thead>
                <tbody>
                    {terms.map(term => {
                    return <tr key={term._id}>
                        <td> {term.name} </td>
                        {classe?.section?.report_type =='Maternelle' && <td> <Link href={`/exams/mat/dynamic?term_id=${term._id}`}>Mat</Link></td> }
                        {classe?.section?.report_type =='Nursery' && <td> <Link href={`/exams/nursery/dynamic/?term_id=${term._id}`}>Nursery</Link></td> }
                        {classe?.section?.report_type =='Matiere' && <td> <Link href={`/exams/normal/dynamic?term_id=${term._id}`} >View</Link> </td> }
                        {classe?.section?.report_type =='Competence' && <td> <Link href={`/exams/ui/dynamic?term_id=${term._id}`} >UI</Link> </td>}
                        {classe?.section?.report_type =='Special' && <td> <Link href={`/exams/special/dynamic?term_id=${term._id}`} >UI/Special</Link> </td>}
                        <td> <a href='javascript:void(0)'  onClick={() =>calculateTerm(term._id)}>Calculer</a> | <a href='javascript:void(0)'  onClick={() =>deleteTerm(term._id)}>Delete</a> </td>
                    </tr>
                    })
                }   
                </tbody>
            </table>

            {classeId && <CreateExamModal modalIsOpen={examIsOpen} closeModal={closeExamModal} save={saveExam} class_id={classeId} /> }
            {classeId && <DynamicExamModal exams={exams} modalIsOpen={dynamicExamIsOpen} closeModal={closeDynamicExamModal} save={saveExam} class_id={classeId} /> }

            <h3 className='mt-3'>Students  
                <span className='pull-right'>
                    <button className='btn btn-xs btn-success mx-3' onClick={() =>setModalIsOpen(s => true)}>Add Student</button>
                    <button className='btn btn-xs btn-success mx-2' onClick={() =>setImportIsOpen(s => true)}> <i className='fa fa-upload'></i> Importer Eleve</button>
                    <CSVLink data={students} headers={studentHeaders} className='btn btn-dark mx-3' filename={"liste-des-elevles-"+classe?.name+"-"+new Date().getFullYear()+".csv"}>
                      Telecharcher liste des eleves Csv
                    </CSVLink>
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
                    return <StudentRow stud={student} key={student._id} deleteStudent={deleteStudent} terms={terms} />
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
  terms:TermInterface[]
}

export function StudentRow({stud, deleteStudent, terms}:StudentProps){
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
    <tr >
            <td>  <input style={{width:'50px'}} type='number' name='number' value={student?.number} onChange={handleChange} />  </td>
            <td>  <input className='form-control' type='text' name='name' value={student?.name} onChange={handleChange} />  </td>
            <td>  <input  style={{width:'150px'}} className='form-control' type='number' name='phone' value={student?.phone} onChange={handleChange}></input></td>
            <td>  <input  style={{width:'50px'}} type='text' name='sex' value={student?.sex} onChange={handleChange}></input></td>
            <td>  <input  style={{width:'150px'}} className='form-control' type='text' name='dob' value={student?.dob} onChange={handleChange}></input></td>
            <td>  <input  style={{width:'150px'}} type='text' name='place' value={student?.place} onChange={handleChange}></input></td>
            <td>  {hasUpdated && <a href='javascript:void(0)'  onClick={() =>updateStudent()}>Update</a> }  | 
                      <a href='javascript:void(0)'  onClick={() =>deleteStudent(student._id)}>Delete</a> | 

                      {terms.map((term, index) => {
                          return <> <a href={`/exams/dynamic/${term.report_type?.toLocaleLowerCase()}?_id=${term._id}&student_id=${student._id}`} target='_blank'> {term.name} </a>  | </>
                      })}
            </td>
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

type DynamicExamModalProps = {
  modalIsOpen:boolean,
  class_id?:any,
  closeModal: () => void,
  save:(student:any) => void, 
  exams:ExamInterface[]
}
export function DynamicExamModal({modalIsOpen, closeModal, save, class_id, exams}:DynamicExamModalProps){
  const [examSelected, setExamSelected] = useState<string[]>([]);
  const [name, setName] = useState('')

  function handleExamChange(e:any) {
      const key:string = e.target.name
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      const ex = value? [...examSelected, key] : examSelected.filter(e => e != key)
      setExamSelected(ex)
    }

  function handleChange(e:any) {
    const key = e.target.name
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setName(value)
  }
    
  
  const generate = () => {
    const report_type:string = exams[0].class_id?.section?.report_type||'Competence';
    api.saveTerm({report_type, exams:examSelected, name, class:exams[0].class_id?._id }).then(()=>{
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
             {exams.map(exam => {
               return  (<tr>
                        <td><input type='checkbox' name={exam._id} onChange={handleExamChange}></input></td>
                        <td>{exam.name}</td>
                      </tr>
               )
             })} 
            </table>
            </div>

            <br />

            <button className='btn btn-success' onClick={generate} disabled={!examSelected.length}> Generer </button>
            <button className='btn btn-dark' onClick={closeModal}>close</button>
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