import { ReactNode } from "react"
import Navbar from "./navbar"

type MainProps = {
    children:ReactNode,
    user: any
}
export default function Main({children, user}:MainProps){
    return (
        <>
            <Navbar user={user}/>
            <div className='container mx-auto mt-4'>
                {children}
            </div>
        </>
    )
}