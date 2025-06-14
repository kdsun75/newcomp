import React, { useMemo, useRef } from 'react';
import { createEditor, Transforms, Editor, Element as SlateElement, BaseEditor, Descendant } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

// 타입 선언
export type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean };
export type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
export type HeadingElement = { type: 'heading'; children: CustomText[] };
export type QuoteElement = { type: 'quote'; children: CustomText[] };
export type ImageElement = { type: 'image'; url: string; children: CustomText[] };
export type LinkElement = { type: 'link'; url: string; children: CustomText[] };
export type CustomElement = ParagraphElement | HeadingElement | QuoteElement | ImageElement | LinkElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface SlateEditorProps {
  value: CustomElement[];
  onChange: (value: CustomElement[]) => void;
}

const ToolbarButton = ({ format, icon, onClick }: { format: string; icon: string; onClick: () => void }) => (
  <button
    type="button"
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    className="mr-2 px-2 py-1 border rounded hover:bg-gray-100"
  >
    {icon}
  </button>
);

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as any)[format] === true : false;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  Transforms.setNodes(
    editor,
    { type: isActive ? 'paragraph' : format } as Partial<SlateElement>,
    {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        typeof (n as any).type === 'string',
    }
  );
};

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as SlateElement).type === format,
  });
  return !!match;
};

const insertImage = (editor: Editor, url: string) => {
  const image: ImageElement = { type: 'image', url, children: [{ text: '' }] };
  Transforms.insertNodes(editor, image);
};

const insertLink = (editor: Editor, url: string) => {
  if (!url) return;
  const { selection } = editor;
  const link: LinkElement = { type: 'link', url, children: [{ text: url }] };
  Transforms.insertNodes(editor, link);
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'heading':
      return <h2 {...attributes} className="text-xl font-bold my-2">{children}</h2>;
    case 'quote':
      return <blockquote {...attributes} className="border-l-4 pl-4 italic text-gray-600 my-2">{children}</blockquote>;
    case 'image':
      return <img {...attributes} src={element.url} alt="" className="my-2 max-h-60" />;
    case 'link':
      return (
        <a {...attributes} href={element.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = (props: any) => {
  let { children } = props;
  if (props.leaf.bold) children = <strong>{children}</strong>;
  if (props.leaf.italic) children = <em>{children}</em>;
  if (props.leaf.underline) children = <u>{children}</u>;
  return <span {...props.attributes}>{children}</span>;
};

const SlateEditor: React.FC<SlateEditorProps> = ({ value, onChange }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파이어베이스 Storage 이미지 업로드
  const handleImageUpload = async (file: File) => {
    // 확장자/용량 체크
    const isImage = file.type.startsWith('image/');
    const isGif = file.type === 'image/gif';
    const maxSize = isGif ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (!isImage && !isGif) {
      alert('이미지(jpg, png) 또는 gif 파일만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > maxSize) {
      alert(isGif ? 'GIF는 10MB 이하만 업로드할 수 있습니다.' : '이미지는 5MB 이하만 업로드할 수 있습니다.');
      return;
    }
    try {
      const storageRef = ref(storage, `editor-images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      insertImage(editor, url);
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  // 이미지 업로드 버튼 클릭
  const handleImage = () => {
    fileInputRef.current?.click();
  };

  // 링크 삽입 핸들러
  const handleLink = () => {
    const url = window.prompt('링크 URL을 입력하세요');
    if (url) insertLink(editor, url);
  };

  return (
    <div className="border rounded-lg p-4 bg-white min-h-[200px]">
      <div className="mb-2 flex flex-wrap gap-2">
        <ToolbarButton format="bold" icon="B" onClick={() => toggleMark(editor, 'bold')} />
        <ToolbarButton format="italic" icon="I" onClick={() => toggleMark(editor, 'italic')} />
        <ToolbarButton format="underline" icon="U" onClick={() => toggleMark(editor, 'underline')} />
        <ToolbarButton format="heading" icon="H2" onClick={() => toggleBlock(editor, 'heading')} />
        <ToolbarButton format="quote" icon="❝" onClick={() => toggleBlock(editor, 'quote')} />
        <ToolbarButton format="image" icon="🖼️" onClick={handleImage} />
        <ToolbarButton format="link" icon="🔗" onClick={handleLink} />
        <input
          type="file"
          accept="image/*,image/gif"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
            e.target.value = '';
          }}
        />
      </div>
      <Slate
        editor={editor}
        initialValue={value}
        onChange={value => onChange(value as CustomElement[])}
      >
        <Editable
          placeholder="내용을 입력하세요..."
          renderElement={Element}
          renderLeaf={Leaf}
        />
      </Slate>
    </div>
  );
};

export default SlateEditor; 