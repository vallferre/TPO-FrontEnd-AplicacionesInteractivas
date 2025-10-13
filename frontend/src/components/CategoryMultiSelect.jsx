// src/components/CategoryMultiSelect.jsx
import React, { useEffect, useMemo, useState } from "react";

const CategoryMultiSelect = ({
  selected = [],
  onChange,
  apiBase = "http://localhost:8080",
}) => {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

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
    <div className="category-select">
      <label className="label" style={{ color: "#111" }}>
        Categorías *
      </label>

      {selected.length > 0 && (
        <div className="chips" style={{ marginBottom: ".5rem" }}>
          {selected.map((c) => (
            <span
              className="chip"
              key={c.id}
              style={{
                background: "#f2f2f2",
                color: "#222",
                padding: "4px 10px",
                borderRadius: "12px",
                marginRight: "4px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {c.description}
              <button
                type="button"
                className="chip-close"
                aria-label={`Quitar ${c.description}`}
                onClick={() => removeCategory(c.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#555",
                  marginLeft: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div
        className="category-input"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar categoría…"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "6px 0 0 6px",
            border: "1px solid #ccc",
            fontSize: "15px",
            color: "#222",
            background: "#fff",
          }}
        />
        <button
          type="button"
          className="btn-add"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir lista"
          style={{
            padding: "10px 14px",
            background: "#fff",
            border: "1px solid #ccc",
            borderLeft: "none",
            borderRadius: "0 6px 6px 0",
            cursor: "pointer",
            color: "#444",
            fontSize: "16px",
            height: "100%",
          }}
        >
          ▼
        </button>

        {open && (
          <div
            className="dropdown"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              marginTop: "0.25rem",
              maxHeight: 240,
              overflowY: "auto",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              color: "#111",
            }}
          >
            {loading && (
              <div
                className="dropdown-item"
                style={{ padding: ".75rem 1rem", color: "#333" }}
              >
                Cargando…
              </div>
            )}

            {error && (
              <div
                className="dropdown-item"
                style={{ padding: ".75rem 1rem", color: "#ef4444" }}
              >
                {error}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div
                className="dropdown-item"
                style={{ padding: ".75rem 1rem", color: "#333" }}
              >
                No hay resultados.
              </div>
            )}

            {!loading &&
              !error &&
              filtered.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className="dropdown-item"
                  onClick={() => addCategory(c)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: ".6rem 1rem",
                    background: "transparent",
                    border: "none",
                    cursor: isSelected(c.id) ? "not-allowed" : "pointer",
                    opacity: isSelected(c.id) ? 0.5 : 1,
                    color: "#222",
                  }}
                  disabled={isSelected(c.id)}
                >
                  {c.description}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMultiSelect;
