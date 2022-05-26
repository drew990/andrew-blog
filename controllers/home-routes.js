const router = require("express").Router();
const { Comment, Post, User } = require("../models");
// Import the custom middleware
const withAuth = require("../utils/auth");

// GET all Post for homepage
router.get("/", async (req, res) => {
  Post.findAll({
    include: [{ model: User }],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.report.get({ plain: true }));
      console.log(posts);

      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/dashboard", withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: Comment,
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const post = dbPostData.map((post) => post.get({ plain: true }));
      res.render("dashboard", { post, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// router.get('/', async (req, res) => {
//   try {
//     const dbGalleryData = await Gallery.findAll({
//       include: [
//         {
//           model: Painting,
//           attributes: ['filename', 'description'],
//         },
//       ],
//     });

//     const galleries = dbGalleryData.map((gallery) =>
//       gallery.get({ plain: true })
//     );

//     res.render('homepage', {
//       galleries,
//       loggedIn: req.session.loggedIn,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

// // GET one gallery
// // Use the custom middleware before allowing the user to access the gallery
// router.get('/gallery/:id', withAuth, async (req, res) => {
//   try {
//     const dbGalleryData = await Gallery.findByPk(req.params.id, {
//       include: [
//         {
//           model: Painting,
//           attributes: [
//             'id',
//             'title',
//             'artist',
//             'exhibition_date',
//             'filename',
//             'description',
//           ],
//         },
//       ],
//     });

//     const gallery = dbGalleryData.get({ plain: true });
//     res.render('gallery', { gallery, loggedIn: req.session.loggedIn });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

// // GET one painting
// // Use the custom middleware before allowing the user to access the painting
// router.get('/painting/:id', withAuth, async (req, res) => {
//   try {
//     const dbPaintingData = await Painting.findByPk(req.params.id);

//     const painting = dbPaintingData.get({ plain: true });

//     res.render('painting', { painting, loggedIn: req.session.loggedIn });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

// router.get('/login', (req, res) => {
//   if (req.session.loggedIn) {
//     res.redirect('/');
//     return;
//   }

//   res.render('login');
// });

module.exports = router;
