import { ReactNode } from "react"
import Navbar from "./navbar"

type MainProps = {
    children:ReactNode,
    user: any
}
export default function Main({children, user}:MainProps){

    const logout = () =>{

    }
    return (
        <>
            <Navbar user={user} logout={logout}/>
            <div className='container mx-auto mt-4'>
                {children}
            </div>
        </>
    )
}