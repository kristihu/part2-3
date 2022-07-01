const { response } = require("express");
const express = require("express");
const app = express();
const _ = require("lodash");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

let persons = [
  {
    id: 1,
    name: "arto hellas",
    number: "040-32178321",
  },
  {
    id: 2,
    name: "fuq hellas",
    number: "040-412412",
  },
  {
    id: 3,
    name: "jionu hellas",
    number: "040-535166",
  },
  {
    id: 4,
    name: "sami hellas",
    number: "040-6316361",
  },
];

const total = _.size(persons);
console.log(total, "total");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(morgan("tiny"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("build"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.get("/api/persons", (req, res) => {
  console.log(res, "res");
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${total} people.</p><p>${new Date()}</p>`
  );
  res.end();
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  res.send(`<p>${person.name}  ${person.number}</p>`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  console.log("deleted", persons);
  res.status(204).end();
});

const genId = () => {
  const random = Math.round(Math.random() * 2000);
  return random;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const checkDuplicates = persons.find((p) => p.name === body.name);
  if (!checkDuplicates) {
    const person = {
      id: genId(),
      name: body.name,
      number: body.number,
    };
    persons = persons.concat(person);
    res.json(person);
  } else {
    return res.status(400).json({
      error: "name allready added ",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }
  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server running");
});
