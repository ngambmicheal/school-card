import { PropsWithChildren, useEffect, useState } from "react";
import ClasseInterface from "../../../models/classe";
import api from "../../../services/api";
import AnnualExamInterface from "../../../models/annualExam";
import SchoolInterface from "../../../models/school";
import { DynamicExamModal } from "../../classes/modals/dyname-exam-form";
import { AnnualExamModal } from "../../classes/modals/annual-exam";
import Dropdown from "../../../components/dropdown";


export default function SchoolSettingExam({ school, editable }: { school: SchoolInterface, editable: boolean }) {
    const [classes, setClasses] = useState<ClasseInterface[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [dynamicExamIsOpen, setDynamicExamIsOpen] = useState(false);
    const [annualExamIsOpen, setAnnualExamIsOpen] = useState(false);
    const [classeId, setClasseId] = useState<string | null | undefined>(school?._id);

    const [terms, setTerms] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [annualExams, setAnnualExams] = useState<AnnualExamInterface[]>([]);

    useEffect(() => {
        loadData();
    }, [classeId]);

    const loadData = () => {
        if (classeId) {
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
    }


    const saveTerm = (exam: any) => {
        api.saveTerm({ ...exam, class: classeId, isGeneral: true, classes: selectedClasses }).then(() => {
            // Optionally, you can show a success message or update the state
            console.log("Exam saved successfully");
            setDynamicExamIsOpen(false);
            loadData();
        }).catch((error) => {
            console.error("Error saving exam:", error);
        });
    };

    const saveAnnualExam = (exam: any) => {
        api.saveAnnualExam({ ...exam, isGeneral: true, class: classeId, classes: selectedClasses }).then(() => {
            // Optionally, you can show a success message or update the state
            setAnnualExamIsOpen(false);
            loadData();
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
            const allClassIds = classes.filter((classe) => classe._id).map((classe) => classe._id ?? '');
            setSelectedClasses(allClassIds);
        }
    };

    return (
        <div>

            <div className="row">
                <div className="col-md-5">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th colSpan={3} className="text-center">Choisir les classes</th>
                            </tr>
                        </thead>
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
                <div className="col-md-7">

                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>BULLETIN DU TRIMESTRE</h3>
                        <button className="btn btn-primary" onClick={() => { setDynamicExamIsOpen(true) }} disabled={!selectedClasses.length}>Ajouter Trimestre</button>
                    </div>

                    <table className="table">
                        {terms.length && <thead>
                            <tr>
                                <th> Name</th>
                                <th> Slug</th>
                                <th>   </th>
                            </tr>
                        </thead>}

                        {
                            terms.map(term => (
                                <TermRow key={term._id} term={term} />
                            ))
                        }
                    </table>

                    <div className="mt-5"> </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <h3>BULLETIN ANNUELLE</h3>
                        <button className="btn btn-primary" onClick={() => { setAnnualExamIsOpen(true) }} disabled={!selectedClasses.length}>Add Annual</button>
                    </div>

                     <table className="table">
                        {annualExams.length && <thead>
                            <tr>
                                <th> Name</th>
                                <th> Slug</th>
                                <th></th>
                            </tr>
                        </thead>}

                        {
                            annualExams.map(term => (
                                <TermRow key={term._id} term={term} />
                            ))
                        }
                    </table>


                </div>

            </div>

            {classeId && selectedClasses.length && (
                <DynamicExamModal
                    exams={exams}
                    modalIsOpen={dynamicExamIsOpen}
                    closeModal={() => setDynamicExamIsOpen(false)}
                    save={saveTerm}
                    class_id={classeId}
                    isGeneral={true}
                />
            )}
            {classeId && selectedClasses.length && (
                <AnnualExamModal
                    terms={terms}
                    modalIsOpen={annualExamIsOpen}
                    closeModal={() => setAnnualExamIsOpen(false)}
                    save={saveAnnualExam}
                    class_id={classeId}
                    isGeneral={true}
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
const ClassRow = ({ index, classe, handleClassSelection, isSelected }: PropsWithChildren<classRowProps>) => {
    const [tbNote, setTbNote] = useState(classe.tb_note);
    const handleTbNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setTbNote(newValue);
        // Here you can also make an API call to update the tb_note in the database
        api.updateClasse({ ...classe, tb_note: tbNote }).then(() => {
            // Optionally, you can show a success message or update the state
            console.log("TB Note updated successfully");
        }).catch((error) => {
            console.error("Error updating TB Note:", error);
        });
    };
    return (
        <tr key={index} onClick={() => { }} >
            <th scope="row"><input type="checkbox" checked={isSelected} onChange={() => handleClassSelection(classe._id!)} />  </th>
            <td>{classe.name}</td>
            {/* <td>{classe.section?.name}</td> */}
            <td><input type="number" value={tbNote} onChange={handleTbNoteChange} className="form-control" style={{ width: '80px' }} /> </td>
        </tr>
    )
}


const TermRow = ({term}: {term:TermInterface}) => {
    return <tr key={term._id}>
        <td>{term.name}</td>
        <td>{term.slug}</td>
        <td>  
            <Dropdown
              buttonTitle="Actions"
              items={[
                { name: 'Edit', action: () => console.log("Edit") },
                { name: 'Sync', action: () => console.log("Sync") },
                { name: 'Calculer Bulletin', action: () => console.log("Calculer Bulletin") },
                { name: 'Print Bulletin', action: () => console.log("Print Bulletin") },
                { name: 'Print Attestation', action: () => console.log("Print Attestation") },
                { name: 'Print Tableau D\'Honneur ', action: () => console.log("Print Reports") },
                { name: 'Delete', action: () => console.log("Delete"), className:"delete-action" },
              ]}
            />
        </td>
    </tr>
}