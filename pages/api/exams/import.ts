import { NextApiRequest, NextApiResponse } from "next";
import Papa from "papaparse";
import formidable from "formidable";
import fs from "fs";
import { stripBomFromKeys } from "../../../utils/stripBom";
import { studentSchema } from "../../../models/student";
import mg from "../../../services/mg";
import { competenceSchema } from "../../../models/competence";
import CourseInterface, { courseSchema } from "../../../models/course";
import SubjectInterface, { subjectSchema } from "../../../models/subject";
import { examSchema } from "../../../models/exam";
import { examResultSchema } from "../../../models/examResult";
import { schoolSchema } from "../../../models/school";

export default async function importStudent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { files, fields } = await parseRequestForm(req);
  if (!files.file || !fields.exam_id)
    return res.status(400).json({ error: "Missing file or mapping" });

  try {
    //@ts-ignore
    const f = files.file as formidable.File;

    const exam = await examSchema.findOne({ _id: fields.exam_id });
    const competences = await competenceSchema
      .find()
      .populate({ path: "school", model: schoolSchema })
      .populate({
        path: "subjects",
        model: subjectSchema,
        populate: { path: "courses", model: courseSchema },
      });
    const students = await studentSchema.find({ class_id: exam.class_id });

    let mapping: any = {};
    let pointMapping: any = {};
    competences.map((competence) =>
      competence.subjects?.map((subject: SubjectInterface) => {
        subject.courses?.map((course: CourseInterface) => {
          mapping[`subject_${course._id}`] = course._id;
          pointMapping[`point_${course._id}`] = course._id;
        });
      })
    );

    const output = await new Promise<{
      loadedCount: number;
      totalCount: number;
    }>((resolve, reject) => {
      const filecontent = fs.createReadStream(f.path);
      filecontent.setEncoding("utf8");

      let loadedCount = 0;
      let totalCount = 0;

      const promises: Promise<any>[] = [];

      //@ts-ignore
      Papa.parse<Record<string, any>>(filecontent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        chunkSize: 25,
        encoding: "utf8",

        chunk: async (out: any) => {
          let data = out.data.map((r: any, index: number) => {
            if (index == 0) {
              const newResult = {
                ...applyMapping(r, pointMapping),
              };
              examSchema
                .findOneAndUpdate({ _id: fields.exam_id }, newResult)
                .then((examUpdate) => {
                  //console.log(examUpdate)
                });
            } else {
              //console.log(r);
              const newResult = {
                ...applyMapping(r, mapping),
              };

              examResultSchema
                .findOneAndUpdate(
                  { exam_id: fields.exam_id, number: r.numero },
                  newResult
                )
                .then((result) => {
                  //console.log(result);
                });
            }
          });

          //console.log(data[0]);

          totalCount += data.length;

          try {
            //const BulkHasOperations = (b:any) => b && b.s && b.s.currentBatch && b.s.currentBatch.operations && b.s.currentBatch.operations.length > 0;
            //const bulk = studentSchema.collection.initializeUnorderedBulkOp();
            //  studentSchema.insertMany(data).then((dd) => {
            //      console.log(dd)
            //  })
            //BulkHasOperations(bulk) && bulk.execute();
            //promises.push(p)
          } catch (e) {
            console.error(e);
            reject(e);
          }
        },

        complete: () => {
          Promise.allSettled(promises).then(() =>
            resolve({ loadedCount, totalCount })
          );
        },
      });
    });
  } catch (e) {
    // console.log(e);
  }
}

type ParsedForm = {
  error: Error | string;
  //@ts-ignore
  fields: formidable.Fields;
  //@ts-ignore
  files: formidable.Files;
};

function parseRequestForm(req: NextApiRequest): Promise<ParsedForm> {
  const form = formidable({ encoding: "utf8" });

  return new Promise((resolve, reject) => {
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject({ err });

      resolve({ error: err, fields, files });
    });
  });
}

function applyMapping(
  data: Record<string, any>,
  mapping: Record<keyof any, string>
): Partial<any> {
  return Object.fromEntries(
    Object.entries(mapping).map(([leadField, csvField]) => {
      const parsed = stripBomFromKeys(data);
      return [
        leadField,
        parseFloat((parsed[csvField] ?? 0).toString().replace(",", ".")),
      ];
    })
  );
}

export const config = {
  api: {
    bodyParser: false,
  },
};
