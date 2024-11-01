import Message from "../model/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";
import path from "path"; // Import path for better file path handling

export const getMessages = async(req, res, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;
        if (!user1 || !user2) {
            return res.status(400).send("Both user IDs are required.");
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 });

        return res.status(200).json({ messages });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const uploadFile = async(request, response, next) => {
    try {
        if (request.file) {
            console.log("File received:", request.file.originalname);
            const date = Date.now();
            const fileDir = path.join("uploads", "files", date.toString()); // Use path.join for cross-platform compatibility
            const fileName = path.join(fileDir, request.file.originalname);

            // Create directory if it doesn't exist
            mkdirSync(fileDir, { recursive: true });

            // Rename the file to the new path
            renameSync(request.file.path, fileName);

            // Send back the file path
            return response.status(200).json({ filePath: fileName.replace(/\\/g, "/") }); // Ensure the file path uses forward slashes
        } else {
            return response.status(400).send("File is required."); // Changed to 400 for better error handling
        }
    } catch (error) {
        console.log("Error during file upload:", error);
        return response.status(500).send("Internal Server Error.");
    }
};