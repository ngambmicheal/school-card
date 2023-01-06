import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import ClasseInterface from "../../models/classe";
import api from "../../services/api";
import { UserType } from "../../utils/enums";
import Link from "next/link";

export default function ProfilePage({ ...error }) {
  const { data: session } = useSession();
  const [userClasses, setUserClasses] = useState<ClasseInterface[]>([]);
  const user = useUser(session);

  useEffect(() => {
    if (user)
      api.getUserClasses(user._id as string).then(({ data: { data } }: any) => {
        setUserClasses((s) => data);
      });
  }, [user]);

  return (
    <>
      <h3 className="my-3">Information Personelle</h3>
      <div>
        {" "}
        Name: <b> {user?.name} </b>{" "}
      </div>
      <div>
        {" "}
        Email: <b> {user?.email} </b>{" "}
      </div>
      <div>
        {" "}
        Type: <b> {user?.type} </b>{" "}
      </div>
      <div>
        {" "}
        Phone: <b> {user?.phone} </b>{" "}
      </div>

      {user?.type == UserType.STAFF && (
        <>
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
