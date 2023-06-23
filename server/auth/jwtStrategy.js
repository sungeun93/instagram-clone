// 인증 처리 라이브러리

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

require('dotenv').config();


// 옵션 객체
const opts = {};
// 요청 헤더로부터 로그인 토큰 추출
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// 토큰 해석에 사용할 SECRET(거꾸로 복구)
opts.secretOrKey = process.env.SECRET;

// 토큰처리 Strategy(방법) 생성
const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
    
        // 토큰에 담긴 username과 일치하는 유저를 검색한다
        const user = await User.findOne({ username: jwt_payload.username }); // ({검색조건})
  
        // 인증실패
        if (!user) {
        return done(null, false);
        }
      
        // 인증성공
        return done(null, user);
  
    } catch (err) {
        done(err, false);
    }
})
  
module.exports = jwtStrategy;

