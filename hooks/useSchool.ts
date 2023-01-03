import { useEffect, useState } from "react";
import SchoolInterface from "../models/school";
import { helperService } from "../services";
import api from "../services/api";

export default function useSchool(){
    const [school, setSchool] = useState<SchoolInterface>();
    const [schools, setSchools] = useState<SchoolInterface[]>();

    useEffect(() => {
        const schoolId = helperService.getSchoolId()
        api.getSchools().then(({data:{data}}:any) => {

            const school = (data as SchoolInterface[]).find(school => school._id == schoolId)
            setSchool(s => school)
            setSchools(s => schools)

        })
    }, [])

    return {school, schools}
}