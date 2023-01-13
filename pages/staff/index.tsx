import { useEffect, useState } from "react";
import UserInterface from "../../models/user";
import Link from "next/link";
import api from "../../services/api";
import Modal from "react-modal";
import { customStyles } from "../../services/constants";
import { UserRole, UserType } from "../../utils/enums";
import SchoolInterface from "../../models/school";
import { helperService } from "../../services";
import { useSession } from "next-auth/react";
import { generateRandomString } from "../../utils/calc";

export default function Users() {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [schools, setSchools] = useState<SchoolInterface[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data: session } = useSession();
  const [filterBy, setFilterBy] = useState<any>("");

  useEffect(() => {
    getUsers();
  }, []);

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const getUsers = () => {
    api.getUsers().then(({ data: { data } }: any) => {
      setUsers((s) => data);
    });

    api.getSchools().then(({ data: { data } }: any) => {
      setSchools((s) => data);
    });
  };

  const saveUser = (user: any) => {
    api.saveUser(user).then(() => getUsers());
    closeModal();
  };

  const generatePassword = () => {
    api.generatePasswordForSchoolStaff();
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-6">
          <button
            className="btn btn-success"
            onClick={() => setModalIsOpen(true)}
          >
            {" "}
            Ajouter utilisateur{" "}
          </button>
          <button
            className="btn btn-dark mx-2"
            onClick={() => generatePassword()}
          >
            Generate Password
          </button>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Filter By</label>
            <select
              className="form-control"
              name="type"
              value={filterBy}
              onChange={(e) => setFilterBy(() => e.target.value)}
            >
              <option value={""}>Select All</option>
              {Object.keys(UserType).map((key) => (
                <option value={key} selected={key == filterBy}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped table-bordered my-3 ">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Code</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Email</th>
            {session && <th>Password</th>}
            {session && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => (filterBy ? user.type == filterBy : user))
            .map((user) => {
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.matricule}</td>
                  <td>{user.phone}</td>
                  <td>{user.type}</td>
                  <td>{user.email}</td>
                  {session && <td>{user.password}</td>}
                  {session && (
                    <td>
                      <Link href={`/staff/${user._id}`}>Voir</Link>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>

      <CreateUserModal
        closeModal={closeModal}
        save={saveUser}
        modalIsOpen={modalIsOpen}
      />
    </>
  );
}

type CreateUserModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  save: (user: any) => void;
};
export function CreateUserModal({
  modalIsOpen,
  closeModal,
  save,
}: CreateUserModalProps) {
  const [user, setUser] = useState<UserInterface>({
    name: "",
    type: UserType.STAFF,
    role: [],
    username: "",
    password: generateRandomString(8),
    school_id: helperService.getSchoolId() ?? undefined,
    matricule: "",
  });

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setUser((inputData) => ({
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
        contentLabel="Add User"
      >
        <div className="modal-body">
          <h2>Ajouter un utilisateur</h2>
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
              onClick={() => save(user)}
              className="btn btn-success"
              disabled={!user.password || !user.name || !user.email}
            >
              Enregistrer
            </button>
            <button onClick={closeModal} className="btn btn-secondary end">
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
