import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'


export default function ProfilePage({...error}){
    const {data:session} = useSession();

    return (<>
      Name: {session?.user?.name}
    
    </>)
}