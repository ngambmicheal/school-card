import ClasseInterface from "../../models/classe";
import SchoolInterface from "../../models/school";
import StudentInterface from "../../models/student";
import serverPath, { base64_encode} from "../../services/serverpath";

const fileUrl = (file: string) => {
  const publicFile = "public/" + file;
  const filePath = base64_encode(serverPath(publicFile));
  return filePath;
};

export const studentHeader = (
  student: StudentInterface,
  className: string,
  totalUsers: number,
  teacher: string,
  lang = "fr",
) => {
  return (
    <div>
      <div style={{ width: "85%", float: "left", fontSize: "20px" }}>
        <table className="table1" style={{fontSize:"20px"}}>
          <thead>
            <tr>
              <th colSpan={2}>
                {lang == "fr" ? "NOMS ET PRENOMS" : "NAME AND SURNAME"}
              </th>
              <th colSpan={4}>{student?.name}</th>
            </tr>
            <tr>
              <th colSpan={2}>
                {lang == "fr" ? "DATE DE NAISSANCE" : "DATE OF BIRTH"}
              </th>
              <th colSpan={2}>{student?.dob}</th>
              <th colSpan={1}> {lang == "fr" ? "SEXE" : "SEX"} </th>
              <th>{student?.sex}</th>
            </tr>
            <tr>
              <th colSpan={1}> {lang == "fr" ? "CLASSE" : "CLASS"} </th>
              <th> {className} </th>
              <th> {lang == "fr" ? "Effectif" : "Enrolment"} </th>
              <th>{totalUsers}</th>
              <th> {lang == "fr" ? "ENSEIGNANT(E)" : "TEACHER"} </th>
              <th>{teacher}</th>
            </tr>
          </thead>
        </table>
      </div>
      <div style={{ width: "15%", float: "right" }}>
        <img
          src={`data:image/jpeg;base64,${fileUrl(student?.image ? student.image : student?.sex == "M" ? "/images/male-avatar.jpg" : "/images/female-avatar.jpg")}`}
          style={{
            width: "130px",
            height: "130px",
            marginTop: "-40px",
            paddingBottom: "10px",
          }}
        />
      </div>
    </div>
  );
};

export const schoolLogo = (school:SchoolInterface, key: keyof SchoolInterface) => {
  return fileUrl(school[key] ? school[key] : "/images/smc/logo.png");
}

export const hasHonorRoll = (classe:ClasseInterface, avg:number):boolean => {
  return avg >= classe.tb_note; 
}
