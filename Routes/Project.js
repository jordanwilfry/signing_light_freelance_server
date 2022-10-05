const router = require("express").Router();
const Project = require("../models/project");
const User = require("../models/users");
const responses = require("../models/responses");
const AllCat = require("../models/AllCat");
const Categorie = require("../models/categorie")

//create a Project
router.post("/", async (req, res) => {
  const newProject = new Project({
    userId : req.body.userId,
    smallDesc : req.body.smallDescription,
    about : req.body.description,
    image : req.body.image,
    detail : req.body.detail,
    name : req.body.name,
    deliveryTime : req.body.deliveryTime,
    price : req.body.price,
    categorie : req.body.categorie,
    subCategorie : req.body.subCategorie,
  });
  try {
    console.log("he "+req.body.userId)
    const savedProject = await newProject.save();
    const user = await User.findById(req.body.userId);
    await user.updateOne({ $push: { completedProjects: savedProject._id } });
    res.status(200).json(savedProject);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//update a Project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.userId === req.body.userId) {
      await project.updateOne({ $set: req.body });
      res.status(200).json("the project has been updated");
    } else {
      res.status(403).json("you can update only your project");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a Project/gig

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.userId === req.body.userId) {
      const user = await User.findById(req.body.userId);
      await user.updateOne({ $pull: { completedProjects: project._id } });
      await project.deleteOne();
      res.status(200).json("the project has been deleted");
    } else {
      res.status(403).json("you can delete only your project");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//star / unstart project

router.put("/:id/star", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project.star.includes(req.body.userId)) {
      await project.updateOne({ $push: { star: req.body.userId } });
      res.status(200).json("The project has been stared");
    } else {
      await project.updateOne({ $pull: { star: req.body.userId } });
      res.status(200).json("The project has been unstared");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/stared/:userId", async (req, res) => {
  try {
    const project = await Project.find({star: { $in : [req.params.userId]}});
    res.status(200).json(project)
  } catch (err) {
    res.status(500).json(err);
  }
});

// working with responses and all around responses the id's that will be used are posts id's
// respond to  a project
router.post("/response", async (req, res) => {
  const newRespond = new responses(req.body);
  try {
    const savedComment = await newRespond.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update your respond
router.get("/response/:projectId", async (req, res) => {
  //here we used the post id
  try {
    const response = await responses.find({
      projectId : req.params.projectId
    });
    
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json(err);
  }
});

// update your respond
router.put("/response/:id", async (req, res) => {
  //here we used the post id
  try {
    const response = await responses.findById(req.params.id);
    if (response.senderId === req.body.userId) {
      await response.updateOne({ $set: req.body });
      res.status(200).json("the response has been updated");
    } else {
      res.status(403).json("you can update only your response");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//response to a respond
router.put("/response/:id/respond", async (req, res) => {
  //here we used the post id
  try {
    const response = await responses.findById(req.params.id);

    await response.updateOne({ response: req.body.response });
    res.status(200).json("the response has been added");
  } catch (err) {
    res.status(500).json(err);
  }
});

//update to a respond
router.put("/response/:id/respond/update", async (req, res) => {
  //here we used the post id
  try {
    const response = await responses.findById(req.params.id);
    if (response.response) {
      await response.updateOne({ response: req.body.response });
      res.status(200).json("the response has been updated");
    } else {
      res.status(403).json("you can't update a response you didn't do");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a respond
router.put("/response/:id/respond/delete", async (req, res) => {
  //here we used the post id
  try {
    const response = await responses.findById(req.params.id);
    if (response.senderId === req.body.userId) {
      await response.updateOne({ response: "" });
      res.status(200).json("the response has been deleted");
    } else {
      res.status(403).json("you can delete only your response");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like and dislike a response

router.put("/response/:id/like", async (req, res) => {
  try {
    const response = await responses.findById(req.params.id);
    if (!response.likes.includes(req.body.userId)) {
      await response.updateOne({ $push: { likes: req.body.userId } });
      if (response.unLikes.includes(req.body.userId)) {
        await response.updateOne({ $pull: { unLikes: req.body.userId } });
      }
      res.status(200).json("The response has been liked");
    } else {
      await response.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The response has been unliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/response/:id/dislike", async (req, res) => {
  try {
    const response = await responses.findById(req.params.id);
    if (!response.unLikes.includes(req.body.userId)) {
      await response.updateOne({ $push: { unLikes: req.body.userId } });
      if (response.likes.includes(req.body.userId)) {
        await response.updateOne({ $pull: { likes: req.body.userId } });
      }
      res.status(200).json("The response has been disliked");
    } else {
      await response.updateOne({ $pull: { unLikes: req.body.userId } });
      res.status(200).json("The response has been undisliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete your response
router.delete("/response/:id", async (req, res) => {
  try {
    const response = await responses.findById(req.params.id);
    if (response.userId === req.body.userId) {
      await response.deleteOne();
      res.status(200).json("the response has been deleted");
    } else {
      res.status(403).json("you can delete only your response");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Back to the project itself
//get a project

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all projects

router.get("/all/projects", async (req, res) => {
  try {
    const project = await Project.find();
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/in/:categorie", async (req, res) => {
  try {
    const project = await Project.find({
      categorie: { $in: [req.params.categorie] },
    });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get project in sub categorie
router.get("/in/sub/:subCategorie", async (req, res) => {
  try {
    const project = await Project.find({
      subCategorie: { $in: [req.params.subCategorie] },
    });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// all categories project
router.get("/category/all", async (req, res) => {
  try{
    const categorie = await Categorie.find();
    res.status(200).json(categorie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// AllCat project
router.get("/AllCatId/:categorieId", async (req, res) => {
  try {
    const allcat = await AllCat.find({
      categorieId: req.params.categorieId
    });
    res.status(200).json(allcat);
  } catch (err) {
    res.status(500).json(err);
  }
});

// AllCat project
router.get("/AllCat/:categorie", async (req, res) => {
  try {
    const allcat = await AllCat.find({
      categorie: req.params.categorie
    });
    res.status(200).json(allcat);
  } catch (err) {
    res.status(500).json(err);
  }
});

// AllCat project
router.get("/AllSubCat/:subCategorie", async (req, res) => {
  try {
    const allSubcat = await AllCat.find({
      subCategorie: req.params.subCategorie
    });
    res.status(200).json(allSubcat);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all project

router.get("/profile/:Id", async (req, res) => {
  try {
    // const user = await User.findOne({ Id: req.params.Id });
    const project = await Project.find({ userId: req.params.Id });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
