import { useEffect, useState } from "react"
import UserInterface from "../../models/user"
import Link from 'next/link';
import api from "../../services/api";
import Modal from 'react-modal';
import { customStyles } from "../../services/constants";
import { UserRole, UserType } from "../../utils/enums";
import SchoolInterface from "../../models/school";
import { helperService } from "../../services";

export default function Users(){
    const [users, setUsers] = useState<UserInterface[]>([])
    const [schools, setSchools] = useState<SchoolInterface[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        getUsers()
    }, []);


    const closeModal = () => {
        setModalIsOpen(s => false);
    }

    const getUsers= () => {
        api.getUsers().then(({data:{data}} :any) => {
            setUsers(s =>data)
        })

        api.getSchools().then(({data:{data}}:any) => {
            setSchools(s => data)
        })
    }

    const saveUser = (user:any) => {
        api.saveUser(user).then(() => getUsers())
        closeModal();
    }

    return (
        <>
            <button className='btn btn-success' onClick={() => setModalIsOpen(true)}> Ajouter utilisateur </button>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Numéro de téléphone</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                       return  <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.phone}</td>
                            <td>{user.email}</td>
                            <td><Link href={`users/${user._id}`}>Voir</Link></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>

            <CreateUserModal closeModal={closeModal} save={saveUser} modalIsOpen={modalIsOpen} />
        </>
    )
}

type CreateUserModalProps = {
    modalIsOpen:boolean,
    closeModal: () => void,
    save:(user:any) => void
}
export function CreateUserModal({modalIsOpen, closeModal, save}:CreateUserModalProps){
    const [user, setUser] = useState<UserInterface>({ name:'', type:UserType.STAFF, role:[], username:'', password:'', school_id: helperService.getSchoolId()??undefined});

    function handleChange(e:any) {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        setUser(inputData => ({
          ...inputData,
          [key]: value
        }))
      }

      
    return (
        <div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Add User"
          >
            <div className='modal-body'>
            <h2 >Ajouter un utilisateur</h2>
            <button onClick={closeModal} className='btn btn-secondary end'>Annuler</button>
                <div className='form-group'>
                    <label>Nom</label>
                    <input className='form-control' name='name' value={user?.name} onChange={handleChange}></input>
                </div>
                

                <div className='form-group'>
                    <label>Email</label>
                    <input className='form-control' name='email' value={user?.email} onChange={handleChange}></input>
                </div>

                <div className='form-group'>
                    <label>Password</label>
                    <input className='form-control' name='password' value={user?.password} onChange={handleChange}></input>
                </div>

                <div className='form-group'>
                    <label>Phone</label>
                    <input className='form-control' name='phone' value={user?.phone} onChange={handleChange}></input>
                </div>

                <div className='form-group'>
                    <label>Type</label>
                    <select className='form-control' name='type' value={user?.type} onChange={handleChange}>
                        {Object.keys(UserType).map(key => <option value={key} selected={key==user.type}>{key}</option>)}
                    </select>
                </div>


                <div className='from-group mt-3'>
                    <button onClick={() =>save(user)} className='btn btn-success' disabled={!user.password}>Enregistrer</button>
                </div>
            </div>
          </Modal>
        </div>
      );
}

