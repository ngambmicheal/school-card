import { useEffect, useState } from "react";
import Modal from "react-modal";
import { customStyles } from "../../../services/constants";
import {
  DeepMap,
  FieldError,
  useForm,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import FileUpload, { validateFiles } from "../../../components/dropzone";
import getCsvColumns from "../../../utils/getCsvColumns";
import { useRouter } from "next/dist/client/router";
import { useToast } from "@chakra-ui/react";
import api from "../../../services/api";

export function ImportStudents({ modalIsOpen, closeModal, class_id }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState();
  const [submitBtn, setSubmitBtn] = useState(false);

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Exam"
      >
        <div className="modal-body">
          <div className="row">
            <UploadFile
              file={file}
              setFile={setFile}
              values={values}
            ></UploadFile>
          </div>
          <div className="row">
            {file && (
              <MapColumns
                file={file}
                setValue={setValues}
                values={values}
                setFile={setFile}
                submitBtn={submitBtn}
                setSubmitBtn={setSubmitBtn}
              />
            )}
          </div>
          <div className="row">
            {values && (
              <Submit
                file={file}
                setFile={setFile}
                values={values}
                class_id={class_id}
                submitBtn={submitBtn}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

type UploadFileStepProps = {
  file: File | null;
  setFile: (f: File) => void;
  values: any;
};

export function UploadFile(props: UploadFileStepProps) {
  const { setFile, file } = props;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<any>({
    defaultValues: { leadFieldToCsvColumn: {} },
  });

  const [debounce, setDebounce] = useState(true);

  useEffect(() => {
    setDebounce(false);
  }, [debounce]);

  return (
    <FileUpload
      accept={".csv"}
      register={register("file_", { validate: validateFiles })}
      onChange={(files) => {
        if (debounce) {
          setDebounce(false);
          return;
        }

        setFile(files[0]);
      }}
    >
      <div className="full-width">
        <button
          className="btn"
          style={{
            width: "80%",
            height: "80%",
            minWidth: "150px",
            minHeight: "150px",
          }}
        >
          {file ? file.name : "Select File"}
        </button>
      </div>
    </FileUpload>
  );
}

type MapColumnsProps = UploadFileStepProps & {
  file: File;
  setValue: (s: any) => void;
  values: any;
  submitBtn: boolean;
  setSubmitBtn: (s: boolean) => void;
};

function MapColumns(props: MapColumnsProps) {
  const { file, setValue, values, submitBtn, setSubmitBtn } = props;

  const [csvColumns, setCsvColumns] = useState<string[]>([]);

  useEffect(() => {
    getCsvColumns(file).then(setCsvColumns);
  }, [file]);

  return (
    <>
      <h5>Map CSV columns to Soft Lead fields</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Field</th>
            <th>CSV Column</th>
          </tr>
        </thead>
        <tbody>
          {generateColumns({
            leadFields: [
              "name",
              "email",
              "dob",
              "phone",
              "number",
              "sex",
              "matricule",
            ],
            foundFields: csvColumns,
            setValue,
            values: values,
            submitBtn: submitBtn,
            setSubmitBtn: setSubmitBtn,
          })}
          <tr>
            <td colSpan={2}>
              {" "}
              <button
                className="btn btn-success"
                onClick={() => setSubmitBtn(true)}
              >
                {" "}
                Envoyer{" "}
              </button>{" "}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

type GenerateColumnsProps = {
  leadFields: string[];
  foundFields: string[];
  setValue: (s: any) => void;
  values: any;
  submitBtn: boolean;
  setSubmitBtn: (s: boolean) => void;
};

function generateColumns(props: GenerateColumnsProps) {
  const { leadFields, foundFields, setValue, values, setSubmitBtn, submitBtn } =
    props;

  return leadFields.map((f) => {
    const field = f.replace(/_/g, " ");

    return (
      <>
        <tr key={`field/${field}`}>
          <td>{field}</td>
          <td>
            <select
              className="form-control"
              value={values && values[field]}
              onChange={(e) => setValue({ ...values, [field]: e.target.value })}
            >
              <option value={undefined}></option>
              {foundFields.map((op) => (
                <option value={op} key={`field/${field}/${op}`}>
                  {op}
                </option>
              ))}
            </select>
          </td>
        </tr>
      </>
    );
  });
}

function Submit(
  props: UploadFileStepProps & { class_id: any; submitBtn: boolean }
) {
  const { values, file, class_id, submitBtn } = props;

  const router = useRouter();

  const toast = useToast();

  useEffect(() => {
    if (submitBtn) {
      toast({
        status: "info",
        title: "Importing leads",
        description:
          "this can take a very (very) long time... please be patient",
        isClosable: true,
      });

      api
        .importStudents({
          file: file,
          mapping: values,
          class_id: class_id,
        })
        .then((data) => {
          toast({
            status: "success",
            title: "Successfully imported leads",
            description: `Loaded `,
          });

          setTimeout(() => window.location.reload(), 2000);
        })
        .catch((e) => {
          console.log(e);
          toast({
            status: "error",
            title: typeof e === "string" ? e : "Failed to import leads",
            description: e.error ?? e.toString(),
            isClosable: true,
          });
        });
    }
  }, [file, submitBtn]);

  return <div>Uploading ...</div>;
}

export default function () {
  return "";
}
