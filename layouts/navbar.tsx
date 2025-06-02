import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { helperService } from '../services'
import useSchool from '../hooks/useSchool'
import useUser from '../hooks/useUser'
import { UserType } from '../utils/enums'
import { useState } from 'react'

export default function Navbar(){
    const { data: session } = useSession()
    const {school} = useSchool();
    const {user} = useUser(session); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/classes',
            icon: '📊',
            show: helperService.getSchoolId() && session && user?.type === UserType.ADMIN
        },
        {
            name: 'Classes',
            href: '/classes',
            icon: '🏛️',
            show: helperService.getSchoolId() && session && user?.type === UserType.ADMIN
        },
        {
            name: 'Élèves',
            href: '/students',
            icon: '👨‍🎓',
            show: helperService.getSchoolId() && session && user?.type === UserType.ADMIN
        },
        {
            name: 'Sections',
            href: '/sections',
            icon: '📚',
            show: helperService.getSchoolId() && session && user?.type === UserType.ADMIN
        },
        {
            name: 'Compétences',
            href: '/competences',
            icon: '⭐',
            show: helperService.getSchoolId() && session && user?.type === UserType.ADMIN
        },
        {
            name: 'Matières',
            href: '/subjects',
            icon: '📖',
            show: helperService.getSchoolId() && session && user?.type === UserType.ADMIN
        },
        {
            name: 'Cours',
            href: '/courses',
            icon: '🎯',
            show: helperService.getSchoolId() && session && user?.type === UserType.ADMIN
        },
        {
            name: 'Personnel',
            href: '/staff',
            icon: '👥',
            show: helperService.getSchoolId() && session && user?.type === UserType.ADMIN
        }
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="mobile-header">
                <div className="mobile-header-content">
                    <button 
                        className="mobile-menu-button"
                        onClick={toggleSidebar}
                    >
                        <span className="hamburger"></span>
                        <span className="hamburger"></span>
                        <span className="hamburger"></span>
                    </button>
                    <div className="mobile-title">
                        {school?.name || 'AcademiX'}
                    </div>
                    <div className="mobile-user">
                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                </div>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <nav className={`modern-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="school-logo">
                        <div className="logo-icon">🎓</div>
                        <div className="school-info">
                            <div className="school-name">
                                {school?.name || 'AcademiX'}
                            </div>
                            <div className="app-title">École Management</div>
                        </div>
                    </div>
                </div>

                <div className="sidebar-content">
                    {!session && (
                        <div className="sidebar-section">
                            <Link href="/">
                                <a className="nav-item">
                                    <span className="nav-icon">🏠</span>
                                    <span className="nav-text">Accueil</span>
                                </a>
                            </Link>
                        </div>
                    )}

                    {session && (
                        <div className="sidebar-section">
                            <div className="section-title">Navigation</div>
                            {navigationItems.filter(item => item.show).map((item, index) => (
                                <Link key={index} href={item.href}>
                                    <a className="nav-item">
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-text">{item.name}</span>
                                    </a>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sidebar-footer">
                    {session ? (
                        <>
                            <Link href="/auth/profile">
                                <a className="user-profile">
                                    <div className="user-avatar">
                                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{session.user?.name}</div>
                                        <div className="user-role">Administrateur</div>
                                    </div>
                                </a>
                            </Link>
                            <button 
                                className="logout-button"
                                onClick={() => signOut({callbackUrl:'/'})}
                            >
                                <span className="logout-icon">🚪</span>
                                <span>Déconnexion</span>
                            </button>
                        </>
                    ) : (
                        school && (
                            <button 
                                className="signin-button"
                                onClick={() => signIn('credentials',{callbackUrl:`/auth/profile`})}
                            >
                                <span className="signin-icon">🔑</span>
                                <span>Se connecter</span>
                            </button>
                        )
                    )}
                </div>
            </nav>

            <style jsx>{`
                .mobile-header {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 60px;
                    background: white;
                    border-bottom: 1px solid var(--secondary-200);
                    z-index: 1000;
                }

                .mobile-header-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 100%;
                    padding: 0 var(--spacing-lg);
                }

                .mobile-menu-button {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    width: 24px;
                    height: 24px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                }

                .hamburger {
                    width: 100%;
                    height: 2px;
                    background: var(--secondary-700);
                    transition: all 0.3s ease;
                }

                .mobile-title {
                    font-weight: 600;
                    color: var(--secondary-900);
                }

                .mobile-user {
                    width: 32px;
                    height: 32px;
                    background: var(--primary-600);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1001;
                    display: none;
                }

                .modern-sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 260px;
                    background: white;
                    border-right: 1px solid var(--secondary-200);
                    z-index: 1002;
                    display: flex;
                    flex-direction: column;
                    transform: translateX(0);
                    transition: transform 0.3s ease;
                }

                .sidebar-header {
                    padding: var(--spacing-lg);
                    border-bottom: 1px solid var(--secondary-200);
                }

                .school-logo {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                }

                .logo-icon {
                    font-size: 2rem;
                }

                .school-info {
                    flex: 1;
                }

                .school-name {
                    font-weight: 600;
                    color: var(--secondary-900);
                    font-size: 1.125rem;
                    line-height: 1.2;
                }

                .app-title {
                    font-size: 0.75rem;
                    color: var(--secondary-500);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .sidebar-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: var(--spacing-lg) 0;
                }

                .sidebar-section {
                    margin-bottom: var(--spacing-lg);
                }

                .section-title {
                    padding: 0 var(--spacing-lg) var(--spacing-sm);
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--secondary-500);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    padding: var(--spacing-sm) var(--spacing-lg);
                    color: var(--secondary-700);
                    text-decoration: none;
                    transition: all 0.2s ease;
                    border-left: 3px solid transparent;
                }

                .nav-item:hover {
                    background: var(--primary-50);
                    color: var(--primary-700);
                    border-left-color: var(--primary-600);
                    text-decoration: none;
                }

                .nav-icon {
                    font-size: 1.25rem;
                    width: 24px;
                    text-align: center;
                }

                .nav-text {
                    font-weight: 500;
                }

                .sidebar-footer {
                    padding: var(--spacing-lg);
                    border-top: 1px solid var(--secondary-200);
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    padding: var(--spacing-sm);
                    border-radius: var(--radius-md);
                    text-decoration: none;
                    color: inherit;
                    transition: background 0.2s ease;
                    margin-bottom: var(--spacing-md);
                }

                .user-profile:hover {
                    background: var(--secondary-50);
                    text-decoration: none;
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    background: var(--primary-600);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                }

                .user-info {
                    flex: 1;
                }

                .user-name {
                    font-weight: 500;
                    color: var(--secondary-900);
                    font-size: 0.875rem;
                }

                .user-role {
                    font-size: 0.75rem;
                    color: var(--secondary-500);
                }

                .logout-button, .signin-button {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    width: 100%;
                    padding: var(--spacing-sm);
                    border: none;
                    background: var(--error-50);
                    color: var(--error-600);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: background 0.2s ease;
                }

                .signin-button {
                    background: var(--primary-50);
                    color: var(--primary-600);
                }

                .logout-button:hover {
                    background: var(--error-100);
                }

                .signin-button:hover {
                    background: var(--primary-100);
                }

                @media (max-width: 768px) {
                    .mobile-header {
                        display: block;
                    }

                    .sidebar-overlay {
                        display: block;
                    }

                    .modern-sidebar {
                        transform: translateX(-100%);
                    }

                    .modern-sidebar.sidebar-open {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    )
}