import enums from "./enums";

export class HelperService {
  getSchoolId() {
    return global?.localStorage?.getItem(enums.SCHOOL_STORAGE_KEY);
  }

  saveSchoolId(schoolId: string) {
    return global?.localStorage?.setItem(enums.SCHOOL_STORAGE_KEY, schoolId);
  }

  getSchoolSessionId(){
    return global?.localStorage?.getItem(enums.SCHOOL_SESSION_STORAGE_KEY);
  }

  saveSchoolSessionId(sessionId: string) {
    return global?.localStorage?.setItem(enums.SCHOOL_SESSION_STORAGE_KEY, sessionId);
  }

  logout() {
    return global?.localStorage?.clear();
  }
}
