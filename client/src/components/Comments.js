import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {getComments, createComment, deleteComment} from "../utils/requests"
import Spinner from './Spinner';

export default function Comments() {
    // 댓글을 가져올 게시물의 id
    const {id} = useParams();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    // 댓글 리스트
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);

    // 댓글 가져오기
    useEffect(() => {
        getComments(id)
        .then(data => {
            setComments([...comments, ...data.comments]);
            setCommentCount(data.commentCount);
        })
        .catch(error => {
            setError(error);
        })
        .finally(() => setIsLoaded(true));
    }, [])

    console.log(comments) // comments 변경사항 추적

    // 댓글 추가
    async function handleAddComment(content) {
        try {
            // 서버 요청
            const data = await createComment(id, content);

            // commentCount를 1 증가시킨다
            setCommentCount(commentCount + 1);

            // comments 업데이트
            const updatedComments = [data.comment, ...comments];
            setComments(updatedComments);

        } catch (error) {
            alert(error)
        }
    };

    // 댓글 삭제
    async function handleDelete(id) {
        try {
            // 서버 요청
            await deleteComment(id);

            const remainingComments = comments.filter(comment => comment.id !== id);

            // comments, commentCount 업데이트
            setComments(remainingComments);
            setCommentCount(commentCount -1);

        } catch (error) {
            alert(error)
        }
    };

    // 댓글 리스트
    const commentList = comments.map(comment => (
        <Comment 
         key={comment.id}
         comment={comment}
         handleDelete={handleDelete}
        />
    ))

    return (
        <div className="px-4">
            <h3 className="text-lg font-semibold my-4">댓글 보기</h3>
            <Form handleAddComment={handleAddComment}/>

            {commentCount > 0 ? (
                <ul>
                    {commentList}
                </ul>
            ) : (
                <p className="text-center">첫번째로 댓글을 달아보세요</p>
            )}

            {!isLoaded && <Spinner />}
            {error && <p className="text-red-500">{error.message}</p>}
        </div>
    )
};

// 폼 컴포넌트
function Form({handleAddComment}) {
    // 댓글 내용
    const [content, setContent] = useState("");

    // 폼 제출 처리
    async function handleSubmit(e) {
        try {
            e.preventDefault();

            // 댓글 내용을 전달한다
            await handleAddComment(content);

            // 댓글 입력란을 비운다
            setContent("");

        } catch (error) {
            alert(error)
        }
    };


    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <textarea 
             rows="2"
             className="border w-full px-2 py-1 rounded"
             value={content}
             onChange={({target}) => setContent(target.value)}
            />
            <button
             type="submit"
             className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-[0.2]"
             disabled={!content.trim()}
            >
                댓글 달기
            </button>
        </form>
    )
};

// 댓글 컴포넌트
function Comment({comment, handleDelete}) {
    // 모달 관리
    const [active, setActive] = useState(false);

    // 삭제 처리
    async function handleClick() {
        try {
            await handleDelete(comment.id);

            // 댓글을 삭제하면 모달을 닫음
            setActive(false);

        } catch (error) {
            alert(error)
        }
    };

    // 모달 닫기
    function close(e) {
        // e.currentTarget: 오버레이
        if (e.target === e.currentTarget) {
            setActive(false);
        }
    }

    // 모달
    const modal = (
        <div className="fixed inset-0 flex justify-center items-center bg-black/[0.2] z-10" onClick={close}>
            <ul className="bg-white w-60 rounded-xl">
                <li className="border-b">
                    <button
                     className="w-full px-4 py-2 text-sm font-semibold text-red-500"
                     onClick={handleClick}
                    >
                        삭제
                    </button>
                </li>
                <li>
                    <button
                     className="text-sm font-semibold w-full px-4 py-2"
                     onClick={() => setActive(false)}
                    >
                        닫기
                    </button>
                </li>
            </ul>
        </div>
    )

    return (
        <li className="py-4 flex border-b">
            {/* 아바타 */}
            <div className="shrink-0">
                <Link to={`/profiles/${comment.author.username}`}>
                    <img 
                     src={`${process.env.REACT_APP_SERVER}/files/profiles/${comment.author.avatar}`}
                     className="w-8 h-8 object-cover border rounded-full"
                    />
                </Link>
            </div>

            {/* 댓글 내용 */}
            <div className="grow ml-4">
                <Link to={`/profiles/${comment.author.username}`} className="font-semibold">
                    {comment.content}
                </Link>
                <p>
                    <small className="font-xs text-gray-400">{comment.created}</small>
                </p>
            </div>

            {/* 더보기 버튼 */}
            <div className="shrink-0 ml-4">
                {active && modal}
                <svg
                  className="w-1 cursor-pointer"
                  onClick={() => setActive(true)}
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 128 512"
                  >
                  <path d="M64 360C94.93 360 120 385.1 120 416C120 446.9 94.93 472 64 472C33.07 472 8 446.9 8 416C8 385.1 33.07 360 64 360zM64 200C94.93 200 120 225.1 120 256C120 286.9 94.93 312 64 312C33.07 312 8 286.9 8 256C8 225.1 33.07 200 64 200zM64 152C33.07 152 8 126.9 8 96C8 65.07 33.07 40 64 40C94.93 40 120 65.07 120 96C120 126.9 94.93 152 64 152z"/>
                </svg>
            </div>
        </li>
    )
};