import { useEffect, useState } from "react";
import Classe from "../../models/classe";
import api from "../../services/api";
import ClasseInterface from "../../models/classe";
import Modal from "react-modal";
import { customStyles } from "../../services/constants";
import SchoolInterface from "../../models/school";
import SectionInterface from "../../models/section";
import { helperService } from "../../services";
import { useSession } from "next-auth/react";
import UserInterface from "../../models/user";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import useUser from "../../hooks/useUser";
import Dropdown from "../../components/dropdown";
import Header from "../../layouts/header";
import Link from "../../components/link";

export default function Classes() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [sections, setSections] = useState<SectionInterface[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [teachers, setTeachers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const {isAdmin} = useUser(session);

  useEffect(() => {
    getClasses();

    api.getSections().then((response: any) => {
      setSections(response.data.data);
    });

    api.getUsers().then((response: any) => {
      setTeachers(response.data.data.filter((t: any) => t.type === "STAFF"));
    });
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getClasses = () => {
    setLoading(true);
    api.getClasses().then((response: any) => {
      setClasses(response.data.data);
    }).finally(() => {
      setLoading(false);
    });
  };

  const saveClasse = (student: any) => {
    api.saveClasse(student).then(() => getClasses());
    closeModal();
  };

  const deleteClasse = (studentId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette classe?"))
      api.deleteClasse(studentId).then(() => getClasses());
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="modern-container">
          <div className="page-title">
            <h1>Gestion des Classes</h1>
            {session && isAdmin && (
              <div className="page-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setModalIsOpen(true)}
                  disabled={loading}
                >
                  ➕ Ajouter une Classe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{classes.length}</div>
          <div className="stat-label">Total Classes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {classes.filter(c => c.teacher_id).length}
          </div>
          <div className="stat-label">Avec Enseignant</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {new Set(classes.map(c => c.section?._id)).size}
          </div>
          <div className="stat-label">Sections Différentes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{teachers.length}</div>
          <div className="stat-label">Enseignants Disponibles</div>
        </div>
      </div>

      {/* Classes Table */}
      <div className="card">
        <div className="card-header">
          <h3>Liste des Classes ({classes.length})</h3>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading"></div>
              <p>Chargement des classes...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏛️</div>
              <h3>Aucune classe enregistrée</h3>
              <p>Commencez par créer votre première classe</p>
              {session && isAdmin && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => setModalIsOpen(true)}
                >
                  ➕ Créer une Classe
                </button>
              )}
            </div>
          ) : (
            <div className="modern-table">
              <table>
                <thead>
                  <tr>
                    <th>Nom de la Classe</th>
                    <th>École</th>
                    <th>Section</th>
                    <th>Enseignant</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((classe: any) => (
                    <ClasseRow
                      teachers={teachers}
                      session={session}
                      classe={classe}
                      deleteClasse={deleteClasse}
                      isAdmin={isAdmin}
                      key={`class_row_${classe._id}`}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateClassModal
        closeModal={closeModal}
        save={saveClasse}
        modalIsOpen={modalIsOpen}
        sections={sections}
      />

      <style jsx>{`
        .loading-container {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-container .loading {
          margin: 0 auto var(--spacing-lg);
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-lg);
        }

        .empty-state h3 {
          color: var(--secondary-700);
          margin-bottom: var(--spacing-sm);
        }

        .empty-state p {
          color: var(--secondary-500);
        }

        @media (max-width: 768px) {
          .page-title {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .page-actions {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}

type ClasseRowInterface = {
  classe: ClasseInterface;
  deleteClasse: (id: string) => void;
  session: any;
  teachers: UserInterface[];
  isAdmin: boolean;
};

export function ClasseRow({
  classe,
  deleteClasse,
  session,
  teachers,
  isAdmin
}: ClasseRowInterface) {
  const [teacher, setTeacher] = useState(classe.teacher_id);

  const updateTeacher = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tt = event.target.value;
    const tea = teachers.find((t) => t._id == tt);
    if (tt != "") {
      setTeacher(tt);
      api.updateClasse({ _id: classe._id, teacher_id: tt, teacher: tea?.name });
    }
  };

  return (
    <tr key={classe._id}>
      <td>
        <div className="class-info">
          <Link href={`classes/${classe._id}`} className="class-link">
            {classe.name}
          </Link>
        </div>
      </td>
      <td>
        <span className="school-info">
          {classe.school?.name || 'Non défini'}
        </span>
      </td>
      <td>
        <span className="section-badge">
          {classe.section?.name || 'Non assignée'}
        </span>
      </td>
      <td>
        <select
          disabled={!session || !isAdmin}
          value={teacher || ''}
          className="form-control teacher-select"
          onChange={updateTeacher}
        >
          <option value="">-- Sélectionner un enseignant --</option>
          {teachers.map((tr) => (
            <option key={tr._id} value={tr._id}>{tr.name}</option>
          ))}
        </select>
      </td>
      <td>
        <div className="actions-container">
          <Link href={`classes/${classe._id}`}>
            <a className="action-link view-action">
              👁️ Voir
            </a>
          </Link>
          {isAdmin && (
            <button
              className="action-link delete-action"
              onClick={() => deleteClasse(classe._id)}
            >
              🗑️ Supprimer
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

type CreateClassModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  save: (student: any) => void;
  sections: SectionInterface[];
};

export function CreateClassModal({
  modalIsOpen,
  closeModal,
  save,
  sections,
}: CreateClassModalProps) {
  const [classe, setClasse] = useState<ClasseInterface>({
    name: "",
    school: helperService.getSchoolId(),
  });

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setClasse((inputData) => ({
      ...inputData,
      [key]: value,
    }));
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Ajouter une Classe"
    >
      <div className="modal-header">
        <h2>Ajouter une Nouvelle Classe</h2>
        <button 
          className="modal-close"
          onClick={closeModal}
          type="button"
        >
          ✕
        </button>
      </div>
      
      <div className="modal-body">
        <form onSubmit={(e) => { e.preventDefault(); save(classe); }}>
          <div className="form-group">
            <label htmlFor="name">
              Nom de la Classe <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Ex: 6ème A, CM2 B..."
              value={classe.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="section_id">Section</label>
            <select
              id="section_id"
              name="section_id"
              className="form-control"
              value={classe.section_id || ''}
              onChange={handleChange}
            >
              <option value="">-- Sélectionner une section --</option>
              {sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              ➕ Créer la Classe
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--secondary-200);
        }

        .modal-header h2 {
          margin: 0;
          color: var(--secondary-900);
          font-size: 1.25rem;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--secondary-500);
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: var(--secondary-100);
          color: var(--secondary-700);
        }

        .modal-body {
          padding: var(--spacing-lg);
        }

        .modal-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--secondary-200);
        }

        .class-info {
          display: flex;
          flex-direction: column;
        }

        .class-link {
          font-weight: 500;
          color: var(--primary-600);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .class-link:hover {
          color: var(--primary-700);
          text-decoration: underline;
        }

        .school-info {
          color: var(--secondary-600);
          font-size: 0.875rem;
        }

        .section-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--success-100);
          color: var(--success-700);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .teacher-select {
          font-size: 0.875rem;
          max-width: 200px;
        }

        .actions-container {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }

        .action-link {
          border: none;
          background: none;
          cursor: pointer;
          font-family: inherit;
        }
      `}</style>
    </Modal>
  );
}
