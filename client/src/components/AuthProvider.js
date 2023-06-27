// user state 관리

import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) { // AuthProvider의 자식 컴포넌트는 router
    // 로컬스토리지에서 user의 초기값을 가져온다
    const initialUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(initialUser);

    // user 감시자
    useEffect(() => {
        // effect: 로컬스토리지 동기화

        if (user) { // 로그인, 정보 수정 시
            localStorage.setItem('user', JSON.stringify(user));
        } else { // 로그아웃 시
            localStorage.removeItem('user');
        }
    }, [user])

    // 하위 컴포넌트에서도 접근할 수 있게 전달한다
    const value = { user, setUser };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    )
};

