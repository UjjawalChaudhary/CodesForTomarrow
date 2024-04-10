const express = require('express');
const http =require('http');
const socketIo = require('socket.io')
const jwt = require ('jsonwebtoken')
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandlingMiddleware = require('./middleware/errorHandlingMiddleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use(errorHandlingMiddleware);

// Middleware to authenticate websocket connections
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if(!token) {
        return next(new Error('Authentication error: token missing'));
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (error) {
        return next(new Error('Authentication error: Invalid token'));
    }
});

// Handle webSocket connections
io.on('connection', (socket)=>{
    console.log(`New WebSocket connection from user ${socket.userId}`);

    socket.on('chatMessage', (message)=>{
        console.log(`Received message from user ${socket.userId}: ${message}`);


        //Brodcast the message to all connected clients 
        socket.broadcast.emit('chatMessage', {
            userId: socket.userId,
            message: message
        });
    });

    // Handle disconnection
    socket.on('disconnect', ()=>{
        console.log(`WebSocket disconnected for user ${socket.userId}`);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("Server is running");
});