const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const UserRoutes = require("./authentication/userRoute");//import User
const beachRoutes = require("./routes/beach");//import Beach
const templeRoutes = require("./routes/temple");//import Temple
const churchRoutes = require("./routes/church");//  import Church
const eventimageRoutes = require("./routes/event_image");//  import Event Image
const feedbackRoutes = require("./routes/feedback");//  import Feedback
const gardenRoutes = require("./routes/garden");//  import Garden
const hosiptalRoutes = require("./routes/hospital");//  import Hospital
const mosqueRoutes = require("./routes/mosque");//  import Mosque
const shopaccessRoutes = require("./routes/shop_accessories");//  import Shop Accessories
const shopclothRoutes = require("./routes/shop_cloth");//  import Shop Clothes
const shopartifactRoutes = require("./routes/shop_artifact");//  import Shop Artifacts
const theaterRoutes = require("./routes/theater");//  import Theater
const turfRoutes = require("./routes/turf");//  import Turf
const pubRoutes = require("./routes/pub");//  import Pub
const parkRoutes = require("./routes/park");//  import Park
const restaurantRoutes = require("./routes/restaurant");//  import Restaurant
const ResidentialHotelRoutes = require("./routes/residential_hotel");//  import Residental Hotel
const ResidentialHomeRoutes = require("./routes/residential_home");//  import Residental Home
const ReviewRoutes = require("./routes/review");//  import Review
const VehicleTwoWheelerRoutes = require("./routes/vehicle_twowheeler");//  import Vehicle Two Wheeler
const VehicleFourWheelerRoutes = require("./routes/vehicle_fourwheeler") // import Vehicle Four Wheeler
const BookingRoutes = require("./routes/booking");//  import Booking
const FavouriteRoutes = require("./routes/favourite");//  import Favourite


dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));  
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", UserRoutes);//User Details
app.use("/api/beach", beachRoutes);//Beach Details
app.use("/api/temple", templeRoutes);//Temple Details
app.use("/api/church", churchRoutes);// Church Details
app.use("/api/eventimage", eventimageRoutes);// Event Image Details
app.use("/api/feedback", feedbackRoutes);// Feedback Details
app.use("/api/garden", gardenRoutes);// Garden Details
app.use("/api/hosiptal", hosiptalRoutes);// Hospital Details
app.use("/api/mosque", mosqueRoutes);// Mosque Details
app.use("/api/shopaccessories", shopaccessRoutes);// Shop Accessories Details
app.use("/api/shopcloth", shopclothRoutes);// Shop Clothes Details
app.use("/api/shopartifact", shopartifactRoutes);// Shop Artifacts Details
app.use("/api/theater", theaterRoutes);// Theater Details
app.use("/api/turf", turfRoutes);// Turf Details
app.use("/api/pub", pubRoutes);// Pub Details
app.use("/api/park", parkRoutes);// Park Details
app.use("/api/restaurant", restaurantRoutes);// Restaurant Details
app.use("/api/residentialhotel", ResidentialHotelRoutes);// Residental Hotel Details
app.use("/api/residentialhome", ResidentialHomeRoutes);// Residental Home Details
app.use("/api/review", ReviewRoutes);// Review Details
app.use("/api/vehicletwowheeler", VehicleTwoWheelerRoutes);// Vehicle Two Wheeler Details
app.use("/api/vehiclefourwheeler", VehicleFourWheelerRoutes); //Vehicle Four Wheeler Details
app.use("/api/booking", BookingRoutes);// Booking Details
app.use("/api/favourite", FavouriteRoutes);// Favourite Details



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
