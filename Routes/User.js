const router = require("express").Router();
const User = require("./../models/users");
const Portfolio = require("./../models/portfolio");
const Education = require("./../models/education");
const Experience = require("./../models/experience");
const Conversation = require("./../models/conversations");
const bcrypt = require("bcryptjs");

//updated a user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      } catch (error) {
        res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("user have been updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can update only your account");
  }
});

//delele a user

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.id] },
      });
      conversation.map(
        async (conv) => await Conversation.findByIdAndDelete(conv._id)
      );
      console.log('conversation have been deleted')
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user have been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can delete only your account");
  }
});

//get a user

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user profile

router.get("/myProfile/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    const { password, updatedAt, ...other } = user._doc;
    console.log(user);
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all users

router.get("/allUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get recomenders
router.get("/recomender/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const recomenders = await Promise.all(
      user.stared.map((recomenderId) => {
        return User.findById(recomenderId);
      })
    );
    let recomenderList = [];
    recomenders.map((recomender) => {
      const { _id, firstName, secondName, profilePicture } = recomender;
      recomenderList.push({ _id, firstName, profilePicture, secondName });
    });
    res.status(200).json(recomenderList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//star a user
router.put("/:userId/:otherUserId/star", async (req, res) => {
  if (req.params.userId !== req.params.otherUserId) {
    try {
      const otherUser = await User.findById(req.params.otherUserId);
      const currentUser = await User.findById(req.params.userId);
      if (
        !currentUser.haveStared.includes(req.params.otherUserId) &&
        !otherUser.stared.includes(req.params.userId)
      ) {
        await otherUser.updateOne({ $push: { stared: req.params.userId } });
        await currentUser.updateOne({
          $push: { haveStared: req.params.otherUserId },
        });
        res.status(200).json("your have successfully stared the other user");
      } else {
        res.status(503).json("your have already star this user ");
      }
    } catch (error) {
      res.status(403).json("you can't star your self");
    }
  }
});

//unstar a user
router.put("/:userId/:otherUserId/unStar", async (req, res) => {
  if (req.params.userId !== req.params.otherUserId) {
    try {
      const otherUser = await User.findById(req.params.otherUserId);
      const currentUser = await User.findById(req.params.userId);
      if (
        currentUser.haveStared.includes(req.params.otherUserId) &&
        otherUser.stared.includes(req.params.userId)
      ) {
        await otherUser.updateOne({ $pull: { stared: req.params.userId } });
        await currentUser.updateOne({
          $pull: { haveStared: req.params.otherUserId },
        });
        res.status(200).json("your have successfully unstared the other user");
      } else {
        res
          .status(503)
          .json(
            "your can't unstar this person because youhave not yet star him/her "
          );
      }
    } catch (error) {
      res.status(403).json("you can't  unstar a star you have not put");
    }
  }
});

// working with the portfolio

// get a user portfolio

router.get("/portfolio/:userId", async (req, res) => {
  try {
    const portfolio = await Portfolio.find({
      userId: req.params.userId
    });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json(err);
  }
});


// creating a new portfolio
router.post("/portfolio", async (req, res) => {
  const portfolio = new Portfolio(req.body);
  try {
    const savedPortfolio = await portfolio.save();
    res.status(200).json(savedPortfolio);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a portfolio
router.put("/portfolio/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (portfolio.userId === req.body.userId) {
      await portfolio.updateOne({ $set: req.body });
      res.status(200).json("the portfolio has been updated");
    } else {
      res.status(403).json("you can update only your portfolio");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a portfolio

router.delete("/portfolio/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (portfolio.userId === req.body.userId) {
      await portfolio.deleteOne();
      res.status(200).json("the portfolio has been deleted");
    } else {
      res.status(403).json("you can delete only your portfolio");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// working with the education

// get a user education

router.get("/education/:userId", async (req, res) => {
  try {
    const education = await Education.find({
      userId: req.params.userId
    });
    res.status(200).json(education);
  } catch (err) {
    res.status(500).json(err);
  }
});


// creating a new education
router.post("/education", async (req, res) => {
  const education = new Education(req.body);
  try {
    const savededucation = await education.save();
    res.status(200).json(savededucation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update an education
router.put("/education/:id", async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    if (education.userId === req.body.userId) {
      await education.updateOne({ $set: req.body });
      res.status(200).json("the education has been updated");
    } else {
      res.status(403).json("you can update only your education");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete an education

router.delete("/education/:id", async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    if (education.userId === req.body.userId) {
      await education.deleteOne();
      res.status(200).json("the education has been deleted");
    } else {
      res.status(403).json("you can delete only your education");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// working with the experience

// get a user experience

router.get("/experience/:userId", async (req, res) => {
  try {
    const experience = await Experience.find({
      userId: req.params.userId
    });
    res.status(200).json(experience);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creating a new experience
router.post("/experience", async (req, res) => {
  const experience = new Experience(req.body);
  try {
    const savedexperience = await experience.save();
    res.status(200).json(savedexperience);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update an experience
router.put("/experience/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (experience.userId === req.body.userId) {
      await experience.updateOne({ $set: req.body });
      res.status(200).json("the experience has been updated");
    } else {
      res.status(403).json("you can update only your experience");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete an experience

router.delete("/experience/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (experience.userId === req.body.userId) {
      await experience.deleteOne();
      res.status(200).json("the experience has been deleted");
    } else {
      res.status(403).json("you can delete only your experience");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
