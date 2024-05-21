// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import CourseInterface, { courseSchema } from "../../../models/course";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: CourseInterface;
    success: boolean;
    message: string;
  }>
) {
  const courseQuery = req.body;

  const course = new courseSchema(courseQuery);
  course
    .save()
    .then(() => {
      res.status(200).json({ data: course, success: true, message: "done" });
    })
    .catch(() => {
      res.status(400).json({ message: "Could not be sent", success: false });
    });
}
