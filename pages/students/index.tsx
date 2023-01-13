import { useEffect, useState } from "react";
import Classe from "../../models/student";
import Link from "next/link";
import api from "../../services/api";
import ClasseInterface from "../../models/student";
import Modal from "react-modal";
import { customStyles } from "../../services/constants";
import { CreateStudentModal } from "../classes/modals/student-forms";
import { useToast } from "@chakra-ui/react";
import { errorMessage, successMessage } from "../../utils/messages";

export default function Students() {
  const [students, setStudents] = useState<Classe[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getStudents();
  }, []);

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const getStudents = () => {
    api.getStudents().then(({ data: { data } }: any) => {
      setStudents((s) => data);
    });
  };

  const saveStudent = (student: any) => {
    api
      .saveStudent(student)
      .then(() => {
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
      <button className="btn btn-success" onClick={() => setModalIsOpen(true)}>
        {" "}
        Ajouter un élève{" "}
      </button>
      <h3 className="my-3">Liste des eleves</h3>
      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Matricule</th>
            <th>Numéro de téléphone</th>
            <th>Email</th>
            <th>Classe</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            return (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.matricule}</td>
                <td>{student.phone}</td>
                <td>{student.email}</td>
                <td>{student.class_id?.name} </td>
                <td>
                  <Link href={`students/${student._id}`}>Voir</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <CreateStudentModal
        totalUsers={students.length}
        closeModal={closeModal}
        save={saveStudent}
        modalIsOpen={modalIsOpen}
      />
    </>
  );
}
