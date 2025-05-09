import enums from "./enums";

export class HelperService {
  getSchoolId() {
    return global?.localStorage?.getItem(enums.SCHOOL_STORAGE_KEY);
  }

  saveSchoolId(schoolId: string) {
    global?.localStorage?.clear();
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


  export const getExamLink:string = (report_type:string, exam_id:string) => {
    switch (report_type) {
      case "Maternelle":
        return `/exams/mat/${exam_id}`;
      case "Nursery":
        return `/exams/nursery/${exam_id}`;
      case "Matiere":
        return `/exams/${exam_id}`;
      case "Competence":
        return `/exams/ui/${exam_id}`;
      case "Special":
        return `/exams/special/${exam_id}`;
      default:
        return `/exams/${exam_id}`;
    }
  }

  export const getTermLink = (report_type, term_id) => {
    switch (report_type) {
      case "Maternelle":
        return `/exams/mat/dynamic?term_id=${term_id}`;
      case "Nursery":
        return `/exams/nursery/dynamic?term_id=${term_id}`;
      case "Matiere":
        return `/exams/normal/dynamic?term_id=${term_id}`;
      case "Competence":
        return `/exams/ui/dynamic?term_id=${term_id}`;
      case "Special":
        return `/exams/special/dynamic?term_id=${term_id}`;
      default:
        return `/exams/dynamic?term_id=${term_id}`;
    }
  }

  export const getAnnualExamLink = (report_type:string, term_id:string) => {
    switch (report_type) {
      case "Maternelle":
        return `/exams/mat/annual?annualExam_id=${term_id}`;
      case "Nursery":
        return `/exams/nursery/annual?annualExam_id=${term_id}`;
      case "Matiere":
        return `/exams/normal/annual?annualExam_id=${term_id}`;
      case "Competence":
        return `/exams/ui/annual?annualExam_id=${term_id}`;
      case "Special":
        return `/exams/special/annual?annualExam_id=${term_id}`;
      default:
        return `/exams/annual?annualExam_id=${term_id}`;
    }
  }
