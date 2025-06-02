import { Link } from "@chakra-ui/layout";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import SchoolInterface from "../models/school";
import { helperService } from "../services";
import api from "../services/api";
import NextLink from "next/link";

const Home: NextPage = () => {
  const [schools, setSchools] = useState<SchoolInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSchools()
      .then((response: any) => {
        setSchools(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching schools:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const chooseSchool = (schoolId: string) => {
    helperService.saveSchoolId(schoolId);
    window.location.href = "/classes";
  };

  return (
    <>
      <Head>
        <title>AcademiX - Système de Gestion Scolaire</title>
        <meta name="description" content="Choisissez votre école pour accéder au système de gestion" />
      </Head>

      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-icon">🎓</div>
            <h1 className="hero-title">
              Bienvenue sur AcademiX
            </h1>
            <p className="hero-subtitle">
              Système de gestion scolaire moderne et intuitif
            </p>
            <div className="hero-description">
              Choisissez votre établissement pour accéder à votre tableau de bord
            </div>
          </div>
        </div>

        {/* Schools Section */}
        <div className="schools-section">
          <div className="section-header">
            <h2>Établissements Disponibles</h2>
            <p>Sélectionnez votre école pour continuer</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading"></div>
              <p>Chargement des établissements...</p>
            </div>
          ) : schools.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏫</div>
              <h3>Aucun établissement trouvé</h3>
              <p>Veuillez contacter l'administrateur système</p>
            </div>
          ) : (
            <div className="schools-grid">
              {schools.map((school) => (
                <div key={school._id} className="school-card">
                  <div className="school-icon">🏫</div>
                  <div className="school-content">
                    <h3 className="school-name">{school.name}</h3>
                    <p className="school-description">
                      Accédez au tableau de bord de l'établissement
                    </p>
                    <div className="school-actions">
                      <NextLink href={`schools/${school._id}`}>
                        <a className="btn btn-secondary btn-sm">
                          Voir détails
                        </a>
                      </NextLink>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => school._id && chooseSchool(school._id)}
                      >
                        Accéder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>Fonctionnalités</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🎓</div>
              <h3>Gestion des Élèves</h3>
              <p>Gérez facilement les informations des élèves, leurs notes et leur progression</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏛️</div>
              <h3>Classes & Sections</h3>
              <p>Organisez vos classes, sections et matières de manière intuitive</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Personnel</h3>
              <p>Gérez le personnel enseignant et administratif de votre établissement</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Rapports</h3>
              <p>Générez des rapports détaillés et des statistiques en temps réel</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
        }

        .hero-section {
          text-align: center;
          padding: var(--spacing-2xl) 0;
          background: white;
          margin-bottom: var(--spacing-2xl);
          border-bottom: 1px solid var(--secondary-200);
        }

        .hero-content {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        .hero-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          color: var(--secondary-900);
          margin-bottom: var(--spacing-md);
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--primary-600);
          margin-bottom: var(--spacing-lg);
          font-weight: 500;
        }

        .hero-description {
          font-size: 1rem;
          color: var(--secondary-600);
          line-height: 1.6;
        }

        .schools-section {
          margin-bottom: var(--spacing-2xl);
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .section-header h2 {
          font-size: 2rem;
          font-weight: 600;
          color: var(--secondary-900);
          margin-bottom: var(--spacing-sm);
        }

        .section-header p {
          color: var(--secondary-600);
          font-size: 1.125rem;
        }

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
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--secondary-200);
          max-width: 400px;
          margin: 0 auto;
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

        .schools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--spacing-lg);
          max-width: 1000px;
          margin: 0 auto;
        }

        .school-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          border: 1px solid var(--secondary-200);
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease;
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-lg);
        }

        .school-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .school-icon {
          font-size: 2.5rem;
          color: var(--primary-600);
        }

        .school-content {
          flex: 1;
        }

        .school-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--secondary-900);
          margin-bottom: var(--spacing-sm);
        }

        .school-description {
          color: var(--secondary-600);
          margin-bottom: var(--spacing-lg);
          line-height: 1.5;
        }

        .school-actions {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .features-section {
          background: white;
          padding: var(--spacing-2xl) 0;
          border-top: 1px solid var(--secondary-200);
        }

        .features-section h2 {
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          color: var(--secondary-900);
          margin-bottom: var(--spacing-2xl);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature-card {
          text-align: center;
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--secondary-200);
          background: var(--secondary-50);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-lg);
        }

        .feature-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--secondary-900);
          margin-bottom: var(--spacing-sm);
        }

        .feature-card p {
          color: var(--secondary-600);
          line-height: 1.5;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.25rem;
          }

          .hero-subtitle {
            font-size: 1.125rem;
          }

          .schools-grid {
            grid-template-columns: 1fr;
            padding: 0 var(--spacing-lg);
          }

          .school-card {
            flex-direction: column;
            text-align: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
            padding: 0 var(--spacing-lg);
          }

          .school-actions {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
