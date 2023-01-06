import { useEffect, useState } from "react";
import Classe from "../../models/classe";
import Link from "next/link";
import api from "../../services/api";
import ClasseInterface from "../../models/classe";
import Modal from "react-modal";
import { customStyles } from "../../services/constants";
import SchoolInterface from "../../models/school";
import SectionInterface from "../../models/section";
import { helperService } from "../../services";
import { useSession } from "next-auth/react";
import UserInterface from "../../models/user";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export default function Classes() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [sections, setSections] = useState<SectionInterface[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [teachers, setTeachers] = useState<UserInterface[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    getClasses();

    api.getSections().then(({ data: { data } }: any) => {
      setSections(data);
    });

    api.getUsers().then(({ data: { data } }: any) => {
      setTeachers((s) => data.filter((t) => t.type === "STAFF"));
    });
  }, []);

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const getClasses = () => {
    api.getClasses().then(({ data: { data } }: any) => {
      setClasses((s) => data);
    });
  };

  const saveClasse = (student: any) => {
    api.saveClasse(student).then(() => getClasses());
    closeModal();
  };

  const deleteClasse = (studentId: string) => {
    if (confirm("Are you sure to delete?"))
      api.deleteClasse(studentId).then(() => getClasses());
  };

  return (
    <>
      {session && (
        <button
          className="btn btn-success"
          onClick={() => setModalIsOpen(true)}
        >
          {" "}
          {t("title.add-class")}{" "}
        </button>
      )}
      <h3 className="mt-3">{t("title.list-class")}</h3>
      <table className="table ">
        <thead>
          <tr>
            <th>{t("title.name")}</th>
            <th>{t("title.school")}</th>
            <th>{t("title.section")}</th>
            <th>{t("title.teacher")}</th>
            <th>{t("title.action")}</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classe: any) => {
            return (
              <ClasseRow
                teachers={teachers}
                session={session}
                classe={classe}
                deleteClasse={deleteClasse}
              />
            );
          })}
        </tbody>
      </table>

      <CreateClassModal
        closeModal={closeModal}
        save={saveClasse}
        modalIsOpen={modalIsOpen}
        sections={sections}
      />
    </>
  );
}

type ClasseRowInterface = {
  classe: ClasseInterface;
  deleteClasse: (id: string) => void;
  session: any;
  teachers: UserInterface[];
};
export function ClasseRow({
  classe,
  deleteClasse,
  session,
  teachers,
}: ClasseRowInterface) {
  const [teacher, setTeacher] = useState(classe.teacher_id);

  const updateTeacher = (event) => {
    const tt = event.target.value;
    const tea = teachers.find((t) => t._id == tt);
    if (tt != "") {
      setTeacher(tt);
      api.updateClasse({ _id: classe._id, teacher_id: tt, teacher: tea?.name });
    }
  };
  return (
    <tr key={classe._id}>
      <td>{classe.name}</td>
      <td>{classe.school?.name}</td>
      <td>{classe.section?.name}</td>
      <td>
        <select
          disabled={!session}
          value={teacher}
          className="form-control"
          onChange={updateTeacher}
        >
          <option value="">-- Select Teacher --</option>
          {teachers.map((tr) => (
            <option value={tr._id}>{tr.name}</option>
          ))}
        </select>
      </td>
      <td>
        {session && (
          <>
            {" "}
            <Link href={`classes/${classe._id}`}>{t("action.view")}</Link>{" "}
            <a
              className="delete-action"
              onClick={() => deleteClasse(classe._id)}
            >
              {" "}
              | {t("action.delete")}
            </a>
          </>
        )}
      </td>
    </tr>
  );
}

type CreateClassModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  save: (student: any) => void;
  sections: SectionInterface[];
};
export function CreateClassModal({
  modalIsOpen,
  closeModal,
  save,
  sections,
}: CreateClassModalProps) {
  const [classe, setClasse] = useState<ClasseInterface>({
    name: "",
    school: helperService.getSchoolId(),
  });

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setClasse((inputData) => ({
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
        contentLabel="Add Classe"
      >
        <div className="modal-body">
          <h2>Ajouter une classe</h2>
          <div className="form-group my-3">
            <label>Nom </label>
            <input
              className="form-control"
              name="name"
              value={classe?.name}
              onChange={handleChange}
            ></input>
          </div>

          <div className="form-group my-3">
            <label>Section</label>

            <select
              className="form-control"
              name="section"
              onChange={handleChange}
            >
              <option value=""> Choisir </option>
              {sections
                .filter((s) => s.school?._id == classe.school)
                .map((section) => {
                  return (
                    <option
                      key={section._id}
                      value={section._id}
                      selected={classe.section == section._id}
                    >
                      {" "}
                      {section.name}{" "}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="from-group">
            <button
              onClick={() => save(classe)}
              className="btn btn-success"
              disabled={!classe.school || !classe.name || !classe.section}
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
