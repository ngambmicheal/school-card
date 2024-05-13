import { useRouter } from "next/dist/client/router";
import React from "react";
import { useEffect, useState } from "react";
import { logo } from "../../../assets/jsx/image";
import CompetenceInterface from "../../../models/competence";
import { courseSchema } from "../../../models/course";
import api from "../../../services/api";

export default function coursesPage() {
  const [competences, setCompetences] = useState<CompetenceInterface[]>([]);
  const [results, setResults] = useState<any>({});
  const [email, setEmail] = useState("");

  const router = useRouter();
  const { _id: resultsId } = router.query;

  useEffect(() => {
    api.getCompetences().then(({ data: { data } }: any) => {
      setCompetences((s) => data);
    });
  }, []);

  useEffect(() => {
    if (resultsId) {
      api.getResults(resultsId).then(({ data: { data } }: any) => {
        setResults(data);
      });
    }
  }, [resultsId]);

  const getCompetencesLenght = (competence: CompetenceInterface) => {
    let total = 0;
    console.log(total);
    competence.subjects &&
      competence.subjects.map((s) => {
        total += s.courses?.length ?? 0;
        total += 1;
      });
    return total;
  };

  const printResults = () => {
    window.open(
      `/api/exams/results/print-result?result=${resultsId}`,
      "_blank"
    );
  };
  return (
    <>
      <button className="btn btn-success mx-2" onClick={printResults}>
        {" "}
        Imprimer{" "}
      </button>
      <button className="btn btn-success mx-2"> Envoyer au Parent </button>
      <input placeholder="parent email" width={100} />
      <div
        className="show-logo"
        style={{ backgroundImage: `url('data:image/jpeg;base64, ${logo}')` }}
      >
        <table className="table2">
          <tr>
            <th>
              REPUBLIQUE DU CAMEROUN <br />
              Paix - Travail - Patrie <br />
              GROUPE SCOLAIRE BILINGUE PRIVE <br />
              LAIC LA SEMENCE <br />
              BP: 1661 DOUALA BANGUE <br />
              TEL: (237) 33 08 95 82/699717529 <br />
            </th>
            <th className="">
              <img src="/logo.png" height={200} />
            </th>
            <th className="">
              REPUBLIC OF CAMEROON <br />
              Peace - Work - Father/land <br />
              GROUPE SCOLAIRE BILINGUE PRIVE LAIC LA SEMENCE <br />
              P.O Box : 1661 DOUALA-BANGUE <br />
              Tel : (237) 33089582 <br />
            </th>
          </tr>
        </table>

        <div>BULLETIN D'EVALUATION 2023/2024</div>

        <div>
          <table className="table1">
            <thead>
              <tr>
                <th>NOMS ET PRENOMS</th>
                <th colSpan={3}>{results?.student?.name}</th>
              </tr>
              <tr>
                <th>DATE DE NAISSANCE</th>
                <th className="th"></th>
                <th>SEXE</th>
                <th></th>
              </tr>
              <tr>
                <th>CLASSE</th>
                <th className="th"> </th>
                <th>ENSEIGNANT</th>
                <th className="th"></th>
              </tr>
            </thead>
          </table>
        </div>

        <table className="table1">
          <thead>
            <tr>
              <th rowSpan={2} className="th">
                COMPETENCE
              </th>
              <th rowSpan={2} className="th">
                SOUS-COMPETENCE
              </th>
              <th className="th">UNITE D'APPRENTISSAGE</th>
              <th colSpan={2}>UA1</th>
            </tr>
            <tr>
              <th>EVALUATION</th>
              <th>NOTES</th>
              <th>COTE</th>
            </tr>
          </thead>
          <tbody>
            {competences &&
              competences.map((competence) => {
                return (
                  <>
                    {competence.subjects?.map((subject, subjectIndex) => {
                      return (
                        <>
                          {subject.courses?.map((course, courseIndex) => {
                            return (
                              <>
                                <tr>
                                  {!subjectIndex && !courseIndex && (
                                    <td
                                      rowSpan={getCompetencesLenght(competence)}
                                    >
                                      {" "}
                                      {competence.name}{" "}
                                    </td>
                                  )}
                                  {!courseIndex && (
                                    <td
                                      rowSpan={
                                        (subject.courses?.length ?? 1) + 1
                                      }
                                    >
                                      {" "}
                                      {subject.name}{" "}
                                    </td>
                                  )}
                                  <td>{course.name} </td>
                                  <td>
                                    {results[`subject_${course._id}`] ?? 0}
                                  </td>
                                  <td>
                                    {results.exam_id?.[`point_${course._id}`]}
                                  </td>
                                </tr>
                              </>
                            );
                          })}

                          <tr>
                            <th>Total </th>
                            <th>{results[`total_${subject._id}`] ?? 0}</th>
                            <th>{results.exam_id?.[`point_${subject._id}`]}</th>
                          </tr>
                        </>
                      );
                    })}
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
