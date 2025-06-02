import { useEffect, useState } from "react";
import Classe from "../../models/student";
import api from "../../services/api";
import ClasseInterface from "../../models/student";
import Modal from "react-modal";
import { CreateStudentModal } from "../classes/modals/student-forms";
import { useToast } from "@chakra-ui/react";
import { errorMessage, successMessage } from "../../utils/messages";
import Link from "../../components/link";

export default function Students() {
  const [students, setStudents] = useState<Classe[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Classe[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  useEffect(() => {
    getStudents();
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const filterStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filter = e.target.value;
    setSearchTerm(filter);
    const filteredStudents = students.filter(student => 
      student.name.toLowerCase().includes(filter.toLowerCase()) || 
      student.matricule?.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredStudents(filteredStudents);
  }

  const getStudents = () => {
    setLoading(true);
    api.getStudents().then((response: any) => {
      setStudents(response.data.data);
      setFilteredStudents(response.data.data);
    }).catch((error) => {
      toast(errorMessage(error.response?.data?.message ?? error.message));
    }).finally(() => {
      setLoading(false);
    });
  };

  const syncPhotos = () => {
    api.syncPhotos().then((response: any) => {
      toast(successMessage(response.data.message));
      getStudents();
    }).catch((error) =>
      toast(errorMessage(error.response?.data?.message ?? error.message))
    );  
  }

  const saveStudent = (student: any, file: any) => {
    api
      .saveStudent(student, file)
      .then(async (response: any) => {
        if (file) {
          api.uploadFile(file, 'STUDENT', response.data.data._id);
        }
        toast(successMessage("Élève créé avec succès!"));
        getStudents();
      })
      .catch((error) =>
        toast(errorMessage(error.response?.data?.message ?? error.message))
      );
    closeModal();
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="modern-container">
          <div className="page-title">
            <h1>Gestion des Élèves</h1>
            <div className="page-actions">
              <button 
                className="btn btn-secondary" 
                onClick={syncPhotos}
                disabled={loading}
              >
                📷 Synchroniser Photos
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => setModalIsOpen(true)}
                disabled={loading}
              >
                ➕ Ajouter un Élève
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">Total Élèves</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filteredStudents.length}</div>
          <div className="stat-label">Résultats Affichés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {students.filter(s => s.image).length}
          </div>
          <div className="stat-label">Avec Photo</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {new Set(students.map(s => s.class_id?._id)).size}
          </div>
          <div className="stat-label">Classes Différentes</div>
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <div className="card-body">
          <div className="search-container">
            <input 
              type="text"
              placeholder="Rechercher un élève par nom ou matricule..." 
              className="form-control search-input" 
              value={searchTerm}
              onChange={filterStudent}
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="card-header">
          <h3>Liste des Élèves ({filteredStudents.length})</h3>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading"></div>
              <p>Chargement des élèves...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👨‍🎓</div>
              <h3>
                {searchTerm ? 'Aucun élève trouvé' : 'Aucun élève enregistré'}
              </h3>
              <p>
                {searchTerm 
                  ? 'Essayez de modifier votre recherche' 
                  : 'Commencez par ajouter votre premier élève'
                }
              </p>
            </div>
          ) : (
            <div className="modern-table">
              <table>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Nom Complet</th>
                    <th>Matricule</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Genre</th>
                    <th>Classe</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>
                        {student.image ? (
                          <img 
                            src={student.image} 
                            alt={student.name}
                            className="avatar avatar-sm" 
                          />
                        ) : (
                          <div className="avatar avatar-sm">
                            {student.name?.[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="student-info">
                          <div className="student-name">{student.name}</div>
                        </div>
                      </td>
                      <td>
                        <span className="matricule-badge">
                          {student.matricule || 'Non défini'}
                        </span>
                      </td>
                      <td>
                        <span className="contact-info">
                          {student.phone || '-'}
                        </span>
                      </td>
                      <td>
                        <span className="contact-info">
                          {student.email || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`gender-badge ${student.sex?.toLowerCase()}`}>
                          {student.sex === 'M' ? '👨 Masculin' : student.sex === 'F' ? '👩 Féminin' : '-'}
                        </span>
                      </td>
                      <td>
                        <span className="class-badge">
                          {student.class_id?.name || 'Non assigné'}
                        </span>
                      </td>
                      <td>
                        <Link href={`students/${student._id}`}>
                          <a className="action-link view-action">
                            👁️ Voir
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateStudentModal
        totalUsers={students.length}
        closeModal={closeModal}
        save={saveStudent}
        modalIsOpen={modalIsOpen}
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

        .student-info {
          display: flex;
          flex-direction: column;
        }

        .student-name {
          font-weight: 500;
          color: var(--secondary-900);
        }

        .matricule-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--primary-100);
          color: var(--primary-700);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
          font-family: monospace;
        }

        .contact-info {
          color: var(--secondary-600);
          font-size: 0.875rem;
        }

        .gender-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .gender-badge.m {
          background: var(--primary-100);
          color: var(--primary-700);
        }

        .gender-badge.f {
          background: var(--error-100);
          color: var(--error-700);
        }

        .class-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--success-100);
          color: var(--success-700);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .avatar {
          background: var(--secondary-200);
          color: var(--secondary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .modern-table {
            overflow-x: auto;
          }

          .page-title {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .page-actions {
            width: 100%;
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
