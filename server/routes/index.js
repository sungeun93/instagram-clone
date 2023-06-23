// 클라이언트의 요청과 클라우드 연결하는 역할


const express = require('express')
const router = express.Router();
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });
const jwtStrategy = require("../auth/jwtStrategy");
const articleController = require("../controllers/articleController");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");

passport.use(jwtStrategy);



/* INDEX */
// router.HTTPRequestMethod(URL, Controller)
router.get('/', (req, res) => {
  // req(request): 요청 객체
  // res(response): 응답 객체

  // 서버의 응답
  res.json({message: "API Server - INDEX PAGE"});
})


/* USERS */
router.post('/users', userController.create); 
router.put('/user', auth, userController.update); 
router.post('/user/login', userController.login); 

/* ARTICLES */
router.get('/feed', auth, articleController.feed) 
router.get('/articles', auth, articleController.find)
router.post('/articles', auth, articleController.create)  
router.get('/articles/:id', auth, articleController.findOne)
router.delete('/articles/:id', auth, articleController.delete) 
router.post('/articles/:id/favorite', auth, articleController.favorite) 
router.delete('/articles/:id/favorite', auth, articleController.unfavorite)

/* COMMENTS */
router.get('/articles/:id/comments', auth, commentController.find) 
router.post('/articles/:id/comments', auth, commentController.create) 
router.delete('/comments/:id', auth, commentController.delete) 

/* PROFILES */
router.get('/profiles', auth, profileController.find); 
router.get('/profiles/:username', auth, profileController.findOne)
router.post('/profiles/:username/follow', auth, profileController.follow) 
router.delete('/profiles/:username/follow', auth, profileController.unfollow)

module.exports = router;

