// 파일 처리할 라이브러리

const multer = require('multer');
const path = require('path');

module.exports = function fileHandler(dest) {
    return multer ({
        // storage: 파일 이름 생성, 파일 저장 경로 설정
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                // 파일 저장 경로 설정
                cb(null, `${__dirname}/../files/${dest}/`); // __dirname: 현재 파일의 경로
            },
            // 파일 이름 생성
            filename: (req, file, cb) => {
                // ext(extension): 파일의 확장자
                const ext = path.extname(file.originalname);

                // 파일의 랜덤이름 생성
                cb(null, Date.now() + ext);
            }
        }),
        // fileFilter
        fileFilter: (req, file, cb) => {
            // 확장자(extension)
            const ext = path.extname(file.originalname);
            
            // 확장자 검사
            if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
                return cb(null, true);
            }

            // 잘못된 확장자의 파일인 경우 에러 처리
            const err = new TypeError('This type of file is not acceptable.');
            cb(err);
        },
        // limits (파일 제한)
        limits: {
            fileSize: 1e7, // 파일 사이즈 제한(10MB까지만 업로드 가능)
            // 1e7: 0이 7개 
            files: 10 // 개수 제한(10개 까지만 업로드 가능)
        }
    })
}

