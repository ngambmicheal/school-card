// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import StudentInterface, { studentSchema } from "../../../models/student";
import { HeadersEnum, UserType } from "../../../utils/enums";
import { createUser } from "../users/store";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: StudentInterface;
    success: boolean;
    message: string;
  }>
) {
  const studentQuery = req.body as StudentInterface;
  let totalStudents = await studentSchema.find({class_id: req.query.class_id}).count();

  const user = await createUser({
    name: studentQuery.name,
    email: studentQuery.email,
    school_id: req.headers[HeadersEnum.SchoolId] as string,
    role: [],
    type: UserType.STUDENT,
    username: studentQuery.email ?? "",
    matricule: "",
    password: "",
  });

  studentQuery.matricule = user.matricule;
  studentQuery.user_id = user._id;
  studentQuery.session_id = req.headers[HeadersEnum.SchoolSessionId] as string

  const student = new studentSchema(studentQuery);
  student
    .save()
    .then(() => {
      res.status(200).json({ data: student, success: true, message: "done" });
    })
    .catch(() => {
      res.status(400).json({ message: "Could not be sent", success: false });
    });
}
