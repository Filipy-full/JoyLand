"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar imagens dinamicamente da API
  const fetchImages = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/gallery-order");
    const data = await res.json();
    setImages(data.images || []);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchImages();
  }, []);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = async () => {
    const listCopy = [...images];
    const dragIdx = dragItem.current;
    const overIdx = dragOverItem.current;
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const draggedImg = listCopy[dragIdx];
      listCopy.splice(dragIdx, 1);
      listCopy.splice(overIdx, 0, draggedImg);
      await fetch("/api/admin/gallery-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: listCopy }),
      });
      await fetchImages();
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Upload handler
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError("");
    setUploading(true);
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadError("Selecione um arquivo");
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/gallery-upload", {
      method: "POST",
      body: formData,
    });
    let result = null;
    try {
      result = await res.json();
    } catch (err) {
      setUploadError("Erro ao processar resposta do servidor. Tente novamente ou verifique o arquivo enviado.");
      setUploading(false);
      return;
    }
    if (result && result.success) {
      await fetchImages();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setUploadError(result?.error || "Erro ao enviar");
    }
    setUploading(false);
  };

  // Remoção de imagem
  const [removing, setRemoving] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState("");

  const handleRemove = async (filename: string) => {
    setRemoving(filename);
    setRemoveError("");
    const res = await fetch("/api/admin/gallery-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    const result = await res.json();
    if (result.success) {
      await fetchImages();
    } else {
      setRemoveError(result.error || "Erro ao remover");
    }
    setRemoving(null);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Galeria de Fotos</h1>

      <form className="mb-6 flex gap-2 items-center" onSubmit={handleUpload}>
        <input type="file" accept="image/*" ref={fileInputRef} className="border rounded px-2 py-1" />
        <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {uploading ? "Enviando..." : "Enviar imagem"}
        </button>
        {uploadError && <span className="text-red-600 ml-2 text-sm">{uploadError}</span>}
      </form>

      {removeError && <div className="text-red-600 mb-2">{removeError}</div>}

      {loading ? (
        <p>Carregando imagens...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.length === 0 ? (
            <p>Nenhuma imagem encontrada.</p>
          ) : (
            images.map((img, idx) => {
              const ext = img.split('.').pop()?.toLowerCase();
              return (
                <div
                  key={img}
                  className="relative group border rounded overflow-hidden cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {ext === "mp4" ? (
                    <video src={`/galeria/${img}`} controls className="object-cover w-full h-40" />
                  ) : ext === "svg" ? (
                    <img src={`/galeria/${img}`} alt={img} className="object-cover w-full h-40" />
                  ) : (
                    <Image
                      src={`/galeria/${img}`}
                      alt={img}
                      width={300}
                      height={200}
                      className="object-cover w-full h-40"
                    />
                  )}
                  <span className="absolute top-2 left-2 bg-white/80 px-2 py-1 text-xs rounded shadow">{idx + 1}</span>
                  <button
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded shadow hover:bg-red-700"
                    onClick={() => handleRemove(img)}
                    disabled={removing === img}
                    title="Remover imagem"
                  >
                    {removing === img ? "..." : "Remover"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500">Arraste as imagens para reordenar.</p>
    </main>
  );
}
