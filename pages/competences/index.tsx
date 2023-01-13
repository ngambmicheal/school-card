import { useEffect, useState } from "react";
import Competence from "../../models/competence";
import Link from "next/link";
import api from "../../services/api";
import CompetenceInterface from "../../models/competence";
import { customStyles } from "../../services/constants";
import Modal from "react-modal";
import SchoolInterface from "../../models/school";
import { report_types } from "../sections";
import { helperService } from "../../services";
import { useSession } from "next-auth/react";

export default function Competences() {
  const [competences, setCompetences] = useState<Competence[]>([]);
  const [schools, setSchools] = useState<SchoolInterface[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    getCompetences();
  }, []);

  const getCompetences = () => {
    api.getCompetences().then(({ data: { data } }: any) => {
      setCompetences((s) => data);
    });
  };

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const saveCompetence = (competence: any) => {
    api.saveCompetences(competence).then(() => {
      api.sync();
      getCompetences();
    });
    closeModal();
  };

  const deleteCompetence = (id: any) => {
    api.deleteCompetence(id).then(() => getCompetences());
  };

  function handleChange(e: any, competence_id: string) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    api.updateCompentence({ _id: competence_id, report_type: e.target.value });
  }

  return (
    <>
      {session && (
        <button
          className="btn btn-success"
          onClick={() => setModalIsOpen(true)}
        >
          {" "}
          Ajouter une Competence{" "}
        </button>
      )}

      <h3 className="my-4">Liste des competences</h3>
      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Type de Bulletin</th>
            <th>Slug</th>
            <th>Ecole</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {competences.map((competence) => {
            return (
              <CompetenceRow
                session={session}
                deleteCompetence={deleteCompetence}
                compt={competence}
              />
            );
          })}
        </tbody>
      </table>

      <CreateCompetenceModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        save={saveCompetence}
        session={session}
        schools={schools}
      />
    </>
  );
}

type CreateCompetenceModalProps = {
  modalIsOpen: boolean;
  class_id?: any;
  closeModal: () => void;
  save: (student: any) => void;
  schools: SchoolInterface[];
  session: any;
};
export function CreateCompetenceModal({
  modalIsOpen,
  closeModal,
  save,
  class_id,
  schools,
  session,
}: CreateCompetenceModalProps) {
  const [student, setStudent] = useState<CompetenceInterface>({
    name: "",
    school: helperService.getSchoolId() ?? undefined,
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
          <h2>Ajouter une Competence </h2>
          <div className="form-group">
            <label>Nom </label>
            <input
              className="form-control"
              name="name"
              value={student?.name}
              onChange={handleChange}
            ></input>
          </div>

          <div className="from-group mt-3">
            <button
              onClick={() => save(student)}
              className="btn btn-success"
              disabled={!student.school && !student.name}
            >
              Enregistrer
            </button>
            <button onClick={closeModal} className="end btn btn-secondary">
              fermer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

type CompetenceProps = {
  compt: CompetenceInterface;
  deleteCompetence: (id: any) => void;
  session: any;
};

export function CompetenceRow({
  compt,
  deleteCompetence,
  session,
}: CompetenceProps) {
  const [competence, setCompetence] = useState(compt);
  const [hasUpdated, setHasUpdated] = useState(false);

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setCompetence((inputData) => ({
      ...inputData,
      [key]: value,
    }));
    setHasUpdated(true);
  }

  const updateCompentence = () => {
    api.updateCompentence(competence).then(() => {
      setHasUpdated(false);
    });
  };

  return (
    <tr key={competence._id}>
      <td>{competence._id}</td>
      <td>
        {" "}
        <input
          className="form-control"
          type="text"
          name="name"
          value={competence?.name}
          onChange={handleChange}
        />{" "}
      </td>
      <td>
        <select
          className="form-control"
          name="report_type"
          onChange={handleChange}
          value={competence.report_type}
        >
          <option value=""> Choisir </option>
          {report_types.map((type) => {
            return (
              <option key={type} value={type}>
                {" "}
                {type}{" "}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        {" "}
        <input
          className="form-control"
          type="text"
          name="slug"
          value={competence?.slug}
          onChange={handleChange}
        />{" "}
      </td>
      <td>{competence.school?.name}</td>
      <td>
        {" "}
        {hasUpdated && session && (
          <a className="update-action" onClick={() => updateCompentence()}>
            Update |{" "}
          </a>
        )}
        <Link href={`competences/${competence._id}`}>Voir</Link> |{" "}
        <a
          className="delete-action"
          onClick={() => deleteCompetence(competence._id)}
        >
          Delete
        </a>
      </td>
    </tr>
  );
}
