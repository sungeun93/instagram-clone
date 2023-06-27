import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { signIn } from "../utils/requests";

export default function Login() {
    // user 업데이트
    const { setUser } = useContext(AuthContext);
    // 페이지 이동
    const navigate = useNavigate();
    // 에러메시지
    const [error, setError] = useState(null);
    // 로컬 스토리지에 이메일이 있을 경우 가져온다
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    // 비밀번호
    const [password, setPassword] = useState("");
    // 비밀번호 표시
    const [showPassword, setShowPassword] = useState(false);

    // 폼 제출 처리
    async function handleSubmit(e) {
      try {
        e.preventDefault(); // 새로고침 방지
  
        setError(null); // 에러 초기화
  
        // 서버 요청
        const { user } = await signIn(email, password);
        
        // user를 응답 객체로 업데이트한다
        setUser(user)
  
        // 로그인에 성공한 경우 로컬스토리지에 이메일을 저장한다
        localStorage.setItem('email', email);
        
        // 피드로 이동한다
        setTimeout(() => {
          navigate('/');
        }, 200); // user가 처리되는 시간을 기다린다
        
      } catch (error) {
        setError(error);
      }
    };

    // 타이틀 업데이트
    useEffect(() => {
        document.title = "로그인 - Instagram"
    }, [])

    return (
        <form onSubmit={handleSubmit} className="max-w-xs p-4 mt-16 mx-auto">
            {/* 로고 이미지 */}
            <div className="mt-4 mb-4 flex justify-center">
              <img src="/images/logo.png" className="w-36" />
            </div>

            {/* 이메일 입력란 */}
            <div className="mb-2">
              <label className="block">
                <input
                  type="text"
                  className="border px-2 py-1 w-full rounded"
                  value={email}
                  placeholder="이메일"
                  onChange={({ target }) => setEmail(target.value)}
                />
              </label>
            </div>
    
            {/* 비밀번호 입력란 */}
            <div className="mb-2">
              <label className="block relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="border px-2 py-1 w-full rounded"
                  value={password}
                  placeholder="비밀번호"
                  autoComplete="new-password"
                  onChange={({ target }) => setPassword(target.value)}
                />
                {/* 비밀번호가 1자리 이상일 때 토글버튼이 나타난다 */}
                {password.trim().length > 0 && (
                  <button
                    type="button"
                    className="absolute right-0 h-full px-4 py-2 text-sm font-semibold"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  </button>
                )}
              </label>
            </div>
    
            {/* 제출버튼 */}
            <button
              type="submit"
              className="bg-blue-500 text-sm text-white font-semibold rounded-lg px-4 py-2 w-full disabled:opacity-[0.5]"
              disabled={!email.trim() || password.trim().length < 5}
            >
              로그인
            </button>

            {/* 에러 메시지 */}
            {error && <p className="my-4 text-center text-red-500">{error.message}</p>}

            <p className="text-center my-4">
              계정이 없으신가요?  {" "}
              <Link to="/accounts/signup" className="text-blue-500 font-semibold">가입하기</Link>
            </p>
        </form>
    )
};