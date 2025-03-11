import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import setupSocket from "./socket.js";
import channelRoutes from "./routes/ChannelRoutes.js";

import path from "path";


dotenv.config();

const app = express();
const port = process.env.PORT;
const databaseURL = process.env.DATABSE_URL;



app.use(express.json());
app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

const __dirname = path.resolve();

// Backend route in server.js or index.js (Express server)

app.post('/api/send-request', (req, res) => {
    try {
        // Log the incoming request to verify what is being sent
        console.log('Received request body:', req.body);

        const { recipientId } = req.body;

        // Check if recipientId is missing
        if (!recipientId) {
            return res.status(400).json({ error: 'Recipient ID is required' });
        }

        // Additional logic for handling the request (e.g., saving to the database)
        console.log('Recipient ID:', recipientId);

        // Example logic: Assume you're saving the request in the database or sending a message
        // Replace with your actual logic

        // Simulate successful processing
        return res.status(200).json({ message: 'Request sent successfully' });

    } catch (error) {
        console.error('Error in send-request API:', error); // Log the error for debugging
        res.status(500).json({ error: 'Server Error' });
    }
});


app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);


app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});




const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

setupSocket(server);

mongoose
    .connect(databaseURL)
    .then(() => {
        console.log("DB Connetion Successfull");
    })
    .catch((err) => {
        console.log(err.message);
    });