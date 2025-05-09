import { PropsWithChildren, useEffect, useState } from "react";
import ClasseInterface from "../../../models/classe";
import api from "../../../services/api";

export default function SchoolSettingExam({children}: any) {
    const [classes, setClasses] = useState<ClasseInterface[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

    useEffect(() => {
        // Fetch classes from the API or any other source
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        api.getClasses().then(({ data: { data } }: any) => {
            setClasses(data);
        });
    }

    const handleClassSelection = (classId: string) => {
        setSelectedClasses((prevSelected) => {
            if (prevSelected.includes(classId)) {
                return prevSelected.filter((id) => id !== classId);
            } else {
                return [...prevSelected, classId];
            }
        });
    };
    const handleSelectAll = () => {
        if (selectedClasses.length === classes.length) {
            setSelectedClasses([]);
        } else {
            const allClassIds = classes.filter((classe) => classe._id).map((classe) => classe._id??'');
            setSelectedClasses(allClassIds);
        }
    };

    return (
        <div>

            <div className="row">
                <div className="col-md-6">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <input type="checkbox" checked={selectedClasses.length === classes.length} onChange={handleSelectAll} />
                                </th>
                                <th scope="col">Class</th>
                                {/* <th scope="col">Section</th> */}
                                <th scope="col">TB Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((classe, index) => (
                                <ClassRow key={index} classe={classe} index={index} handleClassSelection={(classId) => handleClassSelection(classe._id!)} isSelected={selectedClasses.includes(classe._id!)} /> 
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">

                        <hr />
                            <div className="form-group">
                                <button className="btn btn-primary" onClick={() => {}}>Add Term Exam</button>
                            </div>

                        <hr />
                        <div className="form-group">
                            <button className="btn btn-primary" onClick={() => {}}>Add Annual</button>
                        </div>

                        <hr />

                        <div className="form-group">
                            <button className="btn btn-primary" onClick={() => {}}>Print tableaux d'honneur</button>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary" onClick={() => {}}>Print Attestation</button>
                        </div>

                </div>
                
            </div>
        </div>
    )
}

type classRowProps = {
    classe: ClasseInterface;
    index: number;
    handleClassSelection: (classId: string) => void;
    isSelected: boolean;
}
const ClassRow = ({index, classe, handleClassSelection, isSelected}: PropsWithChildren<classRowProps>) => {
    const [tbNote, setTbNote] = useState(classe.tb_note);
    const handleTbNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setTbNote(newValue);
        // Here you can also make an API call to update the tb_note in the database
        api.updateClasse({...classe, tb_note:tbNote}).then(() => {
            // Optionally, you can show a success message or update the state
            console.log("TB Note updated successfully");
        }).catch((error) => {
            console.error("Error updating TB Note:", error);
        });
    };
    return (
        <tr key={index} onClick={() => {}} >
            <th scope="row"><input type="checkbox" checked={isSelected} onChange={() => handleClassSelection(classe._id!)}  />  </th>
            <td>{classe.name}</td>
            {/* <td>{classe.section?.name}</td> */}
            <td><input type="number" value={tbNote} onChange={handleTbNoteChange} className="form-control" style={{width:'80px'}} /> </td>
        </tr>
    )
}
