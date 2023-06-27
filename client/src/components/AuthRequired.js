// 인증 검사

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

export default function AuthRequired({ children }) { // AuthRequired의 자식 컴포넌트는 layout
    // user에 접근한다
    const { user } = useContext(AuthContext);

    // 인증 실패
    if (!user) {
        // 로그인 페이지로 이동시킨다
        return <Navigate to="/accounts/login" replace={true} /> // replace={true}: 현재 페이지를 대체한다(이동X)
    }

    // 앱에 진입
    return children;
};

