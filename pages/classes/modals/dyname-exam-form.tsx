import { useState } from "react";
import ExamInterface from "../../../models/exam";
import Modal from "react-modal";
import { customStyles } from "../../../services/constants";
import api from "../../../services/api";

type DynamicExamModalProps = {
  modalIsOpen: boolean;
  class_id?: any;
  closeModal: () => void;
  save: (student: any) => void;
  exams: ExamInterface[];
};
export function DynamicExamModal({
  modalIsOpen,
  closeModal,
  save,
  class_id,
  exams,
}: DynamicExamModalProps) {
  const [examSelected, setExamSelected] = useState<string[]>([]);
  const [name, setName] = useState("");

  function handleExamChange(e: any) {
    const key: string = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const ex = value
      ? [...examSelected, key]
      : examSelected.filter((e) => e != key);
    setExamSelected(ex);
  }

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setName(value);
  }

  const generate = () => {
    const report_type: string =
      exams[0].class_id?.section?.report_type || "Competence";
    api
      .saveTerm({
        report_type,
        exams: examSelected,
        name,
        class: exams[0].class_id?._id,
      })
      .then(() => {
        closeModal();
      });
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="select Exams"
      >
        <div className="modal-body">
          <h2>Ajoute Trimestre</h2>
          <div>
            <div className="form-group">
              <input type="" className="form-control" onChange={handleChange} />
            </div>
            <table style={{ width: "100%" }} className="table1">
              <tr>
                <th>Select</th>
                <th>Exam</th>
              </tr>
              {exams.map((exam) => {
                return (
                  <tr>
                    <td>
                      <input
                        type="checkbox"
                        name={exam._id}
                        onChange={handleExamChange}
                      ></input>
                    </td>
                    <td>{exam.name}</td>
                  </tr>
                );
              })}
            </table>
          </div>

          <br />

          <button
            className="btn btn-success"
            onClick={generate}
            disabled={!examSelected.length}
          >
            {" "}
            Generer{" "}
          </button>
          <button className="btn btn-dark" onClick={closeModal}>
            close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function NothingName() {
  return "";
}
