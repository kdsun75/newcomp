import React, { useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

interface ToastUIEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const ToastUIEditor: React.FC<ToastUIEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.getInstance();
      
      // 이미지 업로드 핸들러
      editor.addHook('addImageBlobHook', async (blob: Blob, callback: (url: string) => void) => {
        try {
          // 파일 타입 및 크기 체크
          const isImage = blob.type.startsWith('image/');
          const isGif = blob.type === 'image/gif';
          const maxSize = isGif ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for GIF, 5MB for images
          
          if (!isImage) {
            alert('이미지(jpg, png) 또는 gif 파일만 업로드할 수 있습니다.');
            return;
          }
          
          if (blob.size > maxSize) {
            alert(isGif ? 'GIF는 10MB 이하만 업로드할 수 있습니다.' : '이미지는 5MB 이하만 업로드할 수 있습니다.');
            return;
          }

          // 파일 이름 생성
          const extension = isGif ? '.gif' : '.jpg';
          const fileName = `image_${Date.now()}${extension}`;

          // Firebase Storage에 업로드
          const storageRef = ref(storage, `post_images/${fileName}`);
          await uploadBytes(storageRef, blob);
          const url = await getDownloadURL(storageRef);
          callback(url);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          alert('이미지 업로드에 실패했습니다.');
        }
      });

      // 유튜브 임베드 핸들러
      editor.addHook('addImageBlobHook', (blob: Blob, callback: (url: string) => void) => {
        // 유튜브 URL 체크 및 임베드 처리
        const url = URL.createObjectURL(blob);
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          const videoId = extractYoutubeId(url);
          if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            callback(embedUrl);
          }
        }
      });

      // 링크 미리보기 핸들러
      editor.addHook('addImageBlobHook', async (blob: Blob, callback: (url: string) => void) => {
        const url = URL.createObjectURL(blob);
        if (isValidUrl(url)) {
          try {
            const preview = await fetchLinkPreview(url);
            callback(preview);
          } catch (error) {
            console.error('링크 미리보기 생성 실패:', error);
          }
        }
      });
    }
  }, []);

  // 유튜브 ID 추출 함수
  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // URL 유효성 검사
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 링크 미리보기 가져오기
  const fetchLinkPreview = async (url: string): Promise<string> => {
    // Open Graph API를 사용하여 미리보기 데이터 가져오기
    // 실제 구현에서는 백엔드 프록시나 외부 API 사용 권장
    return `<div class="link-preview">
      <img src="thumbnail-url" alt="preview" />
      <h3>Title</h3>
      <p>Description</p>
    </div>`;
  };

  return React.createElement(Editor as any, {
    ref: editorRef,
    initialValue: value,
    previewStyle: 'vertical',
    height: '500px',
    initialEditType: 'markdown',
    useCommandShortcut: true,
    toolbarItems: [
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task', 'indent', 'outdent'],
      ['table', 'image', 'link'],
      ['code', 'codeblock'],
    ],
    customHTMLRenderer: {
      // 커스텀 렌더링 규칙 추가
      image(node: any) {
        return {
          tag: 'img',
          attrs: {
            src: node.src,
            alt: node.alt,
            style: 'max-width: 100%; height: auto;',
          },
        };
      },
      youtube(node: any) {
        return {
          tag: 'iframe',
          attrs: {
            src: node.src,
            width: '100%',
            height: '400',
            frameborder: '0',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            allowfullscreen: true,
          },
        };
      },
    },
    onChange: () => {
      const content = editorRef.current?.getInstance().getMarkdown();
      onChange(content || '');
    }
  });
};

export default ToastUIEditor; 