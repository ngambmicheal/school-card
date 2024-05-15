import { useEffect, useState } from "react";
import UserInterface from "../../models/user";
import { helperService } from "../../services";
import api from "../../services/api";
import { generateRandomString } from "../../utils/calc";
import { UserType } from "../../utils/enums";
import { useRouter } from "next/dist/client/router";

export default function viewStaff() {
  const [user, setUser] = useState<UserInterface>({
    name: "",
    type: UserType.STAFF,
    role: [],
    username: "",
    password: generateRandomString(8),
    school_id: helperService.getSchoolId() ?? undefined,
    matricule:''
  });
  const router = useRouter();
  const { _id: userId } = router.query;

  useEffect(() => {
    if (userId)
      api.getUsers().then(({ data: { data } }: any) => {
        const user = data.find((ur: UserInterface) => ur._id === userId);
        setUser((s) => user);
      });
  }, [userId]);

  const handleChange = (e: any) => {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setUser((inputData) => ({
      ...inputData,
      [key]: value,
    }));
  };

  const saveUser = (user: UserInterface) => {
    api.updateUser(user);
  };

  const generateMatricule = () => {
    api.generateMatricule(userId as string).then(() => { 
      window.location = window.location;
    })
  }

  return (
    <>
    <div className="row">
      <div className="col-sm-6">
      <div className="modal-body">
        <h2>Modifier L'utilisateur</h2>
        <div className="form-group">
          <label>Nom</label>
          <input
            className="form-control"
            name="name"
            value={user?.name}
            onChange={handleChange}
          ></input>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            name="email"
            value={user?.email}
            onChange={handleChange}
          ></input>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            name="password"
            value={user?.password}
            onChange={handleChange}
          ></input>
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            className="form-control"
            name="phone"
            value={user?.phone}
            onChange={handleChange}
          ></input>
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            className="form-control"
            name="type"
            value={user?.type}
            onChange={handleChange}
            disabled={true}
          >
            {Object.keys(UserType).map((key) => (
              <option value={key} selected={key == user.type}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="from-group mt-3">
          <button
            onClick={() => saveUser(user)}
            className="btn btn-success"
            disabled={!user.password}
          >
            Enregistrer
          </button>
        </div>
      </div>
      </div>
      <div className="col-sm-6">
        <div className="form-group">
            <label>Matricule</label>
            <input
            disabled={true}
              className="form-control"
              name="matricule"
              value={user?.matricule}
              onChange={handleChange}
            ></input>
          </div>
          {user.matricule && <button className="btn btn-dark" onClick={() => generateMatricule()}>Generate Matricule</button> }
      </div>

    </div>
    </>
  );
}
