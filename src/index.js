import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import data from "../turtles_database";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swaggerUi-Turtles.json";

const app = express();
const {PORT = 1000} = process.env;
app.listen(PORT, () => console.log(`Hello Turtles, I am listening on port ${PORT}!`));

// swaggerUI
app.use("/sa/swaggerUI", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json()).use(cors());
app.get("/sa", (request, response) => response.send("Hello Turtles, I love you!"));

// Code for Turtles------------------------------------------------------------------------------
app.get("/sa/turtles", (req, res) => res.json(data.turtles));

// Get turtles by species name
app.get("/sa/turtles/L1/:ScientificName", (req, res) => {
    const SpeciesName = req.params.ScientificName;
    const turtle = data.turtles.find((tur) => tur.ScientificName === SpeciesName);
    if (!turtle) {
        return res.status(404).json({error: "Turtle not found"});
    }
    return res.json(turtle);
});

// Get turtles by English name
app.get("/sa/turtles/L2/:EnglishName", (req, res) => {
    const EngName = req.params.EnglishName;
    const turtle1 = data.turtles.find((tur) => tur.EnglishName === EngName);
    if (!turtle1) {
        return res.status(404).json({error: "Turtle not found"});
    }
    return res.json(turtle1);
});

// get turtles by family
app.get("/sa/turtles/:Family", (req, res) => {
    const family = req.params.Family;
    const turtle2 = data.turtles.filter(tur => tur.Family === family);
    if (!turtle2) {
        return res.status(404).json({error: "No turtle in the given family"});
    }
    return res.json(turtle2);
});

// Add a new turtle
app.post("/sa/turtles", (req, res) => {
    const newTurtle = {...req.body};

    data.turtles.push(newTurtle);
    res.status(201).json(newTurtle);
});


// Code for foods------------------------------------------------------------------------------
app.get("/sa/foods", (req, res) => res.json(data.foods));

// Get foods by id
app.get("/sa/foods/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const food = data.foods.find((tur) => tur.id === id);
    if (!food) {
        return res.status(404).json({error: "Food not found"});
    }
    return res.json(food);
});

// Add a new turtle's food
app.post("/sa/foods", (req, res) => {
    const nextId = data.foods.length + 1;
    const newFood = {id:nextId, ...req.body};
    data.foods.push(newFood);
    res.status(201).json(newFood);
});

// code for pairs-----------------------------------------------------------------------------
app.get("/sa/pairs", (req, res) => {
    const {turtleName, foodid} = req.query;
    let pairs = data.pairs;

    if (turtleName) {
        pairs = pairs.filter(
            (pair) => pair.turtleName === turtleName
        );
    }
    if (foodid) {
        pairs = pairs.filter(
            (pair) => pair.foodid === parseInt(foodid, 10)
        );
    } 
return res.json(pairs);
});


// app.get("/sa/pairs/:turtleName", (req, res) => {
//     const turtleName = req.params.turtleName;
//     const name = data.pairs.filter(p => p.turtleName === turtleName);
//     if (!name) {
//         return res.status(404).json({error: "Nothing"});
//     }
//     return res.json(name);
// });