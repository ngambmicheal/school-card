// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { examSchema } from "../../../models/exam";
import { studentSchema } from "../../../models/student";
import mg from "../../../services/mg";

import * as pdf from "pdf-creator-node";
import fs from "fs";
import { subjectSchema } from "../../../models/subject";
const html = fs.readFileSync("assets/students.html", "utf8");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { class_id } = req.query;

  const students = await studentSchema.find(req.query);
  const exams = await examSchema.find(req.query);

  // const filtered = students.map(student => {
  //     let dt:any = {name:student.name}
  //     exams.map(exam => {
  //         dt[exam.name]  = '';
  //     });
  //     return dt;
  // })

  const subjects = await subjectSchema.find();

  try {
    var options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
      header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Author: Shyam Hajare</div>',
      },
      footer: {
        height: "28mm",
        contents: {
          first: "Cover page",
          2: "Second page", // Any page number is working. 1-based index
          default:
            '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: "Last Page",
        },
      },
    };

    var document = {
      html: html,
      data: {
        users: students.map((s) => ({ name: s.name, id: s._id })),
        subjects: subjects.map((s) => ({ name: s.name, id: s._id })),
      },
      path: "./output.pdf",
      type: "",
    };

    pdf
      .create(document, options)
      .then((res: any) => {
        console.log(res);
      })
      .catch((error: any) => {
        console.error(error);
      });
  } catch (e: any) {
    res.json({ message: e.message, success: false });
  }
}
