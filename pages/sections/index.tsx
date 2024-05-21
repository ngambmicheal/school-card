import { useEffect, useState } from "react";
import Section from "../../models/section";
import Link from "next/link";
import api from "../../services/api";
import SectionInterface from "../../models/section";
import { customStyles } from "../../services/constants";
import Modal from "react-modal";
import SchoolInterface from "../../models/school";
import useSchool from "../../hooks/useSchool";
import { helperService } from "../../services";
import { useSession } from "next-auth/react";

export const report_types = [
  "Competence",
  "Matiere",
  "Maternelle",
  "Nursery",
  "Special",
];
export default function Sections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [schools, setSchools] = useState<SchoolInterface[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    getSections();
    api.getSchools().then(({ data: { data } }: any) => {
      setSchools(data);
    });
  }, []);

  const getSections = () => {
    api.getSections().then(({ data: { data } }: any) => {
      setSections((s) => data);
    });
  };

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const saveSection = (section: any) => {
    api.saveSections(section).then(() => getSections());
    closeModal();
  };

  const deleteSection = (section: string) => {
    if (confirm("Are you sure you want to delete ?"))
      api.deleteSection(section).then(() => getSections());
  };

  return (
    <>
      <button className="btn btn-success" onClick={() => setModalIsOpen(true)}>
        {" "}
        Ajouter une section{" "}
      </button>
      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Ecole</th>
            <th>Type de Bullentin</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => {
            return (
              <tr key={section._id}>
                <td>{section.name}</td>
                <td>{section.school?.name}</td>
                <th>{section.report_type}</th>
                <td>
                  <Link href={`sections/${section._id}`}>Voir</Link>{" "}
                  {session && (
                    <a
                      className="delete-action"
                      href="#"
                      onClick={() => deleteSection(section._id)}
                    >
                      {" "}
                      | Delete{" "}
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <CreateSectionModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        save={saveSection}
        schools={schools}
      />
    </>
  );
}

type CreateSectionModalProps = {
  modalIsOpen: boolean;
  class_id?: any;
  closeModal: () => void;
  save: (student: any) => void;
  schools: SectionInterface[];
};
export function CreateSectionModal({
  modalIsOpen,
  closeModal,
  save,
  class_id,
  schools,
}: CreateSectionModalProps) {
  const localSchool = useSchool();
  const [student, setStudent] = useState<SectionInterface>({
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
          <h2>Ajouter une section</h2>
          <div className="form-group">
            <label>Nom </label>
            <input
              className="form-control"
              name="name"
              value={student?.name}
              onChange={handleChange}
            ></input>
          </div>

          <div className="form-group my-3">
            <label>Type de Bulletin</label>

            <select
              className="form-control"
              name="report_type"
              onChange={handleChange}
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
          </div>

          <div className="from-group">
            <button
              onClick={() => save(student)}
              className="btn btn-success"
              disabled={!(student.report_type && student.name)}
            >
              Enregistrer
            </button>
            <button onClick={closeModal} className="btn btn-secondary end">
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
