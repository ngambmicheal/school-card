import { useState } from "react";
import ExamInterface from "../../../models/exam";
import Modal from "react-modal";
import { customStyles } from "../../../services/constants";
import api from "../../../services/api";

type DynamicExamModalProps = {
  modalIsOpen: boolean;
  class_id?: any;
  closeModal: () => void;
  save: (exam:{name:string, slug?:string}) => void;
  exams: ExamInterface[];
  isGeneral?: boolean;
};
export function DynamicExamModal({
  modalIsOpen,
  closeModal,
  save,
  class_id,
  exams,
  isGeneral = false,
}: DynamicExamModalProps) {
  const [examSelected, setExamSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

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

    function handleChangeSlug(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSlug(value);
  }

  const generate = () => {
    if(isGeneral) {
      save({name, slug});

      return;
    }


    const report_type: string =
      exams[0].class_id?.section?.report_type || "Competence";
    api
      .saveTerm({
        report_type,
        exams: examSelected,
        name,
        slug,
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
              <label>Name</label>
              <input type="" className="form-control" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input type="" className="form-control" onChange={handleChangeSlug} />
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
            disabled={(!examSelected.length && !isGeneral) || !name}
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


export default function DefaultDynamicExam() {
  return <div></div>;
}

