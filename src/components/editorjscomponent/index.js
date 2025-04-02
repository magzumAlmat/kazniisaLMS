import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const EditorJS = dynamic(
  () => import('@editorjs/editorjs').then((mod) => mod.default),
  { ssr: false }
);

const Header = dynamic(
  () => import('@editorjs/header').then((mod) => mod.default),
  { ssr: false }
);

const List = dynamic(
  () => import('@editorjs/list').then((mod) => mod.default),
  { ssr: false }
);

const ImageTool = dynamic(
  () => import('@editorjs/image').then((mod) => mod.default),
  { ssr: false }
);

const EditorjsComponent = ({ data: initialData, onChange }) => {
  const editorRef = useRef(null);

  // Функция загрузки изображения на сервер
  const uploadImageByFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name.split('.')[0]); // Убираем расширение из имени

      const response = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки изображения');
      }

      const result = await response.json();
      return {
        success: 1,
        file: {
          url: `http://localhost:4000/${result.newFile.path}`, // URL загруженного изображения
        },
      };
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      return {
        success: 0,
        message: 'Ошибка загрузки изображения',
      };
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeEditor = async () => {
      try {
        const [EditorJS, Header, List, ImageTool] = await Promise.all([
          import('@editorjs/editorjs').then((mod) => mod.default),
          import('@editorjs/header').then((mod) => mod.default),
          import('@editorjs/list').then((mod) => mod.default),
          import('@editorjs/image').then((mod) => mod.default),
        ]);

        const editor = new EditorJS({
          holder: 'editorjs-container',
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Введите заголовок',
                levels: [2, 3],
                defaultLevel: 2,
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile: uploadImageByFile, // Загрузка через файл
                },
              },
            },
          },
          placeholder: 'Начните ввод...',
          data: initialData || undefined,
          onReady: () => {
            console.log('Editor.js готов');
          },
          onChange: async (api, event) => {
            const content = await api.saver.save();
            if (onChange) {
              onChange(content); // Передаём данные наверх
            }
          },
        });

        editorRef.current = editor;

        // Корректный рендер начальных данных
        if (initialData && editorRef.current?.render) {
          editorRef.current.render(initialData).catch((err) => {
            console.error('Ошибка рендеринга:', err);
          });
        }
      } catch (error) {
        console.error('Ошибка инициализации:', error);
      }
    };

    initializeEditor();

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialData]);

  return (
    <div
      id="editorjs-container"
      style={{
        minHeight: '200px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '1rem',
      }}
    />
  );
};

export default EditorjsComponent;