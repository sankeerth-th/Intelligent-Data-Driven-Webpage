// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const habitRoutes = require('./routes/habitRoutes');
const progressRoutes = require('./routes/progressRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const path = require('path');
const { isAuthenticated } = require('./routes/middleware/authMiddleware');
const Habit = require('./models/habit');
const http = require('http');
const { Server } = require("socket.io");
const MotivationMessage = require('./models/MotivationMessage'); // Import MotivationMessage model

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }),
);

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('requestMotivationMessage', async (milestone) => {
    try {
      const messages = await MotivationMessage.find({ milestone });
      const randomIndex = Math.floor(Math.random() * messages.length);
      const message = messages[randomIndex];
      io.emit('motivationMessage', message);
    } catch (error) {
      console.error('Error fetching motivational message:', error.message);
      console.error(error.stack);
    }
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Authentication Routes
app.use(authRoutes);

// Habit Routes
app.use(habitRoutes);

// Progress Routes
app.use(progressRoutes);

// Challenge Routes
app.use(challengeRoutes);

// Dashboard Route
app.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const habits = await Habit.find({});
    res.render("dashboard", { habits });
  } catch (err) {
    console.error('Error fetching habits for dashboard:', err.message);
    console.error(err.stack);
    res.status(500).send("Error fetching habits data.");
  }
});

// Root path response
app.get("/", (req, res) => {
  res.render("index");
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});