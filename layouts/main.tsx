import { ReactNode } from "react"
import Navbar from "./navbar"
import Header from "./header";

type MainProps = {
    children:ReactNode,
    user: any
}

export const metadata = {
    title: 'AcademiX',
    description: 'Système de gestion scolaire moderne',
    icons: {
      icon: '/assets/images/logo.png',
    },
};

export default function Main({children, user}:MainProps){
    return (
        <div className="page-layout">
            <Header title={metadata.title} description={metadata.description} icon={metadata.icons.icon}/>
            <Navbar />
            <main className="main-content fade-in">
                <div className="modern-container">
                    {children}
                </div>
            </main>
        </div>
    )
}