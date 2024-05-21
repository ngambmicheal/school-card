// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import SchoolInterface, { schoolSchema } from "../../../models/school";
import logger from "../../../utils/logger";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: SchoolInterface;
    success: boolean;
    message: string;
  }>
) {
  const schoolQuery = req.body;

  const existingSchool = await schoolSchema.findOne({ code: schoolQuery.code });

  if (existingSchool) {
    res
      .status(400)
      .json({ message: "School with code already exist", success: false });
    return false;
  }

  const school = new schoolSchema(schoolQuery);
  school
    .save()
    .then(() => {
      res.status(200).json({ data: school, success: true, message: "done" });
    })
    .catch((e) => {
      logger.error(e, { message: "Could not Create School" });
      res.status(400).json({ message: e.message, success: false });
    });
}
