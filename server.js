//dendencies
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const { urlencoded } = require('express')
const PORT = process.env.PORT
const app = express()

//database connections
const DATABASE_URL =process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// establish connections
mongoose.connect(DATABASE_URL)

//events for when connection open/closes/error
mongoose.connection
.on('open', () => console.log('connected to mongoose'))
.on('closed', () => console.log('disconnected from mongoose'))
.on('error', () => console.log(error))

// MODELS/SCHEMA
const {Schema, model} = mongoose
const animalSchema = new Schema({
    species: String,
    extinct: Boolean,
    location: String,
    lifeExpectancy: Number
});
const Animal = model('Animal', animalSchema)

//MIDDLEWARE
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

//ROUTES
//HOME
app.get('/', (req, res) => {
    res.send('home route works')
});
 //SEED
app.get('/animals/seed', (req, res) => {
    const starterAnimals = [
        {species: 'Mantis Shrimp', extinct: false, location: 'Pacific Ocean', lifeExpectancy: 7},
        {species: 'Axolotl', extinct: false, location: 'Lake Xochimilco, Mexico City', lifeExpectancy: 12},
        {species: 'Snow Leopard', extinct: false, location: 'Central/South Asia', lifeExpectancy: 11},
        {species: 'Liopleurodon', extinct: true, location: 'England/France', lifeExpectancy: 100},
        {species: 'Harpy Eagle', extinct: false, location: 'Central/South America', lifeExpectancy: 30},
    ]
     // Delete all fruits
  Animal.deleteMany({}, (err, data) => {
    // Seed Starter animals
    Animal.create(starterAnimals,(err, data) => {
        // send created animals as response to confirm creation
        res.json(data);
      })
})
});
//INDEX
app.get("/animals/", (req, res) => {
    Animal.find({})
    .then((animals) => {
res.render("animals/index.ejs", { animals });
    });
  });

  //NEW
app.get('/animals/new', (req, res) => {
res.render('animals/new.ejs', {
    // animal: Animal[req.params.id],
    // index: req.params.id
})
});
//destroy route
app.delete("/animals/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    // delete the animal
    Animal.findByIdAndRemove(id, (err, animal) => {
        // redirect user back to index page
        res.redirect("/animals")
    })
});
//update route
app.put("/animals/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    // check if the extinct property should be true or false
    req.body.extinct = req.body.extinct === "on" ? true : false
    // update the animal
    Animal.findByIdAndUpdate(id, req.body, {new: true}, (err, animal) => {
        // redirect user back to main page when animal is updated
        res.redirect(`/animals/${req.params.id}`)
    })
});
// create route
app.post("/animals", (req, res) => {
    // check if the extinct property should be true or false
    req.body.extinct = req.body.extinct === "on" ? true : false
    // create the new fruit
    Animal.create(req.body, (err, animal) => {
        // redirect the user back to the main animals page after animal is created
        res.redirect("/animals")
    })
});
// edit route
app.get("/animals/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id
    // get the animal from the database
    Animal.findById(id, (err, animal) => {
        // render template and send it an animal
        res.render("animals/edit.ejs", {animal})
    })
});

//SHOW
app.get('/animals/:id', (req, res) => {
    const id = req.params.id
    Animal.findById(id, (err, animal) => {
        res.render('animals/show.ejs', {animal})
    })
})



//app listener
app.listen(PORT, () => {
console.log(`I am listening on Port: ${PORT}`)
});