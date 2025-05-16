// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { examSchema } from "../../../../models/exam";
import { studentSchema } from "../../../../models/student";

import * as pdf from "pdf-creator-node";
import fs from "fs";
import { examResultSchema } from "../../../../models/examResult";
import ReactDOMServer from "react-dom/server";
import archiver from "archiver";
import { schoolSchema } from "../../../../models/school";
import ClasseInterface, { classeSchema } from "../../../../models/classe";
import TermInterface, { termSchema } from "../../../../models/terms";
import { replaceAll } from "../../../../services/utils";
import attestationFr from "../../../../assets/attestation/attestation_fr";
import AttestationOnly from "../../../../assets/attestation/attestation";
import { sectionSchema } from "../../../../models/section";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { classes:class_ids } = req.query;

  const c_ids = class_ids.toString().split(",");

  if(!c_ids || c_ids.length === 0) {
    res.json({ message: "No classes found", success: false });
    return;
  }

  const classess = await classeSchema
    .find({ _id: { $in: c_ids } })
 .populate({ path: "school", model: schoolSchema })
 .populate({ path: "section", model: sectionSchema });


    await Promise.all(classess.map(async (classs) => {
        return await printStudentAttestation(classs);
    }))
    res.json({ message: "success", success: true });


}

const printStudentAttestation = async (classs: ClasseInterface) => {
    const studentsResults = await studentSchema
    .find({ class_id: classs._id });


    const zipName = `${replaceAll(" ", "_", classs?.name)}_attestation__${new Date().getFullYear()}`;
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

    Promise.all(studentsResults.map(async (results) => {
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
          timeout: 50000,
        };
    
        let html = ReactDOMServer.renderToStaticMarkup(AttestationOnly(results, classs));
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
          results.name
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
            console.log("thisfile isnot react");
          });
      }));


    archive.pipe(zipOutput);
    archive.directory(dir, false);
    archive.finalize();
}
