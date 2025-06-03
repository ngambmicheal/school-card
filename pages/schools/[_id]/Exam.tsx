import { PropsWithChildren, useEffect, useState } from "react";
import ClasseInterface from "../../../models/classe";
import api from "../../../services/api";
import AnnualExamInterface from "../../../models/annualExam";
import SchoolInterface from "../../../models/school";
import { DynamicExamModal } from "../../classes/modals/dyname-exam-form";
import { AnnualExamModal } from "../../classes/modals/annual-exam";
import Dropdown from "../../../components/dropdown";

interface TermInterface {
  _id: string;
  name: string;
  slug: string;
}

export default function SchoolSettingExam({ school, editable }: { school: SchoolInterface, editable: boolean }) {
    const [classes, setClasses] = useState<ClasseInterface[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [dynamicExamIsOpen, setDynamicExamIsOpen] = useState(false);
    const [annualExamIsOpen, setAnnualExamIsOpen] = useState(false);
    const [classeId, setClasseId] = useState<string | null | undefined>(school?._id);
    const [loading, setLoading] = useState(true);

    const [terms, setTerms] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [annualExams, setAnnualExams] = useState<AnnualExamInterface[]>([]);

    useEffect(() => {
        loadData();
    }, [classeId]);

    const loadData = async () => {
        if (classeId) {
            setLoading(true);
            try {
                const [termsResponse, examsResponse, annualExamsResponse] = await Promise.all([
                    api.getTerms(classeId),
                    api.getClasseExams(classeId),
                    api.getAnnualExams(classeId)
                ]);
                setTerms(termsResponse.data.data);
                setExams(examsResponse.data.data);
                setAnnualExams(annualExamsResponse.data.data);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        }
    }

    const saveTerm = (exam: any) => {
        api.saveTerm({ ...exam, class: classeId, isGeneral: true, classes: selectedClasses }).then(() => {
            console.log("Trimestre sauvegardé avec succès");
            setDynamicExamIsOpen(false);
            loadData();
        }).catch((error) => {
            console.error("Erreur lors de la sauvegarde du trimestre:", error);
        });
    };

    const saveAnnualExam = (exam: any) => {
        api.saveAnnualExam({ ...exam, isGeneral: true, class: classeId, classes: selectedClasses }).then(() => {
            setAnnualExamIsOpen(false);
            loadData();
        }).catch((error) => {
            console.error("Erreur lors de la sauvegarde de l'examen annuel:", error);
        });
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await api.getClasses();
            setClasses(response.data.data);
        } catch (error) {
            console.error('Erreur lors du chargement des classes:', error);
        }
    }

    const handleClassSelection = (classId: string) => {
        setSelectedClasses((prevSelected) => {
            if (prevSelected.includes(classId)) {
                return prevSelected.filter((id) => id !== classId);
            } else {
                return [...prevSelected, classId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedClasses.length === classes.length) {
            setSelectedClasses([]);
        } else {
            const allClassIds = classes.filter((classe) => classe._id).map((classe) => classe._id ?? '');
            setSelectedClasses(allClassIds);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading"></div>
                <p>Chargement de la configuration des examens...</p>
            </div>
        );
    }

    return (
        <>
            <div className="exam-container">
                {/* Header Section */}
                <div className="exam-header">
                    <div className="header-content">
                        <h3>📝 Configuration des Examens</h3>
                        <p>Gestion des trimestres, bulletins annuels et attestations</p>
                    </div>
                    
                    {selectedClasses.length > 0 && (
                        <div className="selection-info">
                            <span className="selection-badge">
                                {selectedClasses.length} classe{selectedClasses.length > 1 ? 's' : ''} sélectionnée{selectedClasses.length > 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                <div className="exam-layout">
                    {/* Classes Selection Section */}
                    <div className="classes-section">
                        <div className="section-card">
                            <div className="card-header">
                                <h4>🏛️ Sélection des Classes</h4>
                                <p>Choisissez les classes pour lesquelles configurer les examens</p>
                            </div>
                            
                            <div className="classes-table-container">
                                <table className="classes-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <label className="checkbox-container">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedClasses.length === classes.length && classes.length > 0} 
                                                        onChange={handleSelectAll}
                                                        disabled={!editable}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </th>
                                            <th>Classe</th>
                                            <th>Note TB</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classes.map((classe, index) => (
                                            <ClassRow 
                                                key={index} 
                                                classe={classe} 
                                                index={index} 
                                                handleClassSelection={() => handleClassSelection(classe._id!)} 
                                                isSelected={selectedClasses.includes(classe._id!)}
                                                editable={editable}
                                            />
                                        ))}
                                    </tbody>
                                </table>

                                {classes.length === 0 && (
                                    <div className="empty-state">
                                        <span className="empty-icon">🏛️</span>
                                        <p>Aucune classe trouvée</p>
                                        <small>Créez d'abord des classes pour configurer les examens</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Exam Configuration Section */}
                    <div className="exams-section">
                        {/* Trimester Exams */}
                        <div className="section-card">
                            <div className="card-header">
                                <div className="header-info">
                                    <h4>📊 Bulletins de Trimestre</h4>
                                    <p>Configuration des examens trimestriels</p>
                                </div>
                                {editable && (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => setDynamicExamIsOpen(true)} 
                                        disabled={!selectedClasses.length}
                                        title={!selectedClasses.length ? "Sélectionnez au moins une classe" : ""}
                                    >
                                        ➕ Ajouter Trimestre
                                    </button>
                                )}
                            </div>

                            <div className="exam-list">
                                {terms.length > 0 ? (
                                    <table className="exam-table">
                                        <thead>
                                            <tr>
                                                <th>Nom</th>
                                                <th>Identifiant</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {terms.map(term => (
                                                <TermRow key={term._id} term={term} />
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="empty-state">
                                        <span className="empty-icon">📊</span>
                                        <p>Aucun trimestre configuré</p>
                                        <small>Ajoutez des trimestres pour organiser les examens</small>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Annual Exams */}
                        <div className="section-card">
                            <div className="card-header">
                                <div className="header-info">
                                    <h4>📋 Bulletins Annuels</h4>
                                    <p>Configuration des examens de fin d'année</p>
                                </div>
                                {editable && (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => setAnnualExamIsOpen(true)} 
                                        disabled={!selectedClasses.length}
                                        title={!selectedClasses.length ? "Sélectionnez au moins une classe" : ""}
                                    >
                                        ➕ Ajouter Bulletin Annuel
                                    </button>
                                )}
                            </div>

                            <div className="exam-list">
                                {annualExams.length > 0 ? (
                                    <table className="exam-table">
                                        <thead>
                                            <tr>
                                                <th>Nom</th>
                                                <th>Identifiant</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {annualExams.map(exam => (
                                                <TermRow key={exam._id} term={exam} />
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="empty-state">
                                        <span className="empty-icon">📋</span>
                                        <p>Aucun bulletin annuel configuré</p>
                                        <small>Ajoutez des bulletins annuels pour les évaluations finales</small>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="section-card">
                            <div className="card-header">
                                <div className="header-info">
                                    <h4>🏆 Actions Rapides</h4>
                                    <p>Génération d'attestations et de documents</p>
                                </div>
                            </div>

                            <div className="actions-content">
                                {selectedClasses.length > 0 ? (
                                    <a 
                                        href={`/api/schools/actions/print-attestation?classes=${selectedClasses.join(',')}`} 
                                        target="_blank" 
                                        className="btn btn-success btn-lg"
                                        rel="noopener noreferrer"
                                    >
                                        🖨️ Imprimer les Attestations
                                        <small>Pour {selectedClasses.length} classe{selectedClasses.length > 1 ? 's' : ''}</small>
                                    </a>
                                ) : (
                                    <div className="action-disabled">
                                        <button className="btn btn-secondary btn-lg" disabled>
                                            🖨️ Imprimer les Attestations
                                        </button>
                                        <small>Sélectionnez des classes pour activer cette action</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {classeId && selectedClasses.length && (
                <DynamicExamModal
                    exams={exams}
                    modalIsOpen={dynamicExamIsOpen}
                    closeModal={() => setDynamicExamIsOpen(false)}
                    save={saveTerm}
                    class_id={classeId}
                    isGeneral={true}
                />
            )}
            {classeId && selectedClasses.length && (
                <AnnualExamModal
                    terms={terms}
                    modalIsOpen={annualExamIsOpen}
                    closeModal={() => setAnnualExamIsOpen(false)}
                    save={saveAnnualExam}
                    class_id={classeId}
                    isGeneral={true}
                />
            )}

            <style jsx>{`
                .loading-container {
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

                .exam-container {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .exam-header {
                    background: white;
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-xl);
                    margin-bottom: var(--spacing-xl);
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--secondary-200);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-content h3 {
                    margin: 0 0 var(--spacing-sm) 0;
                    color: var(--secondary-900);
                    font-size: 1.25rem;
                    font-weight: 600;
                }

                .header-content p {
                    margin: 0;
                    color: var(--secondary-600);
                    font-size: 0.875rem;
                }

                .selection-info {
                    display: flex;
                    align-items: center;
                }

                .selection-badge {
                    background: var(--primary-100);
                    color: var(--primary-700);
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .exam-layout {
                    display: grid;
                    grid-template-columns: 400px 1fr;
                    gap: var(--spacing-xl);
                    align-items: start;
                }

                .section-card {
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--secondary-200);
                    margin-bottom: var(--spacing-xl);
                    overflow: hidden;
                }

                .card-header {
                    background: var(--secondary-50);
                    padding: var(--spacing-lg);
                    border-bottom: 1px solid var(--secondary-200);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-info h4 {
                    margin: 0 0 var(--spacing-xs) 0;
                    color: var(--secondary-900);
                    font-size: 1rem;
                    font-weight: 600;
                }

                .header-info p {
                    margin: 0;
                    color: var(--secondary-600);
                    font-size: 0.8rem;
                }

                .classes-table-container {
                    padding: var(--spacing-lg);
                }

                .classes-table, .exam-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .classes-table th, .exam-table th {
                    background: var(--secondary-100);
                    padding: var(--spacing-md);
                    font-weight: 600;
                    color: var(--secondary-700);
                    font-size: 0.875rem;
                    border-bottom: 1px solid var(--secondary-200);
                }

                .classes-table td, .exam-table td {
                    padding: var(--spacing-md);
                    border-bottom: 1px solid var(--secondary-200);
                    font-size: 0.875rem;
                }

                .classes-table tr:hover, .exam-table tr:hover {
                    background: var(--secondary-50);
                }

                .checkbox-container {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    position: relative;
                }

                .checkbox-container input[type="checkbox"] {
                    opacity: 0;
                    position: absolute;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }

                .checkmark {
                    height: 18px;
                    width: 18px;
                    background-color: white;
                    border: 2px solid var(--secondary-300);
                    border-radius: var(--radius-sm);
                    position: relative;
                    transition: all 0.2s ease;
                }

                .checkbox-container:hover .checkmark {
                    border-color: var(--primary-500);
                }

                .checkbox-container input:checked ~ .checkmark {
                    background-color: var(--primary-600);
                    border-color: var(--primary-600);
                }

                .checkmark:after {
                    content: "";
                    position: absolute;
                    display: none;
                    left: 5px;
                    top: 2px;
                    width: 4px;
                    height: 8px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                .checkbox-container input:checked ~ .checkmark:after {
                    display: block;
                }

                .exam-list {
                    padding: var(--spacing-lg);
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

                .actions-content {
                    padding: var(--spacing-lg);
                    text-align: center;
                }

                .btn {
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-md) var(--spacing-lg);
                    border: none;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .btn:hover {
                    text-decoration: none;
                }

                .btn-primary {
                    background: var(--primary-600);
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    background: var(--primary-700);
                }

                .btn-success {
                    background: var(--success-600);
                    color: white;
                }

                .btn-success:hover {
                    background: var(--success-700);
                }

                .btn-secondary {
                    background: var(--secondary-300);
                    color: var(--secondary-600);
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-lg {
                    padding: var(--spacing-lg) var(--spacing-xl);
                    font-size: 1rem;
                }

                .btn small {
                    font-size: 0.75rem;
                    opacity: 0.9;
                }

                .action-disabled {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-sm);
                }

                .action-disabled small {
                    color: var(--secondary-500);
                    font-size: 0.8rem;
                }

                @media (max-width: 1024px) {
                    .exam-layout {
                        grid-template-columns: 1fr;
                    }

                    .exam-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--spacing-md);
                    }
                }

                @media (max-width: 768px) {
                    .card-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--spacing-md);
                    }

                    .classes-table, .exam-table {
                        font-size: 0.8rem;
                    }

                    .classes-table th, .exam-table th,
                    .classes-table td, .exam-table td {
                        padding: var(--spacing-sm);
                    }
                }
            `}</style>
        </>
    );
}

type classRowProps = {
    classe: ClasseInterface;
    index: number;
    handleClassSelection: (classId: string) => void;
    isSelected: boolean;
    editable: boolean;
}

const ClassRow = ({ index, classe, handleClassSelection, isSelected, editable }: PropsWithChildren<classRowProps>) => {
    const [tbNote, setTbNote] = useState(classe.tb_note);
    
    const handleTbNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setTbNote(newValue);
        if (editable) {
            api.updateClasse({ ...classe, tb_note: newValue }).then(() => {
                console.log("Note TB mise à jour avec succès");
            }).catch((error) => {
                console.error("Erreur lors de la mise à jour de la note TB:", error);
            });
        }
    };

    return (
        <tr>
            <td>
                <label className="checkbox-container">
                    <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => handleClassSelection(classe._id!)}
                        disabled={!editable}
                    />
                    <span className="checkmark"></span>
                </label>
            </td>
            <td>
                <a 
                    href={`/classes/${classe._id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="class-link"
                >
                    {classe.name}
                </a>
            </td>
            <td>
                <input 
                    type="number" 
                    value={tbNote || ''} 
                    onChange={handleTbNoteChange} 
                    className="tb-note-input"
                    disabled={!editable}
                    placeholder="Note"
                />
            </td>
        </tr>
    );
}

const TermRow = ({ term }: { term: TermInterface }) => {
    return (
        <tr>
            <td className="term-name">{term.name}</td>
            <td className="term-slug">{term.slug}</td>
            <td>
                <Dropdown
                    buttonTitle="Actions"
                    items={[
                        { name: 'Modifier', action: () => console.log("Modifier") },
                        { name: 'Synchroniser', action: () => console.log("Synchroniser") },
                        { name: 'Calculer Bulletin', action: () => console.log("Calculer Bulletin") },
                        { name: 'Imprimer Bulletin', action: () => console.log("Imprimer Bulletin") },
                        { name: 'Imprimer Attestation', action: () => console.log("Imprimer Attestation") },
                        { name: 'Imprimer Tableau d\'Honneur', action: () => console.log("Imprimer Tableau d'Honneur") },
                        { name: 'Supprimer', action: () => console.log("Supprimer"), className: "delete-action" },
                    ]}
                />
            </td>
        </tr>
    );
}