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
  const [loading, setLoading] = useState(false);

  const updateSchool = async () => {
    if (school) {
      setLoading(true);
      try {
        await api.updateSchool(school);
        toast(successMessage('École mise à jour avec succès!'));
      } catch (error) {
        toast(errorMessage('Erreur lors de la mise à jour'));
      } finally {
        setLoading(false);
      }
    }
  };

  const toast = useToast();

  useEffect(() => {
    getSessions();
    getClasses();
  }, [])

  const getSessions = async () => {
    try {
      const response: any = await api.getSessions();
      setSchoolSessions(response.data.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  }

  const getClasses = async () => {
    try {
      const response: any = await api.getClasses();
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }

  const saveSession = (session: SessionInterface) => {
    api.saveSession(session).then(() => { 
      getSessions();
      toast(successMessage('Session ajoutée avec succès!'));
    }).catch(e => toast(errorMessage(e)))
  }

  const saveExam = (exam: ExamInterface, classes: string[]) => {
    api.saveExamForClasses(exam, classes).then(() => { 
      getSessions();
      toast(successMessage('Examen ajouté avec succès!'));
      setAddExamModal(false);
    }).catch(e => toast(errorMessage(e)))
  }

  const syncSchoolSession = async () => {
    try {
      await api.syncSchoolSession();
      toast(successMessage('Synchronisation réussie!'));
    } catch (e) {
      toast(errorMessage(e as string));
    }
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
      <div className="school-info-container">
        {/* Basic Information Section */}
        <div className="info-section">
          <div className="section-header">
            <h3>📋 Informations Générales</h3>
            <p>Paramètres de base de l'établissement</p>
          </div>
          
          <div className="info-grid">
            <div className="form-group">
              <label htmlFor="name">
                Nom de l'École <span className="required">*</span>
              </label>
              <input
                id="name"
                className="form-control"
                disabled={!editable}
                name="name"
                value={school?.name || ''}
                onChange={handleChange}
                placeholder="Nom de votre établissement"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                id="phone"
                type="tel"
                className="form-control"
                disabled={!editable}
                name="phone"
                value={school?.phone || ''}
                onChange={handleChange}
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-control"
                disabled={!editable}
                name="email"
                value={school?.email || ''}
                onChange={handleChange}
                placeholder="contact@ecole.fr"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Adresse</label>
              <input
                id="address"
                className="form-control"
                disabled={!editable}
                name="address"
                value={school?.address || ''}
                onChange={handleChange}
                placeholder="Adresse complète de l'école"
              />
            </div>

            <div className="form-group">
              <label htmlFor="box">Boîte Postale</label>
              <input
                id="box"
                className="form-control"
                disabled={!editable}
                name="box"
                value={school?.box || ''}
                onChange={handleChange}
                placeholder="BP 1234"
              />
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="info-section">
          <div className="section-header">
            <h3>⚙️ Paramètres du Système</h3>
            <p>Configuration des fonctionnalités et permissions</p>
          </div>
          
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">
                  Autoriser la modification des notes
                </label>
                <p className="setting-description">
                  Permet aux enseignants de modifier les notes après validation
                </p>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    disabled={!editable}
                    name="allowUpdate"
                    checked={school?.allowUpdate || false}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            {editable && (
              <div className="form-group">
                <label htmlFor="staff_password_length">
                  Longueur du mot de passe du personnel
                </label>
                <input
                  id="staff_password_length"
                  type="number"
                  className="form-control"
                  name="staff_password_length"
                  value={school?.staff_password_length || ''}
                  onChange={handleChange}
                  min="4"
                  max="20"
                  placeholder="8"
                />
                <small className="form-hint">
                  Nombre minimum de caractères pour les mots de passe
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Academic Year Section */}
        {editable && (
          <div className="info-section">
            <div className="section-header">
              <h3>📅 Année Scolaire</h3>
              <p>Gestion des sessions et examens</p>
            </div>
            
            <div className="academic-controls">
              <div className="form-group">
                <label htmlFor="session_id">Session Actuelle</label>
                <select 
                  id="session_id"
                  className="form-control" 
                  name="session_id" 
                  value={school?.session_id || ''} 
                  onChange={handleChange}
                >
                  <option value="">--- Sélectionner une session ---</option>
                  {schoolSessions.map(session => (
                    <option key={session._id} value={session._id}>
                      {session.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSessionModal(true)}
                >
                  ➕ Ajouter une Session
                </button>
                
                {school?.session_id && (
                  <button 
                    className="btn btn-warning"
                    onClick={syncSchoolSession}
                  >
                    🔄 Synchroniser Session
                  </button>
                )}
                
                <button 
                  className="btn btn-primary"
                  onClick={() => setAddExamModal(true)}
                >
                  📝 Ajouter un Examen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Section */}
        {editable && (
          <div className="save-section">
            <button
              className="btn btn-primary btn-lg"
              onClick={updateSchool}
              disabled={loading || !school?.session_id}
            >
              {loading ? (
                <>
                  <span className="loading-sm"></span>
                  Enregistrement...
                </>
              ) : (
                <>
                  💾 Enregistrer les Modifications
                </>
              )}
            </button>
            
            {!school?.session_id && (
              <p className="save-hint">
                Veuillez sélectionner une session pour enregistrer
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {sessionModal && school?._id && (
        <CreateSessionModal 
          modalIsOpen={sessionModal} 
          closeModal={() => setSessionModal(false)} 
          save={saveSession} 
          schoolId={school._id}
        />
      )}
      
      {addExamModal && school?._id && (
        <CreateExamModal 
          modalIsOpen={addExamModal}  
          classes={classes} 
          closeModal={() => setAddExamModal(false)} 
          save={saveExam} 
          schoolId={school._id}
        />
      )}

      <style jsx>{`
        .school-info-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .info-section {
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--secondary-200);
        }

        .section-header {
          margin-bottom: var(--spacing-xl);
          padding-bottom: var(--spacing-lg);
          border-bottom: 1px solid var(--secondary-200);
        }

        .section-header h3 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--secondary-900);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .section-header p {
          margin: 0;
          color: var(--secondary-600);
          font-size: 0.875rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border: 1px solid var(--secondary-200);
          border-radius: var(--radius-md);
          background: var(--secondary-50);
        }

        .setting-info {
          flex: 1;
        }

        .setting-label {
          font-weight: 500;
          color: var(--secondary-900);
          margin-bottom: var(--spacing-xs);
          display: block;
        }

        .setting-description {
          font-size: 0.875rem;
          color: var(--secondary-600);
          margin: 0;
        }

        .setting-control {
          margin-left: var(--spacing-lg);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--secondary-300);
          transition: .4s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
          box-shadow: var(--shadow-sm);
        }

        input:checked + .toggle-slider {
          background-color: var(--primary-600);
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        input:disabled + .toggle-slider {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .academic-controls {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .save-section {
          background: var(--primary-50);
          border: 1px solid var(--primary-200);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          text-align: center;
        }

        .save-hint {
          margin-top: var(--spacing-md);
          color: var(--warning-600);
          font-size: 0.875rem;
        }

        .form-hint {
          display: block;
          margin-top: var(--spacing-xs);
          color: var(--secondary-500);
          font-size: 0.75rem;
        }

        .loading-sm {
          display: inline-block;
          width: 0.875rem;
          height: 0.875rem;
          border: 2px solid var(--secondary-300);
          border-radius: 50%;
          border-top-color: var(--primary-600);
          animation: spin 1s ease-in-out infinite;
          margin-right: var(--spacing-sm);
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }

          .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .setting-control {
            margin-left: 0;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
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


