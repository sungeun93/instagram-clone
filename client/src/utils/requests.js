// 서버 요청 함수 라이브러리

const server = process.env.REACT_APP_SERVER; // 서버 주소
/* USER */

// 1 유저생성
export async function createUser(newUser) {

    // fetch(요청주소, 옵션): 서버에 요청하는 함수
    const res = await fetch(`${server}/users`, {
        method: "POST", // 요청주소
        headers: { 'Content-Type': 'application/json'}, // 요청 헤더에 컨텐츠 타입을 명시한다
        body: JSON.stringify(newUser) // 전송 데이터
    })

    // 요청 실패
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    // 요청 성공: 응답 객체를 리턴한다
    return await res.json();
}

// 2 정보 수정
export async function updateUser(formData) {
  const res = await fetch(`${server}/user`, {
        method: "PUT",
        // 로컬스토리지에서 토큰을 추출하여 헤더에 담는다
        headers: {"Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token},
        body: formData // 파일이 있기 때문에 formData형식으로 전송한다
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`); // 에러객체에서 인자는 에러 메시지가 된다
    }

    return await res.json();
}

// 3 로그인
export async function signIn(email, password) {
    const res = await fetch(`${server}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

/* ARTICLES */

// 1 피드 가져오기
export async function getFeed(skip) {
    // 요청변수 skip: 더보기 기능 구현
    const res = await fetch(`${server}/feed?skip=${skip}`, {
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    });
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

// 2 게시물 한개 가져오기
export async function getArticle(id) {
    const res = await fetch(`${server}/articles/${id}`, {
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    });
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

// 3 게시물 생성
export async function createArticle(formData) {
    const res = await fetch(`${server}/articles`, {
      method: "POST",
      headers: { "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token },
      body: formData
    })
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

// 4 게시물 삭제
export async function deleteArticle(id) {
    const res = await fetch(`${server}/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    })
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

// 5 좋아요
export async function favorite(id) {
    const res = await fetch(`${server}/articles/${id}/favorite`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    })
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

// 6 좋아요 취소
export async function unfavorite(id) {
    const res = await fetch(`${server}/articles/${id}/favorite`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    })
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

/* COMMENTS */

// 1 댓글 가져오기
export async function getComments(id) {
    const res = await fetch(`${server}/articles/${id}/comments`, {
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    });
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

// 2 댓글 생성
export async function createComment(id, content) {

    const res = await fetch(`${server}/articles/${id}/comments`, {
        method: "POST",
        headers: {
            "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token,
            "Content_Type": "application/json",
        },
        body: JSON.stringify({content})
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 3 댓글 삭제
export async function deleteComment(id) {
    const res = await fetch(`${server}/comments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    })
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

/* PROFILES */

// 1 프로필 리스트 가져오기
export async function getProfiles(username) {
    // 프로필 검색에서 활용
    const res = await fetch(`${server}/profiles/?username=${username}`, {
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    });
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

// 2 프로필 상세보기
export async function getProfile(username) {
    const res = await fetch(`${server}/profiles/${username}`, {
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    })
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

// 3 타임라인 가져오기
export async function getTimeline(username) {
    const res = await fetch(`${server}/articles/?username=${username}`, {
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
    })
  
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  
    return await res.json();
}

// 4 팔로워 리스트 가져오기
export async function getFollowers(username) {
    const res = await fetch(`${server}/profiles/?followers=${username}`, {
        headers: {'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token}
    });

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 5 팔로잉 리스트 가져오기
export async function getFollowings(username) {
    const res = await fetch(`${server}/profiles/?following=${username}`, {
        headers: {'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token}
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 6 팔로우
export async function follow(username) {
    const res = await fetch(`${server}/profiles/${username}/follow`, {
        method: "POST",
        headers: {'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token}
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 7 언팔로우
export async function unfollow(username) {
    const res = await fetch(`${server}/profiles/${username}/follow`, {
        method: "DELETE",
        headers: {'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token}
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}


