import { storage } from ".";
import enums from "./enums";

export class HelperService{
    getSchoolId(){
        return storage.get(enums.SCHOOL_STORAGE_KEY)
    }

    saveSchoolId(schoolId:string){
        return storage.save(enums.SCHOOL_STORAGE_KEY, schoolId)
    }
}