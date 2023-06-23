const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // 암호 관련 모듈


// 유저 스키마(모델의 구조)
const userSchema = new Schema({
    // 아이디
    username: { type: String, required: true, minLength: 3, maxLength: 100 },
    // 비밀번호
    password: { type: String, minLength: 5 },
    // 비밀번호 암호화에 사용되는 키
    salt: { type: String },
    // 이메일
    email: { type: String, required: true, maxLength: 100 },
    // 사용자 이름
    fullName: { type: String },
    // 프로필 사진
    avatar: { type: String, default: 'default.png' }, // default : 설정하지 않았을 때 기본값(기본설정)
    // 자기소개
    bio: { type: String },
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

// 유저의 오퍼레이션(Operation)-모델이 하는일

// 1 로그인 토큰 생성
userSchema.methods.generateJWT = function () {
    // 로그인 토근 생성에 username을 사용한다
    // SECRET을 사용하여 토큰을 생성한다
    return jwt.sign({ username: this.username }, process.env.SECRET);
  }
// 2 비밀번호 암호화
userSchema.methods.setPassword = function (password) {
    // 암호화에 사용하는 키
    this.salt = crypto
        .randomBytes(16).toString("hex");

    // 해시함수(sha256)를 사용한 단방향 암호화
    this.password = crypto
        // pbkdf2: 비밀번호 암호화에 사용하는 알고리즘
        // Sync: 동기
        .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")
        .toString("hex")
}
// 해시함수(sha256)를 사용한 단방향 암호화(복호화가 안된다. 양방향함수는 복호화 가능)
// 비밀번호는 단방향으로 설정하는 것이 좋음(유출을 막기 위함.)

// 3 비밀번호 일치 여부 검사
userSchema.methods.checkPassword = function (password) {
    // 유저 생성에 사용되었던 salt를 가지고 로그인시 입력받은 비밀번호를 암호화한다
    // salt는 유저마다 고유함
    const hashedPassword = crypto
        .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")
        .toString("hex")

        return this.password === hashedPassword;
}

// 컬렉션 조인 (클라이언트 요청에 의하기 위한 데이터 가공)
userSchema.virtual('isFollowing', {
    ref: 'Follow', // Follow 컬렉션과 조인
    localField: '_id',
    foreignField: 'following',
    justOne: true
})

module.exports = mongoose.model('User', userSchema);


