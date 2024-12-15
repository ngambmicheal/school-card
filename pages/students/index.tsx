import { useEffect, useState } from "react";
import Classe from "../../models/student";
import api from "../../services/api";
import ClasseInterface from "../../models/student";
import Modal from "react-modal";
import { CreateStudentModal } from "../classes/modals/student-forms";
import { useToast } from "@chakra-ui/react";
import { errorMessage, successMessage } from "../../utils/messages";
import Link from "../../components/link";

export default function Students() {
  const [students, setStudents] = useState<Classe[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Classe[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getStudents();
  }, []);

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const filterStudent= (e) => {
    const filter = e.target.value; 
    const filteredStudents = students.filter(student => 
      student.name.toLowerCase().includes(filter.toLowerCase()) || student.matricule?.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredStudents(filteredStudents);
  }

  const getStudents = () => {
    api.getStudents().then(({ data: { data } }: any) => {
      setStudents((s) => data);
      setFilteredStudents((s) => data);
    });
  };

  const syncPhotos = () => {
    api.syncPhotos().then((response) => {
      toast(successMessage(response.data.message));
      getStudents();
    }).catch((error) =>
      toast(errorMessage(error.response?.data?.message ?? error.message))
    );  
  }

  const saveStudent = (student: any, file:any) => {
    api
      .saveStudent(student, file)
      .then(async (response) => {
        api.uploadFile(file, 'STUDENT', response.data.data._id);

        toast(successMessage("Student Created successfully!"));
        getStudents();
      })
      .catch((error) =>
        toast(errorMessage(error.response?.data?.message ?? error.message))
      );
    closeModal();
  };

  return (
    <>
      <div style={{width:'100%'}} className='py-3 my-3'>
        <h3 className="my-3" style={{float:'left'}}>Liste des eleves </h3>
          <span className="pull-right mb-3">
            <button className="btn btn-secondary mx-3" onClick={() => syncPhotos()} >
              Sync Photos
            </button>
            <button className="btn btn-success"  onClick={() => setModalIsOpen(true)} >
              Ajouter un élève
            </button>
          </span>
      </div>

      <div  style={{maxHeight:'20%'}}>
      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th colspan='8'>
              <input placeholder="Search for student..." className='form-control' onChange={filterStudent} />
            </th>
          </tr>
          <tr>
            <th></th>
            <th>Nom</th>
            <th>Matricule</th>
            <th>Numéro de téléphone</th>
            <th>Email</th>
            <th>Sex</th>
            <th>Classe</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => {
            return (
              <tr key={student._id}>
                <td><img src={student.image} style={{height:'30px', width:'30px'}} /> </td>
                <td><Link href={`students/${student._id}`}>{student.name}</Link></td>
                <td>{student.matricule}</td>
                <td>{student.phone}</td>
                <td>{student.email}</td>
                <td>{student.sex}</td>
                <td>{student.class_id?.name} </td>
                <td>
                  <Link href={`students/${student._id}`}>Voir</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      <CreateStudentModal
        totalUsers={students.length}
        closeModal={closeModal}
        save={saveStudent}
        modalIsOpen={modalIsOpen}
      />
    </>
  );
}
