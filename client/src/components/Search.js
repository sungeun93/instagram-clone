import { useState, useEffect, useRef } from "react";
import { getProfiles } from "../utils/requests";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

export default function Search() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    // 프로필 리스트 저장
    const [profiles, setProfiles] = useState([]);
    const inputEl = useRef(null);

    console.log(profiles)// key state 추적

    // 검색 input 변경 처리
    async function handleChange(e) {
        try {
            // 검색어
            const username = e.target.value;

            // 검색어가 없는 경우 프로필 리스트를 비운다
            if (!username) {
                return setProfiles([]);
            }

            setError(null);
            setIsLoaded(false);

            // 서버 요청(프로필 리스트 가져오기)
            const {profiles} = await getProfiles(username);

            // profiles 업데이트
            setProfiles(profiles);

            setIsLoaded(true);

        } catch (error) {
            setError(error)
        }
    };

    // 처음 페이지 팡문 시 검색창에 focus가 되게 한다
    useEffect(() => {
        // useRef: 실제 엘리먼트(HTML의 엘리먼트)에 접근할 수 있다
        inputEl.current.focus();
    })

    return (
        <div className="px-4">
            <h3 className="text-lg font-semibold my-4">검색</h3>
            <label className="block mb-4">
                <input 
                 type="text"
                 className="border px-2 py-1 rounded w-full"
                 onChange={handleChange}
                 placeholder="검색"
                 ref={inputEl}
                />
            </label>

            <Result 
                error={error} 
                isLoaded={isLoaded} 
                profiles={profiles}
            />
        </div>
    )
};

// 검색 결과
function Result({error, isLoaded, profiles}) {
    if (error) {
        return <p className="text-red-500">{error.message}</p>
    }

    if (!isLoaded) {
        return <Spinner />
    }

    const profileList = profiles.map(profile => (
        <li key={profile.username} className="flex items-center justify-between my-2">
            <Link
              to={`/profiles/${profile.username}`}
              className="flex items-center"
            >
                <img
                  src={`${process.env.REACT_APP_SERVER}/files/profiles/${profile.avatar}`}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <div className="ml-2">
                  <span className="block font-semibold">
                      {profile.username}
                  </span>
                  <span className="block text-gray-400 text-sm">
                      {profile.fullName}
                  </span>
                </div>
            </Link>
            {/* 팔로잉 중인 경우 */}
            {profile.isFollowing && (
                <div className="ml-2 text-sm text-blue-500 font-semibold">팔로잉</div>
            )}
        </li>
    ))

    return (
        <ul>
            {profileList}
        </ul>
    )
};