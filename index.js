import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import { createUser, connectDB, findUserByUserName } from "./database.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import bcrypt, { compare } from "bcrypt"
import { songDatabase } from "./songs.js";
dotenv.config();


const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors({
    origin: ['http://localhost:3000', 'http://example.com'],  // Allow multiple origins
    methods: ['GET', 'POST'],  // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
}));

connectDB("JaMoveo");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/pictures', express.static(path.join(__dirname, 'pictures')));
app.use('/css', express.static(path.join(__dirname, 'css')));
const sendFile = (res, fileName) => {
    res.sendFile(path.join(__dirname, "public", fileName));
}
app.get("/", (req, res) => {
    sendFile(res, "index.html");
});
app.get("/signup", (req, res) => {
    sendFile(res, "signup.html");
});
app.get("/adminSignup", (req, res) => {
    sendFile(res, "adminSignup.html");
});
app.get("/login", (req, res) => {
    sendFile(res, "login.html");
});
app.get("/mainPagePlayer", (req, res) => {
    sendFile(res, "mainPlayer.html");
});
app.get("/mainPageAdmin", (req, res) => {
    sendFile(res, "mainAdmin.html");
});
app.get("/resultPage", (req, res) => {
    sendFile(res, "resultPage.html");
});
app.get("/liveRoom", (req, res) => {
    sendFile(res, "liveRoom.html");
});

app.get('/searchSong', (req, res) => {
    const query = req.query.query.toLowerCase();
    const songs = songDatabase.filter(
        song => song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
    );

    if (songs) {
        res.json({ success: true, data: songs });
    } else {
        res.json({ success: false, message: 'Song not found' });
    }
});

app.post("/signup", async (req, res) => {
    const { username, password, instrument } = req.body;
    const user = {
        userName: username ,
        password: password,
        instrument: instrument
    }
    await createUser(user,false)
    res.redirect("/login");
});

app.post("/adminSignup" , async (req, res) =>{
    const { username, password, instrument } = req.body;
    const user = {
        userName: username ,
        password: password,
        instrument: instrument
    }
    await createUser(user,true)
    res.redirect("/login");
});

app.post("/login", async (req, res)=>{
    try {
        const {username , password} = req.body;
        console.log(username,password)
        const user = await findUserByUserName(username);
        if (!user) throw new Error("user not found");
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) throw new Error("incorrect password");
        return res.json({ isConnect: true, instrument: user.instrument, isAdmin: user.isAdmin });
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
});

// Socket.io
let currentSong = null
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    if (currentSong) {
        socket.emit('songData', currentSong);
    }
    
    // Listen for an event from the admin 
    socket.on('adminSelectSong', () => {
        console.log('Admin selected a song, moving all users to the live room...');
        io.emit('moveToLiveRoom');  // Broadcast to all users
    });

    socket.on('adminSelectSong', (songData) => {
        console.log('Admin selected a song:', songData.title);
        currentSong = songData;  
        io.emit('songData', currentSong);  // Broadcast the song data to all users
    });

    socket.on('adminEndSession', () => {
        console.log('Admin ended the session...');
        currentSong = null;
        io.emit('moveBackToMainRoom');  // Broadcast to all users
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});