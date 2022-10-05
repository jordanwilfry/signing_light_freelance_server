const mongoose = require("mongoose");

const app = require("express");
const router = app.Router();

const bcrypt = require("bcryptjs");
const Cryptr = require("cryptr");
// const cryptr = new Cryptr(process.env.ENCRYPT)

const multer = require("multer");
const gridFsStorage = require("multer-gridfs-storage");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
//database model to use
const User = require("./../models/users");

console.log(User);

// sending

const Mailing = (receiverEmail, url) => {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: "signinglight.freelance@gmail.com",
        pass: "upbiglqvjnjqtcmr",
      },
    })
  );

  const mailOption = {
    from: "signinglight.freelance@gmail.com",
    to: `${receiverEmail}`,
    subject:
      "[Signing Light Freelance] Welcome! Please verify your email address",
    attachments: [
      {
        filename: "logo.png",
        path: "./assets/logo/logo.png",
        cid: "unique@cid",
      },
    ],
    html: `    
      <!DOCTYPE html>
      <html>
          <body style='font-family: "montserrat", sans-serif; background-color: rgb(243, 243, 243); margin: auto; width: 90%; color: black'>
          <header style="font-size: 35px; font-weight: 300; padding: 10px;padding-left: 20px; text-align: left; color: white; background-color: #FFE47A; display: flex; justify-items: center;" ><img src="cid:unique@cid"  style="margin: none;margin-right: 15px; padding-top: 6px; width: 150px;height: auto;"></header>
          <div style="background-color: white; padding: 20px;">
              <p style="font-size: 19px;">
                  Welcome to Signing Light Freelance, <b></b>! To complete your registration, We just want you to verify your Email address: ${receiverEmail}
              </p>
              
              <a href=${url}>
              <button style="margin-bottom: 20px; margin-bottom: 20px; padding: 10px 15px; background-color: #FFE47A; color: black; border: none; border-radius: 5px; font-weight: 600;">
                  Verify Email Address
              </button></a><br>
              <p style="font-size: 17px;">Once verified your will be able to fully accessed the <b>Signing Light Freelance</b> platform</p><br>
              <p style="font-size: 16px;">your are receiving this mail because you recently created a <b>Signing Light Freelance</b> account. If is wasn't you, please ignore this mail</p><br>
              <hr><br><br>
              <p style="text-align: right; font-size: 15px;"><a href="#" style="color: #ffcc00;">Preferences</a> - <a href="#" style="color: #ffcc00;">Terms</a> - <a href="#" style="color: #ffcc00;">Pravicy</a></p><br><br>
          </div>
          </body>
      </html>
        `,
  };

  transporter.sendMail(mailOption, (error, infos) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email successfully send");
    }
  });
};

// profile uploaded
const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./../public/images/profiles");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.profilePicture);
  },
});

upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    res.status(200).json("file have been uploaded");
  } catch (error) {
    console.log(error);
  }
});

router.get("/", (req, res) => {
  res.send("hello here we are working with the athentications");
});

//registration routes

router.post("/register1", async (req, res) => {
  // res.redirect("http://localhost:4000");

  this.email = req.body.email;
  hashedPassword = await bcrypt.hash(req.body.password, 10);
  this.password = hashedPassword;

  console.log(this.email, this.password);
});

router.post("/register2", async (req, res) => {
  this.phoneNumber = req.body.phoneNumber;
  console.log(this.phoneNumber);
});

router.post("/register3", async (req, res) => {
  this.firstName = req.body.firstName;
  this.secondName = req.body.secondName;
  this.birthday = req.body.birthday;
  this.country = req.body.country;
  this.gender = req.body.gender;

  console.log(this.birthday);
  console.log(this.gender);
  console.log(this.firstName);
  console.log(this.secondName);
  console.log(this.country);
});

router.post("/register4", async (req, res) => {
  this.profilePicture = req.body.profilePicture;
  if (!this.profilePicture) {
    this.profilePicture = "/assets/persons/avatar.jpg";
  }
  this.description = req.body.description;
  this.skills = req.body.skills;

  //generating some random string
  console.log(this.description);
  console.log(this.skills);
  console.log(this.profilePicture);

  const user = await new User({
    firstName: this.firstName,
    secondName: this.secondName,
    phoneNumber: this.phoneNumber,
    password: this.password,
    dateOfBirth: this.birthday,
    profilePicture: this.profilePicture,
    gender: this.gender,
    country: this.country,
    email: this.email,
    description: this.description,
    skills: this.skills,
  });

  const token = jwt.sign({ Id: this.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const url = `http://localhost:3000/email/confirmation/${token}`;
  try {
    await user
    .save()
    .then(() => {
        Mailing(this.email, url);
        console.log("user created");
        res.json("sucessful");
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

router.put("/confirmation/:token", async (req, res) => {
  try {
    const { Id } = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const email = Id
    console.log(email)
    await User.updateOne(
      { email: email },
      {
        $set: {
          verifiedEmail: true,
        },
      }
    );
    console.log(await User);
  } catch (error) {
    res.send("error");
  }
});

router.post("/login", async (req, res) => {
  const LoginEmail = req.body.email;
  const LoginPassword = req.body.password;
  const userEmail = await User.findOne({ email: LoginEmail });

  if (!userEmail) {
    console.log("Invalid password or Phone");
    res.json({ message: "invalid" });
  }
  storedPassword = userEmail.password;

  if (await bcrypt.compare(LoginPassword, storedPassword)) {
    console.log("login");
    res.json({ message: "valid", userEmail });
  } else {
    console.log("ivalid");
    res.json({ message: "invalid" });
  }
});

router.post("/verifyEmail", async (req, res) => {
  const LoginEmail = req.body.email;
  const userEmail = await User.findOne({ email: LoginEmail });

  if (!userEmail) {
    console.log("");
    res.json({ message: "valid" });
  } else {
    console.log("already");
    res.json({ message: "invalid" });
  }
});

module.exports = router;
