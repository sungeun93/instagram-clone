const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');
const Favorite = require('../models/Favorite');
const fileHandler = require('../utils/fileHandler');

// 퍼드 가져오기
exports.feed = async(req, res, next) => {};

// 게시물 리스트 가져오기
exports.find = async(req, res, next) => {
    try {
        // 검색 조건
        const where = {} 
        // 한 번에 전송할 도큐먼트의 갯수
        const limit = req.query.limit || 9 
        // 건너뛸 도큐먼트의 갯수
        const skip = req.query.skip || 0

        // req.query: 클라이언트의 요청
        if ('username' in req.query) { // 특정 유저의 게시물=타임라인
            // 클라이언트가 요청한 username으로 유저를 검색한다
            const user = await User.findOne({username: req.query.username});
            // 조건 추가
            where.author = user._id;
        }

        // 게시물 검색 부분
        // count: 해당하는 도큐먼트의 갯수를 구한다
        const articleCount = await Article.count(where);

        // 도큐먼트
        const articles = await Article
            .find(where, 'photos favoriteCount created') // find(검색조건, 검색필드) - 조건에서 where객체 사용
            .populate({ // 컬렉션 조인
                path: 'commentCount' // 게시물의 댓글 갯수 파악
            })
            .sort({created: 'desc'}) // 생성일 기준 내림차순 정렬(sort)
            .limit(limit)
            .skip(skip)

        // 클라이언트에게 전송
        res.json({articles, articleCount})

    } catch (error) {
        next(error)
    }
};

// 게시물 상세보기
exports.findOne = async(req, res, next) => {
    try {

        const article = await Article
            .findById(req.params.id) // 클라이언트가 요청한 id로 게시물을 검색한다
            .populate({ // 컬렉션 조인
                path: 'author', // 유저(게시물 작성자) 정보
                select: 'username avatar' // 검색 필드
            })
            .populate({
                path: 'isFavorite' // 좋아요 여부
            })
            .populate({
                path: 'commentCount' // 댓글 갯수
            })

            // 게시물이 없을 경우
        if (!article) {
            const err = new Error("Article not found");
            err.status = 404; // 404 NotFound
            throw err;
        }

        // 검색한 게시물을 전송한다
        res.json({article});

    } catch (error) {
        next(error)
    }
};

// 게시물 생성
exports.create = [
    // 파일 처리 (사진)
    fileHandler('articles').array('photos'),
    async (req, res, next) => {
      try {
        // req.files: 클라이언트가 전송한 파일
        const files = req.files;
  
        // 파일이 없을 경우
        if (files.length < 1) {
          const err = new Error('File is required');
          err.status = 400; // 400 BadRequest
          throw err;
        }
  
        const photos = files.map(file => file.filename);
  
        // article 도큐먼트를 생성한다
        const article = new Article({
          photos,
          description: req.body.description,
          author: req.user._id
        });
  
        await article.save();
  
        // 전송
        res.json({ article });
  
      } catch (error) {
        next(error)
      }
    }
]

// 게시물 삭제
exports.delete = async(req, res, next) => {
    try {
        // 클라이언트가 전송한 id로 게시물을 검색한다
        const article = await Article.findById(req.params.id);

        // 게시물이 존재하지 않을 경우
        if (!article) {
            const err = new Error("Article not found")
            err.status = 404; // 404 NotFound
            throw err;
        }

        //  본인 게시물이 아닌 경우 삭제 불가(로그인 유저 !== 게시물 작성 유저)
        if (req.user._id.toString() !== article.author.toString()) {
            const err = new Error("Author is not correct")
            err.status = 400;
            throw err;
        }

        await article.deleteOne(); // 게시물 삭제 처리

        // 삭제한 게시물을 전송한다
        res.json({article});

    } catch (error) {
        next(error)
    }
};

// 좋아요 처리
exports.favorite = async(req, res, next) => {
    try {
        // 클라이언트가 전송한 id로 게시물을 검색한다
        const article = await Article.findById(req.params.id);
        
        // 게시물이 없을 경우
        if (!article) {
            const err = new Error("Article not found");
            err.status = 404;
            throw err;
        }
        
        // 이미 좋아요한 게시물인 경우
        const _favorite = await Favorite
            .findOne({user: req.user._id, article: article._id})

        // 처음 좋아요하는 게시물일 경우
        if (!_favorite) {
            // Favorite 도큐먼트를 생성한다
            const favorite = new Favorite({
                user: req.user._id,
                article: article._id
            })
            await favorite.save();

            // 게시물의 좋아요 갯수를 1 증가시킨다
            article.favoriteCount++;
            await article.save();
        }

        // 좋아요 처리 게시물 전송
        res.json({article})

    } catch (error) {
        next(error)
    }
};

// 좋아요 취소 처리
exports.unfavorite = async (req, res, next) => {
    try {
      // 게시물 검색
      const article = await Article.findById(req.params.id);
  
      // 게시물이 없는 경우
      if (!article) {
        const err = new Error("Article not found");
        err.status = 404;
        throw err;
      }
  
      // 좋아요 한 게시물인지 확인
      const favorite = await Favorite
        .findOne({ user: req.user._id, article: article._id });
  
      // 좋아요 한 게시물이면 좋아요 취소  
      if (favorite) {
        // 도큐먼트 삭제
        await favorite.deleteOne();
  
        // 게시물의 좋아요 개수 1 감소
        article.favoriteCount--;
        await article.save();
      }
  
      // 처리완료된 게시물
      res.json({ article });
  
    } catch (error) {
      next(error)
    }
  }
