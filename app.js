const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// API to add a new task
app.post("/todos/", async (request, response) => {
  try {
    const { todo, status } = request.body;
    const postTodoQuery = `
      INSERT INTO
        tasks ( todo, status)
      VALUES
        ( '${todo}', '${status}');`;
    await db.run(postTodoQuery);
    response.send("Todo Successfully Added");
  } catch (e) {
    console.log(`Error: ${e.message}`);
    response.status(500).send("Internal Server Error");
  }
});

// API to update the status of a task
app.put("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;
    const { status } = request.body;
    const updateStatusQuery = `
      UPDATE
        tasks
      SET
        status='${status}'
      WHERE
        id = ${todoId};`;
    await db.run(updateStatusQuery);
    response.send("Todo status updated successfully.");
  } catch (e) {
    console.log(`Error: ${e.message}`);
    response.status(500).send("Internal Server Error");
  }
});

// API to delete a task
app.delete("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;
    const deleteTodoQuery = `
      DELETE FROM
        tasks
      WHERE
        id = ${todoId};`;
    await db.run(deleteTodoQuery);
    response.send("Todo Deleted");
  } catch (e) {
    console.log(`Error: ${e.message}`);
    response.status(500).send("Internal Server Error");
  }
});

// API to update a task
app.put("/todos/:todoId/update_todo", async (request, response) => {
  try {
    const { todoId } = request.params;
    const { todo } = request.body;
    const updateTodoQuery = `
      UPDATE
        tasks
      SET
        todo='${todo}'
      WHERE
        id = ${todoId};`;
    await db.run(updateTodoQuery);
    response.send("Todo updated successfully.");
  } catch (e) {
    console.log(`Error: ${e.message}`);
    response.status(500).send("Internal Server Error");
  }
});

// API to get all tasks
app.get("/todos/", async (request, response) => {
  try {
    const getTodoQuery = `
      SELECT
        *
      FROM
        tasks`;
    const todo = await db.all(getTodoQuery);
    response.send(todo);
  } catch (e) {
    console.log(`Error: ${e.message}`);
    response.status(500).send("Internal Server Error");
  }
});

module.exports = app;
