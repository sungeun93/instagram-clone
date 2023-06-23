// 샘플 데이터설정 부분

// 명령어의 인자(argument) 부분을 추출한다
const userArgs = process.argv.slice(2);
const mongoose = require('mongoose');
const User = require('./models/User');
const Article = require('./models/Article');

// 유효한 데이터베이스 주소가 아닌 경우
if (!userArgs[0].startsWith('mongodb')) { // startWith: 문자 메서드
    console.log('ERROR: You need to specify a valid mongodb URL');
    return;
}

seedDatabase();

// 샘플 데이터를 생성하는 함수
async function seedDatabase() {
    try {
        // 데이터베이스 주소
        const MONGODB_URI = userArgs[0];
        // 데이터베이스에 연결한다
        await mongoose.connect(MONGODB_URI);

        // 생성할 유저 리스트
        const users = [
            {
                username: 'cat',
                email: 'cat@example.com',
                fullName: 'Kitty',
                avatar: 'cat.jpeg',
                bio: 'Meow',
            },
            {
                username: 'dog',
                email: 'dog@example.com',
                fullName: 'Mr.Loyal',
                avatar: 'dog.jpeg',
                bio: 'Bark',
            },
            {
                username: 'bird',
                email: 'bird@example.com',
                fullName: 'Blue and White',
                avatar: 'bird.jpeg',
                bio: '',
            }
        ]

        // 유저 도큐먼트를 생성한다(실제 유저 생성부분)
        for (let i = 0; i < users.length; i++) {
            const user = new User(); // 모델의 인스턴스를 만든다
            user.username = users[i].username;
            user.email = users[i].email;
            user.fullName = users[i].fullName;
            user.avatar = users[i].avatar;
            user.bio = users[i].bio;

            await user.save(); // 변경사항을 저장한다(save메서드를 호출해야 저장된다)

            console.log(user);
        }

        // 샘플 게시물 생성
        for (let i = 1; i <= 4; i++) {
            // 유저 컬렉션에서 username이 cat인 도큐먼트를 검색한다
            const user = await User.findOne({username: 'cat'});

            // Article의 인스턴스 생성
            const article = new Article();
            article.photos = [`${i}.jpeg`];
            article.description = `cat photos ${i}`;  
            article.author = user._id; // 유저의 id

            await article.save(); // 변경사항을 저장한다

            console.log(article);
        }

        // 데이터베이스 연결을 종료
        mongoose.connection.close();

    } catch(error) {
        console.error(error)
    }
}





