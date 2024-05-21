// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { examSchema } from "../../../models/exam";
import { sectionSchema } from "../../../models/section";
import { sessionSchema } from "../../../models/session";
import mg from "../../../services/mg";
import { HeadersEnum } from "../../../utils/enums";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let query = req.query;
  query.session_id = req.headers[HeadersEnum.SchoolSessionId] as string
  examSchema
    .find(query)
    .populate({
      path: "class_id",
      model: classeSchema,
      populate: { path: "section", model: sectionSchema },
    })
    .populate({
      path: "session_id",
      model: sessionSchema,
      strictPopulate:false
    })
    .then((exams) => {
      res.json({ data: exams, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
