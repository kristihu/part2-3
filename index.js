require("dotenv").config();
const { response } = require("express");
const express = require("express");
const app = express();
const _ = require("lodash");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const e = require("express");

let persons = [];

const total = _.size(persons);
console.log(total, "total");

app.use(express.static("build"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(morgan("tiny"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  Person.countDocuments({}).exec((err, count) => {
    if (err) {
      res.send(err);
      return;
    }

    res.send(`Phone book has info for: ${count} persons date: ${new Date()}`);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  console.log(req.params.id);
  Person.findById(req.params.id)
    .then((per) => {
      if (per) {
        res.json(per);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  console.log(req.params.id, "IIDDDDD");
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const genId = () => {
  const random = Math.round(Math.random() * 2000);
  return random;
};

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const newNumber = { number: body.number };

  Person.findByIdAndUpdate(request.params.id, newNumber, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "no such id exists :(" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).send({ error: error });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server running in", PORT);
});
