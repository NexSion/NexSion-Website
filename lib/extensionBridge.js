import { EXTENSION_ID } from "./site-config";

function extensionReachable() {
  return (
    typeof window !== "undefined" &&
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    typeof chrome.runtime.sendMessage === "function" &&
    EXTENSION_ID &&
    EXTENSION_ID !== "REPLACE_WITH_YOUR_EXTENSION_ID"
  );
}

/**
 * Sends a message to the NexSion extension via
 * chrome.runtime.onMessageExternal (only works if this origin is listed in
 * the extension's manifest.json "externally_connectable"). Resolves `null`
 * — never throws — if the extension isn't installed, isn't allowed to talk
 * to this origin yet, or doesn't respond, so callers can always fall back
 * gracefully instead of crashing on a browser that lacks `chrome.runtime`
 * entirely (Firefox, Safari, mobile browsers, etc).
 */
export function sendToExtension(message) {
  return new Promise((resolve) => {
    if (!extensionReachable()) {
      console.warn(
        "[NexSion] Not messaging the extension — EXTENSION_ID isn't set in lib/site-config.js, or this isn't Chrome."
      );
      return resolve(null);
    }
    try {
      chrome.runtime.sendMessage(EXTENSION_ID, message, (response) => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[NexSion] Extension didn't respond:",
            chrome.runtime.lastError.message,
            "— check that manifest.json's externally_connectable includes this origin, and that the extension was reloaded after that change."
          );
          resolve(null);
          return;
        }
        resolve(response ?? null);
      });
    } catch (e) {
      console.warn("[NexSion] chrome.runtime.sendMessage threw:", e);
      resolve(null);
    }
  });
}

export function isExtensionEnvironmentAvailable() {
  return extensionReachable();
}
