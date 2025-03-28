require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Create a transporter using nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // 465 for SSL, 587 for TLS
    secure: true, // true for 465, false for 587
    auth: {
        user: "email address",
        pass: "password"
    }
});

app.post("/send-email", async (req, res) => {
    const { email, report } = req.body;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Sales Report",
            text: `Here is your sales report:\n\n${report}`
        });

        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// API route to save report data
app.post("/save-report", (req, res) => {
    const data = req.body; // Get the JSON data from the request

    const filePath = path.join(__dirname, "accumulated_sales_data.json");

    // Write JSON data to the file
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error("Error saving report:", err);
            return res.status(500).json({ success: false, message: "Failed to save report" });
        }
        res.json({ success: true, message: "Report saved successfully" });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));