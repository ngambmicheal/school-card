import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import ClasseInterface from "../../models/classe";
import StudentInterface from "../../models/student";
import api from "../../services/api";
import Modal from "react-modal";
import { customStyles } from "../../services/constants";
import ExamInterface from "../../models/exam";
import TermInterface from "../../models/terms";
import {DynamicExamModal} from "./modals/dyname-exam-form";
import AnnualExamInterface from "../../models/annualExam";
import {CreateStudentModal}  from "./modals/student-forms";
import { ImportStudents } from "./modals/import-students";
import { AnnualExamModal, CreateExamModal } from "./modals/annual-exam";
import { CSVLink } from "react-csv";
import { useSession } from "next-auth/react";
import useSchool from "../../hooks/useSchool";
import { Button, Menu, MenuButton, MenuItem, MenuList, useToast } from "@chakra-ui/react";
import { successMessage, errorMessage } from "../../utils/messages";
import Header from "../../layouts/header";
import Link from "../../components/link";
import {getAnnualExamLink, getExamLink, getTermLink} from '../../services/helper'

export default function ClasseDetails() {
  const [classe, setClasse] = useState<ClasseInterface>();
  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [exams, setExams] = useState<ExamInterface[]>([]);
  const [terms, setTerms] = useState<TermInterface[]>([]);
  const [annualExams, setAnnualExams] = useState<AnnualExamInterface[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [examIsOpen, setExamIsOpen] = useState(false);
  const [dynamicExamIsOpen, setDynamicExamIsOpen] = useState(false);
  const [annualExamIsOpen, setAnnualExamIsOpen] = useState(false);
  const [ImportIsOpen, setImportIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { _id: classeId } = router.query;
  const { editable } = useSchool();
  const toast = useToast();

  useEffect(() => {
    if (classeId) {
      loadClassData();
    }
  }, [classeId]);

  const loadClassData = async () => {
    setLoading(true);
    try {
      const [classeResponse, studentsResponse, examsResponse, termsResponse, annualExamsResponse] = await Promise.all([
        api.getClasse(classeId),
        api.getClasseStudents(classeId),
        api.getClasseExams(classeId),
        api.getTerms(classeId),
        api.getAnnualExams(classeId)
      ]);
      
      setClasse(classeResponse.data.data);
      setStudents(studentsResponse.data.data);
      setExams(examsResponse.data.data);
      setTerms(termsResponse.data.data);
      setAnnualExams(annualExamsResponse.data.data);
    } catch (error) {
      console.error('Error loading class data:', error);
      toast(errorMessage('Erreur lors du chargement des données'));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  const getStudents = () => {
    api.getClasseStudents(classeId).then(({ data: { data } }: any) => {
      setStudents(data);
    });
  };

  const saveStudent = (student: any) => {
    api.saveStudent(student).then(() => {
      getStudents();
      toast(successMessage('Élève ajouté avec succès!'));
    });
    closeModal();
  };

  const deleteStudent = (studentId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet élève ?"))
      api.deleteStudent(studentId).then(() => {
        toast(successMessage('Élève supprimé avec succès!'))
        getStudents();
  });
  };

  const deleteExam = (examId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet examen ?"))
      api.deleteExam(examId).then(() => {
        getExams();
        toast(successMessage('Examen supprimé avec succès!'));
      });
  };

  const importStudent = () => {};

  const closeExamModal = () => {
    setExamIsOpen((s) => false);
  };

  const closeDynamicExamModal = () => {
    setDynamicExamIsOpen((s) => false);
    getTerms();
  };

  const closeAnnualExamModal = () => {
    setAnnualExamIsOpen((s) => false);
    getAnnualExams();
  };

  const saveAnnualExam = () => {};

  const closeImportModal = () => {
    setImportIsOpen((s) => false);
  };

  const getExams = () => {
    api.getClasseExams(classeId).then(({ data: { data } }: any) => {
      setExams(data);
    });
  };

  const getTerms = () => {
    api.getTerms(classeId).then(({ data: { data } }: any) => {
      setTerms(data);
    });
  };

  const getAnnualExams = () => {
    api.getAnnualExams(classeId).then(({ data: { data } }: any) => {
      setAnnualExams(data);
    });
  };

  const deleteTerm = (term_id: any) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce trimestre ?"))
      api.deleteTerm(term_id).then(() => {
        getTerms();
        toast(successMessage('Trimestre supprimé avec succès!'));
      });
  };

  const calculateTerm = (term_id: string) => {
    api.calculateTerm(term_id).then(() => {
      toast(successMessage("Calcul du trimestre terminé!"));
    });
  };

  const deleteAnnualResult = (term_id: any) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce bulletin annuel ?"))
      api.deleteAnnualExam(term_id).then(() => {
        getTerms();
        toast(successMessage('Bulletin annuel supprimé avec succès!'));
      });
  };

  const calculateAnnualExam = (term_id: string) => {
    api.calculateAnnualExam(term_id).then(() => {
      toast(successMessage("Calcul du bulletin annuel terminé!"));
    });
  };

  const saveExam = (exam: any) => {
    api.saveExam(exam).then(() => {
      getExams();
      toast(successMessage('Examen sauvegardé avec succès!'));
    });
    closeExamModal();
  };

  const downloadToCsv = () => {
    api.downloadToCsv(classeId);
  };

  const downloadToPdf = () => {
    api.downloadToPdf(classeId);
  };

  const studentHeaders = [
    { label: "Numero", key: "number" },
    { label: "Nom", key: "name" },
    { label: "Phone", key: "phone" },
    { label: "Sex", key: "sex" },
    { label: "Id", key: "_id" },
  ];

  if (loading) {
    return (
      <>
        <Header title="Classe Details" description="Classe Details" />
        <div className="loading-container">
          <div className="loading"></div>
          <p>Chargement des détails de la classe...</p>
        </div>
      </>
    );
  }

  if (!classe) {
    return (
      <>
        <Header title="Classe Details" description="Classe Details" />
        <div className="error-container">
          <div className="error-icon">🏛️</div>
          <h3>Classe non trouvée</h3>
          <p>La classe demandée n'existe pas ou n'est pas accessible</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={`Classe ${classe.name}`} description={`Détails de la classe ${classe.name}`} />
      
      <div className="class-detail-container">
        {/* Class Header */}
        <div className="class-header">
          <div className="header-content">
            <div className="class-info">
              <h1>🏛️ Classe {classe.name}</h1>
              <div className="class-meta">
                <span className="meta-item">
                  📚 Section: {classe.section?.name || 'Non définie'}
                </span>
                <span className="meta-item">
                  📊 Type de bulletin: {classe.section?.report_type || 'Standard'}
                </span>
                <span className="meta-item">
                  👥 {students.length} élève{students.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="header-actions">
              <CSVLink
                data={students}
                headers={studentHeaders}
                className="btn btn-secondary"
                filename={`liste-des-eleves-${classe.name}-${new Date().getFullYear()}.csv`}
              >
                📥 Exporter CSV
              </CSVLink>
            </div>
          </div>
        </div>

        {/* Exams Section */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">
              <h2>📝 Examens</h2>
              <p>Configuration des examens et épreuves</p>
            </div>
            {editable && (
              <button
                className="btn btn-primary"
                onClick={() => setExamIsOpen(true)}
              >
                ➕ Ajouter un Examen
              </button>
            )}
          </div>
          
          <div className="section-content">
            {exams.length > 0 ? (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Nom de l'Examen</th>
                      <th>Type d'Examen</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => (
                      <tr key={exam._id}>
                        <td className="exam-name">{exam.name}</td>
                        <td>
                          <Link href={getExamLink(classe.section?.report_type, exam._id)}>
                            <span className="exam-link">📊 Saisir les données</span>
                          </Link>
                        </td>
                        <td>
                          {editable && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteExam(exam._id as string)}
                            >
                              🗑️ Supprimer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📝</span>
                <p>Aucun examen configuré</p>
                <small>Commencez par ajouter des examens pour cette classe</small>
              </div>
            )}
          </div>
        </div>

        {/* Terms Section */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">
              <h2>📊 Trimestres</h2>
              <p>Gestion des périodes trimestrielles</p>
            </div>
            {exams.length > 0 && editable && (
              <button
                className="btn btn-primary"
                onClick={() => setDynamicExamIsOpen(true)}
              >
                ➕ Ajouter Trimestre
              </button>
            )}
          </div>
          
          <div className="section-content">
            {terms.length > 0 ? (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Identifiant</th>
                      <th>Type d'Examen</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {terms.map((term) => (
                      <TermRow 
                        classe={classe} 
                        term={term} 
                        key={term._id} 
                        deleteTerm={deleteTerm} 
                        calculateTerm={calculateTerm} 
                        editable={editable} 
                        openLink={getTermLink(classe.section?.report_type, term._id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📊</span>
                <p>Aucun trimestre configuré</p>
                <small>Ajoutez d'abord des examens puis créez des trimestres</small>
              </div>
            )}
          </div>
        </div>

        {/* Annual Reports Section */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">
              <h2>📋 Bulletins Annuels</h2>
              <p>Rapports de fin d'année scolaire</p>
            </div>
            {exams.length > 0 && editable && (
              <button
                className="btn btn-primary"
                onClick={() => setAnnualExamIsOpen(true)}
              >
                ➕ Ajouter Bulletin Final
              </button>
            )}
          </div>
          
          <div className="section-content">
            {annualExams.length > 0 ? (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Type d'Examen</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {annualExams.map((term) => (
                      <TermRow 
                        classe={classe} 
                        term={term} 
                        key={term._id} 
                        deleteTerm={deleteAnnualResult} 
                        calculateTerm={calculateAnnualExam} 
                        editable={editable} 
                        openLink={getAnnualExamLink(classe.section?.report_type, term._id)} 
                        isAnnual={true}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p>Aucun bulletin annuel configuré</p>
                <small>Créez des bulletins de fin d'année pour cette classe</small>
              </div>
            )}
          </div>
        </div>

        {/* Students Section */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">
              <h2>👥 Élèves ({students.length})</h2>
              <p>Liste et gestion des élèves de la classe</p>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setImportIsOpen(true)}
              >
                📥 Importer
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setModalIsOpen(true)}
              >
                ➕ Ajouter Élève
              </button>
            </div>
          </div>
          
          <div className="section-content">
            {students.length > 0 ? (
              <div className="table-container">
                <table className="modern-table students-table">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Photo</th>
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Téléphone</th>
                      <th>Sexe</th>
                      <th>Date de naissance</th>
                      <th>Lieu</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <StudentRow
                        stud={student}
                        key={student._id}
                        deleteStudent={deleteStudent}
                        terms={terms}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">👥</span>
                <p>Aucun élève inscrit</p>
                <small>Commencez par ajouter des élèves à cette classe</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {classeId && (
        <>
          <CreateExamModal
            modalIsOpen={examIsOpen}
            closeModal={closeExamModal}
            save={saveExam}
            class_id={classeId}
          />
          <DynamicExamModal
            exams={exams}
            modalIsOpen={dynamicExamIsOpen}
            closeModal={closeDynamicExamModal}
            save={saveExam}
            class_id={classeId}
          />
          <AnnualExamModal
            terms={terms}
            modalIsOpen={annualExamIsOpen}
            closeModal={closeAnnualExamModal}
            save={saveAnnualExam}
            class_id={classeId}
          />
          <CreateStudentModal
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            save={saveStudent}
            class_id={classeId}
            totalUsers={students.length}
          />
          <ImportStudents
            modalIsOpen={ImportIsOpen}
            closeModal={closeImportModal}
            save={importStudent}
            class_id={classeId}
          />
        </>
      )}

      <style jsx>{`
        .loading-container, .error-container {
          text-align: center;
          padding: var(--spacing-2xl);
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .loading-container .loading {
          margin: 0 auto var(--spacing-lg);
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
        }

        .class-detail-container {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0 var(--spacing-lg);
        }

        .class-header {
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--secondary-200);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-lg);
        }

        .class-info h1 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--secondary-900);
          font-size: 1.75rem;
          font-weight: 700;
        }

        .class-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--secondary-600);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .section-card {
          background: white;
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-xl);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--secondary-200);
          overflow: hidden;
        }

        .section-header {
          background: var(--secondary-50);
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--secondary-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title h2 {
          margin: 0 0 var(--spacing-xs) 0;
          color: var(--secondary-900);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .section-title p {
          margin: 0;
          color: var(--secondary-600);
          font-size: 0.875rem;
        }

        .section-content {
          padding: var(--spacing-lg);
        }

        .table-container {
          overflow-x: auto;
          border-radius: var(--radius-md);
          border: 1px solid var(--secondary-200);
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .modern-table th {
          background: var(--secondary-100);
          padding: var(--spacing-md);
          font-weight: 600;
          color: var(--secondary-700);
          font-size: 0.875rem;
          border-bottom: 1px solid var(--secondary-200);
          text-align: left;
        }

        .modern-table td {
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--secondary-200);
          font-size: 0.875rem;
          vertical-align: middle;
        }

        .modern-table tr:hover {
          background: var(--secondary-50);
        }

        .modern-table tr:last-child td {
          border-bottom: none;
        }

        .students-table td {
          padding: var(--spacing-sm);
        }

        .exam-name {
          font-weight: 500;
          color: var(--secondary-900);
        }

        .exam-link {
          color: var(--primary-600);
          text-decoration: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .exam-link:hover {
          color: var(--primary-700);
          text-decoration: underline;
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--secondary-500);
        }

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: var(--spacing-md);
        }

        .empty-state p {
          margin: 0 0 var(--spacing-sm) 0;
          font-weight: 500;
          color: var(--secondary-600);
        }

        .empty-state small {
          color: var(--secondary-500);
          font-size: 0.8rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          font-family: inherit;
          font-size: 0.875rem;
        }

        .btn:hover {
          text-decoration: none;
        }

        .btn-primary {
          background: var(--primary-600);
          color: white;
        }

        .btn-primary:hover {
          background: var(--primary-700);
        }

        .btn-secondary {
          background: var(--secondary-200);
          color: var(--secondary-700);
        }

        .btn-secondary:hover {
          background: var(--secondary-300);
        }

        .btn-danger {
          background: var(--error-600);
          color: white;
        }

        .btn-danger:hover {
          background: var(--error-700);
        }

        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: 0.8rem;
        }

        @media (max-width: 1024px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .class-meta {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }
        }

        @media (max-width: 768px) {
          .class-detail-container {
            padding: 0 var(--spacing-md);
          }

          .class-header, .section-card {
            margin-bottom: var(--spacing-lg);
          }

          .section-content {
            padding: var(--spacing-md);
          }

          .modern-table {
            font-size: 0.8rem;
          }

          .modern-table th,
          .modern-table td {
            padding: var(--spacing-sm);
          }

          .class-info h1 {
            font-size: 1.5rem;
          }
        }

        /* CSS Variables */
        :global(:root) {
          --primary-600: #2563eb;
          --primary-700: #1d4ed8;
          --primary-500: #3b82f6;
          --primary-100: #dbeafe;
          --secondary-25: #fafafa;
          --secondary-50: #f9fafb;
          --secondary-100: #f3f4f6;
          --secondary-200: #e5e7eb;
          --secondary-300: #d1d5db;
          --secondary-500: #6b7280;
          --secondary-600: #4b5563;
          --secondary-700: #374151;
          --secondary-900: #111827;
          --success-600: #059669;
          --success-700: #047857;
          --error-600: #dc2626;
          --error-700: #b91c1c;
          --warning-600: #d97706;
          --spacing-xs: 0.25rem;
          --spacing-sm: 0.5rem;
          --spacing-md: 0.75rem;
          --spacing-lg: 1rem;
          --spacing-xl: 1.5rem;
          --spacing-2xl: 2rem;
          --radius-sm: 0.25rem;
          --radius-md: 0.375rem;
          --radius-lg: 0.5rem;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }

        /* Loading Component */
        .loading {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          border: 3px solid var(--secondary-300);
          border-radius: 50%;
          border-top-color: var(--primary-600);
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Additional responsive styling */
        @media (max-width: 480px) {
          .class-detail-container {
            padding: 0 var(--spacing-sm);
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .class-meta {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .meta-item {
            font-size: 0.8rem;
          }

          .class-info h1 {
            font-size: 1.25rem;
          }

          .table-container {
            font-size: 0.75rem;
          }

          .student-input, .term-input {
            font-size: 0.75rem;
            padding: var(--spacing-xs);
          }
        }
      `}</style>
    </>
  );
}

type StudentProps = {
  stud: StudentInterface;
  deleteStudent: (id: string) => void;
  terms: TermInterface[];
};

export function StudentRow({ stud, deleteStudent, terms }: StudentProps) {
  const [student, setStudent] = useState(stud);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const session = useSession();
  const toast = useToast();

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setStudent((inputData) => ({
      ...inputData,
      [key]: value,
    }));
    setHasUpdated(true);
  }

  const updateStudent = async () => {
    setIsUpdating(true);
    try {
      await api.updateStudent(student);
      setHasUpdated(false);
      toast(successMessage('Élève mis à jour avec succès!'));
    } catch (error) {
      toast(errorMessage('Erreur lors de la mise à jour'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <tr className="student-row">
        <td>
          <input
            className="student-input number-input"
            type="number"
            name="number"
            value={student?.number || ''}
            onChange={handleChange}
            min="1"
          />
        </td>
        <td className="image-cell">
          <div className="student-image">
            {student?.image ? (
              <img src={student.image} alt={student.name} />
            ) : (
              <div className="no-image">👤</div>
            )}
          </div>
        </td>
        <td className="matricule-cell">
          <span className="matricule">{student.matricule}</span>
        </td>
        <td>
          <input
            className="student-input name-input"
            type="text"
            name="name"
            value={student?.name || ''}
            onChange={handleChange}
            placeholder="Nom de l'élève"
          />
        </td>
        <td>
          <input
            className="student-input phone-input"
            type="tel"
            name="phone"
            value={student?.phone || ''}
            onChange={handleChange}
            placeholder="Téléphone"
          />
        </td>
        <td>
          <select
            className="student-input sex-input"
            name="sex"
            value={student?.sex || ''}
            onChange={handleChange}
          >
            <option value="">Sexe</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </td>
        <td>
          <input
            className="student-input date-input"
            type="date"
            name="dob"
            value={student?.dob || ''}
            onChange={handleChange}
          />
        </td>
        <td>
          <input
            className="student-input place-input"
            type="text"
            name="place"
            value={student?.place || ''}
            onChange={handleChange}
            placeholder="Lieu de naissance"
          />
        </td>
        <td className="actions-cell">
          <div className="student-actions">
            {hasUpdated && (
              <button
                className="btn btn-success btn-sm"
                onClick={updateStudent}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="loading-sm"></span>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    ✓ Mettre à jour
                  </>
                )}
              </button>
            )}
            
            <Menu>
              <MenuButton as={Button} size="sm" variant="ghost" className="menu-button">
                ⋮
              </MenuButton>
              <MenuList>
                {terms.map((term: TermInterface) => (
                  <MenuItem key={term._id}>
                    <Link href={`/students/${student._id}/report-card/term/${term._id}`}>
                      📊 Bulletin {term.name}
                    </Link>
                  </MenuItem>
                ))}
                <MenuItem onClick={() => deleteStudent(student._id as string)}>
                  🗑️ Supprimer l'élève
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </td>
      </tr>

      <style jsx>{`
        .student-row:hover {
          background: var(--secondary-25) !important;
        }

        .student-input {
          width: 100%;
          padding: var(--spacing-xs) var(--spacing-sm);
          border: 1px solid var(--secondary-300);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .student-input:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow: 0 0 0 2px var(--primary-100);
        }

        .number-input {
          width: 60px;
        }

        .phone-input {
          width: 120px;
        }

        .sex-input {
          width: 60px;
        }

        .date-input {
          width: 130px;
        }

        .place-input {
          width: 140px;
        }

        .image-cell {
          text-align: center;
        }

        .student-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--secondary-200);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--secondary-100);
        }

        .student-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          color: var(--secondary-500);
          font-size: 1.2rem;
        }

        .matricule-cell {
          font-family: monospace;
          font-weight: 500;
          color: var(--secondary-700);
        }

        .matricule {
          background: var(--secondary-100);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
        }

        .actions-cell {
          text-align: center;
        }

        .student-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          justify-content: center;
        }

        .btn-success {
          background: var(--success-600);
          color: white;
        }

        .btn-success:hover {
          background: var(--success-700);
        }

        .btn-success:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .menu-button {
          min-width: auto !important;
          padding: var(--spacing-xs) !important;
          font-size: 1rem !important;
          color: var(--secondary-600) !important;
        }

        .loading-sm {
          display: inline-block;
          width: 0.75rem;
          height: 0.75rem;
          border: 2px solid var(--secondary-300);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: var(--spacing-xs);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export function TermRow({classe, term, deleteTerm, calculateTerm , editable, openLink, isAnnual}: any) {
  const [currentTerm, setCurrentTerm] = useState(term);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const toast = useToast();

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setCurrentTerm((inputData: any) => ({
      ...inputData,
      [key]: value,
    }));
    setHasUpdated(true);
  }

  const updateTerm = async () => {
    setIsUpdating(true);
    try {
      await api.updateTerm(currentTerm);
      setHasUpdated(false);
      toast(successMessage('Période mise à jour avec succès!'));
    } catch (error) {
      toast(errorMessage('Erreur lors de la mise à jour'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      await calculateTerm(currentTerm._id);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <>
      <tr className="term-row">
        <td>
          <input
            className="term-input name-input"
            type="text"
            name="name"
            value={currentTerm?.name || ''}
            onChange={handleChange}
            disabled={!editable}
            placeholder="Nom de la période"
          />
        </td>
        <td>
          <input
            className="term-input slug-input"
            type="text"
            name="slug"
            value={currentTerm?.slug || ''}
            onChange={handleChange}
            disabled={!editable}
            placeholder="Identifiant"
          />
        </td>
        <td>
          <Link href={openLink}>
            <span className="term-link">
              📊 {isAnnual ? 'Bulletin Annuel' : 'Bulletin Trimestriel'}
            </span>
          </Link>
        </td>
        <td className="actions-cell">
          <div className="term-actions">
            {hasUpdated && editable && (
              <button
                className="btn btn-success btn-sm"
                onClick={updateTerm}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="loading-sm"></span>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    ✓ Mettre à jour
                  </>
                )}
              </button>
            )}
            
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCalculate}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <span className="loading-sm"></span>
                  Calcul...
                </>
              ) : (
                <>
                  🔢 Calculer
                </>
              )}
            </button>

            {editable && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteTerm(currentTerm._id)}
              >
                🗑️ Supprimer
              </button>
            )}
          </div>
        </td>
      </tr>

      <style jsx>{`
        .term-row:hover {
          background: var(--secondary-25) !important;
        }

        .term-input {
          width: 100%;
          padding: var(--spacing-xs) var(--spacing-sm);
          border: 1px solid var(--secondary-300);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .term-input:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow: 0 0 0 2px var(--primary-100);
        }

        .term-input:disabled {
          background-color: var(--secondary-50);
          color: var(--secondary-500);
          cursor: not-allowed;
        }

        .name-input {
          min-width: 150px;
        }

        .slug-input {
          min-width: 100px;
          font-family: monospace;
        }

        .term-link {
          color: var(--primary-600);
          text-decoration: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .term-link:hover {
          color: var(--primary-700);
          text-decoration: underline;
        }

        .actions-cell {
          text-align: center;
        }

        .term-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-success {
          background: var(--success-600);
          color: white;
        }

        .btn-success:hover {
          background: var(--success-700);
        }

        .btn-success:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-sm {
          display: inline-block;
          width: 0.75rem;
          height: 0.75rem;
          border: 2px solid var(--secondary-300);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: var(--spacing-xs);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export function ExamRow({ exam, deleteExam }: any) {
  return (
    <tr>
      <td> {exam.name} </td>
      <td>
        {" "}
        <a onClick={() => deleteExam(exam._id)}>Delete</a>{" "}
      </td>
    </tr>
  );
}

