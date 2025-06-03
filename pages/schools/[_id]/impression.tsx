import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import SchoolInterface from "../../../models/school";
import SessionInterface from "../../../models/session";
import api from "../../../services/api";
import { customStyles } from "../../../services/constants";
import { errorMessage, successMessage } from "../../../utils/messages";

type ImpressionSettingsParams = {
  school: SchoolInterface;
  editable: boolean;
};

export default function SchoolSettingImpression({
  school: schol,
  editable,
}: ImpressionSettingsParams) {
  const [school, setSchool] = useState<SchoolInterface>(schol);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: boolean}>({});

  const updateSchool = async () => {
    if (school) {
      setLoading(true);
      try {
        await api.updateSchool(school);
        toast(successMessage('Configuration d\'impression mise à jour avec succès!'));
      } catch (error) {
        toast(errorMessage('Erreur lors de la mise à jour'));
      } finally {
        setLoading(false);
      }
    }
  };

  const toast = useToast(); 

  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setSchool((inputData) => ({
      ...inputData,
      [key]: value,
    }));
  }

  function handleChangeLogo(e: any, key: keyof SchoolInterface) {
    const file = e.target.files[0];
    if (file && school?._id) {
      setUploadingFiles(prev => ({...prev, [key]: true}));
      api.uploadFile(file, 'SCHOOL', school._id).then((response) => {
        setSchool((inputData) => ({
          ...inputData,
          [key]: response.data.data.src,
        }));
        toast(successMessage('Image téléchargée avec succès!'));
      }).catch((error) => {
        toast(errorMessage('Erreur lors du téléchargement de l\'image'));
      }).finally(() => {
        setUploadingFiles(prev => ({...prev, [key]: false}));
      });
    }
  }

  return (
    <>
      <div className="impression-container">
        {/* Document Configuration Section */}
        <div className="config-section">
          <div className="section-header">
            <h3>📄 Configuration des Documents</h3>
            <p>Paramètres d'affichage pour les bulletins et statistiques</p>
          </div>
          
          <div className="config-grid">
            {/* Stats Configuration */}
            <div className="config-card">
              <div className="card-header">
                <h4>📊 Page Statistiques</h4>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label htmlFor="police_stats">Police PDF Statistiques</label>
                  <input
                    id="police_stats"
                    className="form-control"
                    disabled={!editable}
                    name="police_stats"
                    value={school?.police_stats || ''}
                    onChange={handleChange}
                    placeholder="Arial, Helvetica, sans-serif"
                  />
                  <small className="form-hint">Police utilisée pour les documents PDF de statistiques</small>
                </div>

                <div className="form-group">
                  <label>Affichage des Matières</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        disabled={!editable}
                        name="subject_display"
                        value={5}
                        checked={school?.subject_display == 5}
                        onChange={handleChange}
                      />
                      <span className="radio-label">Orale (complet)</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        disabled={!editable}
                        name="subject_display"
                        value={3}
                        checked={school?.subject_display == 3}
                        onChange={handleChange}
                      />
                      <span className="radio-label">Ora (abrégé)</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        disabled={!editable}
                        name="subject_display"
                        value={1}
                        checked={school?.subject_display == 1}
                        onChange={handleChange}
                      />
                      <span className="radio-label">O (minimal)</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Affichage des Noms</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        disabled={!editable}
                        name="name_display_stats"
                        value={2}
                        checked={school?.name_display_stats == 2}
                        onChange={handleChange}
                      />
                      <span className="radio-label">Nom Complet</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        disabled={!editable}
                        name="name_display_stats"
                        value={1}
                        checked={school?.name_display_stats == 1}
                        onChange={handleChange}
                      />
                      <span className="radio-label">Prénom Seulement</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        disabled={!editable}
                        name="name_display_stats"
                        value={0}
                        checked={school?.name_display_stats == 0}
                        onChange={handleChange}
                      />
                      <span className="radio-label">Aucun</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Afficher Sous-Total</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        disabled={!editable}
                        name="sub_total_display"
                        value={1}
                        checked={school?.sub_total_display == 1}
                        onChange={handleChange}
                      />
                      <span className="radio-label">Oui</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        disabled={!editable}
                        name="sub_total_display"
                        value={0}
                        checked={school?.sub_total_display == 0}
                        onChange={handleChange}
                      />
                      <span className="radio-label">Non</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Configuration */}
            <div className="config-card">
              <div className="card-header">
                <h4>📈 Page Bulletins</h4>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label htmlFor="police_reports">Police PDF Bulletins</label>
                  <input
                    id="police_reports"
                    className="form-control"
                    disabled={!editable}
                    name="police_reports"
                    value={school?.police_reports || ''}
                    onChange={handleChange}
                    placeholder="Arial, Helvetica, sans-serif"
                  />
                  <small className="form-hint">Police utilisée pour les documents PDF de bulletins</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Assets Section */}
        <div className="assets-section">
          <div className="section-header">
            <h3>🖼️ Ressources Visuelles</h3>
            <p>Logos et images utilisés dans les documents officiels</p>
          </div>
          
          <div className="assets-grid">
            {[
              { key: 'logo', title: 'Logo de l\'École', description: 'Logo principal utilisé sur tous les documents' },
              { key: 'th_fr', title: 'Tableau d\'Honneur (FR)', description: 'Image pour le tableau d\'honneur en français' },
              { key: 'th_en', title: 'Tableau d\'Honneur (EN)', description: 'Image pour le tableau d\'honneur en anglais' },
              { key: 'attestation_fr', title: 'Attestation (FR)', description: 'Template d\'attestation en français' },
              { key: 'attestation_en', title: 'Attestation (EN)', description: 'Template d\'attestation en anglais' },
              { key: 'attestation_mat', title: 'Attestation Maternelle', description: 'Template spécial pour la maternelle' },
              { key: 'attestation_nursery', title: 'Attestation Nursery', description: 'Template spécial pour la nursery' },
            ].map((asset) => (
              <div key={asset.key} className="asset-card">
                <div className="asset-header">
                  <h4>{asset.title}</h4>
                  <p>{asset.description}</p>
                </div>
                <div className="asset-content">
                  <div className="image-preview">
                    {school?.[asset.key as keyof SchoolInterface] ? (
                      <img 
                        src={school[asset.key as keyof SchoolInterface] as string} 
                        alt={asset.title}
                        className="preview-image"
                      />
                    ) : (
                      <div className="no-image">
                        <span className="no-image-icon">📷</span>
                        <p>Aucune image</p>
                      </div>
                    )}
                  </div>
                  
                  {editable && (
                    <div className="upload-controls">
                      <label className="upload-button">
                        {uploadingFiles[asset.key] ? (
                          <>
                            <span className="loading-sm"></span>
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            📁 Choisir une image
                          </>
                        )}
                        <input 
                          type="file" 
                          onChange={(e) => handleChangeLogo(e, asset.key as keyof SchoolInterface)} 
                          accept=".jpg,.jpeg,.png,.gif"
                          disabled={uploadingFiles[asset.key]}
                          hidden
                        />
                      </label>
                      <small className="upload-hint">
                        Formats acceptés: JPG, PNG, GIF (max 5MB)
                      </small>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

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
                  💾 Enregistrer la Configuration
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
        .impression-container {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0 var(--spacing-lg);
        }

        .config-section, .assets-section {
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--secondary-200);
          width: 100%;
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

        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-xl);
          width: 100%;
        }

        .config-card {
          border: 1px solid var(--secondary-200);
          border-radius: var(--radius-md);
          overflow: hidden;
          min-height: 500px;
        }

        .card-header {
          background: var(--secondary-50);
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--secondary-200);
        }

        .card-header h4 {
          margin: 0;
          color: var(--secondary-900);
          font-size: 1rem;
          font-weight: 600;
        }

        .card-content {
          padding: var(--spacing-lg);
          height: calc(100% - 70px);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .form-group {
          margin-bottom: var(--spacing-lg);
        }

        .form-group label {
          display: block;
          font-weight: 500;
          color: var(--secondary-700);
          margin-bottom: var(--spacing-sm);
          font-size: 0.875rem;
        }

        .form-control {
          width: 100%;
          padding: var(--spacing-md);
          border: 1px solid var(--secondary-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
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

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          margin-top: var(--spacing-sm);
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm);
          border-radius: var(--radius-sm);
          transition: background 0.2s ease;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .radio-option:hover {
          background: var(--secondary-50);
          border-color: var(--secondary-200);
        }

        .radio-option input[type="radio"] {
          margin: 0;
          width: 14px;
          height: 14px;
        }

        .radio-label {
          font-size: 0.875rem;
          color: var(--secondary-700);
          font-weight: 500;
        }

        .assets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
          width: 100%;
        }

        .asset-card {
          border: 1px solid var(--secondary-200);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .asset-header {
          background: var(--secondary-50);
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--secondary-200);
        }

        .asset-header h4 {
          margin: 0 0 var(--spacing-xs) 0;
          color: var(--secondary-900);
          font-size: 0.95rem;
          font-weight: 600;
        }

        .asset-header p {
          margin: 0;
          color: var(--secondary-600);
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .asset-content {
          padding: var(--spacing-lg);
        }

        .image-preview {
          width: 100%;
          height: 150px;
          border: 2px dashed var(--secondary-300);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--spacing-md);
          overflow: hidden;
        }

        .preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }

        .no-image {
          text-align: center;
          color: var(--secondary-500);
        }

        .no-image-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: var(--spacing-sm);
        }

        .no-image p {
          margin: 0;
          font-size: 0.875rem;
        }

        .upload-controls {
          text-align: center;
        }

        .upload-button {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--primary-600);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background 0.2s ease;
          text-decoration: none;
        }

        .upload-button:hover {
          background: var(--primary-700);
        }

        .upload-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-hint {
          display: block;
          margin-top: var(--spacing-sm);
          color: var(--secondary-500);
          font-size: 0.75rem;
        }

        .save-section {
          background: var(--primary-50);
          border: 1px solid var(--primary-200);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          text-align: center;
          width: 100%;
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

        /* Desktop-first responsive design */
        @media (max-width: 1200px) {
          .config-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }
          
          .config-card {
            min-height: auto;
          }
        }

        @media (max-width: 768px) {
          .impression-container {
            padding: 0 var(--spacing-md);
          }

          .config-section, .assets-section {
            padding: var(--spacing-lg);
          }

          .assets-grid {
            grid-template-columns: 1fr;
          }

          .radio-group {
            flex-direction: column;
          }

          .radio-option {
            padding: var(--spacing-sm);
          }
        }

        @media (max-width: 480px) {
          .impression-container {
            padding: 0 var(--spacing-sm);
          }

          .config-section, .assets-section {
            padding: var(--spacing-md);
          }

          .section-header h3 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
}
