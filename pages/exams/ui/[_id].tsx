import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import CourseInterface from "../../../models/course";
import SubjectInterface from "../../../models/subject";
import api from "../../../services/api";
import { customStyles } from "../../../services/constants";
import Modal from "react-modal";
import Link from "next/link";
import Subjects from "../../subjects";
import StudentInterface from "../../../models/student";
import ExamResultInterface from "../../../models/examResult";
import CompetenceInterface from "../../../models/competence";
import ExamInterface from "../../../models/exam";
import FileUpload, { validateFiles } from "../../../components/dropzone";
import { toast } from "@chakra-ui/toast";
import { useForm } from "react-hook-form";
import { CSVLink } from "react-csv";
import { getFloat } from "../../../utils/calc";
import useSchool from "../../../hooks/useSchool";
import SchoolInterface from "../../../models/school";

export default function examDetails() {
  const [exam, setExam] = useState<ExamInterface>();
  const [competences, setCompetences] = useState<CompetenceInterface[]>([]);
  const [points, setPoints] = useState(0);

  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [results, setResults] = useState<any>([]);
  const [ImportIsOpen, setImportIsOpen] = useState(false);

  const router = useRouter();
  const { _id: examId } = router.query;
  const { school } = useSchool();

  useEffect(() => {
    if (examId) {
      api.getExam(examId).then(({ data: { data } }: any) => {
        setExam(data);
      });

      api.getExamResults(examId).then(({ data: { data } }: any) => {
        setResults(data);
      });

      api.getStudents().then(({ data: { data } }: any) => {
        setStudents((s) => data);
      });
    }
  }, [examId]);

  useEffect(() => {
    if (exam) {
      api
        .getSchoolCompetences({
          school: exam?.class_id.school,
          report_type: exam.class_id.section.report_type,
        })
        .then(({ data: { data } }: any) => {
          setCompetences((s) => data);
        });
    }
  }, [exam]);

  useEffect(() => {
    if (results && exam) {
      console.log("thi si sht efile");
      setExam((inputData) => ({
        ...inputData,
        loaded: "yes",
      }));
      getTotalPoints();
      console.log("this is me");
    }
  }, [results]);

  const printResults = () => {
    window.open("/api/exams/results/" + examId, "_blank");
  };

  const printStats = () => {
    window.open("/api/exams/stats?exam_id=" + examId, "_blank");
  };

  const deleteResult = (resultId: string) => {
    if (confirm("Are you sure to delete?")) {
      api.deleteResult(resultId).then(() => {
        api.getExamResults(examId).then(({ data: { data } }: any) => {
          setResults(data);
        });
      });
    }
  };

  useEffect(() => {
    if (exam?._id) {
      api.updateExam(exam._id, exam).then(({ data: { data } }: any) => {
        //setExam(data)
      });
    }
  }, [exam]);

  const handleChange = (e) => {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setExam((inputData) => ({
      ...inputData,
      [key]: value,
    }));

    getTotalPoints();
  };

  const importResults = (file: File | null) => {
    api
      .importResults({
        file: file,
        exam_id: examId,
      })
      .then((data) => {
        toast({
          status: "success",
          title: "Successfully imported leads",
          description: `Loaded `,
        });

        setTimeout(() => router.push("/soft-leads"), 2000);
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title: typeof e === "string" ? e : "Failed to import leads",
          description: e.error ?? e.toString(),
          isClosable: true,
        });
      });
  };

  const closeImportModal = () => {
    setImportIsOpen((s) => false);
  };

  const getTotalPoints = () => {
    let sum = 0;
    console.log(sum);
    for (const el in exam) {
      if (el.includes("point_")) {
        sum += getFloat(exam[el]) ?? 0;
        console.log(exam[el]);
      }
    }
    setPoints((s) => sum);
  };

  const getRank = () => {
    api.getExamResults(examId).then(({ data: { data } }: any) => {
      const sortedData = data.sort((a, b) => {
        let lA = getTotal(a);
        let lB = getTotal(b);

        if (lA < lB) return 1;
        if (lA > lB) return -1;
        return 0;
      });

      sortedData.map((item, index) => {
        item.rank = index + 1;
        api.updateExamResult(item);

        if (index == data.lenght - 1) {
          window.location = window.location;
        }
      });
    });
  };

  const getTotal = (result) => {
    let sum = 0;
    for (const el in result) {
      if (el.includes("subject_")) {
        sum += getFloat(getFloat(result[el]).toFixed(2));
      }
    }
    return sum;
  };

  const [resultsCsv, setResultsCsv] = useState<any>([]);
  const [headers, setHeaders] = useState<any>([]);

  function getCsvData() {
    console.log(results);
    let data = results.map((result: any) => {
      const total = getTotal(result);
      return {
        ...result,
        total,
        average: ((total / points) * 20).toFixed(2),
      };
    });

    setResultsCsv(data);
  }

  function getHeaders() {
    let headers = [
      { label: "Number", key: "student.number" },
      { label: "Name", key: "student.name" },
    ];

    competences.map((competence) => {
      competence.subjects?.map((subject) => {
        const name = subject.slug || subject.name;

        subject.courses?.map((course) => {
          headers.push({
            label: name + "--" + course.name,
            key: `subject_${course._id}`,
          });
        });
      });
    });

    headers = [
      ...headers,
      ...[
        { label: "Total", key: "total" },
        { label: "Moyenne", key: "average" },
        { label: "Rang", key: "rank" },
      ],
    ];

    setHeaders(headers);
  }

  useEffect(() => {
    getCsvData();
    getHeaders();
  }, [competences, results, points]);

  return (
    <>
      <div className="py-3">
        <h3>Classe : {exam?.class_id?.name} </h3>
        <h4>Examen : {exam?.name} </h4>
      </div>
      <button className="mx-3 btn btn-success" onClick={() => printResults()}>
        {" "}
        Imprimer Resultats{" "}
      </button>

      <button className="mx-3 btn btn-success" onClick={() => getRank()}>
        {" "}
        get Rank
      </button>

      {school && school.allowUpdate && (
        <button
          className="mx-3 btn btn-success"
          onClick={() => setImportIsOpen(true)}
        >
          {" "}
          Upload Results
        </button>
      )}

      <button className="mx-3 btn btn-dark" onClick={() => printStats(true)}>
        {" "}
        Imprimer Statistics
      </button>

      {resultsCsv.length && (
        <CSVLink
          data={resultsCsv}
          headers={headers}
          className="btn btn-dark mx-3"
          filename={`statistics-${exam?.class_id?.name}-${exam?.name}.csv`}
        >
          Telecharcher Csv
        </CSVLink>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Numero</th>
            <th>Nom</th>
            {competences &&
              competences.map((s) => {
                return (
                  <th key={s._id} colSpan={s.subjects?.length * 4}>
                    {" "}
                    {s.slug?.substring(0, 40)}{" "}
                  </th>
                );
              })}
            <th>Total</th>
            <th>Moyenne</th>
            <th>Rang</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            {competences &&
              competences.map((competence) => {
                return competence.subjects?.map((subject) => {
                  return (
                    <th key={subject._id} colSpan={subject.courses?.length + 1}>
                      {" "}
                      {subject.slug || subject.name?.substring(0, 30)}{" "}
                    </th>
                  );
                });
              })}
          </tr>
          <tr>
            <th></th>
            <th></th>
            {competences &&
              competences.map((competence) => {
                return competence.subjects?.map((subject) => {
                  return (
                    <>
                      {subject.courses?.map((course) => {
                        return (
                          <th key={course._id}>
                            <input
                              name={`point_${course._id}`}
                              style={{ width: "50px" }}
                              value={exam[`point_${course._id}`]}
                              onChange={handleChange}
                            />
                            {course.name}
                          </th>
                        );
                      })}
                      <th> Total</th>
                    </>
                  );
                });
              })}
            <th>{points} </th>
            <th>Moyenne</th>
            <th>Rank</th>
            <th>Ignorer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {results &&
            competences.length &&
            results.map((result) => {
              return (
                <ExamResult
                  key={`exam-${result._id}`}
                  result={result}
                  competences={competences}
                  exam={exam}
                  points={points}
                  deleteResult={deleteResult}
                  school={school}
                />
              );
            })}
        </tbody>
      </table>

      {examId && (
        <ImportResults
          modalIsOpen={ImportIsOpen}
          closeModal={closeImportModal}
          save={importResults}
        />
      )}
    </>
  );
}

const reducer = (previousValue: any, currentValue: any) =>
  getFloat(
    (getFloat(previousValue ?? 0) + getFloat(currentValue ?? 0)).toFixed(2)
  );

export function ExamResult({
  school,
  result,
  competences,
  exam,
  points,
  deleteResult,
}: {
  school: SchoolInterface;
  competences: CompetenceInterface[];
  result: ExamResultInterface | any;
  exam: any;
  points: any;
  deleteResult: (resultId: string) => void;
}) {
  const [total, setTotal] = useState(0);
  const [res, setRes] = useState(result);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    getTotals();
    getTotal(res);
    if (hasLoaded) {
      api.updateExamResult(res).then(() => {
        getTotal(res);
      });
      calculateSubTotal();
    }
    setHasLoaded(true);
  }, [res]);

  const getTotal = (result) => {
    let sum = 0;
    for (const el in result) {
      if (el.includes("total_")) {
        sum += result[el];
      }
    }
    setTotal((s) => sum);
  };

  const calculateSubTotal = () => {
    setHasLoaded(false);

    getTotals();

    setHasLoaded(true);
  };

  const getTotals = () => {
    competences.map((c) => {
      c.subjects?.map((s) => {
        res[`total_${s._id}`] = s.courses
          ?.map((cc) => res[`subject_${cc._id}`])
          .reduce(reducer, 0);
      });
    });
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setRes((inputData) => ({
      ...inputData,
      [key]: value,
    }));
  };

  return (
    <tr>
      <td>{result?.student?.number}</td>
      <td>{result?.student?.name}</td>
      {competences &&
        competences.map((competence) => {
          return competence.subjects?.map((subject) => {
            return (
              <>
                {subject.courses?.map((course) => {
                  return (
                    course._id && (
                      <td key={course._id}>
                        {" "}
                        <input
                          name={`subject_${course._id}`}
                          style={{ width: "50px" }}
                          value={res[`subject_${course._id}`]}
                          disabled={!school.allowUpdate}
                          onChange={handleChange}
                          max={course.point}
                        />{" "}
                      </td>
                    )
                  );
                })}
                <th> {res[`total_${subject._id}`]} </th>
              </>
            );
          });
        })}
      <td>{total}</td>
      <th> {((total / points) * 20).toFixed(2)} / 20 </th>
      <th> {res.rank}</th>
      <td>
        <input
          type="checkbox"
          name="ignore"
          checked={res.ignore == true}
          onClick={handleChange}
          disabled={!school.allowUpdate}
        />
      </td>
      <th>
        {" "}
        <Link href={`/exams/ui/print?_id=${res._id}`}>Imprimer</Link> |{" "}
        <a onClick={() => deleteResult(res._id)}> Delete</a>{" "}
      </th>
    </tr>
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
          <button className="btn btn-secondary end" onClick={closeModal}>
            close
          </button>
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
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function ImportResults({
  modalIsOpen,
  closeModal,
  save,
}: {
  modalIsOpen: boolean;
  closeModal: () => void;
  save: (file: File | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState();

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Exam"
      >
        <div className="modal-body">
          <div className="row">
            <UploadFile
              file={file}
              setFile={setFile}
              values={values}
            ></UploadFile>
          </div>
          <div className="row">
            {file && (
              <button className="btn btn-success" onClick={() => save(file)}>
                {" "}
                Upload{" "}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

type UploadFileStepProps = {
  file: File | null;
  setFile: (f: File) => void;
  values: any;
};

export function UploadFile(props: UploadFileStepProps) {
  const { setFile, file } = props;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<any>({
    defaultValues: { leadFieldToCsvColumn: {} },
  });

  const [debounce, setDebounce] = useState(true);

  useEffect(() => {
    setDebounce(false);
  }, [debounce]);

  return (
    <FileUpload
      accept={".csv"}
      register={register("file_", { validate: validateFiles })}
      onChange={(files) => {
        if (debounce) {
          setDebounce(false);
          return;
        }

        setFile(files[0]);
      }}
    >
      <div className="full-width">
        <button
          className="btn"
          style={{
            width: "80%",
            height: "80%",
            minWidth: "150px",
            minHeight: "150px",
          }}
        >
          {file ? file.name : "Select File"}
        </button>
      </div>
    </FileUpload>
  );
}
