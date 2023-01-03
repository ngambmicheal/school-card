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
import useSchool from "../../../hooks/useSchool";

export default function Classes(){
    const [classes, setClasses] = useState<Classe[]>([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [sections, setSections] = useState<SectionInterface[]>([])
    const {school} = useSchool()

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

    function handleChange(e:any) {
        const key = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    
        // setClasse(inputData => ({
        //   ...inputData,
        //   [key]: value
        // }))
      }


    return (
        <> {school && <div><div className="row">
            <div className="col-md-6">
                <div className='form-group'>
                    <label>Name </label>
                    <input className='form-control' name='name' value={school.name} onChange={handleChange}></input>
                </div>
                <div className='form-group'>
                    <label>Phone</label>
                    <input className='form-control' name='phone' value={school.phone} onChange={handleChange}></input>
                </div>
                <div className='form-group'>
                    <label>Address</label>
                    <input className='form-control' name='name' value={school.address} onChange={handleChange}></input>
                </div>
                <div className='form-group'>
                    <label>Email</label>
                    <input className='form-control' name='email' value={school.email} onChange={handleChange}></input>
                </div>
                <div className='form-group'>
                    <label>P.O Box</label>
                    <input className='form-control' name='box' value={school.box} onChange={handleChange}></input>
                </div>

            </div>
            <div className="col-md-6">
            <div className='form-group'>
                    <label className="form-label">Allow mark editing </label>
                    <input className="mx-4" type='checkbox' name='allowUpdate' onChange={handleChange}></input>
                </div>
            </div>
            </div>

            <div className="row">

            </div>
            </div>

            }
        </>
    )
}

