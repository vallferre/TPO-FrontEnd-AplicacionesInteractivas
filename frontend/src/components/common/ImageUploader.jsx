import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

/**
 * Props:
 * - onImagesChange(filesArray: File[])  // devuelve el array de File seleccionado (y actualizado al borrar)
 */
const ImageUploader = ({ onImagesChange }) => {
  const [files, setFiles] = useState([]); // File[]
  const inputRef = useRef(null);

  // URLs para previews (se generan a partir de files)
  const previews = useMemo(
    () =>
      files.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
        key: `${f.name}-${f.size}-${f.lastModified}`,
      })),
    [files]
  );

  // Limpieza de ObjectURLs
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const addFiles = (incoming) => {
    // Evita duplicados por nombre/tamaño/lastModified
    const byKey = new Map(files.map((f) => [`${f.name}-${f.size}-${f.lastModified}`, f]));
    incoming.forEach((f) => {
      const key = `${f.name}-${f.size}-${f.lastModified}`;
      if (!byKey.has(key)) byKey.set(key, f);
    });
    const next = Array.from(byKey.values());
    setFiles(next);
    onImagesChange?.(next);
  };

  const handleInputChange = (e) => {
    const picked = Array.from(e.target.files || []);
    addFiles(picked);
    // permite volver a elegir los mismos archivos
    e.target.value = "";
  };

  const handleRemove = (key) => {
    const next = files.filter((f) => `${f.name}-${f.size}-${f.lastModified}` !== key);
    setFiles(next);
    onImagesChange?.(next);
  };

  // Drag & drop (opcional)
  const onDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    if (dropped.length) addFiles(dropped);
  };
  const onDragOver = (e) => e.preventDefault();

  return (
    <StyledWrapper>
      <label
        className="custum-file-upload"
        htmlFor="product-images"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M10 1C9.73 1 9.48 1.1 9.29 1.29L3.29 7.29C3.1 7.48 3 7.73 3 8V20C3 21.66 4.34 23 6 23H7C7.55 23 8 22.55 8 22C8 21.45 7.55 21 7 21H6C5.45 21 5 20.55 5 20V9H10C10.55 9 11 8.55 11 8V3H18C18.55 3 19 3.45 19 4V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 2.34 19.66 1 18 1H10ZM9 7H6.41L9 4.41V7ZM14 15.5C14 14.12 15.12 13 16.5 13C17.88 13 19 14.12 19 15.5V17H20C21.1 17 22 17.9 22 19C22 20.1 21.1 21 20 21H13C11.9 21 11 20.1 11 19C11 17.9 11.9 17 13 17H14V15.5Z"
            />
          </svg>
        </div>
        <div className="text">
          <span>Arrastrá o hacé click para subir imágenes</span>
        </div>
        <input
          ref={inputRef}
          id="product-images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
        />
      </label>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="preview-grid">
          {previews.map((p) => (
            <div className="preview" key={p.key}>
              <img src={p.url} alt={p.file.name} />
              <button
                type="button"
                className="remove-image-btn"
                title="Quitar imagen"
                onClick={() => handleRemove(p.key)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="helper"></p>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Caja de subida (diseño del ImageUpload original) */
  .custum-file-upload {
    height: 200px;
    width: 100%;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border: 2px dashed #cacaca;
    background-color: #fff;
    padding: 1.25rem;
    border-radius: 10px;
    box-shadow: 0px 48px 35px -48px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s ease, background-color 0.2s ease;
    user-select: none;
  }
  .custum-file-upload:hover {
    border-color: #135bec;
    background-color: #f9fbff;
  }
  .custum-file-upload .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .custum-file-upload .icon svg {
    height: 72px;
    width: 72px;
    color: rgba(75, 85, 99, 1);
  }
  .custum-file-upload .text {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .custum-file-upload .text span {
    font-weight: 500;
    color: rgba(75, 85, 99, 1);
  }
  .custum-file-upload input {
    display: none;
  }

  /* Grid de previews (independiente del CSS global) */
  .preview-grid {
    margin-top: 0.75rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.75rem;
    max-width: 720px;
  }
  .preview {
    position: relative;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #fff;
    aspect-ratio: 1 / 1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }
  .preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .remove-image-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    background: rgba(17, 24, 39, 0.85);
    color: #fff;
    cursor: pointer;
    display: flex;          /* centra la “X” */
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    z-index: 2;
    transition: transform 0.15s ease, background-color 0.15s ease;
  }
  .remove-image-btn:hover {
    transform: scale(1.06);
    background: rgba(239, 68, 68, 0.95);
  }
  .remove-image-btn:active {
    transform: scale(1);
  }

  .helper {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #6b7280;
  }
`;

export default ImageUploader;
