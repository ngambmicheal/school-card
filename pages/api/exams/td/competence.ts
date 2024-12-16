// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { examSchema } from "../../../../models/exam";
import { studentSchema } from "../../../../models/student";

import * as pdf from "pdf-creator-node";
import fs from "fs";
import { examResultSchema } from "../../../../models/examResult";
import ReactDOMServer from "react-dom/server";
import archiver from "archiver";
import { classeSchema } from "../../../../models/classe";
import TermInterface, { termSchema } from "../../../../models/terms";
import { replaceAll } from "../../../../services/utils";
import thFr from "../../../../assets/td/td_fr";
import { schoolSchema } from "../../../../models/school";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { term_id } = req.query;

  const term: TermInterface = await termSchema
    .findOne({ _id: term_id })
    .populate({ path: "class", model: classeSchema, populate:{
      path:"school", model: schoolSchema
    } })
    .populate({ path: "exams", model: examSchema });
  const totalResults = await examResultSchema
    .find({ term_id, th: true })
    .populate({ path: "student", model: studentSchema });

  const zipName = `${replaceAll(" ", "_", term.class?.name)}_td__${term.name}`;
  var dir = `./tmp/td/${zipName}`;
  var termsDir = "./public/td";
  var zipOutput = fs.createWriteStream(`./public/td/${zipName}.zip`);
  var zipDir = `./public/td/${zipName}.zip`;
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
      },
    };

    let html = ReactDOMServer.renderToStaticMarkup(thFr(results, term));
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
