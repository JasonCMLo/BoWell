const { default: mongoose } = require("mongoose");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const mongoKey = process.env.MongoAPI;
const mongoID = process.env;

mongoose.connect(
  "mongodb+srv://Jason_Desktop:" +
    mongoKey +
    "@cluster0.tstbsbq.mongodb.net/boWell"
);

const MealSchema = {
  name: String,
  source: String,
  ingredients: [String],
};

const bmSchema = {
  rating: Number,
};

const Meal = mongoose.model("meal", MealSchema);

const BM = mongoose.model("bm", bmSchema);

const DaySchema = {
  day: { type: Date, required: true },
  meals: [MealSchema],
  bms: [bmSchema],
  user: { type: String, required: true },
};

const Log = mongoose.model("Log", DaySchema);

app.get("/", function (req, res) {
  res.render("main");
});

app.get("/about", function (req, res) {
  res.render("about");
});

let historyDate = new Date();

app.get("/history", function (req, res) {
  const currLog = Log.findOne({ day: historyDate }, function (err, results) {
    if (!results) {
      res.render("history", { meals: [], day: "" });

      console.log("no");
    } else {
      console.log("yes");
      const currMeals = results.meals;

      console.log(currMeals);

      res.render("history", { meals: currMeals, day: historyDate });
    }
  });
});

app.post("/history", function (req, res) {
  historyDate = req.body.histDate;

  res.redirect("history");
});

app.post("/:postType", function (req, res) {
  const input = req.body;

  console.log(input);
  const day = new Date(input.currDate || input.currDateBM);

  console.log(input);

  const postType = req.params.postType;

  Log.findOne({ day: day }, function (err, results) {
    if (postType === "meal") {
      var newMeal = new Meal({
        name: input.name,
        source: input.source,
        ingredients: input.ingredients.split(","),
      });
    } else if (postType === "bm") {
      var newBM = new BM({
        rating: input.bmRating,
      });
    }

    if (!results) {
      const mdb_date = new Log({
        day: day,
        user: input.user,
      });
      if (postType === "meal") {
        mdb_date.meals.push(newMeal);
      } else if (postType === "bm") {
        mdb_date.meals.push(newBM);
      }

      mdb_date.save();
    } else {
      if (postType === "meal") {
        results.meals.push(newMeal);
      } else if (postType === "bm") {
        results.bms.push(newBM);
      }
      results.save();
    }
  });

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});

// const UserSchema = {
//   name: String,
//   pw: String,
// };

// const User = mongoose.model("user", UserSchema);

// const newUser = new User({ name: "Jason", pw: "pw123" });
// newUser.save();
