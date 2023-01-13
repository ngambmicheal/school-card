import { useEffect, useState } from "react";
import Classe from "../../../models/classe";
import Link from "next/link";
import api from "../../../services/api";
import ClasseInterface from "../../../models/classe";
import Modal from "react-modal";
import { customStyles } from "../../../services/constants";
import { useRouter } from "next/dist/client/router";
import SectionInterface from "../../../models/section";
import { CSVLink } from "react-csv";
import useSchool from "../../../hooks/useSchool";
import SchoolInterface from "../../../models/school";
import SchoolSettingInfo from "./info";
import { useSession } from "next-auth/react";
import useUser from "../../../hooks/useUser";
import { UserType } from "../../../utils/enums";

export default function Classes() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sections, setSections] = useState<SectionInterface[]>([]);
  const { school: schol } = useSchool();
  const { data: session } = useSession();
  const {user} = useUser(session);

  const [school, setSchool] = useState<SchoolInterface | undefined>(schol);

  const router = useRouter();
  const { _id: schoolId } = router.query;

  useEffect(() => {
    api.getSections().then(({ data: { data } }: any) => {
      setSections(data);
    });

    setSchool((s) => schol);
  }, [schol]);

  const closeModal = () => {
    setModalIsOpen((s) => false);
  };

  return (
    <>
      {" "}
      {school && session && (
        <div>
          <SchoolSettingInfo
            school={school}
            editable={user?.type === UserType.ADMIN}
          ></SchoolSettingInfo>
        </div>
      )}
      {school && !session && (
        <div>
          <div>{school.name}</div>
        </div>
      )}
    </>
  );
}
