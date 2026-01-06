"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung blog...",
}: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  // Khởi tạo Quill (chỉ 1 lần)
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ header: [1, 2, 3, false] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link"],
          ["clean"],
        ],
      },
    });

    // set content ban đầu (edit blog)
    if (value) {
      quillRef.current.root.innerHTML = value;
    }

    // sync editor → state
    quillRef.current.on("text-change", () => {
      onChange(quillRef.current!.root.innerHTML);
    });
  }, []);

  // Khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (
      quillRef.current &&
      value !== quillRef.current.root.innerHTML
    ) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="rounded-lg border bg-white">
      <div ref={editorRef} className="min-h-[250px]" />
    </div>
  );
}
