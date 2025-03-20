const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for temporary files

app.use(express.json()); // Middleware to parse JSON

// Simple GET route to avoid "Cannot GET /"
app.get("/", (req, res) => {
    res.send("Welcome to the Email API!");
});

// Transporter setup for sending email
const transporter = nodemailer.createTransport({
    service: "gmail", // Change to your email provider if needed
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post("/send-email", upload.array("documents", 3), async (req, res) => {
  console.log("Files received:", req.files);  // Log files to see what is received

  const { userId, userEmail, subject, text } = req.body;

  // Check if required fields are present
  if (!userId || !userEmail || !subject || !text || req.files.length !== 3) {
      return res.status(400).json({ error: "Missing required fields or files" });
  }

  try {
      // Create email attachments
      const attachments = req.files.map(file => ({
          filename: file.originalname,
          path: file.path, // The path to the file
      }));

      console.log("Attachments:", attachments); // Log attachments

      // Send the email with the user's details and documents attached
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "smartscape.grp15@gmail.com",
        subject,
        text, // Remove extra concatenation
        attachments,
    });


      console.log("Email sent:", info);
      res.status(200).json({ success: true, message: "Email sent successfully" });

  } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, error: error.message });
  }
});

const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:3000',  // Replace with your frontend URL
}));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
