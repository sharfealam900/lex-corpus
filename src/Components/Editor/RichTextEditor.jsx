import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";


import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaLink,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaHighlighter,
} from "react-icons/fa";


export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,

      Underline,

      Highlight,

      Image,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Placeholder.configure({
        placeholder: "Write your article here...",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: value || "",

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "ProseMirror",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
  <div className="editor">

    <div className="editor-toolbar">

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <FaBold />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <FaItalic />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <FaUnderline />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title="Highlight"
      >
        <FaHighlighter />
      </button>

      <span className="divider"></span>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        H1
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        H2
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        H3
      </button>

      <span className="divider"></span>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
      >
        <FaListUl />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
      >
        <FaListOl />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleBlockquote().run()
        }
      >
        <FaQuoteLeft />
      </button>

      <span className="divider"></span>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
      >
        <FaAlignLeft />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
      >
        <FaAlignCenter />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
      >
        <FaAlignRight />
      </button>

      <span className="divider"></span>

      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Enter URL");

          if (url) {
            editor
              .chain()
              .focus()
              .setLink({ href: url })
              .run();
          }
        }}
      >
        <FaLink />
      </button>

      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Image URL");

          if (url) {
            editor
              .chain()
              .focus()
              .setImage({ src: url })
              .run();
          }
        }}
      >
        <FaImage />
      </button>

      <span className="divider"></span>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <FaUndo />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <FaRedo />
      </button>

    </div>
          <EditorContent
        editor={editor}
        className="editor-content"
      />

    </div>
  );


}