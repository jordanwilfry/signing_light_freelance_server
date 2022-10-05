const router = require("express").Router();
const Message = require("../models/messages");

//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  console.log(newMessage);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/last/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages[messages.length -1]);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
