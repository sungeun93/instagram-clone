import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { updateUser } from "../utils/requests";
import AuthContext from "./AuthContext";

export default function Accounts() {
    // 로그인 유저
    const {user, setUser} = useContext(AuthContext);
    // 변경사항을 저장할 객체 (업데이트된 유저)
    const [updatedUser, setUpdatedUser] = useState({});

    // 폼 제출처리
    async function handleSubmit(e) {
        try {
            e.preventDefault();

            console.log(updatedUser); // 업데이트된 유저를 서버에 전송한다

            // 폼데이터에 updatedUser 데이터를 추가한다
            const formData = new FormData();

            Object.keys(updatedUser).forEach(prop => { // forEach: 반복문
                // FormData.append(key, value): 폼데이터에 데이터를 추가하는 메서드
                formData.append(prop, updatedUser[prop]);
            }) // 파일이 있기 때문에 formData이용

            // 서버 전송
            const data = await updateUser(formData);

            // user를 응답객체로 업데이트한다
            setUser(data.user);

            // 변경사항을 초기화한다
            setUpdatedUser({});

            // 성공 메시지
            alert("수정되었습니다")

        } catch (error) {
            alert(error)
        }
    };

    // 파일 처리
    async function handleFile(e) {
        const file = e.target.files[0];

        if (file) {
            setUpdatedUser({...updatedUser, avatar: file});
        }
    };

    // 입력란 처리
    function handleChange(e) {
        // e.target: 현재 입력중인 input
        const name = e.target.name;
        const value = e.target.value;

        console.log(name, value);

        // 수정을 취소한 경우
        if (user[name] === value) {
            // user[name]: 현재 로그인 유저의 정보(원래값)
            // value: 새롭게 입력한 값
            const {[name]: value, ...rest} = updatedUser;
            return setUpdatedUser(rest);
            // rest변수: 구조분해할당에서 사용하는 변수. 나머지 값들을 저장할 때 사용하는 변수
        }

        // updatedUser의 속성을 업데이트한다
        setUpdatedUser({...updatedUser, [name]: value});
    };

    // 타이틀 업데이트
    useEffect(() => {
        document.title = "프로필 수정 - Instagram"
    }, []);

    // 변경사항 추적
    console.log(updatedUser);

    return (
        <div className="mt-8 px-4">
            {/* 변경사항이 생겼을 경우 나타나는 메시지 */}
            {Object.keys(updatedUser).length > 0 && (
                <p className="mb-4 bg-blue-500 text-white px-2 py-1">
                    변경사항을 저장하려면 저장 버튼을 클릭하세요
                </p>
            )}

            {/* 프로필 이미지 */}
            <div className="flex mb-4">
                <img
                  src={updatedUser.avatar ? URL.createObjectURL(updatedUser.avatar) : `${process.env.REACT_APP_SERVER}/files/profiles/${user.avatar}`}
                  className="w-16 h-16 object-cover rounded-full border"
                />
                <div className="flex flex-col grow items-start ml-4">
                    <h3>{user.username}</h3>

                    <label className="text-sm font-semibold text-blue-500 cursor-pointer">
                        <input 
                         type="file"
                         className="hidden"
                         onChange={handleFile}
                         // 업로드할 수 있는 파일의 포맷을 필터링 한다
                         accept="image/png, image/jpg, image/jpeg"
                        />
                        사진 업로드
                    </label>
                </div>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit}>
                {/* 이름 입력란 */}
                <div className="mb-2">
                    <label htmlFor="fullName" className="block font-semibold">이름</label>
                    <input 
                     type="text"
                     id="fullName"
                     name="fullName"
                     className="border px-2 py-1 rounded w-full"
                     defaultValue={user.fullName}
                     onChange={handleChange}
                    />
                </div>

                {/* 아이디 입력란 */}
                <div className="mb-2">
                    <label htmlFor="username" className="block font-semibold">아이디</label>
                    <input 
                     type="text"
                     id="username"
                     name="username"
                     className="border px-2 py-1 rounded w-full read-only:bg-gray-100"
                     defaultValue={user.username}
                     onChange={handleChange}
                    />
                </div>

                {/* 이메일 입력란 */}
                <div className="mb-2">
                    <label htmlFor="email" className="block font-semibold">이메일</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className="border px-2 py-1 rounded w-full read-only:bg-gray-100"
                      defaultValue={user.email}
                      onChange={handleChange}
                    />
                </div>

                {/* 자기소개 */}
                <div className="mb-2">
                    <label htmlFor="bio" className="block font-semibold">자기소개</label>
                    <textarea
                      id="bio"
                      rows="3"
                      name="bio"
                      className="border px-2 py-1 rounded w-full"
                      defaultValue={user.bio}
                      onChange={handleChange}
                    />
                </div>

                <div className="flex">
                    <button
                      type="submit"
                      className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 disabled:opacity-[0.2]"
                      disabled={Object.keys(updatedUser).length < 1}
                    >
                      저장
                    </button>
                    <Link
                      to={`/profiles/${user.username}`}
                      className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 ml-2"
                    >
                      취소
                    </Link>
                </div>


            </form>

        </div>
    )
};