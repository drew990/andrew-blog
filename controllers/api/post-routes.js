const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// GET Gets all the post
router.get("/", (req, res) => {
  Post.findAll({
    model: User,
    attributes: { exclude: ["[password]"] },
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST creates a post
router.post("/", (req, res) => {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
