import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import ClasseInterface from "../../models/classe";
import api from "../../services/api";
import { UserType } from "../../utils/enums";
import Link from "next/link";
import StudentInterface from "../../models/student";


export default function ProfilePage({ ...error }) {
  const { data: session } = useSession();
  const {user} = useUser(session);
  const [student, setStudent] = useState<StudentInterface>()

  const router = useRouter();
  const { _id: studentId } = router.query;

  useEffect(() => {
    if (studentId)
      api.getStudent(studentId as string).then(({data: { data}}: any) => {
          setStudent(d => data)
      })
  }, [studentId]);

  function getProfileImage(){
    return student?.image ? student.image :  student?.sex == 'M' ? '/images/male-avatar.jpg' : '/images/female-avatar.jpg';
  }

  const onFileChange = (e: any) => {
    const file = e.target.files[0];
    api.uploadFile(file, "STUDENT", studentId as string
    ).then((response) => {
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

      <div className="avatar">
        <img className="img img-rounded" src={getProfileImage()} height={200} width={200} />

        <input type="file" onChange={onFileChange} name="Edit" accept=".jpg, .png" />
      </div>

      <div className="mt-4">
        {" "}
        Name: <b> {student?.name} </b>{" "}
      </div>
      <div>
        {" "}
        Email: <b> {student?.email} </b>{" "}
      </div>
      <div>
        {" "}
        Type: <b> {user?.type} </b>{" "}
      </div>
      <div>
        {" "}
        Phone: <b> {user?.phone || student?.phone} </b>{" "}
      </div>
      <div>
        {" "}
        matricule: <b> {user?.matricule} </b>{" "}
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
    </>
  );
}
