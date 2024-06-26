// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { studentSchema } from "../../../models/student";
import mg from "../../../services/mg";
import { HeadersEnum } from "../../../utils/enums";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { class_id } = req.query;
  let query = req.query; 
  query.session_id = req.headers[HeadersEnum.SchoolSessionId] as string;

  studentSchema
    .find(query)
    .sort({ number: 1 })
    .collation({ locale: "en_US", numericOrdering: true })
    .then((students) => {
      res.json({ data: students, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
