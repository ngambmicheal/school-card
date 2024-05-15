import { NextApiRequest, NextApiResponse } from "next";
import Papa from "papaparse";
import formidable from "formidable";
import fs from "fs";
import { stripBomFromKeys } from "../../../utils/stripBom";
import { studentSchema } from "../../../models/student";
import mg from "../../../services/mg";
import { createUser } from "../users/store";
import { HeadersEnum, UserType } from "../../../utils/enums";

export default async function importStudent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { files, fields } = await parseRequestForm(req);
  if (!files.file || !fields.mapping)
    return res.status(400).json({ error: "Missing file or mapping" });

  let parsedMapping: Record<string, string>;

  try {
    parsedMapping = JSON.parse(fields.mapping as string);
  } catch (e) {
    return res.status(400).json({
      error:
        "`mapping` not properly formatted, should be sent as stringified JSON",
    });
  }

  if (Object.keys(parsedMapping).length < 1)
    return res.status(400).json({
      error: "`mapping` must map at least one field",
    });

  //@ts-ignore
  const f = files.file as formidable.File;

  const output = await new Promise<{ loadedCount: number; totalCount: number }>(
    async (resolve, reject) => {
      const filecontent = fs.createReadStream(f.path);
      filecontent.setEncoding("utf8");

      let loadedCount = 0;
      let totalCount = 0;
      

      let totalStudents = await studentSchema.find({class_id: fields.class_id}).count();

      const promises: Promise<any>[] = [];

      //@ts-ignore
      Papa.parse<Record<string, any>>(filecontent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        chunkSize: 25,
        encoding: "utf8",

        chunk: async (out: any) => {
          let data = out.data.map((r: any) => ({
            ...applyMapping(r, parsedMapping),
            class_id: fields.class_id,
          }));

          data = await data.reduce(async (previousMapping:any, x: any) => {

            const previousData = await previousMapping; 

              const user = await createUser({
                name: x.name,
                email: x.email,
                school_id: req.headers[HeadersEnum.SchoolId] as string,
                role: [],
                type: UserType.STUDENT,
                username: x.email ?? "",
                matricule: x.matricule ?? "",
                password: "",
              });
              totalStudents++;

              previousData.push({
                ...x,
                class_id: x.class_id,
                name: x.name,
                email: x.email,
                matricule: user.matricule,
                user_id: user._id,
                session_id: req.headers[HeadersEnum.SchoolSessionId] as string, 
                number: totalStudents
              })
              return previousData

            }, Promise.resolve([]))

          totalCount += data.length;

          try {
            //const BulkHasOperations = (b:any) => b && b.s && b.s.currentBatch && b.s.currentBatch.operations && b.s.currentBatch.operations.length > 0;
            //const bulk = studentSchema.collection.initializeUnorderedBulkOp();
            
            studentSchema.insertMany(data).then((dd) => {
              console.log(dd);
            });
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
    }
  );

  return res.json(output);
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

      return [leadField, parsed[csvField]];
    })
  );
}

export const config = {
  api: {
    bodyParser: false,
  },
};
