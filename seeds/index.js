const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/user');
const cloudinary = require('cloudinary').v2;


if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
console.log(process.env.DB_URL);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    // clear all cur users and campgrounds (along with its comment)
    // ! hàm này chưa hoàn thành

    const user = new User({
        email: "trancongquang2002@gmail.com",
        username: "qang"
    })

    const registeredUser = await User.register(user, "qang");

    await cloudinary.v2.uploader
        .upload("/seed-img/seed1.jpg", {
            folder: "seed-img/",
            public_id: "seed1",
            use_filename: true,
            unique_filename: false
        })
        .then(result => console.log(result));


    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '653d0786717b3f3e7877aeec',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgo51ltyy/image/upload/v1698575538/YelpCamp/rk5cfgnwmre1gimvf7zi.jpg',
                    filename: 'YelpCamp/653e34b29d3f6818cc73d9ca'
                },
                {
                    url: 'https://res.cloudinary.com/dgo51ltyy/image/upload/v1698575597/YelpCamp/tumktwmasbbenzhw67ph.jpg',
                    filename: 'YelpCamp/tumktwmasbbenzhw67ph'
                }
            ]
        })
        await camp.save();
        console.log("add success")
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})