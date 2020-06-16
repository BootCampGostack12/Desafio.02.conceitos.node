const express = require("express");
const cors = require("cors");
const parserArray = require('./utils/parser');
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/repositories/:id", (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID" });
  }

  const repoIndex = repositories.findIndex(item => item.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "repository not found" });
  }

  request.repoIndex = repoIndex;
  return next();

})

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs: parserArray(techs),
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {

  const { repoIndex } = request;
  const { title, url, techs } = request.body;

  const repository = {
    id: repositories[repoIndex].id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  };

  repositories[repoIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.repoIndex, 1);
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {

  const { repoIndex } = request;

  const repository = repositories[repoIndex];
  repository.likes += 1;

  repositories[repoIndex] = repository;

  return response.json(repository);
});

module.exports = app;
