export default App;

# AI 커뮤니티 플랫폼 데이터베이스 구조

## Firestore 구조

```
users/ (사용자 정보)
  - {uid}: {
      email: string,
      displayName: string,
      photoURL: string,
      bio: string,
      location: string,
      website: string,
      createdAt: timestamp,
      updatedAt: timestamp,
      surveyCompleted: boolean,
      personalInfo: {
        age: string,
        gender: string,
        occupation: string,
        interests: string[],
        experience: string,
        goals: string[]
      }
    }

posts/ (게시글)
  - {postId}: {
      authorId: string,
      title: string,
      content: string,
      tags: string[],
      images: string[], // Storage URL
      attachments: string[], // Storage URL
      createdAt: timestamp,
      updatedAt: timestamp,
      likeCount: number,
      bookmarkCount: number,
      commentCount: number
    }
    comments/ (서브컬렉션)
      - {commentId}: {
          authorId: string,
          content: string,
          createdAt: timestamp,
          updatedAt: timestamp,
          parentId: string | null // 대댓글 지원
        }

likes/ (좋아요 정보)
  - {likeId}: {
      userId: string,
      postId: string,
      createdAt: timestamp
    }

bookmarks/ (북마크 정보)
  - {bookmarkId}: {
      userId: string,
      postId: string,
      createdAt: timestamp
    }

chatRooms/ (채팅방 메타데이터)
  - {roomId}: {
      members: string[], // userId 배열
      lastMessage: string,
      lastMessageAt: timestamp,
      createdAt: timestamp
    }
```

---

## Realtime Database 구조

```
chatRooms/
  - {roomId}: {
      members: {
        [userId]: true
      },
      createdAt: timestamp
    }

messages/
  - {roomId}/
      - {messageId}: {
          senderId: string,
          content: string,
          type: 'text' | 'image' | 'file',
          fileUrl?: string,
          createdAt: timestamp,
          readBy: {
            [userId]: boolean
          }
        }

userChats/
  - {userId}/
      - {roomId}: {
          lastReadAt: timestamp,
          unreadCount: number
        }

presence/
  - {userId}: {
      state: 'online' | 'offline',
      lastChanged: timestamp
    }
```

---

## Storage 구조

```
profiles/avatars/{uid}/{filename}         # 프로필 이미지
posts/images/{postId}/{filename}          # 게시글 이미지
posts/attachments/{postId}/{filename}     # 게시글 첨부파일
chats/images/{roomId}/{filename}          # 채팅 이미지
chats/files/{roomId}/{filename}           # 채팅 파일
```

---

## 참고
- Firestore는 정규화된 데이터(사용자, 게시글, 댓글, 좋아요, 북마크, 채팅방 메타 등)에 적합
- Realtime Database는 실시간성이 중요한 채팅 메시지, 온라인 상태 등에 적합
- Storage는 이미지, 파일 등 대용량 바이너리 데이터 저장에 적합
