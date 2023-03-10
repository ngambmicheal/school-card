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
              <h3>Stats Page</h3>
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

            <div className="form-group">
              <label>Subject Display  </label> <br/>
              <span className="mx-3">
                <label htmlFor='display_5'>Orale  <input id="display_5"
                disabled={!editable}
                type='radio'
                name="subject_display"
                value={5}
                checked={school?.subject_display==5}
                onChange={handleChange}
              ></input> </label>
              </span>
              <span className="mx-3">
                <label htmlFor='display_3'>Ora  <input id="display_3"
                disabled={!editable}
                type='radio'
                name="subject_display"
                value={3}
                checked={school?.subject_display==3}
                onChange={handleChange}
              ></input> </label>
              </span>
              <span className="mx-3">
                <label htmlFor='display_1'>O  <input id="display_1"
                disabled={!editable}
                type='radio'
                name="subject_display"
                value={1}
                checked={school?.subject_display==1}
                onChange={handleChange}
              ></input> </label>
              </span>
            </div>

            <div className="form-group">
              <label>Name Display  </label> <br/>
              <span className="mx-3">
                <label htmlFor='display_name_2'>Nom Complet <input id="display_name_2"
                disabled={!editable}
                type='radio'
                name="name_display_stats"
                value={2}
                checked={school?.name_display_stats==2}
                onChange={handleChange}
              ></input> </label>
              </span>
              <span className="mx-3">
                <label htmlFor='display_name_1'>Prenom<input id="display_name_1"
                disabled={!editable}
                type='radio'
                name="name_display_stats"
                value={1}
                checked={school?.name_display_stats==1}
                onChange={handleChange}
              ></input> </label>
              </span>
              <span className="mx-3">
                <label htmlFor='display_name_0'>Aucun <input id="display_name_0"
                disabled={!editable}
                type='radio'
                name="name_display_stats"
                value={0}
                checked={school?.name_display_stats==0}
                onChange={handleChange}
              ></input> </label>
              </span>
          </div>
          <div className="form-group">
              <label>Afficher Sous-Total</label> <br/>
              <span className="mx-3">
                <label htmlFor='sub_total_display_yes'>OUI<input id="sub_total_display_yes"
                disabled={!editable}
                type='radio'
                name="sub_total_display"
                value={1}
                checked={school?.sub_total_display==1}
                onChange={handleChange}
              ></input> </label>
              </span>
              <span className="mx-3">
                <label htmlFor='sub_total_display_non'>NON<input id="sub_total_display_non"
                disabled={!editable}
                type='radio'
                name="sub_total_display"
                value={0}
                checked={school?.sub_total_display==1}
                onChange={handleChange}
              ></input> </label>
              </span>
          </div>
          </div>
         <div className="col-md-6">
           <h3>Reports Page</h3>
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
    </>
  );
}
