import { PropsWithChildren, useEffect, useState } from "react";
import ClasseInterface from "../../../models/classe";
import api from "../../../services/api";
import TermInterface from "../../models/terms";
import {DynamicExamModal} from "../../modals/dyname-exam-form";
import AnnualExamInterface from "../../models/annualExam";

export default function SchoolSettingExam({school, editable}:{school: SchoolInterface, editable: boolean}) {
    const [classes, setClasses] = useState<ClasseInterface[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [dynamicExamIsOpen, setDynamicExamIsOpen] = useState(false);
    const [annualExamIsOpen, setAnnualExamIsOpen] = useState(false);
    const [classeId, setClasseId] = useState<string | null>(school?._id);

    const [terms, setTerms] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [annualExams, setAnnualExams] = useState<AnnualExamInterface[]>([]);

    useEffect(() => {
        if(classeId) {
            api.getTerms(classeId).then(({ data: { data } }: any) => {
                setTerms(data);
            });
            api.getClasseExams(classeId).then(({ data: { data } }: any) => {
                setExams(data);
            });
            api.getAnnualExams(classeId).then(({ data: { data } }: any) => {
                setAnnualExams(data);
            });
        }
    }, [classeId]);

    const saveExam = (exam: any) => {
        api.saveExam(exam).then(() => {
            // Optionally, you can show a success message or update the state
            console.log("Exam saved successfully");
            setDynamicExamIsOpen(false);
        }).catch((error) => {
            console.error("Error saving exam:", error);
        });
    };

    const saveAnnualExam = (exam: any) => {
        api.saveAnnualExam(exam).then(() => {
            // Optionally, you can show a success message or update the state
            console.log("Annual exam saved successfully");
            setAnnualExamIsOpen(false);
        }).catch((error) => {
            console.error("Error saving annual exam:", error);
        });
    };

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
                                <button className="btn btn-primary" onClick={() => {setDynamicExamIsOpen(true)}}>Add Term Exam</button>
                            </div>

                        <hr />
                        <div className="form-group">
                            <button className="btn btn-primary" onClick={() => {setAnnualExamIsOpen(true)}}>Add Annual</button>
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

              {classeId && (
                <DynamicExamModal
                  exams={exams}
                  modalIsOpen={dynamicExamIsOpen}
                  closeModal={() => setDynamicExamIsOpen(false)}
                  save={saveExam}
                  class_id={classeId}
                />
              )}
              {classeId && (
                <AnnualExamModal
                  terms={terms}
                  modalIsOpen={annualExamIsOpen}
                  closeModal={() => setAnnualExamIsOpen(false)}
                  save={saveAnnualExam}
                  class_id={classeId}
                />
              )}

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
