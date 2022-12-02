import Link from 'next/link'

type NavbarProps = {
    user: any,
    logout: () => void
}

export default function Navbar({user, logout}:NavbarProps){
    return (
        <nav className='navbar navbar-dark bg-dark navbar-expand'>
        <div className='collapse navbar-collapse'>
            <ul className='navbar-nav mr-auto'>
                {/* {user?
                <>
                    <li className='navbar-item'>
                        <Link href='/admin/users' ><a className='nav-link'>Users</a></Link>
                    </li>
                    <li className='navbar-item'>
                        <Link href='/admin/users'>Logout</Link>
                    </li>
                </> 
                :
                <>
                    <li className='navbar-item'>
                        <Link  href='/auth/login'><a className='nav-link'>Login</a></Link>
                    </li>
                    <li className='navbar-item'>
                        <Link  href='/auth/register'><a className='nav-link'>Register</a></Link>
                    </li>
                </>
                } */}

        <Link href='/' ><a className='nav-link'>Accueil</a></Link>
        <Link href='/schools' ><a className='nav-link'>Ecoles</a></Link>

        <Link href='/sections'><a className='nav-link'>Sections</a></Link>
        <Link href='/classes' ><a className='nav-link'>Classes</a></Link>
        <Link href='/students' ><a className='nav-link'>Elèves</a></Link>
        <Link href='/competences'><a className='nav-link'>Compétences</a></Link>
        <Link href='/subjects'><a className='nav-link'>Matières</a></Link>
        <Link href='/courses'><a className='nav-link'>Courses</a></Link>
            </ul>
        </div>
    </nav>
    )
}