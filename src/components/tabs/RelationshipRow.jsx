import { InfoTip } from "../common/InfoTip";
import "./RelationshipRow.css";

const ON_DELETE = ["CASCADE", "PROTECT", "SET_NULL", "SET_DEFAULT", "DO_NOTHING"];

const toFieldName = (modelName) => {
  if (!modelName) return "";
  // naive camel->snake-ish: "BlogPost" -> "blog_post"
  const snake = modelName.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  return snake;
};

const defaultRelatedName = (toModel) => {
  if (!toModel) return "";
  const base = toFieldName(toModel);
  // simple pluralization for UX (backend can still override)
  if (base.endsWith("s")) return base;
  if (base.endsWith("y")) return base.slice(0, -1) + "ies";
  return base + "s";
};

export const RelationshipRow = ({ rel, rIdx, models, onChange, onRemove }) => {
  const modelNames = (models || []).map((m) => m.name).filter(Boolean);
  const isFK = rel.type === "FK";
  const isM2M = rel.type === "M2M";
  const isO2O = rel.type === "O2O";

  const fromUnknown = rel.from && !modelNames.includes(rel.from);
  const toUnknown = rel.to && !modelNames.includes(rel.to);

  // Preview string that shows what we’ll generate
  let preview = "";
  if (rel.from && rel.to) {
    const fieldName = isM2M ? toFieldName(rel.to) : toFieldName(rel.to);
    if (isFK) {
      preview = `${rel.from}.${fieldName}: ForeignKey("${rel.to}", on_delete=${
        rel.on_delete || "CASCADE"
      }, related_name="${rel.related_name || defaultRelatedName(rel.from)}")`;
    } else if (isM2M) {
      preview = `${rel.from}.${fieldName}: ManyToManyField("${rel.to}"${
        rel.related_name ? `, related_name="${rel.related_name}"` : ""
      })`;
    } else if (isO2O) {
      preview = `${rel.from}.${fieldName}: OneToOneField("${rel.to}", on_delete=${
        rel.on_delete || "CASCADE"
      }${rel.related_name ? `, related_name="${rel.related_name}"` : ""})`;
    }
  }

  return (
    <section className="modelrel-row">
      <div className={`rel-row ${fromUnknown || toUnknown ? "rel-row--warn" : ""}`}>
        {/* FROM model */}
        <select
          className="select-input"
          value={rel.from || ""}
          onChange={(e) => onChange(rIdx, { from: e.target.value })}>
          <option value="">From…</option>
          {modelNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {/* type with inline help */}
        <select
          className="select-input"
          value={rel.type}
          onChange={(e) => onChange(rIdx, { type: e.target.value })}>
          <option value="FK">FK</option>
          <option value="M2M">M2M</option>
          <option value="O2O">O2O</option>
        </select>

        {/* TO model */}
        <select
          className="select-input"
          value={rel.to || ""}
          onChange={(e) => {
            const patch = { to: e.target.value };
            // set sensible defaults when user picks a target:
            if (!rel.related_name && rel.from) {
              patch.related_name = defaultRelatedName(rel.from);
            }
            onChange(rIdx, patch);
          }}>
          <option value="">To…</option>
          {modelNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <InfoTip label="Relationship types">
          <p>
            <strong>FK</strong> (ForeignKey): many <em>from</em> → one <em>to</em>. Adds a field on{" "}
            <code>from</code>.
          </p>
          <p>
            <strong>M2M</strong>: many ↔ many (Django uses a join table for you).
          </p>
          <p>
            <strong>O2O</strong> (OneToOne): exactly one ↔ one (a specialized FK with unique).
          </p>
        </InfoTip>
        {/* on_delete for FK & O2O */}
        {/* <section className="cascade-row"></section>*/}
        {(isFK || isO2O) && (
          <select
            className="select-input"
            value={rel.on_delete || "CASCADE"}
            onChange={(e) => onChange(rIdx, { on_delete: e.target.value })}
            title="What happens to child rows if the parent is deleted?">
            {ON_DELETE.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        )}

        {/* related_name (optional) */}
        <input
          className="text-input"
          placeholder="related_name (optional)"
          value={rel.related_name || ""}
          onChange={(e) => onChange(rIdx, { related_name: e.target.value })}
        />

        <button className="btn btn-xs btn-danger" type="button" onClick={() => onRemove(rIdx)}>
          Remove
        </button>

        {/* soft warnings */}
        {(fromUnknown || toUnknown) && (
          <div className="rel-hint rel-hint--warn">
            {fromUnknown && <span>“{rel.from}” isn’t in Models.</span>}
            {toUnknown && <span> “{rel.to}” isn’t in Models.</span>}
          </div>
        )}

        {/* live preview */}
        {preview && (
          <div className="rel-hint">
            <code>{preview}</code>
          </div>
        )}
      </div>
    </section>
  );
};
