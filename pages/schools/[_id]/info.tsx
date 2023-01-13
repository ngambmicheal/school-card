import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import SchoolInterface from "../../../models/school";
import SessionInterface from "../../../models/session";
import api from "../../../services/api";
import { customStyles } from "../../../services/constants";
import { errorMessage, successMessage } from "../../../utils/messages";

type InfoSettingsParams = {
  school: SchoolInterface;
  editable: boolean;
};

export default function SchoolSettingInfo({
  school: schol,
  editable,
}: InfoSettingsParams) {
  const [school, setSchool] = useState<SchoolInterface | undefined>(schol);
  const [schoolSessions, setSchoolSessions] = useState<SessionInterface[]>([])
  const [sessionModal, setSessionModal] = useState(false);

  const updateSchool = () => {
    if (school) {
      api.updateSchool(school).then(() => { toast(successMessage('School Updated successfully!'))});
    }
  };
  const toast = useToast(); 

  useEffect(() => {
    getSessions(); 
  }, [])
  
  const getSessions = async () => {
    const response = await api.getSessions()
    setSchoolSessions(s => response.data.data)
  }

  const saveSession = (session:SessionInterface) => {
    api.saveSession(session).then(() => {getSessions(), toast(successMessage('Session added successfully!')) } ).catch(e => toast(errorMessage(e)))
  }

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setSchool((inputData) => ({
      ...inputData,
      [key]: value,
    }));
  }

  return (
    <>
      <div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Name </label>
              <input
                className="form-control"
                disabled={!editable}
                name="name"
                value={school?.name}
                onChange={handleChange}
              ></input>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                className="form-control"
                disabled={!editable}
                name="phone"
                value={school?.phone}
                onChange={handleChange}
              ></input>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                className="form-control"
                disabled={!editable}
                name="address"
                value={school?.address}
                onChange={handleChange}
              ></input>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                disabled={!editable}
                name="email"
                value={school?.email}
                onChange={handleChange}
              ></input>
            </div>
            <div className="form-group">
              <label>P.O Box</label>
              <input
                className="form-control"
                disabled={!editable}
                name="box"
                value={school?.box}
                onChange={handleChange}
              ></input>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Allow mark editing </label>
              <input
                className="mx-4"
                type="checkbox"
                disabled={!editable}
                name="allowUpdate"
                checked={school?.allowUpdate}
                onChange={handleChange}
              ></input>
            </div>
            {editable && (
              <div className="form-group">
                <label>Staff Password Lenght</label>
                <input
                  className="form-control"
                  name="staff_password_length"
                  value={school?.staff_password_length}
                  onChange={handleChange}
                ></input>
              </div>
            )}

            {editable && (
              <div className="form-group">
                <label>School Year</label>
                <select className="form-control" name="session_id" value={school?.session_id} onChange={handleChange}>
                  <option value=''>--- Select Session ---</option>
                  {schoolSessions.map(session => <option key={session._id} value={session._id}>{session.name}</option>)}
                </select>
                <button onClick={() => setSessionModal(true)}>Add School Session</button>
              </div>
            )}
          </div>
        </div>

        {editable && (
          <div className="row">
            <div className="col-sm-6">
              <button
                className="btn btn-success"
                onClick={() => updateSchool()}
                disabled={!school?.session_id}
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>

        {sessionModal && school?._id && <CreateSessionModal modalIsOpen={sessionModal} closeModal={() => setSessionModal(false)} save={saveSession} schoolId={school._id}></CreateSessionModal>}
    </>
  );
}



type CreateSessionModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  save: (student: any) => void;
  schoolId:string
};
export function CreateSessionModal({
  modalIsOpen,
  closeModal,
  save,
  schoolId
}: CreateSessionModalProps) {

  const year = new Date().getFullYear(); 
  const name = `${year} - ${year+1}`

  const [session, setSession] = useState<SessionInterface>({
    name: name,
    school: schoolId
  });

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setSession((inputData) => ({
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
        contentLabel="Add Classe"
        ariaHideApp={false}
      >
        <div className="modal-body">
          <h2>Ajouter une session</h2>
          <div className="form-group my-3">
            <label>Name </label>
            <input
              className="form-control"
              name="name"
              value={session?.name}
              onChange={handleChange}
            ></input>
          </div>

          <div className="from-group">
            <button
              onClick={() => save(session)}
              className="btn btn-success"
              disabled={!session.name}
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
  )
              }
