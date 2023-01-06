import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import CourseInterface from "../../models/course";
import SubjectInterface from "../../models/subject";
import api from "../../services/api";
import { customStyles } from "../../services/constants";
import Modal from "react-modal";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function subjectDetails() {
  const [subject, setSubject] = useState<SubjectInterface>();
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const { _id: subjectId } = router.query;

  useEffect(() => {
    if (subjectId) {
      api.getSubject(subjectId).then(({ data: { data } }: any) => {
        setSubject(data);
      });

      getCourses();
    }
  }, [subjectId]);

  const getCourses = () => {
    api.getSubjectCourses(subjectId).then(({ data: { data } }: any) => {
      setCourses((s) => data);
    });
  };

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const saveCourses = (subject: any) => {
    api.saveCourses(subject).then(() => {
      api.sync();
      getCourses();
    });
    closeModal();
  };

  const deleteCourse = (course: any) => {
    if (confirm("Are you sure ?"))
      api.deleteCourse(course).then(() => getCourses());
  };

  return (
    <>
      <div className="py-3">
        <h3>Matiere : {subject?.name}</h3>
      </div>
      {session && (
        <button
          className="btn btn-success"
          onClick={() => setModalIsOpen(true)}
        >
          {" "}
          Ajouter une sous matiere{" "}
        </button>
      )}

      <h3 className="py-2">Liste des sous-matieres</h3>
            <table className="table table-hover table-striped table-bordered my-3 ">

        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Points </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            return (
              <CourseRow
                session={session}
                crs={course}
                deleteCourse={deleteCourse}
              />
            );
          })}
        </tbody>
      </table>

      {subjectId && (
        <CreateSubjectModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          save={saveCourses}
          subject={subjectId}
        />
      )}
    </>
  );
}

type CreateSubjectModalProps = {
  modalIsOpen: boolean;
  subject?: any;
  closeModal: () => void;
  save: (student: any) => void;
};
export function CreateSubjectModal({
  modalIsOpen,
  closeModal,
  save,
  subject,
}: CreateSubjectModalProps) {
  const [student, setStudent] = useState<CourseInterface>({
    name: "",
    subject,
    point: 5,
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
            <label>Point </label>
            <input
              className="form-control"
              name="point"
              value={student?.point}
              onChange={handleChange}
            ></input>
          </div>

          <div className="from-group">
            <button onClick={() => save(student)} className="btn btn-success">
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

type CourseProps = {
  crs: CourseInterface;
  deleteCourse: (id: string) => void;
  session: any;
};

export function CourseRow({ crs, deleteCourse, session }: CourseProps) {
  const [course, setCourse] = useState(crs);
  const [hasUpdated, setHasUpdated] = useState(false);

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setCourse((inputData) => ({
      ...inputData,
      [key]: value,
    }));
    setHasUpdated(true);
  }

  const updateCourse = () => {
    api.updateCourse(course).then(() => {
      setHasUpdated(false);
    });
  };

  return (
    <tr key={course._id}>
      <td>{course._id}</td>
      <td>
        {" "}
        <input
          className="form-control"
          type="text"
          disabled={!session}
          name="name"
          value={course?.name}
          onChange={handleChange}
        />{" "}
      </td>
      <td>
        {" "}
        <input
          className="form-control"
          type="text"
          name="point"
          disabled={!session}
          value={course?.point}
          onChange={handleChange}
        />{" "}
      </td>
      <td>
        {" "}
        {hasUpdated && session && (
          <a className="update-action" onClick={() => updateCourse()}>
            Update |{" "}
          </a>
        )}{" "}
        {session && (
          <a className="delete-action" onClick={() => deleteCourse(course._id)}>
            {" "}
            | Delete
          </a>
        )}
      </td>
    </tr>
  );
}
