var express = require('express');
var router = express.Router();
const userModel = require("../db/users");
const postModel = require("../db/post");
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require("../utils/multer");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {nav : false});
});

router.get('/register', (req, res, next) => {
  res.render('register', { nav: false });
});

router.get('/profile', isLoggedIn, async (req, res, next) => {
  const user = await userModel
          .findOne({username : req.session.passport.user})
          .populate("posts");
  res.render('profile', {user, nav :true});
});

router.get('/show/posts', isLoggedIn, async (req, res, next) => {
  const user = await userModel
          .findOne({username : req.session.passport.user})
          .populate("posts");
  res.render('show', {user, nav :true});
});

router.get('/feed', isLoggedIn, async (req, res, next) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts = await postModel.find().populate("user");
  res.render('feed', { user, posts, nav: true });
});


router.get('/add', isLoggedIn, async (req, res, next) => {
  const user = await userModel.findOne({username : req.session.passport.user});
  res.render('add', {user, nav :true});
});

router.post('/createpost', isLoggedIn, upload.single("postimage"), async (req, res, next) => {
  const user = await userModel.findOne({username : req.session.passport.user});
  const post = await postModel.create({
    user : user._id,
    title : req.body.title,
    description : req.body.description,
    image : req.file.filename
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile")
});

router.post('/fileupload', isLoggedIn, upload.single("image"), async (req, res, next) => {
  const user  = await userModel.findOne({username : req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

router.post('/register', function(req, res, next) {
  const data = new userModel({
    username : req.body.username,
    email : req.body.email,
    contact : req.body.contact,
  })

  userModel.register(data, req.body.password)
  .then(() => {
    passport.authenticate("local")(req, res , () => {
      res.redirect("/profile")
    })
  })
});

router.post('/login', passport.authenticate("local", {
  failureRedirect : "/",
  successRedirect : "/profile"
}), function(req, res, next) {});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if(err) { return next(err);}
    res.redirect("/")
  })
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/")
  }
}

module.exports = router;
