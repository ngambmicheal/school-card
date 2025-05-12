import React, { useState } from 'react'
import SchoolInterface from '../../../models/school'

export default function SchoolSettingAttestation({school:schol, editable}: {school: SchoolInterface, editable: boolean}) {
      const [school, setSchool] = useState<SchoolInterface>(schol);

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


    <div>
        <div className="col-md-6">
            <div className="form-group">
              <label>Intro Text </label>
              <input
                className="form-control"
                disabled={!editable}
                name="name"
                value={school?.attestation_en_intro}
                onChange={handleChange}
              ></input>
            </div>
        </div>

        <div className="col-md-6">
            <div className="form-group">
              <label>Body Text </label>
              <input
                className="form-control"
                disabled={!editable}
                name="name"
                value={school?.attestation_en_intro}
                onChange={handleChange}
              ></input>
            </div>
        </div>
     </div>
  )

}
