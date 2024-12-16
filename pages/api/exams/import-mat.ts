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
import { classeSchema } from "../../../models/classe";
import { sectionSchema } from "../../../models/section";
import { IncomingForm } from "formidable";


export default async function importStudent(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const form = new IncomingForm({});
    let [fields, files] = await form.parse(req);

  if (!files.file || !fields.exam_id)
    return res.status(400).json({ error: "Missing file or mapping" });

  try {
    //@ts-ignore
    const f = files.file as formidable.File;

    const exam = await examSchema.findOne({ _id: fields.exam_id }).populate({
      path: "class_id",
      model: classeSchema,
      populate: { path: "section", model: sectionSchema },
    });
    const competences = await competenceSchema
        .find({
            school: exam?.class_id?.school,
            report_type: exam?.class_id?.section?.report_type,
          })
        .populate({ path: "school", model: schoolSchema })
        .populate({
        path: "subjects",
        model: subjectSchema,
        populate: { path: "courses", model: courseSchema },
        });

    let mapping: any = {};
    let pointMapping: any = {};
    competences.map((competence) =>
        competence.subjects?.map((course: SubjectInterface) => {
            mapping[`subject_${course._id}`] = course._id;
            pointMapping[`point_${course._id}`] = course._id;
        })
    );

    const output = await new Promise<{
      loadedCount: number;
      totalCount: number;
    }>((resolve, reject) => {
      const filecontent = fs.createReadStream(f[0].filepath);
      filecontent.setEncoding("utf8");

      let loadedCount = 0;
      let totalCount = 0;

      const promises: Promise<any>[] = [];

      //@ts-ignore
      Papa.parse<Record<string, any>>(filecontent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        chunkSize: 250,
        encoding: "utf8",

        chunk: async (out: any) => {
          let data = out.data.map((r: any, index: number) => {
            if (index === 0) {
              
            } else {
              const newResult = {
                ...applyMapping(r, mapping),
              };

              examResultSchema
                .findOneAndUpdate(
                  { exam_id: fields.exam_id, number: r.numero },
                  newResult
                )
                .then((result) => {
                  console.log(result);
                });
            }
          });

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

    return res.json(output)
  } catch (e) {
    console.log(e);
    return res.status(500).json(e)
  }
}


function applyMapping(
  data: Record<string, any>,
  mapping: Record<keyof any, string>
): Partial<any> {
  return Object.fromEntries(
    Object.entries(mapping).map(([leadField, csvField]) => {
    
      const parsed = stripBomFromKeys(data);
      const value = getValue(parsed[csvField] as string)

      return [
        leadField,
        value,
      ];
    })
  );
}


function getValue(key:string){
    if(!key){
        return undefined;
    }
    switch(key.toString()){
        case '1':
            return 'A';
        case '2':
            return 'ECA';
        case '3':
            return 'NA'
        default : 
            return key
    }
}


export const config = {
  api: {
    bodyParser: false,
  },
};
