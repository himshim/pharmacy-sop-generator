/**
 * Pharmacy SOP Generator - Enhanced Utilities
 * Common utility functions with improved security
 * @version 2.0.0
 */

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 */
function today() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Escape HTML to prevent XSS attacks
 * Enhanced version with comprehensive character map
 * @param {string} str - String to escape
 * @returns {string}
 */
function escapeHTML(str) {
  if (!str) return "";

  const htmlEscapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return String(str).replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Sanitize text using DOM API (XSS protection)
 * @param {string} text - Text to sanitize
 * @returns {string}
 */
function sanitizeText(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function}
 */
function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success, error, warning, info)
 */
function showToast(message, type = "info") {
  const color = CONFIG.TOAST_COLORS[type] || CONFIG.TOAST_COLORS.info;

  if (typeof M !== "undefined" && M.toast) {
    M.toast({
      html: escapeHTML(message),
      classes: color,
      displayLength: CONFIG.TOAST_DURATION,
    });
  } else {
    // Fallback for development
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message);
  }
}

/**
 * Download data as JSON file
 * @param {Object} data - Data to download
 * @param {string} filename - Filename for download
 */
function downloadJSON(data, filename) {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error("Download failed:", e);
    return false;
  }
}
