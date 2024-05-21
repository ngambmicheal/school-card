// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import SchoolInterface, { schoolSchema } from "../../../models/school";
import mg from "../../../services/mg";
import { HeadersEnum } from "../../../utils/enums";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { class_id } = req.query;
  schoolSchema
    .find(req.query)
    .then((schools) => {
      console.log(schools);
      res.json({ data: schools, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}


export async function findSchool(req: NextApiRequest): Promise<SchoolInterface | null>{
  return schoolSchema.findOne({ _id:req.headers[HeadersEnum.SchoolId] as string})
}

export async function findSchoolById(schoolId:string): Promise<SchoolInterface | null>{
  return schoolSchema.findOne({ _id:schoolId})
}