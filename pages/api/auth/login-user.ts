import { NextApiRequest, NextApiResponse } from "next";
import { userSchema } from "../../../models/user";
import { HeadersEnum } from "../../../utils/enums";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const school_id = req.headers[HeadersEnum.SchoolId];
  const { username, password } = req.body;

  if (!(username && password && school_id)) {
    return res.send(false);
  }

  const isAdmin = username === "admin" && password === "admin";

  const query = isAdmin
    ? { username, password }
    : { username, password, school_id };

  const existingUser = await userSchema.findOne({ username, school_id });
  if (!existingUser) return res.send(false);

  const user = await userSchema.findOne(query);

  if (user) {
    return res.json(user);
  }

  return res.send(false);
}
