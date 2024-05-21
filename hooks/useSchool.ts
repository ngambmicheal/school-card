import { useEffect, useState } from "react";
import SchoolInterface from "../models/school";
import { helperService } from "../services";
import api from "../services/api";

export default function useSchool(){
    const [school, setSchool] = useState<SchoolInterface>();
    const [schools, setSchools] = useState<SchoolInterface[]>();
    const [editable, setEditable] = useState(false); 

    useEffect(() => {
        if(!school){
            const schoolId = helperService.getSchoolId()
            const sessionSchoolId = helperService.getSchoolSessionId(); 
            api.getSchools().then(({data:{data}}:any) => {

                const school = (data as SchoolInterface[]).find(school => school._id == schoolId)
                setSchool(s => school)
                setSchools(s => schools)

                if(school?.session_id && !sessionSchoolId){
                    helperService.saveSchoolSessionId(school.session_id)
                }

                setEditable(s => !!school?.allowUpdate)
            })
        }
    }, [])

    return {school, schools, editable}
}