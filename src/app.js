const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", middlewareValidateID);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  const repositorieUpdate = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes,
  };

  repositories[repositorieIndex] = repositorieUpdate;
  return response.json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  repositories.splice(repositorieIndex, 1);
  return response.status(204).send();
});

app.post(
  "/repositories/:id/like",

  (request, response) => {
    const { id } = request.params;

    const repositorieIndex = findIndexRepositorie(id);

    repositories[repositorieIndex].likes++;
    return response.json({ likes: repositories[repositorieIndex].likes });
  }
);

function middlewareValidateID(request, response, next) {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).send();
  }

  return next();
}
// function for to find an index of one repositorie in array of repostiories
function findIndexRepositorie(id) {
  return repositories.findIndex((repositorie) => repositorie.id === id);
}
module.exports = app;
