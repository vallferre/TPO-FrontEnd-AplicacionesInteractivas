import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "../assets/CategoryMultiSelect.css";

const CategoryMultiSelect = ({
  selected = [],              // [{ id, description }]
  onChange,
  apiBase = "http://localhost:8080",
  lockedIds = [],             // ids que no se pueden quitar (EditProduct)
  placeholder = "Buscar categoría…",
}) => {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // refs
  const wrapRef = useRef(null);     // contenedor del campo (ancla)
  const inputRef = useRef(null);
  const dropdownRef = useRef(null); // nodo del dropdown (en portal)

  // posición del dropdown (coordenadas viewport)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  // ---- Fetch categorías
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

    return () => { mounted = false; };
  }, [apiBase]);

  // ---- Cerrar al click afuera (incluyendo afuera del portal)
  useEffect(() => {
    const onDocDown = (e) => {
      const w = wrapRef.current;
      const d = dropdownRef.current;
      if (!w) return;
      const clickInsideAnchor = w.contains(e.target);
      const clickInsideDropdown = d?.contains?.(e.target);
      if (!clickInsideAnchor && !clickInsideDropdown) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  // ---- Filtro
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((c) => c.description?.toLowerCase().includes(q));
  }, [all, query]);

  // ---- Utils selección
  const isSelected = (id) => selected.some((s) => s.id === id);
  const isLocked = (id) => lockedIds?.includes?.(id);

  const addCategory = (cat) => {
    if (isSelected(cat.id)) return;
    onChange?.([...selected, cat]);
    setQuery("");
    // foco de vuelta al input para seguir tipeando
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const removeCategory = (id) => {
    if (isLocked(id)) return;
    onChange?.(selected.filter((s) => s.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = filtered.find((c) => !isSelected(c.id));
      if (first) addCategory(first);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // ---- Posicionamiento del dropdown (portal, fixed)
  const updatePosition = () => {
    const anchor = wrapRef.current;
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    setPos({
      top: r.bottom + 8, // 8px de separación
      left: r.left,
      width: r.width,
    });
  };

  // cuando se abre, calcular y escuchar scroll/resize
  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    // usar capture=true para escuchar scroll de contenedores
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <div className="catms" ref={wrapRef}>
      <label className="catms__label">Categorías *</label>

      {/* chips seleccionadas */}
      {selected.length > 0 && (
        <div className="catms__chips">
          {selected.map((c) => {
            const locked = isLocked(c.id);
            return (
              <span
                className="catms__chip"
                key={c.id}
                title={locked ? "Asignada previamente" : ""}
              >
                {c.description}
                {!locked && (
                  <button
                    type="button"
                    className="catms__chip-close"
                    aria-label={`Quitar ${c.description}`}
                    onClick={() => removeCategory(c.id)}
                  >
                    ×
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* input + botón caret */}
      <div className="catms__inputwrap" onFocus={updatePosition}>
        <input
          ref={inputRef}
          className="catms__input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-expanded={open}
          aria-haspopup="listbox"
        />

        <button
          type="button"
          className="catms__toggle"
          onClick={() => {
            const next = !open;
            setOpen(next);
            if (next) updatePosition();
          }}
          aria-label={open ? "Cerrar lista" : "Abrir lista"}
        >
          <span className="catms__caret" />
        </button>
      </div>

      {/* DROPDOWN en portal */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="catms__dropdown"
            role="listbox"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 100000, // por arriba de todo
            }}
          >
            {loading && <div className="catms__item">Cargando…</div>}
            {error && (
              <div className="catms__item catms__item--error">{error}</div>
            )}

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
                    role="option"
                    aria-selected={disabled}
                  >
                    {c.description}
                  </button>
                );
              })}
          </div>,
          document.body
        )}
    </div>
  );
};

export default CategoryMultiSelect;
