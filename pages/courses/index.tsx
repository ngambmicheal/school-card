import { useEffect, useState } from "react";
import CompetenceInterface from "../../models/competence";
import { courseSchema } from "../../models/course";
import api from "../../services/api";

export default function coursesPage(){
    const [competences, setCompetences] = useState<CompetenceInterface[]>([])

    useEffect(() => {
        api.getCompetences().then(({data:{data}} : any) => {
            setCompetences(s => data);
        })
    }, [])

    const getCompetencesLenght = (competence:CompetenceInterface) => {
        let total = 0; 
        competence.subjects && competence.subjects.map(s => {
            total+=s.courses?.length ?? 0  
        })
        return total; 
    }
    return (
        <>
            <table className='table1'>
                <thead>
                <tr>
                    <th rowSpan={2} className="th">
                        COMPETENCE
                    </th>
                    <th rowSpan={2} className="th">
                        SOUS-COMPETENCE
                    </th>
                    <th>
                        UNITE D'APPRENTISSAGE
                    </th>
                    <th colSpan={2}>
                        UA1
                    </th>
                </tr>
                <tr>
                    <th>
                        EVALUATION
                    </th>
                    <th>
                        NOTES
                    </th>
                    <th>
                        COTE
                    </th>
                </tr>
                </thead>
                <tbody>
                {competences && competences.map(competence=> {
                            return (
                                <>                                    
                                    {
                                        competence.subjects?.map((subject, subjectIndex) => {
                                            return (
                                                <> 
                                                    {subject.courses?.map((course, courseIndex) => {
                                                    return( 
                                                        <tr>
                                                            {!subjectIndex && !courseIndex&& <td rowSpan={getCompetencesLenght(competence)}> {competence.name} </td> }
                                                            {!courseIndex && <td rowSpan={subject.courses?.length}> {subject.name}  </td>  }
                                                            <td>{course.name} - {course._id} </td>
                                                            <td></td> 
                                                            <td></td>
                                                        </tr>
                                                    )
                                                    })}
                                                </>
                                            )
                                        })
                                    }
                                </>
                            ) 
                        })}
                </tbody>
            </table>
        </>
    );
}