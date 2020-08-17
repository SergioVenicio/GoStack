const PORT = 3000;

const express = require("express");
const bodyParser = require("body-parser");
const { uuid } = require("uuidv4");
const { validate } = require("uuid");

const app = express();

app.use(bodyParser.json());

const logMiddleWare = (request, response, next) => {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);
  return next();
};

const validateUUI = (request, response, next) => {
  const { id } = request.params;

  if (id !== undefined && !validate(id)) {
    return response.status(400).json({
      message: "Invalid uuid",
    });
  }
  return next();
};

app.use(logMiddleWare);
app.use("/*/:id", validateUUI);

let projects = [];

const filter_by = (arrayToFilter, field, value) => {
  if (!value) return arrayToFilter;

  return arrayToFilter.filter((element) =>
    element[field].includes(value) ? element : null
  );
};

app.get("/projects", (request, response) => {
  const { title, owner } = request.query;
  let resp_projects = projects;

  resp_projects = filter_by(resp_projects, "title", title);
  resp_projects = filter_by(resp_projects, "owner", owner);

  return response.status(200).json({ projects: resp_projects });
});

app.get("/projects/:id", (request, response) => {
  const { id } = request.params;
  const project = filter_by(projects, "id", id)[0];
  if (!project) {
    return response.status(404).json({
      message: "ERROR",
    });
  }
  return response.status(200).json({ project });
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;
  projects.push({
    id: uuid(),
    title,
    owner,
  });

  return response.status(201).json({
    message: "OK",
  });
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;

  const { title, owner } = request.body;
  const project = filter_by(projects, "id", id)[0];
  const position = projects.indexOf(project);

  if (!project || position === -1) {
    return response.status(404).json({
      message: "ERROR",
    });
  }

  projects[position] = { ...project, title, owner };

  return response.status(200).json({
    message: "OK",
  });
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;
  projects = projects.filter((project) => (project.id !== id ? project : null));
  return response.status(204).json();
});

app.listen(PORT, () => {
  console.log(`Running on :${PORT}`);
});
