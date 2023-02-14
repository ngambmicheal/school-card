import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import SchoolInterface from "../../../models/school";
import SessionInterface from "../../../models/session";
import api from "../../../services/api";
import { customStyles } from "../../../services/constants";
import { errorMessage, successMessage } from "../../../utils/messages";

type ImpressionSettingsParams = {
  school: SchoolInterface;
  editable: boolean;
};

export default function SchoolSettingImpression({
  school: schol,
  editable,
}: ImpressionSettingsParams) {
  const [school, setSchool] = useState<SchoolInterface | undefined>(schol);
  const [schoolSessions, setSchoolSessions] = useState<SessionInterface[]>([])
  const [sessionModal, setSessionModal] = useState(false);

  const updateSchool = () => {
    if (school) {
      api.updateSchool(school).then(() => { toast(successMessage('School Updated successfully!'))});
    }
  };
  const toast = useToast(); 


  function handleChange(e: any) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setSchool((inputData) => ({
      ...inputData,
      [key]: value,
    }));
  }

  return (
    <>
      <div className="mt-3">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Police Stats Pdf </label>
              <input
                className="form-control"
                disabled={!editable}
                name="police_stats"
                value={school?.police_stats}
                onChange={handleChange}
              ></input>
            </div>

            <div className="col-md-6">
            <div className="form-group">
              <label>Police Bulletin </label>
              <input
                className="form-control"
                disabled={!editable}
                name="police_reports"
                value={school?.police_reports}
                onChange={handleChange}
              ></input>
            </div>
          </div>
        </div>

        {editable && (
          <div className="row">
            <div className="col-sm-6">
              <button
                className="btn btn-success"
                onClick={() => updateSchool()}
                disabled={!school?.session_id}
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>
        </div>
    </>
  );
}
