import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { helperService } from '../services'
import useSchool from '../hooks/useSchool'

type NavbarProps = {
    user: any,
}

export default function Navbar({user}:NavbarProps){
    const { data: session } = useSession()
    const {school} = useSchool();
    return (
        <nav className='navbar navbar-dark bg-dark navbar-expand'>
        <div className='collapse navbar-collapse'>
            <ul className='navbar-nav mr-auto'>
        <Link href='#'><a className='nav-link'>{school?.name}</a></Link>
        <Link href='/' ><a className='nav-link'>Accueil</a></Link>

        { helperService.getSchoolId() && session && <>
        <Link href='/classes' ><a className='nav-link'>Classes</a></Link>
        <Link href='/students' ><a className='nav-link'>Elèves</a></Link>
            <Link href='/schools' ><a className='nav-link'>Ecoles</a></Link>
            <Link href='/sections'><a className='nav-link'>Sections</a></Link>
            <Link href='/competences'><a className='nav-link'>Compétences</a></Link>
            <Link href='/subjects'><a className='nav-link'>Matières</a></Link>
            <Link href='/courses'><a className='nav-link'>Courses</a></Link>
            <Link href='/staff'><a className='nav-link'>Staff</a></Link>
        </>}
            </ul>
        </div>
        <div className='collapse navbar-collapse'>
        <ul className='navbar-nav mr-0'>
            {session?
                <>
                    <Link href='/profile' ><a className='nav-link'>{session.user?.name}</a></Link>
                    <a className='nav-link' href='#' onClick={() => signOut()}>Logout</a>
                </> 
                :
                <>
                    <a href='#' className='nav-link' onClick={() => signIn()}>Sign in</a>
                </>
                }
            </ul>
        </div>
    </nav>
    )
}