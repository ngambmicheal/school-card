// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { studentSchema } from "../../../models/student";
import mg from "../../../services/mg";
import { HeadersEnum } from "../../../utils/enums";
import path from 'path'; 
import fs from 'fs';
import { schoolSchema } from "../../../models/school";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  
    const school = await schoolSchema.findOne({
        _id: req.headers[HeadersEnum.SchoolId],
    });
    const folderPath = path.join(process.cwd(), 'public', 'photos');

    const files = (await fs.promises.readdir(folderPath, { recursive: true })).filter((file) => file.includes(school.code));

    const classes = (
        await classeSchema.find({ school: req.headers[HeadersEnum.SchoolId] })
      ).map((classe) => classe._id);
    
    const query = { ...req.query, class_id: { $in: classes }, session_id: req.headers[HeadersEnum.SchoolSessionId] }


    const students = await studentSchema.find(query);
    let updatedStudents = 0;

    await Promise.all(students.filter(student => !student.image).map(async (student) => {
        const studentFiles = files.filter((file) => file.includes(student.matricule));
        console.log({ studentFiles });
        if(studentFiles.length > 0) {
           const studentImage = studentFiles[0];
           const studentImageSrc = `/photos/${studentImage}`;
           await studentSchema.updateOne({ _id: student._id }, { image: studentImageSrc });
              updatedStudents++;
        }

        return student;
    }))

    res.json({
        message: `${updatedStudents} Images updated successfully!`
    })

}   
