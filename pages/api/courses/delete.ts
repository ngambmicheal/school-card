// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { courseSchema } from "../../../models/course";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.body;
  courseSchema
    .findOneAndDelete({ _id })
    .then((course) => {
      res.json({ data: course, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
