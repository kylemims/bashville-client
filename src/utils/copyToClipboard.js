export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("✅ Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
    alert("❌ Failed to copy. Please select and copy manually.");
  }
};
