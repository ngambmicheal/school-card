// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { courseSchema } from "../../../models/course";
import { subjectSchema } from "../../../models/subject";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id, ...obj } = req.body;

  courseSchema
    .findOneAndUpdate({ _id }, obj)
    .then((course) => {
      res.json({ data: course, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
