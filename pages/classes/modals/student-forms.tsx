import { useEffect, useState } from "react";
import StudentInterface from "../../../models/student";
import Modal from "react-modal";
import { customStyles } from "../../../services/constants";
import ClasseInterface from "../../../models/classe";
import api from "../../../services/api";

type CreateStudentModalProps = {
  modalIsOpen: boolean;
  totalUsers: number;
  class_id?: any;
  closeModal: () => void;
  save: (student: any) => void;
};
export function CreateStudentModal({
  modalIsOpen,
  closeModal,
  save,
  class_id,
  totalUsers,
}: CreateStudentModalProps) {
  const [student, setStudent] = useState<StudentInterface>({
    class_id,
    name: "",
    number: (totalUsers + 1).toString(),
  });
  const [classes, setClasses] = useState<ClasseInterface[]>();

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setStudent((inputData) => ({
      ...inputData,
      [key]: value,
    }));
  }

  useEffect(() => {
    setStudent((inputData) => ({
      ...inputData,
      number: (totalUsers + 1).toString(),
      name: "",
      dob: "",
    }));
  }, [totalUsers]);

  useEffect(() => {
    api.getClasses().then(({ data: { data } }: any) => {
      setClasses((s) => data);
    });
  }, []);

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Student"
      >
        <div className="modal-body">
          <h2>Add Student</h2>
          <div className="form-group">
            <label>Numero </label>
            <input
              className="form-control"
              type="number"
              name="number"
              value={student?.number}
              onChange={handleChange}
            ></input>
          </div>
          <div className="form-group">
            <label>Name </label>
            <input
              className="form-control"
              name="name"
              value={student?.name}
              onChange={handleChange}
            ></input>
          </div>
          <div className="form-group">
            <label>Phone </label>
            <input
              className="form-control"
              name="phone"
              value={student?.phone}
              onChange={handleChange}
            ></input>
          </div>
          <div className="form-group">
            <label>Sex </label>
            <input
              className="form-control"
              name="sex"
              value={student?.sex}
              onChange={handleChange}
            ></input>
          </div>
          <div className="form-group">
            <label>Email </label>
            <input
              className="form-control"
              name="email"
              value={student?.email}
              onChange={handleChange}
            ></input>
          </div>
          <div className="form-group">
            <label>Date </label>
            <input
              className="form-control"
              name="dob"
              value={student?.dob}
              onChange={handleChange}
            ></input>
          </div>

          <div className="form-group">
            <label>Class</label>
            <select
              className="form-control"
              name="class_id"
              value={student?.class_id}
              onChange={handleChange}
            >
              <option value="">---Select class</option>
              {classes?.map((classe) => (
                <option value={classe._id}>{classe.name}</option>
              ))}
            </select>
          </div>

          <div className="from-group">
            <button
              disabled={!student.name || !student.class_id}
              onClick={() => save(student)}
              className="btn btn-success"
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

export default function () {
  return "";
}
