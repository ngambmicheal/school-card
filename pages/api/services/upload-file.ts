import { NextApiRequest, NextApiResponse } from "next";
import StudentInterface from "../../../models/student";
import { uploadFile } from "../services";
import { filePaths, fileTypeEnum } from "../../../services/constants";
import { IncomingForm } from "formidable";
import { FileResponse } from "../../../models/utils";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest & any,
    res: NextApiResponse<{
      data?: FileResponse;
      success: boolean;
      message: string;
    }>
  ) {
    
    const uploadDir =`./public/uploads/`;
    const form = new IncomingForm({ uploadDir, keepExtensions: true });

    const [fields, files] = await form.parse(req);

    const file = files.file[0];

    if (!file) {
      res.status(400).json({ message: "No file uploaded", success: false });
      return;
    }
 
    res.status(200).json({ success: true, message: "done", data:file });

  }

