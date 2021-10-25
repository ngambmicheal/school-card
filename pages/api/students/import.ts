import { NextApiRequest, NextApiResponse } from 'next'
import Papa from 'papaparse'
import formidable from 'formidable'
import fs from 'fs'
import { stripBomFromKeys } from '../../../utils/stripBom'
import { studentSchema } from '../../../models/student'
import mg from '../../../services/mg'


export default async function importStudent(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { files, fields } = await parseRequestForm(req)
  if (!files.file || !fields.mapping)
    return res.status(400).json({ error: 'Missing file or mapping' })

  let parsedMapping: Record<string, string>

  try {
    parsedMapping = JSON.parse(fields.mapping as string)
  } catch (e) {
    return res.status(400).json({
      error:
        '`mapping` not properly formatted, should be sent as stringified JSON',
    })
  }

  if (Object.keys(parsedMapping).length < 1)
    return res.status(400).json({
      error: '`mapping` must map at least one field',
    })

  //@ts-ignore
  const f = files.file as formidable.File

 
  const output = await new Promise<{ loadedCount: number; totalCount: number }>(
    (resolve, reject) => {
      const filecontent = fs.createReadStream(f.path)
      filecontent.setEncoding('utf8')

      let loadedCount = 0
      let totalCount = 0

      const promises: Promise<any>[] = []

      //@ts-ignore
      Papa.parse<Record<string, any>>(filecontent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        chunkSize: 25,
        encoding: 'utf8',

        chunk: async (out:any) => {
          let data = out.data.map((r:any) => ({
            ...applyMapping(r, parsedMapping),
            class_id: fields.class_id,
          }))

          data = data.map((x:any) => ({
            ...x,
            class_id : x.class_id, 
            name: x.name
          }))

          totalCount += data.length

          try {
            const BulkHasOperations = (b:any) => b && b.s && b.s.currentBatch && b.s.currentBatch.operations && b.s.currentBatch.operations.length > 0;
            const bulk = studentSchema.collection.initializeUnorderedBulkOp(); 
             studentSchema.collection.insertMany(data).then((dd) => {
                 console.log(dd)
             })
             BulkHasOperations(bulk) && bulk.execute();
            //promises.push(p)
          } catch (e) {
            console.error(e)
            reject(e)
          }
        },

        complete: () => {
          Promise.allSettled(promises).then(() =>
            resolve({ loadedCount, totalCount })
          )
        },
      })
    }
  )

  
}


  type ParsedForm = {
    error: Error | string
    //@ts-ignore
    fields: formidable.Fields
    //@ts-ignore
    files: formidable.Files
  }

  function parseRequestForm(req: NextApiRequest): Promise<ParsedForm> {
    const form = formidable({ encoding: 'utf8' })
  
    return new Promise((resolve, reject) => {
      form.parse(req, (err:any, fields:any, files:any) => {
        if (err) reject({ err })
  
        resolve({ error: err, fields, files })
      })
    })
  }
  
  function applyMapping(
    data: Record<string, any>,
    mapping: Record<keyof any, string>
  ): Partial<any> {
    return Object.fromEntries(
      Object.entries(mapping).map(([leadField, csvField]) => {
        const parsed = stripBomFromKeys(data)
  
        return [leadField, parsed[csvField]]
      })
    )
  }
  
  export const config = {
    api: {
      bodyParser: false,
    },
  }
  