// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { schoolSchema } from "../../../models/school";
import UserInterface, { userSchema } from "../../../models/user";
import { padWithLeadingZeros } from "../../../utils/calc";
import { HeadersEnum, UserTypeCode } from "../../../utils/enums";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: UserInterface;
    success: boolean;
    message: string;
  }>
) {
  const userQuery: UserInterface = req.body;

  userQuery.username = userQuery.email as string;
  userQuery.school_id = req.headers[HeadersEnum.SchoolId] as string;

  const school = await schoolSchema.findOne({
    _id: req.headers[HeadersEnum.SchoolId],
  });
  const users = await userSchema
    .find({ school_id: userQuery.school_id })
    .count();

  const code = `${school.code}-${
    UserTypeCode[userQuery.type]
  }-${padWithLeadingZeros(users + 1, 6)}`;
  userQuery.matricule = code;

  const user = new userSchema(userQuery);
  user
    .save()
    .then(() => {
      res.status(200).json({ data: user, success: true, message: "done" });
    })
    .catch(() => {
      res.status(400).json({ message: "Could not be sent", success: false });
    });
}
