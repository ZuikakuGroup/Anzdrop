"use client";

import { useState } from "react";
import { iterateFileChunks } from "@/lib/crypto";

type UploadResponse = {
  success: boolean;
  shareId?: string;
  error?: string;
};

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [shareId, setShareId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/d/${shareId}`
      : "";

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) {
      return;
    }

    setFiles(Array.from(event.target.files));
  };

  const upload = async () => {
    if (files.length === 0) {
      setError("ファイルを選択してください。");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Upload failed");
      }

      const shareId = result.shareId;
      if (!shareId) {
        throw new Error("shareId is missing");
      }

      setShareId(shareId);
      setError("");
    } catch (unknownErr: unknown) {
      const error =
        unknownErr instanceof Error
          ? unknownErr
          : new Error("Unknown error");
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Anzdrop
      </h1>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
      />

      <div className="mt-6">
        <h2 className="font-semibold mb-2">
          選択されたファイル
        </h2>

        {files.length === 0 ? (
          <p>ファイルが選択されていません。</p>
        ) : (
          <ul className="list-disc ml-6">
            {files.map((file) => (
              <li key={`${file.name}-${file.lastModified}`}>
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={upload}
        disabled={isUploading}
        className="mt-6 rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
      >
        {isUploading ? "アップロード中..." : "アップロード"}
      </button>
      {error && (
        <p className="mt-4 text-red-600">
          {error}
        </p>
      )}
      {shareId && (
        <div className="mt-6">
          <h2 className="font-semibold">
            共有URL
          </h2>

          <p className="break-all">
            {shareUrl}
          </p>
        </div>
      )}
    </div>
  );
}