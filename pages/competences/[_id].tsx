import { useEffect, useState } from "react";
import Subject from "../../models/subject";
import Link from "next/link";
import api from "../../services/api";
import SubjectInterface from "../../models/subject";
import { customStyles } from "../../services/constants";
import Modal from "react-modal";
import SchoolInterface from "../../models/school";
import { useRouter } from "next/dist/client/router";
import CompetenceInterface from "../../models/competence";
import { useSession } from "next-auth/react";

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [competence, setCompetence] = useState<CompetenceInterface>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data: session } = useSession();

  const router = useRouter();
  const { _id: competenceId } = router.query;

  useEffect(() => {
    getSubjects();

    api.getCompetence(competenceId).then(({ data: { data } }: any) => {
      setCompetence(data);
    });
  }, [competenceId]);

  const getSubjects = () => {
    api
      .getCompetenceSubjects(competenceId)
      .then(({ data: { data, status } }: any) => {
        if (status) setSubjects((s) => data);
      });
  };

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const saveSubject = (subject: any) => {
    api.saveSubjects(subject).then(() => getSubjects());
    closeModal();
  };

  const deleteSubject = (id: any) => {
    if (confirm("Are you sure you want to delete?"))
      api.deleteSubject(id).then(() => getSubjects());
  };

  return (
    <>
      <h3> Competence : {competence?.name} </h3>
      <button className="btn btn-success" onClick={() => setModalIsOpen(true)}>
        {" "}
        Ajouter une matiere{" "}
      </button>
      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>School</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => {
            return (
              <tr key={subject._id}>
                <td>{subject._id}</td>
                <td>{subject.name}</td>
                <td>{subject.school?.name}</td>
                <td>
                  <Link href={`/subjects/${subject._id}`}>Voir</Link> |{" "}
                  {session && (
                    <a
                      className="delete-action"
                      onClick={() => deleteSubject(subject._id)}
                    >
                      Delete
                    </a>
                  )}{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {competence && (
        <CreateSubjectModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          save={saveSubject}
          school={competence.school}
          competence={competenceId}
        />
      )}
    </>
  );
}

type CreateSubjectModalProps = {
  modalIsOpen: boolean;
  class_id?: any;
  closeModal: () => void;
  save: (student: any) => void;
  competence: any;
  school: any;
};
export function CreateSubjectModal({
  modalIsOpen,
  closeModal,
  save,
  class_id,
  school,
  competence,
}: CreateSubjectModalProps) {
  const [student, setStudent] = useState<SubjectInterface>({
    name: "",
    competence: competence,
    school: school,
    report_type: "Competence",
  });

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setStudent((inputData) => ({
      ...inputData,
      [key]: value,
    }));
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Student"
      >
        <div className="modal-body">
          <h2>Add Competence</h2>
          <div className="form-group">
            <label>Name </label>
            <input
              className="form-control"
              name="name"
              value={student?.name}
              onChange={handleChange}
            ></input>
          </div>

          <div className="from-group">
            <button
              onClick={() => save(student)}
              className="btn btn-success"
              disabled={!student.school || !student.name}
            >
              Save
            </button>
            <button className="btn btn-secondary end" onClick={closeModal}>
              close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
