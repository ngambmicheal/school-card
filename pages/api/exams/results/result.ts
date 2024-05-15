// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { classeSchema } from "../../../../models/classe";
import SubjectInterface, { examSchema } from "../../../../models/exam";
import { examResultSchema } from "../../../../models/examResult";
import { sectionSchema } from "../../../../models/section";
import { studentSchema } from "../../../../models/student";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { result_id } = req.query;

  examResultSchema
    .findOne({ _id: result_id })
    .populate({ path: "student", model: studentSchema })
    .populate({
      path: "exam_id",
      model: examSchema,
      populate: {
        path: "class_id",
        model: classeSchema,
        populate: { path: "section", model: sectionSchema },
      },
    })
    .then((results) => {
      res.json({ data: results, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
