// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { classeSchema } from "../../../models/classe";
import SubjectInterface, { examSchema } from "../../../models/exam";
import { sectionSchema } from "../../../models/section";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.query;
  examSchema
    .findOne({ _id })
    .populate({
      path: "class_id",
      model: classeSchema,
      populate: { path: "section", model: sectionSchema },
    })
    .then((exam) => {
      res.json({ data: exam, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
