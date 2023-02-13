// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { schoolSchema } from "../../../models/school";
import UserInterface, { userSchema } from "../../../models/user";
import { generateRandomString, padWithLeadingZeros } from "../../../utils/calc";
import { HeadersEnum, UserType, UserTypeCode } from "../../../utils/enums";

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

  try {
    const user = await createUser(userQuery);
    return res.status(200).json({ data: user, success: true, message: "done" });
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Could not be sent", success: false });
  }
}

export async function createUser(
  userParams: UserInterface, 
  returnCode = false
): Promise<UserInterface> {
  const year = new Date().getFullYear().toString().slice(-2);
  const school = await schoolSchema.findOne({
    _id: userParams.school_id,
  });
  const users = await userSchema
    .find({ school_id: userParams.school_id })
    .count();

  if (userParams.matricule) {
    const existingUser = await userSchema.findOne({
      matricule: userParams.matricule,
    });
    if (existingUser) return existingUser;
  }

  const code = `${school.code}-${
    UserTypeCode[userParams.type]
  }${year}-${padWithLeadingZeros(users + 1, 6)}`;
  userParams.matricule = code;

  if (!userParams.email) {
    userParams.email = code;
    userParams.username = code;
  }

  if (!userParams.password) {
    userParams.password = generateRandomString(
      school.staff_password_length ?? 8
    );
  }

  const user = await new userSchema(userParams).save();
  return user;
}

export async function generateNewMatricule(
  userParams: {school_id: string, user_type: UserType}, 
): Promise<string> {
  const year = new Date().getFullYear().toString().slice(-2);
  const school = await schoolSchema.findOne({
    _id: userParams.school_id,
  });
  const users = await userSchema
    .find({ school_id: userParams.school_id })
    .count();

  const code = `${school.code}-${
    UserTypeCode[userParams.user_type]
  }${year}-${padWithLeadingZeros(users + 1, 6)}`;

  return code; 
}
