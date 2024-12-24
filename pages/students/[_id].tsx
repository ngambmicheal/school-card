import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import ClasseInterface from "../../models/classe";
import api from "../../services/api";
import { UserType } from "../../utils/enums";
import Link from "next/link";
import StudentInterface from "../../models/student";
import SessionInterface from "../../models/session";


export default function ProfilePage({ ...error }) {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<SessionInterface[]>([]);
  const {user} = useUser(session);
  const [student, setStudent] = useState<StudentInterface>()

  const router = useRouter();
  const { _id: studentId } = router.query;

  useEffect(() => {
    if (studentId)
      api.getStudent(studentId as string).then(({data: { data}}: any) => {
          setStudent(d => data)
      })

    getSessions();
  }, [studentId]);

  function getProfileImage(){
    return student?.image ? student.image :  student?.sex == 'M' ? '/images/male-avatar.jpg' : '/images/female-avatar.jpg';
  }

  function getSessions(){
    api.getSessions().then(({data: {data}}: any) => {
      setSessions(d => data)
    })
  }

  const onFileChange = (e: any) => {
    const file = e.target.files[0];
    api.uploadFile(file, "STUDENT", studentId as string).then((response) => {
        const fileName = `/uploads/${response.data.data.newFilename}`;
        if(student)
          api.updateStudent({_id:student._id, image: fileName} as StudentInterface).then(() => {
              setStudent(d => ({...d, image: fileName}))
          })
    })
  }

  return (
    <>
      <h3 className="my-3 ">Information Personelle</h3>

      <div className="row">
        <div className="col-md-4">
          <div className="avatar">
            <img className="img img-rounded" src={getProfileImage()} height={200} width={200} />

            <input type="file" onChange={onFileChange} name="Edit" accept=".jpg, .png" className="form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mt-4">
            Name: <b> {student?.name} </b>
          </div>
          <div>
            Email: <b> {student?.email} </b>
          </div>
          <p>Sex: <b>{student?.sex}</b></p>
          <p>Type: <b> {user?.type}</b> </p>
          <p>
            Phone: <b> {user?.phone || student?.phone} </b>
          </p>
          <p>
          Matricule: <b> {user?.matricule} </b>
        </p>
          <p>Class: <b> {student?.class_id?.name}</b></p>
        </div>
      </div>

      {user?.type == UserType.STAFF && (
        <>
          <hr />
          <h3 className="my-3">Mes Classes</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userClasses.map((classe) => {
                return (
                  <>
                    <tr>
                      <td>{classe.name}</td>
                      <td>
                        <Link href={`/classes/${classe._id}`}>Voir</Link>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {
        sessions.map((session) => {
          return <UserDataPerSession session={session} user={user} student={student} > </UserDataPerSession>
        })
      }
    </>
  );
}

type UserDataPerSessionProps = {
  session: SessionInterface;
  user: any;
  student: StudentInterface;
}

function UserDataPerSession(props: UserDataPerSessionProps){
  const {session, user, student} = props;
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    getExams();
  }, [session, student]);

  const getExams = () => {
    if(session?._id && student?._id){
      api.getExamResultsByStudent(student._id, session._id, "exam").then(({data: {data}}: any) => {
        setExams(d => data)
      })
    }


  }

  return <>

  {/* EXAM */}
    {exams.length ? <div className="my-3">
      <hr />
      <h3 className="my-3">Session: {session.name}</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Exam</th>
            <th>Rank</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => {
            return (
              <tr key={`exam_${exam._id}`}>
                <td>{exam.exam_id?.name}</td>
                <td>{exam.rank}</td>
                <td>{getAverage(exam.exam_id, exam)}</td>
              </tr>
            );
          })}

        </tbody>
        </table>

    </div> : <></>
  }
  

  </>

}

function getAverage(exam, results){
  const total = Object.keys(exam).filter(key => key.startsWith("point_")).reduce((acc, key) => { return acc + exam[key]}, 0); 
  const totalResults = Object.keys(results).filter(key => key.startsWith("subject_")).reduce((acc, key) => { return acc + results[key]}, 0);

  return Number(((totalResults / total) * 20)).toFixed(2);
}
