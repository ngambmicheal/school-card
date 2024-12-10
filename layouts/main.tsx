import { ReactNode } from "react"
import Navbar from "./navbar"
import Header from "./header";

type MainProps = {
    children:ReactNode,
    user: any
}

export const metadata = {
    title: 'AcademiX',
    description: 'The official Coding Beauty home page.',
    icons: {
      icon: '/assets/images/logo.png',
    },
};

export default function Main({children, user}:MainProps){
    return (
        <>
            <Header title={metadata.title} description={metadata.description} icon={metadata.icons.icon}/>
            <Navbar user={user}/>
            <div className='container mx-auto mt-4'>
                {children}
            </div>
        </>
    )
}