import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleTemplate from "./ArticleTemplate";
import { getArticle, deleteArticle, favorite, unfavorite } from "../utils/requests";
import Spinner from "./Spinner";

export default function ArticleView() {
    // 요청할 게시물의 id
    const {id} = useParams();
    const [article, setArticle] = useState(null);
    const navigate = useNavigate();

    // 서버 요청(게시물 가져오기 요청)
    useEffect(() => {
        getArticle(id)
        .then(data => {
            setArticle(data.article);
            console.log(data);
        })
        // 요청 실패
        .catch(error => {
            navigate('/notfound', {replace: true});
        })
    }, [])

    // 좋아요 처리
    async function handleFavorite(id) {};

    // 좋아요 취소 처리
    async function handleUnfavorite(id) {};

    // 게시물 삭제 처리
    async function handleDelete(id) {};

    if (!article) {
        return <Spinner />
    }

    return (
        <ArticleTemplate
          article={article}
          handleFavorite={handleFavorite}
          handleUnfavorite={handleUnfavorite}
          handleDelete={handleDelete}
        />
    )
};