import { writeFile, readFile } from "fs/promises";

export async function  uploadFile(file: any, path:string, name:string) {
    const content =  readFile(file.file.nameOfTheInput.path, {
        encoding: 'utf8',
      })
  
    await writeFile(`./public/uploads/${name}`, content);
  }