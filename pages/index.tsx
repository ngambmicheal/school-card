import { Link } from "@chakra-ui/layout";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import SchoolInterface from "../models/school";
import { helperService } from "../services";
import api from "../services/api";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [schools, setSchools] = useState<SchoolInterface[]>([]);

  useEffect(() => {
    api.getSchools().then(({ data: { data } }) => {
      setSchools(data);
    });
  }, []);

  const chooseSchool = (schoolId: string) => {
    helperService.saveSchoolId(schoolId);
    window.location = "/classes";
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h4 className={styles.title}>
          Bienvenue au site. <br /> Choississez Votre Ecole :
        </h4>

        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th> Ecole </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {schools.map((s) => {
              return (
                <tr>
                  <td key={s._id}>
                    <Link href={`schools/${s._id}`}> {s.name} </Link>{" "}
                  </td>
                  <td>
                    <a
                      className="choose-action"
                      href="#"
                      onClick={() => s._id && chooseSchool(s._id)}
                    >
                      {" "}
                      Choisir{" "}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Home;
