import a from 'axios';
import ClasseInterface from '../models/classe';
import CompetenceInterface from '../models/competence';
import ExamInterface from '../models/exam';
import SchoolInterface from '../models/school';
import StudentInterface from '../models/student';
import SubjectInterface from '../models/subject';

const axios = a.create()

export class Api{

    //classes
    getClasses(){ return axios.get('/api/classes');   }
    saveClasse(data:ClasseInterface){    return axios.post('/api/classes/store', data)}
    getClasse(classeId?:any){ return axios.get(`/api/classes/${classeId}`)}
    getClasseStudents(classeId?:any) {return axios.get(`/api/classes/students?class_id=${classeId}`)}
    getClasseExams(classeId?:any) {return axios.get(`/api/exams?class_id=${classeId}`)}

    //students
    getStudents() {  return axios.get('/api/students');  }
    saveStudent(data:StudentInterface) { return axios.post('/api/students/store', data); }
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

    //subjects
    getSubjects() {  return axios.get('/api/subjects');  }
    saveSubjects(data:SubjectInterface) { return axios.post('/api/subjects/store', data); }
    getSubject(subjectId?:any){ return axios.get(`/api/subjects/${subjectId}`) }
    getSubjectCourses(subjectId?:any){ return axios.get(`/api/courses?subject=${subjectId}`) }

      //competences
    getCompetences() {  return axios.get('/api/competences');  }
    saveCompetences(data:CompetenceInterface) { return axios.post('/api/competences/store', data); }
    getCompetence(competenceId?:any){ return axios.get(`/api/competences/${competenceId}`) }
    getCompetenceSubjects(competenceId?:any){ return axios.get(`/api/subjects?competence=${competenceId}`) }
    deleteCompetence(id:any) { return axios.post('/api/competences/delete', {_id:id})}

    
    //schools
    getSchools() {  return axios.get('/api/schools');  }
    saveSchools(data:SchoolInterface) { return axios.post('/api/schools/store', data); }
    getSchool(schoolId?:any){ return axios.get(`/api/schools/${schoolId}`) }
    getSchoolCourses(schoolId?:any){ return axios.get(`/api/courses?school=${schoolId}`) }

    //subjects
    getCourses() {  return axios.get('/api/courses');  }
    saveCourses(data:SubjectInterface) { return axios.post('/api/courses/store', data); }
    getCourse(courseId?:any){ return axios.get(`/api/courses/${courseId}`) }

    //subjects
    getExams() {  return axios.get('/api/exams');  }
    saveExam(data:ExamInterface) { return axios.post('/api/exams/store', data); }
    getExam(examId?:any){ return axios.get(`/api/exams/${examId}`) }
    getExamResults(examId?:any){ return axios.get(`/api/exams/results?exam_id=${examId}`) }
    updateExamResult(data:any){ return axios.post(`/api/exams/update-results`, data)}


    downloadToCsv(classeId:any) { return axios.post(`/api/classes/export-csv`, {class_id: classeId})}
    downloadToPdf(classeId:any) { return axios.post(`/api/classes/export-pdf`, {class_id: classeId})}
}

const api = new Api();
export default api;

