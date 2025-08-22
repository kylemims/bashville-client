// src/utils/addToStash.js
import { getCommands, createCommand } from "../services/commandService";

export async function addCommandsToStash(commands) {
  // de‑dupe by label so repeated clicks don’t create duplicates
  const existing = await getCommands();
  const have = new Set(existing.map((c) => c.label.trim().toLowerCase()));

  const created = [];
  for (const c of commands) {
    const key = c.label.trim().toLowerCase();
    if (have.has(key)) continue;
    const saved = await createCommand({ label: c.label, command_text: c.command_text });
    created.push(saved);
    have.add(key);
  }
  return created;
}
