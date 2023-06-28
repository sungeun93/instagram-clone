import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../utils/requests";

export default function ArticleCreate({active, setActive}) {
    const navigate = useNavigate();
    // 게시물 내용
    const [description, setDescription] = useState("");
    // 파일 처리
    const [files, setFiles] = useState([]);

    // 폼 제출 처리
    async function handleSubmit(e) {
        try {
            e.preventDefault();

            // 서버에 전송할 데이터
            console.log(files)
            console.log(description)

            // 폼데이터에 전송할 데이터를 담는다
            const formData = new FormData();

            files.forEach(file => {
                formData.append('photos', file);
            })
            formData.append('description', description);

            // 서버에 전송한다
            await createArticle(formData);

            // 피드로 이동
            navigate('/');

        } catch (error) {
            alert(error)
        }
    };

    // 모달 닫기
    function close(e) {
        // e.currentTaget: 오버레이(가장 바깥의 div)
        if (e.target === e.currentTaget) {
            setActive(false);
        }
    };

    if (active) {
        return (
            <div className="fixed inset-0 bg-black/[0.2] z-10" onClick={close}>
                {/* 모달 닫기 버튼 */}
                <button
                 type="button"
                 className="float-rigth text-2xl px-4 py-2 text-white"
                 onClick={() => setActive(false)}
                >
                    &times;
                </button>

                {/* 폼 */}
                <form className="bg-white max-w-xs mt-2o mx-auto  rounded-2xl" onSubmit={handleSubmit}>
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold text-center">게시물 업로드</h3>
                    </div>

                    <div className="p-4">
                        {/* 업로드 버튼 */}
                        <label className="inline-block mb-2 font-semibold text-sm px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
                            <input
                             type="file"
                             className="hidden"
                             // Array.from(): 순회가능한 객체를 배열로 반환한다
                             onChange={({target}) => setFiles(Array.from(target.files))}
                             // 여러개의 파일 선택 가능
                             multiple={true}
                             accept="image/png, image/jpg, image/jpeg"
                            />
                            사진 선택
                        </label>

                        {/* 선택한 파일의 이미지 미리보기 */}
                        {files.length > 0 && (
                            <ul className="grid grid-cols-3 mb-2">
                                {files.map(file => (
                                    <li key={file.name} className="pt-[100%] relative">
                                        <img 
                                         className="absolute inset-0 w-full h-full object-cover"
                                         src={URL.createObjectURL(file)}
                                         alt={file.name}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* 사진 설명 */}
                        <div className="mb-2">
                            <label htmlFor="description" className="block font-semibold">
                                Description
                            </label>
                            <textarea 
                             rows="2"
                             id="description"
                             className="block w-full px-2 py-1 rounded border"
                             onChange={({target}) => setDescription(target.value)}
                             value={description}
                            />
                        </div>

                        <button
                         type="submit"
                         className="px-4 py-2 text-sm font-semibold bg-blue-500 rounded-lg text-white disabled:opacity-[0.2]"
                         disabled={files.length < 1}
                        >
                            업로드
                        </button>
                    </div>
                </form>
            </div>
        )
    }

};