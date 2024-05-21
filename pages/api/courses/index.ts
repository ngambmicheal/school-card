// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { courseSchema } from "../../../models/course";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const courses = courseSchema
    .find(req.query)
    .then((subjects) => {
      res.json({ data: subjects, status: true });
    })
    .catch(() => {
      res.json({ message: "Could not be sent s", success: false });
    });
}
