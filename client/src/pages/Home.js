
//hooks 
import React, { useEffect, useState } from "react";
import RowDetails from "../components/RowDetailsEvent";
import axios from "axios";
import Alert from "../components/Alert";
import { Col, Input, Row } from "reactstrap";
import { DownloadCloud } from "react-feather";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";

import IconButton from "@mui/material/IconButton";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { Select } from "@mui/material";
import { useHistory } from "react-router-dom";
function Home() {

  // stat to manpulate all components in front
  const [users, setUsers] = useState([]);
  const [testeur, setTesteur] = useState([]);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useHistory();

  const [formData, setFormData] = useState({
    Notes: "",
    Testeur: "",
    Version: "",
    Date: "",
  });

  // function to create new release in DB
  const create = (event) => {
    event.preventDefault();
    // refresh table when add data 
    loadRelease();
   
    window.location.reload();
    const formDataF = new FormData();
    formDataF.append("image", selectedFile);
    formDataF.append("Notes", formData.Notes);
    formDataF.append("Date", formData.Date);
    formDataF.append("Testeur", formData.Testeur);
    formDataF.append("Version", formData.Version);

    // axios for add api in data
    axios.post("/api/release", formDataF, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        navigate.push("/Release");
        setShow(true);
        setMessage(response.data.message);
        console.log(response);
      });
  };

  const handleChange = (event) => {
    const { value } = event.target;
    console.log(event);
    setFormData({
      ...formData,
      Notes: value,
    });
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    console.log(event);
    setFormData({
      ...formData,
      Date: value,
    });
  };

  const handleTesteurChange = (event) => {
    const { value } = event.target;
    console.log(event);
    setFormData({
      ...formData,
      Testeur: value,
    });
  };

  const handleVersionChange = (event) => {
    const { value } = event.target;
    console.log(event);
    setFormData({
      ...formData,
      Version: value,
    });
  };

  /* delete */
  const OnDelete = (id__) => {

    if (window.confirm("are you sure to delete this release")) {
      axios.delete(`/api/release/${id__}`).then((res) => {
        setMessage(res.data.message);
        setShow(true);
        //to refresh table after delete
        loadRelease();
        setTimeout(() => {

          // Alert or notification whene delete show in 0.4 second
          setShow(false);
        }, 4000);
      });
    }
  };

  //when window show in first one
  useEffect(async () => {
    loadRelease();
    loadTesteur();
  }, []);

  const loadRelease = async () => {
    await axios.get("/api/release").then((res) => {
      setUsers(res.data);
    });
  };

  const loadTesteur = async () => {
    try {
      const response = await axios.get("/api/releaseTesteur");
      const testeur = response.data.map(({ user: { username } }) => ({
        username,
      }));
      setTesteur(testeur);
      console.log("ttttttttt", testeur);
      return testeur;
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="row p-4">
      {/* alert show */}
      <Alert message={message} show={show} />
      <div className="mt-4">
        <h2> Release Mangement</h2>
      </div>

      <div className="col-12 col-lg-7">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">File</th>

              <th scope="col">Version</th>
              <th scope="col">Notes</th>
              <th scope="col">Date</th>
              <th scope="col">Testeur</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ Notes, Testeur, Version, Date, _id }) => (
              <RowDetails
                File={<FolderCopyIcon />}
                Notes={Notes}
                Version={Version}
                Date={Date}
                Testeur={Testeur}
                Id={_id}
                OnDelete={OnDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-12 col-lg-4">
        <button onClick={create} style={{ marginLeft: 400 }} className="btn btn-primary" type="submit">
          Add Release
        </button>
        <h5>Notes</h5>
        <Input
          value={formData.Notes}
          onChange={handleChange}
          id="titre"
          type="text"
          placeholder="Notes"
        />

        <h5>Date</h5>
        <Input
          value={formData.Date}
          onChange={handleDateChange}
          id="desc"
          type="text"
          placeholder="date"
        />

        <h5>Version</h5>
        <Input
          value={formData.Version}
          onChange={handleVersionChange}
          id="desc"
          type="text"
          placeholder="Version"
        />
        <h5>Testeur</h5>

        <select
          style={{ width: 180, height: 40, borderRadius: 20 }}
          value={formData.Testeur}
          onChange={handleTesteurChange}
        >
          {testeur.map((t, index) => (
            <option key={index} value={t.username}>
              {t.username}
            </option>
          ))}
        </select>

        <h5>upload</h5>
        <Row gutter={16}>
          <Col span={4} style={{ borderColor: "black" }}>
            <label>File</label>
            <div className="d-flex align-items-center justify-content-center flex-column">
              <DownloadCloud style={{ marginTop: 20 }} size={64} />
              <Input
                style={{ marginTop: 30, marginLeft: 20 }}
                onChange={(e) => {
                  setSelectedFile(e.target.files[0]);
                  console.log(e.target.files[0]);
                }}
                type="file"
              />
            </div>
          </Col>
        </Row>

        <Row>
          {users.map((item, index) => {
            return (
              <Col key={index} lg="4" md="6" sm="12">
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader />

                  <CardMedia
                    component="img"
                    height="194"
                    image={"http://localhost:3700/images" + item.image}
                    alt="YOUR FILE NOT EXIST OR EMPTY"
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default Home;
