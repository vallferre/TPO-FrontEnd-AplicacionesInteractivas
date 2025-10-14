// src/components/CategoryMultiSelect.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CategoryMultiSelect.css";

const CategoryMultiSelect = ({
  selected = [],         // [{id, description}]
  onChange,
  apiBase = "http://localhost:8080",
}) => {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);

  // Fetch categorías
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${apiBase}/categories`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data.content || [];
        setAll(list);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("GET /categories error:", err);
        setError("No se pudieron cargar las categorías.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [apiBase]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((c) => c.description?.toLowerCase().includes(q));
  }, [all, query]);

  const isSelected = (id) => selected.some((s) => s.id === id);

  const addCategory = (cat) => {
    if (isSelected(cat.id)) return;
    onChange?.([...selected, cat]);
    setQuery("");
  };

  const removeCategory = (id) => {
    onChange?.(selected.filter((s) => s.id !== id));
  };

  return (
    <div className="catms" ref={wrapRef}>
      <label className="catms__label">Categorías *</label>

      {selected.length > 0 && (
        <div className="catms__chips">
          {selected.map((c) => (
            <span className="catms__chip" key={c.id}>
              {c.description}
              <button
                type="button"
                className="catms__chip-close"
                aria-label={`Quitar ${c.description}`}
                onClick={() => removeCategory(c.id)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="catms__inputwrap">
        <input
          className="catms__input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar categoría…"
        />
        <button
          type="button"
          className="catms__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir lista"
        >
          <span className="catms__caret" />
        </button>

        {open && (
          <div className="catms__dropdown">
            {loading && <div className="catms__item">Cargando…</div>}
            {error && <div className="catms__item catms__item--error">{error}</div>}

            {!loading && !error && filtered.length === 0 && (
              <div className="catms__item">No hay resultados.</div>
            )}

            {!loading &&
              !error &&
              filtered.map((c) => {
                const disabled = isSelected(c.id);
                return (
                  <button
                    type="button"
                    key={c.id}
                    className={`catms__itembtn ${disabled ? "is-disabled" : ""}`}
                    onClick={() => addCategory(c)}
                    disabled={disabled}
                    title={disabled ? "Ya está seleccionada" : "Agregar"}
                  >
                    {c.description}
                  </button>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMultiSelect;
