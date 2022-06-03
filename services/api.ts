import a from 'axios';
import AnnualExamInterface from '../models/annualExam';
import ClasseInterface from '../models/classe';
import CompetenceInterface from '../models/competence';
import CourseInterface from '../models/course';
import ExamInterface from '../models/exam';
import SchoolInterface from '../models/school';
import SectionInterface from '../models/section';
import StudentInterface from '../models/student';
import SubjectInterface from '../models/subject';
import TermInterface from '../models/terms';

const axios = a.create()

export class Api{

    //classes
    getClasses(){ return axios.get('/api/classes');   }
    saveClasse(data:ClasseInterface){    return axios.post('/api/classes/store', data)}
    getClasse(classeId?:any){ return axios.get(`/api/classes/${classeId}`)}
    getClasseStudents(classeId?:any) {return axios.get(`/api/classes/students?class_id=${classeId}`)}
    getClasseExams(classeId?:any) {return axios.get(`/api/exams?class_id=${classeId}`)}
    deleteClasse(classeId:string) { return axios.post('/api/classes/delete',{_id:classeId})}
    updateClasse(data:any) { return axios.post('/api/classes/update', data)}

    //students
    getStudents() {  return axios.get('/api/students');  }
    deleteStudent(studentId:string) { return axios.post('/api/students/delete',{_id:studentId})}
    saveStudent(data:StudentInterface) { return axios.post('/api/students/store', data); }
    updateStudent(data:StudentInterface) {return axios.post('/api/students/update', data)}
    importStudents(data:any) {
        var formData = new FormData();
        formData.append('file', data.file)
        formData.append('mapping', JSON.stringify(data.mapping))
        formData.append('class_id',data.class_id)

        return axios.post('/api/students/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }) }
    importResults(data:any) {
      var formData = new FormData();
      formData.append('file', data.file)
      formData.append('mapping', JSON.stringify(data.mapping))
      formData.append('exam_id',data.exam_id)

      return axios.post('/api/exams/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) }
    importResultsNormal(data:any) {
      var formData = new FormData();
      formData.append('file', data.file)
      formData.append('mapping', JSON.stringify(data.mapping))
      formData.append('exam_id',data.exam_id)

      return axios.post('/api/exams/import-normal', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) }

    //subjects
    getSchoolSubjects(data:{school:string, report_type?:string}){ return axios.get(`/api/subjects?school=${data.school}&report_type=${data.report_type}`)}
    getSubjects() {  return axios.get('/api/subjects',);  }
    saveSubjects(data:SubjectInterface) { return axios.post('/api/subjects/store', data); }
    getSubject(subjectId?:any){ return axios.get(`/api/subjects/${subjectId}`) }
    getSubjectCourses(subjectId?:any){ return axios.get(`/api/courses?subject=${subjectId}`) }
    deleteSubject(id:any) { return axios.post('/api/subjects/delete', {_id:id})}
    updateSubject(data:SubjectInterface) {return axios.post('/api/subjects/update', data)}

      //competences
    getCompetences() {  return axios.get('/api/competences');  }
    saveCompetences(data:CompetenceInterface) { return axios.post('/api/competences/store', data); }
    getCompetence(competenceId?:any){ return axios.get(`/api/competences/${competenceId}`) }
    getCompetenceSubjects(competenceId?:any){ return axios.get(`/api/subjects?competence=${competenceId}`) }
    deleteCompetence(id:any) { return axios.post('/api/competences/delete', {_id:id})}
    updateCompentence(data:any){ return axios.post('/api/competences/update', data) }

    
    //schools
    getSchools() {  return axios.get('/api/schools');  }
    saveSchools(data:SchoolInterface) { return axios.post('/api/schools/store', data); }
    getSchool(schoolId?:any){ return axios.get(`/api/schools/${schoolId}`) }
    getSchoolCourses(schoolId?:any){ return axios.get(`/api/courses?school=${schoolId}`) }
    getSchoolClasses(schoolId?:any){ return axios.get(`/api/classes?school=${schoolId}`) }
    getSchoolCompetences(data:{school:string, report_type?:string}){ return axios.get(`/api/competences?school=${data.school}&report_type=${data.report_type}`)}


    //sections
    getSections() {  return axios.get('/api/sections');  }
    saveSections(data:SectionInterface) { return axios.post('/api/sections/store', data); }
    getSection(sectionId?:any){ return axios.get(`/api/sections/${sectionId}`) }
    getSectionCourses(sectionId?:any){ return axios.get(`/api/courses?section=${sectionId}`) }
    getSectionClasses(sectionId?:any){ return axios.get(`/api/classes?section=${sectionId}`) }



    //subjects
    getCourses() {  return axios.get('/api/courses');  }
    saveCourses(data:SubjectInterface) { return axios.post('/api/courses/store', data); }
    getCourse(courseId?:any){ return axios.get(`/api/courses/${courseId}`) }
    updateCourse(data:CourseInterface) { return axios.post('/api/courses/update', data)}
    deleteCourse(courseId:any){return axios.post('/api/courses/delete', {_id:courseId})}

    //subjects
    getExams() {  return axios.get('/api/exams');  }
    saveExam(data:ExamInterface) { return axios.post('/api/exams/store', data); }
    updateExam(id?:any, data:any) { return axios.post('/api/exams/update', data) }
    getExam(examId?:any){ return axios.get(`/api/exams/${examId}`) }
    getExamResults(examId?:any){ return axios.get(`/api/exams/results?exam_id=${examId}`) }
    getResults(resultsId?:any){ return axios.get(`/api/exams/results/result?result_id=${resultsId}`) }
    getTermResults(termId:string,studentId:string){ return axios.get(`/api/exams/results/dynamic?term_id=${termId}&student_id=${studentId}`)}
    deleteResult(resultsId:any){ return axios.post(`/api/exams/results/delete`, {_id:resultsId})}

    updateExamResult(data:any){ return axios.post(`/api/exams/update-results`, data)}
    deleteExam(examId:any){return axios.post('/api/exams/delete', {_id:examId})}

    //terms 
    getTerms(classeId?:string) { return axios.get(`/api/terms?class=${classeId}`)}
    saveTerm(data:TermInterface) { return axios.post('/api/terms/store', data);}
    getTermResult(termId:string){ return axios.get(`/api/terms/results?term_id=${termId}`)}
    deleteTerm(termId:any){return axios.post('/api/terms/delete', {_id:termId})}
    calculateTerm(term_id:string){
      return axios.post(`/api/terms/calculate`, {term_id} )
    }
    getTerm(term_id:string) { return axios.get(`/api/terms/${term_id}`)}

    //annualExams 
    getAnnualExams(classeId?:string) { return axios.get(`/api/annualExams?class=${classeId}`)}
    saveAnnualExam(data:AnnualExamInterface) { return axios.post('/api/annualExams/store', data);}
    getAnnualExamResult(annualExamId:string){ return axios.get(`/api/annualExams/results?annualExam_id=${annualExamId}`)}
    deleteAnnualExam(annualExamId:any){return axios.post('/api/annualExams/delete', {_id:annualExamId})}
    calculateAnnualExam(annualExam_id:string){
      return axios.post(`/api/annualExams/calculate`, {annualExam_id} )
    }
    getAnnualExam(annualExam_id:string) { return axios.get(`/api/annualExams/${annualExam_id}`)}


    downloadToCsv(classeId:any) { return axios.post(`/api/classes/export-csv`, {class_id: classeId})}
    downloadToPdf(classeId:any) { return axios.post(`/api/classes/export-pdf`, {class_id: classeId})}


    sync(){
      axios.get('/api/competences/sync');
      axios.get('/api/subjects/sync');
    }
}

const api = new Api();
export default api;

