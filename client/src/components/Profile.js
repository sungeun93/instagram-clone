import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import ArticleCreate from "./ArticleCreate";
import Timeline from "./Timeline";
import { getProfile, getTimeline, follow, unfollow } from "../utils/requests";
import Spinner from "./Spinner";

export default function Profile() {
    // 요청주소로 전달된 username 매개변수
    const {username} = useParams();
    // user객체와 업데이트 메서드
    const {user, setUser} = useContext(AuthContext);
    // user.username: 로그인 유저의 username
    // username: 방문한 프로필 유저의 username
    // isMaster: 본인 프로필 방문시 true
    const isMaster = user.username === username;
    const [profile, setProfile] = useState(null);
    const [articles, setArticles] = useState(null);
    const [articleCount, setArticleCount] = useState(0);
    // 게시물 업로드 모달
    const [active, setActive] = useState(false);
    const navigate = useNavigate(); // 페이지 이동

    console.log(profile); // 변경사항 추적

    // 프로필 가져오기 요청
    useEffect(() => {
        setProfile(null);

        // 여러개의 프로미스 객체를 처리하는 함수
        // 한번에 여러개의 데이터를 서버에 요청할 때 사용할 수 있다
        Promise.all([
            getProfile(username), // 프로필 요청
            getTimeline(username) // 타임라인 요청
        ])
         .then(([profileData, timelineData]) => {
            setProfile(profileData.profile);
            setArticles(timelineData.articles);
            setArticleCount(timelineData.articleCount)
         })
         .catch(error => {
            // 에러 발생 시 사용불가 페이지로 이동시킨다
            navigate('/notfound', {replace: true});
         })
    }, [username])

    console.log(profile)
    console.log(articles)
    console.log(articleCount);

    // 로그아웃 처리
    function handlelSignOut() {};

    // 팔로우 처리
    async function handlefollow() {};

    // 언팔로우 처리
    async function handleUnfollow() {};

    // 타이틀 업데이트
    useEffect(() => {
        document.title = `${username} - Instagram`
    }, [])
};