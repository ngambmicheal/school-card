import { useRouter } from 'next/router'


export default function Error({...error}){
    const router = useRouter(); 

    return (<>
        This is an error 
        <p color='red'>{router.query.error}</p>
    
    </>)
}