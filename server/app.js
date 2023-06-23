// 필요한 모듈을 가져온다
const express = require("express");
const createError = require('http-errors');
const cookieParser = require("cookie-parser");
const logger = require('morgan');
const cors = require("cors");
const indexRouter = require("./routes/index");
const app = express();
const mongoose = require("mongoose");
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

// 데이터베이스 연결
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGODB_URI)
    .catch(err => console.log(err));

// 모듈 적용
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin" }));
app.use(compression()); // Compress all routes
app.use(cors());

// 파일 저장경로 설정
// 앱에서 사용할 파일 저장(기본 경로)
app.use('/api/static', express.static('public'));
// 클라이언트가 전송한 파일을 저장할 경로
app.use('/api/files', express.static('files'));

// 라우터의 prefix 설정
app.use('/api', indexRouter);

// 404 에러 처리
app.use((req, res, next) => {
    next(createError(404))
  })

// 에러 핸들러(앱에서 발생할 모든 에러를 처리함)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json(err); 
})

// 앱을 exports 한다
module.exports = app;



