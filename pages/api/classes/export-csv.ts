// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { examSchema } from "../../../models/exam";
import { studentSchema } from "../../../models/student";
import mg from "../../../services/mg";

import * as fastcsv from "fast-csv";
import fs from "fs";
const ws = fs.createWriteStream("data.csv");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { class_id } = req.query;

  const students = await studentSchema.find(req.query);
  const exams = await examSchema.find(req.query);

  const filtered = students.map((student) => {
    let dt: any = { name: student.name };
    exams.map((exam) => {
      dt[exam.name] = "";
    });
    return dt;
  });

  try {
    fastcsv
      .write(filtered, { headers: true })
      .on("finish", function () {
        console.log("Write to CSV successfully!");
      })
      .pipe(ws);

    res.json({ message: "Done", success: true });
  } catch (e: any) {
    res.json({ message: e.message, success: false });
  }
}
