const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://kp45110:123@cinemaebooking.fujzi.mongodb.net/?retryWrites=true&w=majority&appName=CinemaEBooking";
const express = require('express');

const app = express();



let db; // To store the database connection

// Connect to the MongoDB database
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db('cinema_ebooking'); // Access the database 'cinema_ebooking'
    console.log('Connected to Database');
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(express.json());

// Route to get movies
app.get('/movies', async (req, res) => {
  try {
    const moviesCollection = db.collection('movies'); // Access 'movies' collection
    const movies = await moviesCollection.find().toArray(); // Fetch all movies
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new movie
app.post('/movies', async (req, res) => {
  const newMovie = {
    title: req.body.title,
    category: req.body.category,
    cast: req.body.cast,
    director: req.body.director,
    producer: req.body.producer,
    description: req.body.description,
    trailerLink: req.body.trailerLink,
    releaseDate: req.body.releaseDate,
    rating: req.body.rating,
    reviews: req.body.reviews,
    showdates: req.body.showdates,
    showtimes: req.body.showtimes,

  };

  try {
    const moviesCollection = db.collection('movies'); // Access 'movies' collection
    const result = await moviesCollection.insertOne(newMovie); // Insert the movie document
    res.status(201).json(result.ops[0]); // Return the inserted movie
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
