// src/components/tabs/BackendTab.jsx
import { useEffect, useState } from "react";
import { setBackendConfig, getBackendConfig, clearBackendConfig } from "../../utils/backendConfig";
import { ActionButton } from "../common/ActionButton.jsx";
import "./BackendTab.css";

export const BackendTab = ({ project }) => {
  const projectId = project?.id;
  const [config, setConfig] = useState(
    () =>
      getBackendConfig(projectId) || {
        models: [
          // starter example; user can edit/add in UI
          {
            name: "Post",
            fields: [
              { name: "title", type: "CharField" },
              { name: "body", type: "TextField" },
            ],
          },
        ],
        relationships: [
          // { from: "Post", type: "FK", to: "User" }
        ],
      }
  );

  useEffect(() => {
    setBackendConfig(projectId, config);
  }, [projectId, config]);

  const addModel = () => {
    setConfig((c) => ({
      ...c,
      models: [...(c.models || []), { name: "", fields: [] }],
    }));
  };

  const removeModel = (idx) => {
    setConfig((c) => ({
      ...c,
      models: c.models.filter((_, i) => i !== idx),
    }));
  };

  const updateModelName = (idx, name) => {
    setConfig((c) => {
      const models = [...c.models];
      models[idx] = { ...models[idx], name };
      return { ...c, models };
    });
  };

  const addField = (mIdx) => {
    setConfig((c) => {
      const models = [...c.models];
      const model = { ...models[mIdx] };
      model.fields = [...(model.fields || []), { name: "", type: "CharField" }];
      models[mIdx] = model;
      return { ...c, models };
    });
  };

  const updateField = (mIdx, fIdx, patch) => {
    setConfig((c) => {
      const models = [...c.models];
      const model = { ...models[mIdx] };
      const fields = [...(model.fields || [])];
      fields[fIdx] = { ...fields[fIdx], ...patch };
      model.fields = fields;
      models[mIdx] = model;
      return { ...c, models };
    });
  };

  const removeField = (mIdx, fIdx) => {
    setConfig((c) => {
      const models = [...c.models];
      const model = { ...models[mIdx] };
      model.fields = model.fields.filter((_, i) => i !== fIdx);
      models[mIdx] = model;
      return { ...c, models };
    });
  };

  const addRelationship = () => {
    setConfig((c) => ({
      ...c,
      relationships: [...(c.relationships || []), { from: "", type: "FK", to: "" }],
    }));
  };

  const updateRelationship = (rIdx, patch) => {
    setConfig((c) => {
      const rels = [...(c.relationships || [])];
      rels[rIdx] = { ...rels[rIdx], ...patch };
      return { ...c, relationships: rels };
    });
  };

  const removeRelationship = (rIdx) => {
    setConfig((c) => {
      const rels = [...(c.relationships || [])];
      rels.splice(rIdx, 1);
      return { ...c, relationships: rels };
    });
  };

  const reset = () => {
    clearBackendConfig(projectId);
    setConfig({ models: [], relationships: [] });
  };

  return (
    <div className="backend-tab">
      <div className="backend-actions">
        <ActionButton variant="primary" size="sm" onClick={addModel}>
          Add Model
        </ActionButton>
        <ActionButton variant="secondary" size="sm" onClick={addRelationship}>
          Add Relationship
        </ActionButton>
        <ActionButton variant="back-secondary" size="sm" onClick={reset}>
          Clear
        </ActionButton>
      </div>

      <div className="backend-grid">
        <section className="backend-section">
          <h3 className="section-title">Models</h3>
          {config.models?.length ? (
            config.models.map((m, mIdx) => (
              <div key={mIdx} className="model-card">
                <div className="model-row">
                  <input
                    className="text-input"
                    placeholder="Model name (e.g., Post)"
                    value={m.name}
                    onChange={(e) => updateModelName(mIdx, e.target.value)}
                  />
                  <ActionButton variant="delete" size="xs" onClick={() => removeModel(mIdx)}>
                    Delete
                  </ActionButton>
                </div>

                <div className="fields">
                  <div className="fields-header">
                    <span>Fields</span>
                    <ActionButton variant="tab" size="xs" onClick={() => addField(mIdx)}>
                      Add Field
                    </ActionButton>
                  </div>
                  {m.fields?.length ? (
                    m.fields.map((f, fIdx) => (
                      <div key={fIdx} className="field-row">
                        <input
                          className="text-input"
                          placeholder="field_name"
                          value={f.name}
                          onChange={(e) => updateField(mIdx, fIdx, { name: e.target.value })}
                        />
                        <select
                          className="select-input"
                          value={f.type}
                          onChange={(e) => updateField(mIdx, fIdx, { type: e.target.value })}>
                          <option>CharField</option>
                          <option>TextField</option>
                          <option>IntegerField</option>
                          <option>BooleanField</option>
                          <option>DateTimeField</option>
                          <option>ForeignKey</option>
                          <option>ManyToManyField</option>
                        </select>
                        <ActionButton variant="delete" size="xs" onClick={() => removeField(mIdx, fIdx)}>
                          Remove
                        </ActionButton>
                      </div>
                    ))
                  ) : (
                    <p className="empty-note">No fields yet.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-note">No models yet. Click “Add Model”.</p>
          )}
        </section>

        <section className="backend-section">
          <h3 className="section-title">Relationships</h3>
          {config.relationships?.length ? (
            config.relationships.map((r, rIdx) => (
              <div key={rIdx} className="rel-row">
                <input
                  className="text-input"
                  placeholder="From model (e.g., Post)"
                  value={r.from}
                  onChange={(e) => updateRelationship(rIdx, { from: e.target.value })}
                />
                <select
                  className="select-input"
                  value={r.type}
                  onChange={(e) => updateRelationship(rIdx, { type: e.target.value })}>
                  <option value="FK">FK</option>
                  <option value="M2M">M2M</option>
                  <option value="O2O">O2O</option>
                </select>
                <input
                  className="text-input"
                  placeholder="To model (e.g., User)"
                  value={r.to}
                  onChange={(e) => updateRelationship(rIdx, { to: e.target.value })}
                />
                <ActionButton variant="delete" size="xs" onClick={() => removeRelationship(rIdx)}>
                  Remove
                </ActionButton>
              </div>
            ))
          ) : (
            <p className="empty-note">No relationships yet.</p>
          )}
        </section>

        <section className="backend-section">
          <h3 className="section-title">Preview</h3>
          <pre className="preview">{JSON.stringify(config, null, 2)}</pre>
          <p className="hint">Saved locally for project #{projectId}. Setup files will include this.</p>
        </section>
      </div>
    </div>
  );
};
