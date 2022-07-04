const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB", result);
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{7,}/.test(v) || /\d{2}-\d{6,}/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number, did you forget to add "-"?`,
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
