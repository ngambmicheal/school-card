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
import TermInterface from "../../../models/terms";
import { CSVLink } from "react-csv";
import { addNumbers } from "../../../utils/actions";


export default function examDetails() {
  const [exam, setExam] = useState<ExamInterface>();
  const [annualExam, setTerm] = useState<TermInterface>();
  const [competences, setCompetences] = useState<CompetenceInterface[]>([]);
  const [points, setPoints] = useState(0);

  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [results, setResults] = useState<any>([]);
  const [ImportIsOpen, setImportIsOpen] = useState(false);

  const router = useRouter();
  const { annualExam_id: examId } = router.query;

  useEffect(() => {
    if (examId) {
      api.getAnnualExam(examId as string).then(({ data: { data } }: any) => {
        setTerm(data);
        setExam(data.terms[0].exams[0]);
      });

      api
        .getAnnualExamResult(examId as string)
        .then(({ data: { data } }: any) => {
          setResults(data);
        });
    }
  }, [examId]);

  useEffect(() => {
    if (annualExam) {
      api
        .getSchoolCompetences({
          school: annualExam?.class.school,
          report_type: annualExam.class.section.report_type,
        })
        .then(({ data: { data } }: any) => {
          setCompetences((s) => data);
        });
    }
  }, [annualExam]);

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
    window.open(
      `/api/exams/annual/${annualExam?.report_type?.toLocaleLowerCase()}?annualExam_id=${examId}`,
      "_blank"
    );
  };

  const printStats = () => {
    window.open(
      `/api/exams/annual/${annualExam?.report_type?.toLocaleLowerCase()}-stats?annualExam_id=${examId}`,
      "_blank"
    );
  };

  const deleteResult = (resultId: string) => {
    api.deleteResult(resultId).then(() => {
      api.getExamResults(examId).then(({ data: { data } }: any) => {
        setResults(data);
      });
    });
  };

  // useEffect(() => {
  //     if(exam?._id){

  //         api.updateExam(exam._id, exam).then(({data:{data}} : any) => {
  //             //setExam(data)
  //         })
  //     }
  // }, [exam])

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

  const getTotalPoints = () => {
    let sum = 0;
    console.log(sum);
    for (const el in exam) {
      if (el.includes("point_")) {
        sum = addNumbers(sum, exam[el] ?? 0);
        console.log(exam[el]);
      }
    }
    setPoints((s) => sum);
  };

  const getRank = () => {
    api.calculateAnnualExam(examId as string);
  };

  const getTotal = (result) => {
    let sum = 0;
    for (const el in result) {
      if (el.includes("subject_")) {
        sum= addNumbers(sum, result[el]);
      }
    }
    return sum;
  };

  const printTD = () => {
    window.open(
      `/api/annualExams/td/${annualExam?.report_type?.toLocaleLowerCase()}?annualExam_id=${examId}`,
      "_blank"
    );
  };

  const printAttestation = () => {
    window.open(
      `/api/annualExams/attestation/${annualExam?.report_type?.toLocaleLowerCase()}?annualExam_id=${annualExam?._id}`,
      "_blank"
    );
  };

  const [resultsCsv, setResultsCsv] = useState<any>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [headers, setHeaders] = useState<any>([]);

  function getCsvData() {
    let data = results
      .map((result: any) => {
        const total = getTotal(result);
        return {
          ...result,
          total: total.toFixed(2),
          average: ((total / points) * 20).toFixed(2),
        };
      })
      .sort((a: any, b: any) => {
        if (a.rank < b.rank) return 1;
        if (a.rank > b.rank) return -1;
        return 0;
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
        <h3>Classe : {annualExam?.class?.name} </h3>
        <h4>TRIMESTRE : {annualExam?.name} </h4>
      </div>
      <button className="mx-3 btn btn-success" onClick={() => printResults()}>
        {" "}
        Imprimer Resultats{" "}
      </button>

      <button className="mx-3 btn btn-success" onClick={() => getRank()}>
        {" "}
        Calculer{" "}
      </button>

      <button className="mx-3 btn btn-dark" onClick={() => printStats(true)}>
        {" "}
        Imprimer Statistics
      </button>

      <button className="mx-3 btn btn-dark" onClick={() => printTD()}>
        {" "}
        Imprimer Tableau D
      </button>

      <button className="mx-3 btn btn-dark" onClick={() => printAttestation()}>
        {" "}
        Imprimer Attestation
      </button>

      {resultsCsv.length && (
        <CSVLink
          data={resultsCsv}
          headers={headers}
          className="btn btn-dark mx-3"
          filename={`statistics-${annualExam?.class?.name}-${annualExam?.name}.csv`}
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
            <th>Tableau d'honneur</th>
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
                />
              );
            })}
        </tbody>
      </table>
    </>
  );
}

const reducer = (previousValue: any, currentValue: any) =>
  parseFloat( (parseFloat(previousValue ?? 0) + parseFloat(currentValue ?? 0)).toFixed(2));

export function ExamResult({
  result,
  competences,
  exam,
  points,
  deleteResult,
}: {
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
        sum= addNumbers(sum,result[el]);
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
                          readOnly
                          disabled
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
      <th>
        <input
          type="checkbox"
          name="th"
          checked={res.th == true}
          onClick={handleChange}
        />
      </th>
      <th>
        {" "}
        <Link
          href={`/api/exams/results/dynamic-print?annualExam_id=${res.annualExam_id}&student_id=${res.student._id}`}
        >
          Imprimer
        </Link>{" "}
        | <a onClick={() => deleteResult(res._id)}> Delete</a>{" "}
      </th>
    </tr>
  );
}
