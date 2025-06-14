import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link, Youtube],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border rounded-lg p-4 bg-white min-h-[200px]">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor; 