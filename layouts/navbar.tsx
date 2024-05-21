import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { helperService } from '../services'
import useSchool from '../hooks/useSchool'
import useUser from '../hooks/useUser'
import { UserType } from '../utils/enums'

type NavbarProps = {
    user: any,
}

export default function Navbar(){
    const { data: session } = useSession()
    const {school} = useSchool();
    const {user} = useUser(session); 

    return (
        <nav className='navbar navbar-dark bg-dark navbar-expand sticky-top '>
        <div className='collapse navbar-collapse'>
            <ul className='navbar-nav mr-auto'>
        <Link href={`/schools/${school?._id}/settings`}><a className='nav-link'>{school?.name}</a></Link>
        {!session && <Link href='/' ><a className='nav-link'>Accueil</a></Link>}

        { helperService.getSchoolId() && session && user?.type===UserType.ADMIN && <>
        <Link href='/classes' ><a className='nav-link'>Classes</a></Link>
        <Link href='/students' ><a className='nav-link'>Elèves</a></Link>
            {/* <Link href='/schools' ><a className='nav-link'>Ecoles</a></Link> */}
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
                    <Link href='/auth/profile' ><a className='nav-link'>{session.user?.name}</a></Link>
                    <a className='nav-link' href='#' onClick={() => signOut({callbackUrl:'/'})}>Logout</a>
                </> 
                :
                <>
                    {school && <a href='#' className='nav-link' onClick={() => signIn('credentials',{callbackUrl:`/auth/profile`})}>Sign in</a> }
                </>
                }
            </ul>
        </div>
    </nav>
    )
}