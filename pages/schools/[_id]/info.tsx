import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import SchoolInterface from "../../../models/school";
import SessionInterface from "../../../models/session";
import api from "../../../services/api";
import { customStyles } from "../../../services/constants";
import { errorMessage, successMessage } from "../../../utils/messages";
import ExamInterface from "../../../models/exam";
import ClasseInterface from "../../../models/classe";

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
  const [classes, setClasses] = useState<ClasseInterface[]>([])
  const [sessionModal, setSessionModal] = useState(false);
  const [addExamModal, setAddExamModal] = useState(false);

  const updateSchool = () => {
    if (school) {
      api.updateSchool(school).then(() => { toast(successMessage('School Updated successfully!')) });
    }
  };
  const toast = useToast();

  useEffect(() => {
    getSessions();
    getClasses();
  }, [])

  const getSessions = async () => {
    const response = await api.getSessions()
    setSchoolSessions(s => response.data.data)
  }

  const getClasses = async () => {
    const response = await api.getClasses()
    setClasses(s => response.data.data)
  }

  const saveSession = (session: SessionInterface) => {
    api.saveSession(session).then(() => { getSessions(), toast(successMessage('Session added successfully!')) }).catch(e => toast(errorMessage(e)))
  }

  const saveExam = (exam: ExamInterface, classes: string[]) => {
    api.saveExamForClasses(exam,  classes).then(() => { 
      getSessions();
      toast(successMessage('Session added successfully!'));
      setAddExamModal(s => false)
    }).catch(e => toast(errorMessage(e)))
  }

  const syncSchoolSession = async () => {
    api.syncSchoolSession().then(() => toast(successMessage('Synced successfully!'))).catch(e => toast(errorMessage(e)))
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
                <button className="btn btn-dark" onClick={() => setSessionModal(true)}>Add School Session</button>
                {school?.session_id && <button className="btn btn-secondary mx-3" onClick={() => syncSchoolSession()}>Sync Session</button>}
                <hr className="my-3"></hr>

                <button className="btn btn-danger" onClick={() => setAddExamModal(true)}>Add Exam</button>
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
      {addExamModal && school?._id && <CreateExamModal modalIsOpen={addExamModal}  classes={classes} closeModal={() => setAddExamModal(false)} save={saveExam} schoolId={school._id}></CreateExamModal>}
    </>
  );
}



type CreateSessionModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  save: (student: any) => void;
  schoolId: string
};
export function CreateSessionModal({
  modalIsOpen,
  closeModal,
  save,
  schoolId
}: CreateSessionModalProps) {

  const year = new Date().getFullYear();
  const name = `${year} - ${year + 1}`

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


type CreateExamModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  save: (student: any) => void;
  schoolId: string,
  classes: ClasseInterface[]
};

export function CreateExamModal({
  modalIsOpen,
  closeModal,
  save,
  schoolId,
  classes
}: CreateExamModalProps) {

  const year = new Date().getFullYear();
  const name = `Trimestre 1`

  const [exam, setExam] = useState<ExamInterface>({
    name: name,
    school: schoolId
  });

  const [selectedClasses, setSelectedClasses] = useState<any[]>([])


  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setExam((inputData) => ({
      ...inputData,
      [key]: value,
    }));
  }

  const handleClasseChange = (e: any) => {
    const key = e.target.name;
    const value = e.target.checked;
    let oldCl = selectedClasses;     
    oldCl.push(key)

    setSelectedClasses((inputData) => oldCl);
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Exam"
        ariaHideApp={false}
      >
        <div className="modal-body" style={{minHeight:"400px"}}>
          <h2>Ajouter un examin</h2>
          <div className="form-group my-3">
            <label>Name </label>
            <input
              className="form-control"
              name="name"
              value={exam?.name}
              onChange={handleChange}
            ></input>
          </div>

          <div>
          <div className="table-responsive" style={{maxHeight:"400px", height: "400px"}}>
            <table className="table" >
                <thead>
                    <tr>
                        <th>Classe</th>
                        <th>Section</th>
                        <th>Select</th>
                    </tr>
                  </thead> 
                  <tbody>
                      {classes.map((classe, index) => {
                          return <tr key={index}>
                              <td>{classe.name}</td>
                              <td>{classe?.section?.name ?? '--'}</td>
                              <td><input checked={ selectedClasses?.includes(classe._id)} type="checkbox" name={classe._id} value={classe._id} onChange={(e) => handleClasseChange(e)}></input></td>
                          </tr>
                      })}
                  </tbody>
            </table>
          </div>
          </div>

          <div className="from-group">
            <button
              onClick={() => save(exam, selectedClasses)}
              className="btn btn-success"
              disabled={!exam.name || !selectedClasses.length}
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


