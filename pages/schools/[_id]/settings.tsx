import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import api from "../../../services/api";
import useSchool from "../../../hooks/useSchool";
import useUser from "../../../hooks/useUser";
import SchoolInterface from "../../../models/school";
import SectionInterface from "../../../models/section";
import { UserType } from "../../../utils/enums";
import SchoolSettingInfo from "./info";
import SchoolSettingImpression from "./impression";
import SchoolSettingExam from "./Exam";
import SchoolSettingAttestation from "./Attestation";

enum SettingPages {
  Information = 'Information',
  Impression = 'Impression',
  Exam = 'Exam',
  Attestation = 'Attestation',
}

const settingTabs = [
  {
    key: SettingPages.Information,
    name: 'Informations Générales',
    icon: '📋',
    description: 'Gérer les informations de base de l\'école'
  },
  {
    key: SettingPages.Impression,
    name: 'Configuration Impression',
    icon: '🖨️',
    description: 'Paramètres d\'impression et de documents'
  },
  {
    key: SettingPages.Exam,
    name: 'Examens',
    icon: '📝',
    description: 'Configuration des examens et évaluations'
  },
  {
    key: SettingPages.Attestation,
    name: 'Attestations',
    icon: '🏆',
    description: 'Gestion des attestations et certificats'
  }
];

export default function SchoolSettings() {
  const [sections, setSections] = useState<SectionInterface[]>([]);
  const [activeTab, setActiveTab] = useState<SettingPages>(SettingPages.Information);
  const [loading, setLoading] = useState(true);

  const { school: schoolFromHook } = useSchool();
  const { data: session } = useSession();
  const { user } = useUser(session);
  const router = useRouter();
  const { _id: schoolId } = router.query;

  const [school, setSchool] = useState<SchoolInterface | undefined>(schoolFromHook);

  useEffect(() => {
    if (schoolFromHook) {
      setSchool(schoolFromHook);
    }
  }, [schoolFromHook]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const response = await api.getSections();
        setSections(response.data.data);
      } catch (error) {
        console.error('Error loading sections:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, []);

  const isAdmin = user?.type === UserType.ADMIN;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Chargement des paramètres...</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏫</div>
        <h3>École non trouvée</h3>
        <p>L'école demandée n'existe pas ou n'est pas accessible</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="modern-container">
          <div className="page-title">
            <div className="title-section">
              <h1>Paramètres de l'École</h1>
              <p className="school-subtitle">{school.name}</p>
            </div>
            <div className="page-actions">
              {!session && (
                <div className="access-info">
                  <span className="access-badge">👁️ Mode Consultation</span>
                </div>
              )}
              {session && !isAdmin && (
                <div className="access-info">
                  <span className="access-badge">📖 Lecture Seule</span>
                </div>
              )}
              {session && isAdmin && (
                <div className="access-info">
                  <span className="access-badge admin">⚙️ Administrateur</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <div className="modern-container">
          <div className="tabs-navigation">
            {settingTabs.map((tab) => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-content">
                  <span className="tab-name">{tab.name}</span>
                  <span className="tab-description">{tab.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content-container">
        <div className="modern-container">
          <div className="tab-content fade-in">
            {activeTab === SettingPages.Information && (
              <SchoolSettingInfo
                school={school}
                editable={isAdmin}
              />
            )}
            
            {activeTab === SettingPages.Impression && (
              <SchoolSettingImpression 
                school={school} 
                editable={isAdmin} 
              />
            )}
            
            {activeTab === SettingPages.Exam && (
              <SchoolSettingExam 
                school={school} 
                editable={isAdmin} 
              />
            )}
            
            {activeTab === SettingPages.Attestation && (
              <SchoolSettingAttestation 
                school={school} 
                editable={isAdmin} 
              />
            )}
          </div>
        </div>
      </div>

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

        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
        }

        .empty-state h3 {
          color: var(--secondary-700);
          margin-bottom: var(--spacing-sm);
        }

        .empty-state p {
          color: var(--secondary-500);
        }

        .title-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .school-subtitle {
          color: var(--primary-600);
          font-size: 1.125rem;
          font-weight: 500;
          margin: 0;
        }

        .access-info {
          display: flex;
          align-items: center;
        }

        .access-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--secondary-100);
          color: var(--secondary-700);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .access-badge.admin {
          background: var(--success-100);
          color: var(--success-700);
        }

        .tabs-container {
          background: white;
          border-bottom: 1px solid var(--secondary-200);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .tabs-navigation {
          display: flex;
          overflow-x: auto;
          gap: var(--spacing-xs);
          padding: var(--spacing-md) 0;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) var(--spacing-lg);
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          min-width: fit-content;
          white-space: nowrap;
          font-family: inherit;
        }

        .tab-button:hover {
          background: var(--primary-50);
        }

        .tab-button.active {
          background: var(--primary-100);
          color: var(--primary-700);
        }

        .tab-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .tab-name {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--secondary-900);
        }

        .tab-button.active .tab-name {
          color: var(--primary-700);
        }

        .tab-description {
          font-size: 0.75rem;
          color: var(--secondary-500);
          margin-top: var(--spacing-xs);
        }

        .tab-content-container {
          padding: var(--spacing-xl) 0;
          min-height: 60vh;
        }

        @media (max-width: 768px) {
          .page-title {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .tabs-navigation {
            flex-direction: column;
          }

          .tab-button {
            width: 100%;
            justify-content: flex-start;
          }

          .tab-content {
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .tabs-navigation {
            padding: var(--spacing-sm) 0;
          }

          .tab-button {
            padding: var(--spacing-sm) var(--spacing-md);
          }

          .tab-icon {
            font-size: 1.25rem;
          }

          .tab-name {
            font-size: 0.8rem;
          }

          .tab-description {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </>
  );
}
