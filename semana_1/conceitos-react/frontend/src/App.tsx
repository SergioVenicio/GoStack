import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import { ProjectInterface, newProjectInterface } from "./interfaces/Project";

import Input from "./components/Input";
import Header from "./components/Header";

import api from "./services/api";

import "./App.css";

function App() {
  const [projects, setProjects] = useState<ProjectInterface[]>([]);
  const [newProject, setNewProject] = useState<newProjectInterface>();

  const handleAddProject = async () => {
    if (!newProject?.title || !newProject.owner) {
      return;
    }

    const response = await api.post("/projects", { ...newProject });
    const { data } = response;

    setProjects((projects) => [...projects, { ...data }]);
    setNewProject({
      title: "",
      owner: "",
    });
  };

  const handleNewProjectChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;

    setNewProject((newProject) => {
      const field = target.name;
      const value = target.value;

      return {
        ...(newProject as newProjectInterface),
        [field]: value,
      };
    });
  };

  useEffect(() => {
    api.get("/projects").then(({ data }: AxiosResponse<any>) => {
      setProjects(Array.from(data["projects"]));
    });
  }, []);

  return (
    <div className="App">
      <Header title="Projects">
        {projects ? (
          <ul>
            {projects.map(({ id, title, owner }) => (
              <li key={id}>
                {title} | {owner}{" "}
              </li>
            ))}
          </ul>
        ) : null}

        <form
          style={{
            marginTop: "15px",
            marginBottom: "15px",
          }}
        >
          <Input
            name="title"
            placeholder="Title"
            value={newProject?.title}
            onChange={(e) => handleNewProjectChange(e)}
          />
          <Input
            name="owner"
            placeholder="Owner"
            value={newProject?.owner}
            onChange={(e) => handleNewProjectChange(e)}
          />
          <button type="button" onClick={handleAddProject}>
            New Project
          </button>
        </form>
      </Header>
    </div>
  );
}

export default App;
