import React, { useState } from 'react'
import { useToast } from "@chakra-ui/react";
import SchoolInterface from '../../../models/school'
import api from '../../../services/api';
import { errorMessage, successMessage } from '../../../utils/messages';

export default function SchoolSettingAttestation({school: schol, editable}: {school: SchoolInterface, editable: boolean}) {
    const [school, setSchool] = useState<SchoolInterface>(schol);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const updateSchool = async () => {
        if (school) {
            setLoading(true);
            try {
                await api.updateSchool(school);
                toast(successMessage('Configuration des attestations mise à jour avec succès!'));
            } catch (error) {
                toast(errorMessage('Erreur lors de la mise à jour'));
            } finally {
                setLoading(false);
            }
        }
    };

    function handleChange(e: any) {
        const key = e.target.name;
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

        setSchool((inputData) => ({
            ...inputData,
            [key]: value,
        }));
    }

    return (
        <>
            <div className="attestation-container">
                {/* Header Section */}
                <div className="attestation-header">
                    <div className="header-content">
                        <h3>🏆 Configuration des Attestations</h3>
                        <p>Personnalisation des textes et contenus des attestations et certificats</p>
                    </div>
                </div>

                {/* French Attestations */}
                <div className="section-card">
                    <div className="card-header">
                        <h4>🇫🇷 Attestations en Français</h4>
                        <p>Contenu des attestations délivrées en langue française</p>
                    </div>
                    
                    <div className="card-content">
                        <div className="form-group">
                            <label htmlFor="attestation_fr_intro">
                                Texte d'Introduction
                            </label>
                            <textarea
                                id="attestation_fr_intro"
                                className="form-control"
                                disabled={!editable}
                                name="attestation_fr_intro"
                                value={school?.attestation_fr_intro || ''}
                                onChange={handleChange}
                                placeholder="Texte d'introduction pour les attestations en français..."
                                rows={3}
                            />
                            <small className="form-hint">
                                Texte affiché en introduction de l'attestation (ex: "Le Directeur de l'École...")
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="attestation_fr_body">
                                Corps du Texte
                            </label>
                            <textarea
                                id="attestation_fr_body"
                                className="form-control"
                                disabled={!editable}
                                name="attestation_fr_body"
                                value={school?.attestation_fr_body || ''}
                                onChange={handleChange}
                                placeholder="Corps principal de l'attestation en français..."
                                rows={6}
                            />
                            <small className="form-hint">
                                Contenu principal de l'attestation avec les détails de certification
                            </small>
                        </div>
                    </div>
                </div>

                {/* English Attestations */}
                <div className="section-card">
                    <div className="card-header">
                        <h4>🇬🇧 Attestations in English</h4>
                        <p>Content for certificates issued in English language</p>
                    </div>
                    
                    <div className="card-content">
                        <div className="form-group">
                            <label htmlFor="attestation_en_intro">
                                Introduction Text
                            </label>
                            <textarea
                                id="attestation_en_intro"
                                className="form-control"
                                disabled={!editable}
                                name="attestation_en_intro"
                                value={school?.attestation_en_intro || ''}
                                onChange={handleChange}
                                placeholder="Introduction text for English certificates..."
                                rows={3}
                            />
                            <small className="form-hint">
                                Text displayed as introduction of the certificate (e.g., "The Principal of the School...")
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="attestation_en_body">
                                Body Text
                            </label>
                            <textarea
                                id="attestation_en_body"
                                className="form-control"
                                disabled={!editable}
                                name="attestation_en_body"
                                value={school?.attestation_en_body || ''}
                                onChange={handleChange}
                                placeholder="Main body of the English certificate..."
                                rows={6}
                            />
                            <small className="form-hint">
                                Main content of the certificate with certification details
                            </small>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                {(school?.attestation_fr_intro || school?.attestation_fr_body || school?.attestation_en_intro || school?.attestation_en_body) && (
                    <div className="section-card">
                        <div className="card-header">
                            <h4>👁️ Aperçu des Attestations</h4>
                            <p>Prévisualisation du rendu des attestations</p>
                        </div>
                        
                        <div className="card-content">
                            <div className="preview-grid">
                                {(school?.attestation_fr_intro || school?.attestation_fr_body) && (
                                    <div className="preview-card">
                                        <div className="preview-header">
                                            <h5>🇫🇷 Version Française</h5>
                                        </div>
                                        <div className="preview-content">
                                            {school?.attestation_fr_intro && (
                                                <div className="preview-section">
                                                    <strong>Introduction:</strong>
                                                    <p>{school.attestation_fr_intro}</p>
                                                </div>
                                            )}
                                            {school?.attestation_fr_body && (
                                                <div className="preview-section">
                                                    <strong>Corps:</strong>
                                                    <p>{school.attestation_fr_body}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {(school?.attestation_en_intro || school?.attestation_en_body) && (
                                    <div className="preview-card">
                                        <div className="preview-header">
                                            <h5>🇬🇧 English Version</h5>
                                        </div>
                                        <div className="preview-content">
                                            {school?.attestation_en_intro && (
                                                <div className="preview-section">
                                                    <strong>Introduction:</strong>
                                                    <p>{school.attestation_en_intro}</p>
                                                </div>
                                            )}
                                            {school?.attestation_en_body && (
                                                <div className="preview-section">
                                                    <strong>Body:</strong>
                                                    <p>{school.attestation_en_body}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                                    💾 Enregistrer les Attestations
                                </>
                            )}
                        </button>
                        
                        {!school?.session_id && (
                            <p className="save-hint">
                                Veuillez sélectionner une session dans les informations générales
                            </p>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .attestation-container {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .attestation-header {
                    background: white;
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-xl);
                    margin-bottom: var(--spacing-xl);
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--secondary-200);
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

                .section-card {
                    background: white;
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-xl);
                    margin-bottom: var(--spacing-xl);
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--secondary-200);
                }

                .card-header {
                    margin-bottom: var(--spacing-xl);
                    padding-bottom: var(--spacing-lg);
                    border-bottom: 1px solid var(--secondary-200);
                }

                .card-header h4 {
                    margin: 0 0 var(--spacing-sm) 0;
                    color: var(--secondary-900);
                    font-size: 1.125rem;
                    font-weight: 600;
                }

                .card-header p {
                    margin: 0;
                    color: var(--secondary-600);
                    font-size: 0.875rem;
                }

                .card-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group label {
                    font-weight: 500;
                    color: var(--secondary-700);
                    margin-bottom: var(--spacing-sm);
                    font-size: 0.875rem;
                }

                .form-control {
                    padding: var(--spacing-md);
                    border: 1px solid var(--secondary-300);
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    line-height: 1.5;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    resize: vertical;
                    font-family: inherit;
                }

                .form-control:focus {
                    outline: none;
                    border-color: var(--primary-500);
                    box-shadow: 0 0 0 3px var(--primary-100);
                }

                .form-control:disabled {
                    background-color: var(--secondary-50);
                    color: var(--secondary-500);
                    cursor: not-allowed;
                }

                .form-hint {
                    margin-top: var(--spacing-sm);
                    color: var(--secondary-500);
                    font-size: 0.75rem;
                    line-height: 1.4;
                }

                .preview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: var(--spacing-lg);
                }

                .preview-card {
                    border: 1px solid var(--secondary-200);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                }

                .preview-header {
                    background: var(--secondary-50);
                    padding: var(--spacing-md);
                    border-bottom: 1px solid var(--secondary-200);
                }

                .preview-header h5 {
                    margin: 0;
                    color: var(--secondary-900);
                    font-size: 0.95rem;
                    font-weight: 600;
                }

                .preview-content {
                    padding: var(--spacing-lg);
                }

                .preview-section {
                    margin-bottom: var(--spacing-lg);
                }

                .preview-section:last-child {
                    margin-bottom: 0;
                }

                .preview-section strong {
                    color: var(--secondary-700);
                    font-size: 0.8rem;
                    display: block;
                    margin-bottom: var(--spacing-xs);
                }

                .preview-section p {
                    margin: 0;
                    color: var(--secondary-600);
                    font-size: 0.875rem;
                    line-height: 1.5;
                    padding: var(--spacing-sm);
                    background: var(--secondary-50);
                    border-radius: var(--radius-sm);
                    border-left: 3px solid var(--primary-300);
                }

                .save-section {
                    background: var(--primary-50);
                    border: 1px solid var(--primary-200);
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-xl);
                    text-align: center;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-md) var(--spacing-lg);
                    border: none;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .btn-primary {
                    background: var(--primary-600);
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    background: var(--primary-700);
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-lg {
                    padding: var(--spacing-lg) var(--spacing-xl);
                    font-size: 1rem;
                }

                .save-hint {
                    margin-top: var(--spacing-md);
                    color: var(--warning-600);
                    font-size: 0.875rem;
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
                    .preview-grid {
                        grid-template-columns: 1fr;
                    }

                    .form-control {
                        font-size: 0.8rem;
                    }
                }
            `}</style>
        </>
    );
}
