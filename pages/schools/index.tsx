import { useEffect, useState } from "react";
import School from "../../models/school";
import Link from "next/link";
import api from "../../services/api";
import SchoolInterface from "../../models/school";
import { customStyles } from "../../services/constants";
import Modal from "react-modal";
import { helperService } from "../../services";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { generateRandomString } from "../../utils/calc";
import { toast, useToast } from "@chakra-ui/react";
import { errorMessage, successMessage } from "../../utils/messages";

export default function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data: session } = useSession();
  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    getSchools();
  }, []);

  const getSchools = () => {
    api.getSchools().then(({ data: { data } }: any) => {
      setSchools((s) => data);
    });
  };

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const saveSchool = (school: any) => {
    api
      .saveSchools(school)
      .then(() => {
        toast(successMessage("School saved successfully!"));
        getSchools();
      })
      .catch((error) =>
        toast(errorMessage(error.response?.data?.message ?? error.message))
      );
    closeModal();
  };

  const deleteSchool = (school: any) => {
    if (confirm("Are you sure you want to delete ? "))
      api.deleteSchool(school).then(() => {
        toast(successMessage("School deleted successfully!"));
        getSchools();
      });
  };

  const chooseSchool = (schoolId: string) => {
    helperService.saveSchoolId(schoolId);
    window.location = "/schools/" + schoolId;
  };

  return (
    <>
      <button className="btn btn-success" onClick={() => setModalIsOpen(true)}>
        {" "}
        {t("title.add-school")}
      </button>
      <table className="table ">
        <thead>
          <tr>
            <th>{t("title.name")}</th>
            <th>{t("title.code")}</th>
            <th>{t("title.action")}</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => {
            return (
              <tr key={school._id}>
                <td>{school.name}</td>
                <td>{school.code}</td>
                <td>
                  <i className="glyphicon glyphicon-eye"></i>
                  <a
                    href="#"
                    onClick={() => school._id && chooseSchool(school._id)}
                  >
                    {" "}
                    {t("action.choose")}{" "}
                  </a>
                  {session && (
                    <a
                      className="delete-action"
                      href="#"
                      onClick={() => deleteSchool(school._id)}
                    >
                      {" "}
                      | {t("action.delete")}{" "}
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <CreateSchoolModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        save={saveSchool}
      />
    </>
  );
}

type CreateSchoolModalProps = {
  modalIsOpen: boolean;
  class_id?: any;
  closeModal: () => void;
  save: (student: any) => void;
};
export function CreateSchoolModal({
  modalIsOpen,
  closeModal,
  save,
  class_id,
}: CreateSchoolModalProps) {
  const [student, setStudent] = useState<SchoolInterface>({
    name: "",
    code: generateRandomString(3),
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
          <h2>Ajouter une ecole</h2>
          <div className="form-group">
            <label>Nom </label>
            <input
              className="form-control"
              name="name"
              value={student?.name}
              onChange={handleChange}
            ></input>
          </div>

          <div className="form-group">
            <label>Code</label>
            <input
              className="form-control"
              name="code"
              value={student?.code}
              onChange={handleChange}
            ></input>
          </div>

          <div className="from-group">
            <button onClick={() => save(student)} className="btn btn-success">
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
