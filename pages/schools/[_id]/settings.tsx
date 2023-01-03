import { useEffect, useState } from "react"
import Classe from "../../../models/classe"
import Link from 'next/link';
import api from "../../../services/api";
import ClasseInterface from "../../../models/classe";
import Modal from 'react-modal';
import { customStyles } from "../../../services/constants";
import { useRouter } from "next/dist/client/router";
import SectionInterface from "../../../models/section";
import { CSVLink } from "react-csv";

export default function Classes(){
    const [classes, setClasses] = useState<Classe[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [sections, setSections] = useState<SectionInterface[]>([])

    const router = useRouter()
    const {_id:schoolId} = router.query;

    useEffect(() => {

        api.getSections().then(({data:{data}} : any) => {
            setSections(data)
        })

    }, [schoolId]);


    const closeModal = () => {
        setModalIsOpen(s => false);
    }



    return (
        <>
            <h4 className="h3">Classes</h4>
            <table className='table '>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>School</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map(classe => {
                       return  <tr key={classe._id}>
                            <td>{classe.name}</td>
                            <td>{classe.school?.name} </td>
                            <td><Link href={`/classes/${classe._id}`}>Voir</Link></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>
        </>
    )
}

