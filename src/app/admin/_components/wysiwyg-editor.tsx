"use client";
import * as React from "react";
import { useMemo } from "react";
import dynamic from "next/dynamic";

import Quill from "quill";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});

const Font = Quill.import("formats/font");
Font.whitelist = [
  "sans-serif",
  "serif",
  "monospace",
  "arial",
  "times-new-roman",
  "courier",
];
Quill.register(Font, true);

import "react-quill/dist/quill.snow.css";

interface EditorProps {
  content: string;
  handleEditorContent: (content: string) => void;
}

export default function WYSIWYGEditor({
  content,
  handleEditorContent,
}: EditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: Font.whitelist }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link"],
          [{ align: [] }],
          [
            {
              color: [
                "#000000",
                "#FFFFFF",
                "#FF0000",
                "#008000",
                "#0000FF",
                "#FFFF00",
                "#00FFFF",
                "#FF00FF",
                "#808080",
                "#FFA500",
              ],
            },
            {
              background: [
                "",
                "#ffffff",
                "#FFFF00",
                "#F0E68C",
                "#FFA500",
                "#FF0000",
                "#FF6347",
                "#800000",
                "#A020F0",
                "#008000",
                "#006400",
                "#2E8B57",
                "#0000FF",
                "#0000CD",
                "#836FFF",
                "#6959CD",
              ],
            },
          ],
        ],
        clipboard: {
          matchVisual: false,
        },
        history: {
          delay: 1000,
          maxStack: 50,
          userOnly: false,
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
    "color",
    "background",
    "align",
  ];

  return (
    <div className="w-full min-h-full max-w-4xl mx-auto">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleEditorContent}
        className="h-full mb-5 rounded-md"
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
