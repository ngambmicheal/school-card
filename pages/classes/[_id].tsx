import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import ClasseInterface from "../../models/classe";
import StudentInterface from "../../models/student";
import api from "../../services/api";
import Modal from "react-modal";
import Link from "next/link";
import { customStyles } from "../../services/constants";
import ExamInterface from "../../models/exam";
import TermInterface from "../../models/terms";
import { DynamicExamModal } from "./modals/dyname-exam-form";
import AnnualExamInterface from "../../models/annualExam";
import { CreateStudentModal } from "./modals/student-forms";
import { ImportStudents } from "./modals/import-students";
import { AnnualExamModal, CreateExamModal } from "./modals/annual-exam";
import { CSVLink } from "react-csv";
import { useSession } from "next-auth/react";
import useSchool from "../../hooks/useSchool";
import { useToast } from "@chakra-ui/react";
import { successMessage } from "../../utils/messages";

export default function ClasseDetails() {
  const [classe, setClasse] = useState<ClasseInterface>();
  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [exams, setExams] = useState<ExamInterface[]>([]);
  const [terms, setTerms] = useState<TermInterface[]>([]);
  const [annualExams, setAnnualExams] = useState<AnnualExamInterface[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [examIsOpen, setExamIsOpen] = useState(false);
  const [dynamicExamIsOpen, setDynamicExamIsOpen] = useState(false);
  const [annualExamIsOpen, setAnnualExamIsOpen] = useState(false);
  const [ImportIsOpen, setImportIsOpen] = useState(false);
  const router = useRouter();
  const { _id: classeId } = router.query;
  const { editable } = useSchool();
  const toast = useToast();

  useEffect(() => {
    if (classeId) {
      api.getClasse(classeId).then(({ data: { data } }: any) => {
        setClasse(data);
      });
      getStudents();
      getExams();
      getTerms();
      getAnnualExams();
    }
  }, [classeId]);

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const getStudents = () => {
    api.getClasseStudents(classeId).then(({ data: { data } }: any) => {
      setStudents(data);
    });
  };

  const saveStudent = (student: any) => {
    api.saveStudent(student).then(() => getStudents());
    closeModal();
  };

  const deleteStudent = (studentId: string) => {
    if (confirm("Are you sure to delete?"))
      api.deleteStudent(studentId).then(() => {
        toast(successMessage('Student deleted successfully!'))
        getStudents();
  });
  };

  const deleteExam = (examId: string) => {
    if (confirm("Are you sure to delete?"))
      api.deleteExam(examId).then(() => getExams());
  };

  const importStudent = () => {};

  const closeExamModal = () => {
    setExamIsOpen((s) => false);
  };

  const closeDynamicExamModal = () => {
    setDynamicExamIsOpen((s) => false);
    getTerms();
  };

  const closeAnnualExamModal = () => {
    setAnnualExamIsOpen((s) => false);
    getAnnualExams();
  };

  const saveAnnualExam = () => {};

  const closeImportModal = () => {
    setImportIsOpen((s) => false);
  };

  const getExams = () => {
    api.getClasseExams(classeId).then(({ data: { data } }: any) => {
      setExams(data);
    });
  };

  const getTerms = () => {
    api.getTerms(classeId).then(({ data: { data } }: any) => {
      setTerms(data);
    });
  };

  const getAnnualExams = () => {
    api.getAnnualExams(classeId).then(({ data: { data } }: any) => {
      setAnnualExams(data);
    });
  };

  const deleteTerm = (term_id: any) => {
    if (confirm("Are you sure to delete?"))
      api.deleteTerm(term_id).then(() => getTerms());
  };

  const calculateTerm = (term_id: string) => {
    api.calculateTerm(term_id).then(() => {
      alert("done ");
    });
  };

  const deleteAnnualResult = (term_id: any) => {
    if (confirm("Are you sure to delete?"))
      api.deleteAnnualExam(term_id).then(() => getTerms());
  };

  const calculateAnnualExam = (term_id: string) => {
    api.calculateAnnualExam(term_id).then(() => {
      alert("done ");
    });
  };

  const saveExam = (exam: any) => {
    api.saveExam(exam).then(() => getExams());
    closeExamModal();
  };

  const downloadToCsv = () => {
    api.downloadToCsv(classeId);
  };

  const downloadToPdf = () => {
    api.downloadToPdf(classeId);
  };

  const studentHeaders = [
    { label: "Numero", key: "number" },
    { label: "Nom", key: "name" },
    { label: "Phone", key: "phone" },
    { label: "Sex", key: "sex" },
    { label: "Id", key: "_id" },
  ];

  return (
    <>
      <div className="">Name : {classe?.name}</div>

      <button onClick={downloadToCsv} className="btn btn-secondary mx-3">
        {" "}
        Download to CSV{" "}
      </button>
      <button onClick={downloadToPdf} className="btn btn-secondary mx-2">
        {" "}
        Download to Pdf{" "}
      </button>

      <Link href={`/exams/`}> Bulletin de fin d'annee </Link>

      <h3 className="mt-3">
        Exams
        {editable && (
          <span className="pull-right">
            <button
              className="btn btn-xs btn-success"
              onClick={() => setExamIsOpen((s) => true)}
            >
              Add Exam
            </button>
          </span>
        )}
      </h3>

      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th>Name</th>
            {classe?.section?.report_type == "Maternelle" && (
              <th>Exam Type Maternelle</th>
            )}
            {classe?.section?.report_type == "Nursery" && (
              <th>Exam Type Nursery</th>
            )}
            {classe?.section?.report_type == "Matiere" && (
              <th>Exam Type Normal </th>
            )}
            {classe?.section?.report_type == "Competence" && (
              <th>Exam Type Competence</th>
            )}
            {classe?.section?.report_type == "Special" && (
              <th>Exam Type Special</th>
            )}
            {editable && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => {
            return (
              <tr key={exam._id}>
                <td> {exam.name} </td>
                {classe?.section?.report_type == "Maternelle" && (
                  <td>
                    {" "}
                    <Link href={`/exams/mat/${exam._id}`}>
                      Entree les donnees
                    </Link>
                  </td>
                )}
                {classe?.section?.report_type == "Nursery" && (
                  <td>
                    {" "}
                    <Link href={`/exams/nursery/${exam._id}`}>Fill Marks</Link>
                  </td>
                )}
                {classe?.section?.report_type == "Matiere" && (
                  <td>
                    {" "}
                    <Link href={`/exams/${exam._id}`}>
                      Entree les donnees
                    </Link>{" "}
                  </td>
                )}
                {classe?.section?.report_type == "Competence" && (
                  <td>
                    {" "}
                    <Link href={`/exams/ui/${exam._id}`}>
                      Entree les donnees
                    </Link>{" "}
                  </td>
                )}
                {classe?.section?.report_type == "Special" && (
                  <td>
                    {" "}
                    <Link href={`/exams/special/${exam._id}`}>
                      Entree les donnees
                    </Link>{" "}
                  </td>
                )}
                {editable && (
                  <td>
                    {" "}
                    <a onClick={() => deleteExam(exam._id as string)}>
                      Delete
                    </a>{" "}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr />

      <h3 className="mt-3"> Trimestre </h3>
      {exams.length && editable && (
        <span className="px-13">
          <button
            className="btn btn-xs btn-success"
            onClick={() => setDynamicExamIsOpen((s) => true)}
          >
            {" "}
            Ajouter Trimestre{" "}
          </button>
        </span>
      )}

      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th>Name</th>
            {classe?.section?.report_type == "Maternelle" && (
              <th>Exam Type Maternelle</th>
            )}
            {classe?.section?.report_type == "Nursery" && (
              <th>Exam Type Maternelle</th>
            )}
            {classe?.section?.report_type == "Matiere" && (
              <th>Exam Type Normal </th>
            )}
            {classe?.section?.report_type == "Competence" && (
              <th>Exam Type Competence</th>
            )}
            {classe?.section?.report_type == "Special" && (
              <th>Exam Type Special</th>
            )}
            {editable && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {terms.map((term) => {
            return (
              <tr key={term._id}>
                <td> {term.name} </td>
                {classe?.section?.report_type == "Maternelle" && (
                  <td>
                    {" "}
                    <Link href={`/exams/mat/dynamic?term_id=${term._id}`}>
                      Mat
                    </Link>
                  </td>
                )}
                {classe?.section?.report_type == "Nursery" && (
                  <td>
                    {" "}
                    <Link href={`/exams/nursery/dynamic/?term_id=${term._id}`}>
                      Nursery
                    </Link>
                  </td>
                )}
                {classe?.section?.report_type == "Matiere" && (
                  <td>
                    {" "}
                    <Link href={`/exams/normal/dynamic?term_id=${term._id}`}>
                      View
                    </Link>{" "}
                  </td>
                )}
                {classe?.section?.report_type == "Competence" && (
                  <td>
                    {" "}
                    <Link href={`/exams/ui/dynamic?term_id=${term._id}`}>
                      UI
                    </Link>{" "}
                  </td>
                )}
                {classe?.section?.report_type == "Special" && (
                  <td>
                    {" "}
                    <Link href={`/exams/special/dynamic?term_id=${term._id}`}>
                      UI/Special
                    </Link>{" "}
                  </td>
                )}
                {editable && (
                  <td>
                    {" "}
                    {term._id && (
                      <a onClick={() => calculateTerm(term._id)}>
                        {" "}
                        Calculer |{" "}
                      </a>
                    )}{" "}
                    <a onClick={() => deleteTerm(term._id)}>Delete</a>{" "}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 className="mt-3"> Bulletin Annuelle </h3>
      {exams.length && editable && (
        <span className="px-13">
          <button
            className="btn btn-xs btn-success"
            onClick={() => setAnnualExamIsOpen((s) => true)}
          >
            {" "}
            Ajouter Bulletin Final{" "}
          </button>
        </span>
      )}

      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th>Name</th>
            {classe?.section?.report_type == "Maternelle" && (
              <th>Exam Type Maternelle</th>
            )}
            {classe?.section?.report_type == "Nursery" && (
              <th>Exam Type Maternelle</th>
            )}
            {classe?.section?.report_type == "Matiere" && (
              <th>Exam Type Normal </th>
            )}
            {classe?.section?.report_type == "Competence" && (
              <th>Exam Type Competence</th>
            )}
            {classe?.section?.report_type == "Special" && (
              <th>Exam Type Special</th>
            )}
            {editable && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {annualExams.map((term) => {
            return (
              <tr key={term._id}>
                <td> {term.name} </td>
                {classe?.section?.report_type == "Maternelle" && (
                  <td>
                    {" "}
                    <Link href={`/exams/mat/annual?annualExam_id=${term._id}`}>
                      Mat
                    </Link>
                  </td>
                )}
                {classe?.section?.report_type == "Nursery" && (
                  <td>
                    {" "}
                    <Link
                      href={`/exams/nursery/annual/?annualExam_id=${term._id}`}
                    >
                      Nursery
                    </Link>
                  </td>
                )}
                {classe?.section?.report_type == "Matiere" && (
                  <td>
                    {" "}
                    <Link
                      href={`/exams/normal/annual?annualExam_id=${term._id}`}
                    >
                      View
                    </Link>{" "}
                  </td>
                )}
                {classe?.section?.report_type == "Competence" && (
                  <td>
                    {" "}
                    <Link href={`/exams/ui/annual?annualExam_id=${term._id}`}>
                      UI
                    </Link>{" "}
                  </td>
                )}
                {classe?.section?.report_type == "Special" && (
                  <td>
                    {" "}
                    <Link
                      href={`/exams/special/annual?annualExam_id=${term._id}`}
                    >
                      UI/Special
                    </Link>{" "}
                  </td>
                )}
                {editable && (
                  <td>
                    {" "}
                    {term._id && (
                      <a onClick={() => calculateAnnualExam(term._id)}>
                        Calculer |{" "}
                      </a>
                    )}{" "}
                    <a onClick={() => deleteAnnualResult(term._id)}>Delete</a>{" "}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {classeId && (
        <CreateExamModal
          modalIsOpen={examIsOpen}
          closeModal={closeExamModal}
          save={saveExam}
          class_id={classeId}
        />
      )}
      {classeId && (
        <DynamicExamModal
          exams={exams}
          modalIsOpen={dynamicExamIsOpen}
          closeModal={closeDynamicExamModal}
          save={saveExam}
          class_id={classeId}
        />
      )}
      {classeId && (
        <AnnualExamModal
          terms={terms}
          modalIsOpen={annualExamIsOpen}
          closeModal={closeAnnualExamModal}
          save={saveAnnualExam}
          class_id={classeId}
        />
      )}

      <h3 className="mt-3">
        Students
        <span className="pull-right">
          <button
            className="btn btn-xs btn-success mx-3"
            onClick={() => setModalIsOpen((s) => true)}
          >
            Add Student
          </button>
          <button
            className="btn btn-xs btn-success mx-2"
            onClick={() => setImportIsOpen((s) => true)}
          >
            {" "}
            <i className="fa fa-upload"></i> Importer Eleve
          </button>
          <CSVLink
            data={students}
            headers={studentHeaders}
            className="btn btn-dark mx-3"
            filename={
              "liste-des-elevles-" +
              classe?.name +
              "-" +
              new Date().getFullYear() +
              ".csv"
            }
          >
            Telecharcher liste des eleves Csv
          </CSVLink>
        </span>
      </h3>

      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th>No </th>
            <th>Matricule</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Sex</th>
            <th>Age</th>
            <th>Lieu</th>
            <th> Action </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            return (
              <StudentRow
                stud={student}
                key={student._id}
                deleteStudent={deleteStudent}
                terms={terms}
              />
            );
          })}
        </tbody>
      </table>

      {classeId && (
        <CreateStudentModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          save={saveStudent}
          class_id={classeId}
          totalUsers={students.length}
        />
      )}
      {classeId && (
        <ImportStudents
          modalIsOpen={ImportIsOpen}
          closeModal={closeImportModal}
          save={importStudent}
          class_id={classeId}
        />
      )}
    </>
  );
}

type StudentProps = {
  stud: StudentInterface;
  deleteStudent: (id: string) => void;
  terms: TermInterface[];
};

export function StudentRow({ stud, deleteStudent, terms }: StudentProps) {
  const [student, setStudent] = useState(stud);
  const [hasUpdated, setHasUpdated] = useState(false);
  const session = useSession();

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setStudent((inputData) => ({
      ...inputData,
      [key]: value,
    }));
    setHasUpdated(true);
  }

  const updateStudent = () => {
    api.updateStudent(student).then(() => {
      setHasUpdated(false);
    });
  };

  return (
    <tr>
      <td>
        {" "}
        <input
          style={{ width: "50px" }}
          type="number"
          name="number"
          value={student?.number}
          onChange={handleChange}
        />{" "}
      </td>
      <td>{student.matricule}</td>
      <td>
        {" "}
        <input
          className="form-control"
          type="text"
          name="name"
          value={student?.name}
          onChange={handleChange}
        />{" "}
      </td>
      <td>
        {" "}
        <input
          style={{ width: "150px" }}
          className="form-control"
          type="number"
          name="phone"
          value={student?.phone}
          onChange={handleChange}
        ></input>
      </td>
      <td>
        {" "}
        <input
          style={{ width: "50px" }}
          type="text"
          name="sex"
          value={student?.sex}
          onChange={handleChange}
        ></input>
      </td>
      <td>
        {" "}
        <input
          style={{ width: "150px" }}
          className="form-control"
          type="text"
          name="dob"
          value={student?.dob}
          onChange={handleChange}
        ></input>
      </td>
      <td>
        {" "}
        <input
          style={{ width: "150px" }}
          type="text"
          name="place"
          value={student?.place}
          onChange={handleChange}
        ></input>
      </td>
      <td>
        {" "}
        {hasUpdated && (
          <a className="update-action" onClick={() => updateStudent()}>
            Update
          </a>
        )}
        {session.data && (
          <a
            className="delete-action"
            onClick={() => deleteStudent(student._id)}
          >
            {" "}
            | Delete
          </a>
        )}
        {terms.map((term, index) => {
          return (
            <>
              {" "}
              <a
                href={`/exams/dynamic/${term.report_type?.toLocaleLowerCase()}?_id=${
                  term._id
                }&student_id=${student._id}`}
                target="_blank"
              >
                {" "}
                | {term.name}{" "}
              </a>{" "}
            </>
          );
        })}
      </td>
    </tr>
  );
}
