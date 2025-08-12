"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { EditorProps } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

/**
 * Dynamic import because this should only run on the client
 * You know because otherwise this error is shown: Window is not defined
 */
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false },
);

export default forwardRef<Object, EditorProps>(
  function RichTextEditor(props, ref) {
    return (
      <Editor
        editorClassName={cn(
          "border rounded-md px-3 min-h-[150px] shadow-xs transition-[color,box-shadow]",
          "ring-offset-background focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring",
          props.editorClassName,
        )}
        toolbar={{
          options: ["inline", "list", "link", "history"],
          inline: {
            options: ["bold", "italic", "underline"],
          },
        }}
        editorRef={(r) => {
          if (typeof ref === "function") {
            ref(r);
          } else if (ref) {
            ref.current = ref;
          }
        }}
        {...props}
      />
    );
  },
);
