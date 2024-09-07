"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Select as DefaultSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TextPart {
  type: "text" | "select";
  key?: string;
  value: string;
}

function parseText(text: string): TextPart[] {
  const regex = /\{([^}]+)\}/g;
  const parts: TextPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "select", key: match[1], value: "" });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts;
}

function reconstructText(textParts: TextPart[]): string {
  return textParts
    .map((part) => {
      if (part.type === "text" || part.type === "select") {
        return part.value;
      } else {
        return `{${part.key}}`;
      }
    })
    .join("");
}

interface DynamicTextFieldProps {
  onChange: (text: string) => void;
  CustomSelect?: React.ComponentType<any>;
  data: { text: string; options: { [key: string]: string[] } };
}

const DynamicTextField: React.FC<DynamicTextFieldProps> = ({
  onChange,
  CustomSelect,
  data,
}) => {
  const [textParts, setTextParts] = useState<TextPart[]>(parseText(data.text));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const newTextParts = [...textParts];
    newTextParts[index].value = value;
    console.log(newTextParts);
    setTextParts(newTextParts);
    onChange(reconstructText(newTextParts));
  };

  useEffect(() => {
    textParts.forEach((part, index) => {
      if (part.type === "text" && spanRefs.current[index]) {
        spanRefs.current[index]!.textContent = part.value;
        inputRefs.current[index]!.style.width = `${
          spanRefs.current[index]!.offsetWidth
        }px`;
      }
    });
  }, [textParts]);

  const SelectComponent: React.ComponentType<any> =
    CustomSelect || DefaultSelect;

  const setRef =
    (
      index: number,
      refs: (HTMLSpanElement | null)[] | (HTMLInputElement | null)[]
    ) =>
    (el: HTMLSpanElement | HTMLInputElement | null) => {
      if (!el || !refs) return;
      refs[index] = el;
    };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {textParts.map((part, index) =>
        part.type === "text" ? (
          <div key={index} className="relative">
            <input
              ref={setRef(index, inputRefs.current)}
              type="text"
              value={part.value}
              onChange={(e) => handleChange(index, e.target.value)}
              className="outline-none bg-transparent min-w-0"
              style={{ width: "fit-content" }}
            />
            <span
              ref={setRef(index, spanRefs.current)}
              className="absolute invisible whitespace-pre"
            >
              {part.value}
            </span>
          </div>
        ) : (
          <SelectComponent
            key={index}
            onValueChange={(value: string) => handleChange(index, value)}
            options={data.options[part.key!]}
            placeholder={`Select ${part.key}`}
            defaultValue={data.options[0]}
          >
            {CustomSelect ? null : (
              <>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`Select ${part.key}`} />
                </SelectTrigger>
                <SelectContent>
                  {data.options[part.key!].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </>
            )}
          </SelectComponent>
        )
      )}
    </div>
  );
};

export default DynamicTextField;
