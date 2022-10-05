const router = require("express").Router();
const User = require("../models/users");
const Project = require("../models/project");

router.get("/:string", async (req, res) => {
  const string = req.params.string;
  try {
    const user = await User.find({
      $or: [
        { firstName: { $regex: `.*${string}.*` } },
        { secondName: { $regex: `.*${string}.*` } },
      ],
    });

    const project = await Project.find({
      $or: [
        { name: { $regex: `.*${string}.*` } },
        {
          categorie: { $regex: `.*${string}.*` },
        },
        {
          subCategorie: { $regex: `.*${string}.*` },
        },
      ],
    });
    res.status(200).json({ user: user, project: project });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
