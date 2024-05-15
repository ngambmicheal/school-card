// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { schoolSchema } from "../../../../models/school";
import UserInterface,  { userSchema,  } from "../../../../models/user";
import { HeadersEnum } from "../../../../utils/enums";
import { createUser, generateNewMatricule } from "../store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const { _id } = req.query;
    const user = await userSchema.findOne<UserInterface>({_id}); 
    const school_id = req.headers[HeadersEnum.SchoolId] as string;

    if(!user) 
        return res.json({message: 'User not found', success:false})

    const matricule = await generateNewMatricule({school_id, user_type: user.type})
    userSchema
    .findOneAndUpdate({_id}, {matricule})
    .populate({ path: "schoo``l_id", model: schoolSchema })
    .collation({ locale: "en_US", numericOrdering: true })
    .then((users) => {
      res.json({ data: users, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
