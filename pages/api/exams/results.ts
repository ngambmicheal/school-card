// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SubjectInterface, { examSchema } from "../../../models/exam";
import { examResultSchema } from "../../../models/examResult";
import { studentSchema } from "../../../models/student";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { exam_id } = req.query;

  examSchema.findOne({ _id: exam_id }).then((exam) => {
    studentSchema
      .find({ class_id: exam.class_id })
      .then((students) => {
        students.map((student) => {
          examResultSchema
            .update(
              { exam_id, student: student._id },
              { number: student.number },
              { upsert: true }
            )
            .then((results) => {
              //res.json({data:results, status:true});
            })
            .catch((e) => {
              res.json({ message: e.message, success: false });
            });
        });
      })
      .finally(() => {
        examResultSchema
          .find({ exam_id })
          .sort({ number: 1 })
          .populate({ path: "student", model: studentSchema })
          .collation({ locale: "en_US", numericOrdering: true })
          .then((results) => {
            res.json({ data: results, status: true });
          });
      });
  });
}
