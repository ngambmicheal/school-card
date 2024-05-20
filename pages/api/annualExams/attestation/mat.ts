// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ExamInterface, { examSchema } from "../../../../models/exam";
import { studentSchema } from "../../../../models/student";

import * as pdf from "pdf-creator-node";
import fs from "fs";
import { examResultSchema } from "../../../../models/examResult";
import { competenceSchema } from "../../../../models/competence";
import { subjectSchema } from "../../../../models/subject";
import { getCompetencesLenght } from "./print-result";
import resultsActions from "../../../../assets/jsx/resultsActions";
import ReactDOMServer from "react-dom/server";
import archiver from "archiver";
import { schoolSchema } from "../../../../models/school";
import { courseSchema } from "../../../../models/course";
import { classeSchema } from "../../../../models/classe";
import { sectionSchema } from "../../../../models/section";
import {
  getTotal,
  getTotalPoints,
  getTotals,
} from "../../../../assets/jsx/resultsUiStats";
import resultsDynamicActions from "../../../../assets/jsx/resultsDynamicActions";
import TermInterface, { termSchema } from "../../../../models/terms";
import { replaceAll } from "../../../../services/utils";
import attestationFr from "../../../../assets/attestation/attestation_fr";
import AnnualExamInterface, { annualExamSchema } from "../../../../models/annualExam";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { annualExam_id } = req.query;

  const term: TermInterface | AnnualExamInterface = await annualExamSchema
      .findOne({ _id: annualExam_id })
      .populate({ path: "class", model: classeSchema, populate: { path: "school", model: schoolSchema }})
      .populate({ path: "terms", model: termSchema, populate: { path: "exams", model: examSchema } });

  const totalResults = await examResultSchema
    .find({ annualExam_id, th: true })
    .populate({ path: "student", model: studentSchema });

  const zipName = `${replaceAll(" ", "_", term.class_id?.name)}_td__${term.name}`;
  var dir = `./tmp/attestation/${zipName}`;
  var termsDir = "./public/attestation";
  var zipOutput = fs.createWriteStream(`./public/attestation/${zipName}.zip`);
  var zipDir = `./public/attestation/${zipName}.zip`;
  var archive = archiver("zip");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(termsDir)) {
    fs.mkdirSync(termsDir, { recursive: true });
  }

  totalResults.map(async (results) => {
    var options = {
      format: "A4",
      orientation: "landscape",
      border: "0mm",
      header: {
        height: "0mm",
      },
      footer: {
        height: "0mm",
        contents: {
          // first: 'Cover page',
          // 2: 'Second page', // Any page number is working. 1-based index
          // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          // last: 'Last Page'
        },
      },
    };

    let html = ReactDOMServer.renderToStaticMarkup(attestationFr(results, term, true));
    html += `
        <style>
            .b{
                color : #020066,
                text-transform:'uppercase'
            }
        </style>
                `;

    const pdfResultsDir = `${dir}/${replaceAll(
      " ",
      "_",
      results.student.name
    )}.pdf`;
    var document = {
      html: html,
      data: {},
      path: pdfResultsDir,
      type: "",
    };

    pdf
      .create(document, options)
      .then((response: any) => {})
      .catch((error: any) => {
        console.error(error);
        res.json({ message: error.message, success: false });
        console.log("thisfile isnot react");
      });
  });

  archive.pipe(zipOutput);
  archive.directory(dir, false);
  archive.finalize();

  var file = fs.createReadStream(zipDir);
  var stat = fs.statSync(zipDir);
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(`Content-Disposition`, `attachment; filename=${zipName}.zip`);
  file.pipe(res);
}
