const router = require("express").Router();
const Conversation = require("../models/conversations");

//new conv

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.currentUser, req.body.otherUser],
    productId: req.body.productId,
  });
  console.log(req.body.currentUser);
  console.log(req.body.otherUser);
  console.log(req.body.productId);

  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.body.currentUser, req.body.otherUser] },
      productId: req.body.productId,
    });

    console.log(conversation);

    if (!conversation) {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } else {
      res.status(200).json(conversation);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get conversation of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conversation includes two userId

router.get("/find/:firstUserId/:secondUserId/:productId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      productId: req.params.productId
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
