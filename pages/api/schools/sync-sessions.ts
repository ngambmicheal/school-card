import { NextApiRequest, NextApiResponse } from "next";
import { classeSchema } from "../../../models/classe";
import { examSchema } from "../../../models/exam";
import { studentSchema } from "../../../models/student";
import { termSchema } from "../../../models/terms";
import { HeadersEnum } from "../../../utils/enums";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {

    const date = new Date('2022-09-01');
    const session_id = req.headers[HeadersEnum.SchoolSessionId] as string;

    const query = {
        "createdAt":{
            "$gte": date 
        },
        "session_id":undefined
    }

    examSchema.updateMany(query, {session_id})
    termSchema.updateMany(query, {session_id})


    const classes = (
        await classeSchema.find({ school: req.headers[HeadersEnum.SchoolId] })
      ).map((classe) => classe._id);
    const studentQuery = {...query,  class_id: { $in: classes } }
    studentSchema.updateMany(studentQuery, {session_id} ).then(sol => res.json({sol})).catch(e => res.json({e}))

  }

  
