import { useState } from "react";
import SchoolInterface from "../../../models/school";
import api from "../../../services/api";

type InfoSettingsParams = {
  school: SchoolInterface;
  editable: boolean;
};

export default function SchoolSettingInfo({
  school: schol,
  editable,
}: InfoSettingsParams) {
  const [school, setSchool] = useState<SchoolInterface | undefined>(schol);

  const updateSchool = () => {
    if (school) {
      api.updateSchool(school).then(() => {});
    }
  };

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
      <div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Name </label>
              <input
                className="form-control"
                disabled={!editable}
                name="name"
                value={school?.name}
                onChange={handleChange}
              ></input>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                className="form-control"
                disabled={!editable}
                name="phone"
                value={school?.phone}
                onChange={handleChange}
              ></input>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                className="form-control"
                disabled={!editable}
                name="address"
                value={school?.address}
                onChange={handleChange}
              ></input>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                disabled={!editable}
                name="email"
                value={school?.email}
                onChange={handleChange}
              ></input>
            </div>
            <div className="form-group">
              <label>P.O Box</label>
              <input
                className="form-control"
                disabled={!editable}
                name="box"
                value={school?.box}
                onChange={handleChange}
              ></input>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Allow mark editing </label>
              <input
                className="mx-4"
                type="checkbox"
                disabled={!editable}
                name="allowUpdate"
                checked={school?.allowUpdate}
                onChange={handleChange}
              ></input>
            </div>
            {editable && (
              <div className="form-group">
                <label>Staff Password Lenght</label>
                <input
                  className="form-control"
                  name="staff_password_length"
                  value={school?.staff_password_length}
                  onChange={handleChange}
                ></input>
              </div>
            )}

            {editable && (
              <div className="form-group">
                <label>School Name</label>
                <select
                  className="form-control"
                  name="session_id"
                  value={school?.session_id}
                  onChange={handleChange}
                ></select>
              </div>
            )}
          </div>
        </div>

        {editable && (
          <div className="row">
            <div className="col-sm-6">
              <button
                className="btn btn-success"
                onClick={() => updateSchool()}
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
