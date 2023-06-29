import { useState, useEffect, useContext } from "react";
import ArticleTemplate from "./ArticleTemplate";
import { getFeed, deleteArticle, favorite, unfavorite } from "../utils/requests";
import Spinner from "./Spinner";

const limit = 5;

export default function Feed() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState([]);
    // 건널 뛸 도큐먼트의 수
    const [skip, setSkip] = useState(0);
    const [articleCount, setArticleCount] = useState(0);

    // 서버 요청 (피드 가져오기)
    useEffect(() => {
        setError(null);
        setIsLoaded(false);

        getFeed(skip)
        .then(data => {
            setArticleCount(data.articleCount);

            let updatedArticles = [...articles, ...data.articles];
            setArticles(updatedArticles);
        })
        .catch(error => {
            setError(error);
        })
        .finally(() => setIsLoaded(true))
    }, [skip])

    console.log(articles) // key state 추적

    // 좋아요 처리
    async function handleFavorite(id) {
        try {
            // 서버 요청
            await favorite(id);

            const updatedArticles = articles.map(article => {
                if(article.id === id) {
                    return {
                        ...article,
                        isFavorite: true,
                        favoriteCount: article.favoriteCount + 1
                    }
                }
                return article;
            })

            // articles 업데이트
            setArticles(updatedArticles);

        } catch (error) {
            alert(error)
        }
    };

    // 좋아요 취소 처리
    async function handleUnfavorite(id) {
        try {
            // 서버 요청
            await unfavorite(id)

            const updatedArticles = articles.map(article => {
                if (article.id === id) {
                    return {
                        ...article,
                        isFavorite: false,
                        favoriteCount: article.favoriteCount - 1
                    }
                }
                return article;
            })

            // articles 업데이트
            setArticles(updatedArticles);

        } catch (error) {
            alert(error)
        }
    };

    // 게시물 삭제 처리
    async function handleDelete(id) {
        try {
            // 서버 요청
            await deleteArticle(id);

            const remainingArticles = articles.filter(article => {
                if (id !== article.id) {
                    return article;
                }
            });

            // articles 업데이트
            setArticles(remainingArticles);

        } catch (error) {
            alert(error)
        }
    };

    // 게시물 리스트
    const articleList = articles.map(article => (
        <li key={article.id} className="border-b pb-4">
            <ArticleTemplate 
             article={article}
             handleFavorite={handleFavorite}
             handleUnfavorite={handleUnfavorite}
             handleDelete={handleDelete}
            />
        </li>
    ))

    // 더보기 버튼
    // articleCount > limit: 게시물의 총 갯수가 limit보다 크다
    // articleCount > articles.length: 더 가져올 게시물이 있다    
    // 두 조건을 만족해야 더보기 버튼이 나타남
    const moreButton = (articleCount > limit && articleCount > articles.length) && (
        <div className="flex justify-center my-2">
            <button
             className="p-1 text-blue-500 font-semibold"
             onClick={() => setSkip(skip + limit)}
            >
                More
            </button>
        </div>
    )

    return (
        <>
            <ul className=""> 
                {articleList}
            </ul>

            {isLoaded ? moreButton : <Spinner />}
            {error && <p className="text-red-500">{error.message}</p>}
        </>
    )
};