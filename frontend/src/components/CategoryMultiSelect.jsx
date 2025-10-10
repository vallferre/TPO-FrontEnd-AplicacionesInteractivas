import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CategoryMultiSelect.css";

export default function CategoryMultiSelect({
  selected = [],                 // [{id, description}]
  onChange,                      // (newSelectedArray) => void
  endpoint = "/categories",      // GET endpoint
}) {
  const [all, setAll] = useState([]);          // [{id, description}]
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const boxRef = useRef(null);

  // Cargar categorías
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const token = localStorage.getItem("jwtToken"); // por si tu API requiere JWT; si no, igual funciona
        const res = await fetch(`${endpoint}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("No se pudieron cargar las categorías");
        const page = await res.json(); // backend devuelve Page<Category>
        const content = Array.isArray(page?.content) ? page.content : page;
        if (mounted) setAll(content ?? []);
      } catch (e) {
        if (mounted) setErr("Error al cargar categorías.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [endpoint]);

  // Cerrar al click afuera
  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selectedIds = useMemo(() => new Set(selected.map((c) => c.id)), [selected]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return all;
    return all.filter((c) => c.description?.toLowerCase().includes(t));
  }, [q, all]);

  const toggle = (cat) => {
    if (selectedIds.has(cat.id)) {
      onChange?.(selected.filter((c) => c.id !== cat.id));
    } else {
      onChange?.([...selected, cat]);
    }
  };

  const removeChip = (id) => onChange?.(selected.filter((c) => c.id !== id));

  return (
    <div className="catms-root" ref={boxRef}>
      <label className="catms-label">Categorías *</label>

      <div
        className={`catms-control ${open ? "open" : ""}`}
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="catms-value">
          {selected.length === 0 ? (
            <span className="catms-placeholder">Elegí una o más categorías…</span>
          ) : (
            <div className="catms-chips">
              {selected.map((c) => (
                <span className="catms-chip" key={c.id} onClick={(e) => e.stopPropagation()}>
                  {c.description}
                  <button
                    type="button"
                    className="catms-chip-x"
                    aria-label={`Quitar ${c.description}`}
                    onClick={() => removeChip(c.id)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="catms-caret">▾</span>
      </div>

      {open && (
        <div className="catms-panel">
          <div className="catms-search">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar categoría…"
              autoFocus
            />
          </div>

          {loading && <div className="catms-info">Cargando…</div>}
          {err && <div className="catms-error">{err}</div>}

          {!loading && !err && (
            <ul className="catms-list" role="listbox">
              {filtered.length === 0 ? (
                <li className="catms-empty">No hay resultados</li>
              ) : (
                filtered.map((c) => (
                  <li key={c.id} className="catms-item" onClick={() => toggle(c)}>
                    <input
                      type="checkbox"
                      readOnly
                      checked={selectedIds.has(c.id)}
                      tabIndex={-1}
                    />
                    <span>{c.description}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
