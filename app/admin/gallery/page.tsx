"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type GalleryImage = {
  id: string;
  url: string;
  order: number;
  created_at: string;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState("");

  // Fetch images from Supabase
  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery")
      .select("id, url, order, created_at")
      .order("order", { ascending: true });
    if (error) {
      setImages([]);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  // Upload handler for Supabase
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError("");
    setUploading(true);
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadError("Select a file");
      setUploading(false);
      return;
    }
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadErrorObj } = await supabase.storage.from('galeria').upload(fileName, file);
    if (uploadErrorObj) {
      setUploadError(uploadErrorObj.message);
      setUploading(false);
      return;
    }
    // Get the public URL using the returned path
    const path = uploadData?.path || fileName;
    const { data: publicUrlData } = supabase.storage.from('galeria').getPublicUrl(path);
    // Find the current max order
    const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.order || 0)) : 0;
    // Insert into table
    const { error: insertError } = await supabase.from('gallery').insert({ url: publicUrlData.publicUrl, order: maxOrder + 1 });
    if (insertError) {
      setUploadError(insertError.message);
    } else {
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchImages();
    }
    setUploading(false);
  };

  // Remove image from Supabase
  const handleRemove = async (id: string, url: string) => {
    setRemoving(id);
    setRemoveError("");
    // Remove from Storage
    const path = url.split('/').slice(-1)[0];
    await supabase.storage.from('galeria').remove([path]);
    // Remove from database
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      setRemoveError(error.message);
    } else {
      await fetchImages();
    }
    setRemoving(null);
  };

  // Reorder images in Supabase
  const handleDragEnd = async () => {
    const dragIdx = dragItem.current;
    const overIdx = dragOverItem.current;
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const reordered = [...images];
      const [removed] = reordered.splice(dragIdx, 1);
      reordered.splice(overIdx, 0, removed);
      // Update the order field of each image
      for (let i = 0; i < reordered.length; i++) {
        await supabase.from('gallery').update({ order: i + 1 }).eq('id', reordered[i].id);
      }
      await fetchImages();
    }
    dragItem.current = null;
    dragOverItem.current = null;
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




  return (
    <main className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center mb-4 gap-2 sm:gap-4">
        <button
          onClick={() => window.history.back()}
          className="mb-2 sm:mb-0 mr-0 sm:mr-3 p-2 rounded-full bg-sage-100 hover:bg-sage-200 border border-sage-200 transition-colors"
          aria-label="Back"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Manage Photo Gallery</h1>
      </div>
      <form className="mb-6 flex flex-col sm:flex-row gap-2 items-center" onSubmit={handleUpload}>
        <label htmlFor="gallery-upload" className="text-sm font-medium text-sage-700 mr-2">Select a photo:</label>
        <div className="relative w-full sm:w-auto">
          <input
            id="gallery-upload"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
            aria-label="Select image file"
            onChange={e => {
              const label = document.getElementById('gallery-upload-label');
              if (label) {
                label.textContent = e.target.files?.[0]?.name || 'No file selected';
              }
            }}
          />
          <div className="flex items-center border rounded px-2 py-1 bg-white shadow-sm cursor-pointer min-w-[180px]">
            <span id="gallery-upload-label" className="text-gray-600 text-sm truncate">No file selected</span>
            <span className="ml-auto bg-sage-600 text-white px-2 py-1 rounded text-xs font-semibold ml-2">Browse</span>
          </div>
        </div>
        <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto">
          {uploading ? "Uploading..." : "Upload image"}
        </button>
        {uploadError && <span className="text-red-600 ml-2 text-sm">{uploadError}</span>}
      </form>
      {removeError && <div className="text-red-600 mb-2">{removeError}</div>}
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.length === 0 ? (
            <p>No images found.</p>
          ) : (
            images.map((img, idx) => (
              <div
                key={img.id}
                className="relative group border rounded overflow-hidden cursor-move"
                draggable
                onDragStart={() => dragItem.current = idx}
                onDragEnter={() => dragOverItem.current = idx}
                onDragEnd={handleDragEnd}
                onDragOver={e => e.preventDefault()}
              >
                <Image
                  src={img.url}
                  alt={`Gallery image ${idx + 1}`}
                  width={300}
                  height={200}
                  className="object-cover w-full h-40"
                />
                <span className="absolute top-2 left-2 bg-white/80 px-2 py-1 text-xs rounded shadow">{idx + 1}</span>
                <button
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded shadow hover:bg-red-700"
                  onClick={() => handleRemove(img.id, img.url)}
                  disabled={removing === img.id}
                  title="Remove image"
                >
                  {removing === img.id ? "..." : "Remove"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500">Drag images to reorder.</p>
    </main>
  );
}
