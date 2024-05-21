import type { NextPage } from "next";
import { useEffect } from "react";
import api from "../services/api";

const Synced: NextPage = () => {
  useEffect(() => {
    api.sync();
  }, []);
  return <></>;
};

export default Synced;
