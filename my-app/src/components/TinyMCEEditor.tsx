import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange }) => {
  return (
    <Editor
      apiKey="no-api-key" // 무료 버전은 'no-api-key' 사용 가능
      value={value}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic backcolor | \
                 alignleft aligncenter alignright alignjustify | \
                 bullist numlist outdent indent | removeformat | help'
      }}
      onEditorChange={onChange}
    />
  );
};

export default TinyMCEEditor; 