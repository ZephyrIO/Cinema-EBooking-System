const mongoose = require('mongoose');
const Movie = require('../models/Movies'); // Import the Movie model

// Replace with your actual MongoDB connection string
mongoose.connect('mongodb+srv://kp45110:123@cinemaebooking.fujzi.mongodb.net/cinema_ebooking?retryWrites=true&w=majority&appName=CinemaEBooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const movies = [
  {
    title: 'Inception',
    category: 'Currently Running',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    director: 'Christopher Nolan',
    producer: 'Emma Thomas',
    description: 'A mind-bending thriller about dream invasion.',
    trailerLink: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    releaseDate: new Date('2010-07-16'),
    rating: 'PG-13',
    reviews: ['89% on Rotten Tomatoes', 'Excellent thriller'],
    showdates: [new Date('2024-09-20'), new Date('2024-09-21')],
    showtimes: ['2:00 PM', '5:00 PM', '8:00 PM']
  },
  {
    title: 'Avatar',
    category: 'Currently Running',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    director: 'James Cameron',
    producer: 'Jon Landau',
    description: 'A visually stunning journey to Pandora.',
    trailerLink: 'https://www.youtube.com/watch?v=5PSNL1qE6VY',
    releaseDate: new Date('2009-12-18'),
    rating: 'PG-13',
    reviews: ['82% on Rotten Tomatoes', 'A groundbreaking movie'],
    showdates: [new Date('2024-09-22'), new Date('2024-09-23')],
    showtimes: ['1:00 PM', '4:00 PM', '7:00 PM']
  }
];

Movie.insertMany(movies)
  .then(() => {
    console.log('Movies inserted');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error inserting movies:', error);
    mongoose.connection.close();
  });
