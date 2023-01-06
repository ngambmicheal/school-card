// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { examSchema } from "../../../models/exam";
import { sectionSchema } from "../../../models/section";
import mg from "../../../services/mg";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query = req.query;
  examSchema
    .find(query)
    .populate({
      path: "class_id",
      model: classeSchema,
      populate: { path: "section", model: sectionSchema },
    })
    .then((exams) => {
      res.json({ data: exams, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
