// This module defines a centralized set of alert messages for the application, categorized by type
// (success, error, warning, info) and context (connection, authentication, document operations, synchronization, etc.). 
// The messages can be easily referenced throughout the codebase to maintain consistency in user notifications.

export const ALERT = {

  SUCCESS: {

    GENERIC: "Operation completed successfully",

    CONNECTION: {
      EXISTDB: "Connection to eXist-db established successfully",
      PROXY: "Connection to proxy established",
    },

    AUTH: {
      LOGIN: "Logged in successfully",
      LOGOUT: "Logged out successfully",
    },

    DOCUMENT: {
      SAVED: (name) => `"${name}" saved successfully`,
      DELETED: (name) => `"${name}" deleted successfully`,
      UPLOADED: (name) => `"${name}" uploaded successfully`,
      EXPORTED: (fmt) => `Document exported as ${fmt}`,
    },

    SYNC: {
      COMPLETE: "Synchronization completed",
      PUBLISHED: "Document published to eXist-db",
    },

    SETTINGS: {
      SAVED: "Settings saved",
      RESET: "Settings reset to defaults",
    },

    TEI: {
      VALIDATION: "TEI document is valid",
    },

    CLIPBOARD: {
      COPIED: "Copied to clipboard",
    },
  },

  ERROR: {

    GENERIC: "An unexpected error occurred",

    CONNECTION: {
      EXISTDB: "Failed to connect to eXist-db",
      PROXY: "Error connecting to proxy server",
      TIMEOUT: "Connection timed out — please retry",
      OFFLINE: "No network connection detected",
    },

    AUTH: {
      UNAUTHORIZED: "Authentication required",
      FORBIDDEN: "You do not have permission to perform this action",
      SESSION: "Your session has expired — please log in again",
      INVALID_CREDS: "Invalid username or password",
    },

    DOCUMENT: {
      NOT_FOUND: (name) => `"${name}" could not be found`,
      SAVE_FAILED: "Failed to save document — please try again",
      DELETE_FAILED: "Failed to delete document",
      PARSE: "XML parsing error — check document structure",
      SCHEMA: "Document does not conform to the TEI schema",
      UPLOAD: (name) => `Failed to upload "${name}"`,
      EXPORT: (fmt) => `Export to ${fmt} failed`,
    },

    SYNC: {
      FAILED: "Synchronization failed",
      CONFLICT: "Sync conflict detected — manual resolution required",
    },

    FORM: {
      VALIDATION: "Please fix the highlighted fields before continuing",
      REQUIRED: (field) => `"${field}" is required`,
    },

    SETTINGS: {
      SAVE_FAILED: "Failed to save settings",
    },

    TEI: {
      VALID: "TEI is not valid.",
      VALIDATION: (count) =>
        `TEI validation failed — ${count} error${count === 1 ? "" : "s"} detected`
    }

  },

  WARNING: {
    UNSAVED_CHANGES: "You have unsaved changes",

    CONNECTION: {
      SLOW: "Slow connection detected — some operations may take longer",
      RECONNECTING: "Connection lost — attempting to reconnect…",
    },

    AUTH: {
      SESSION_EXPIRING: "Your session will expire in 5 minutes",
    },

    DOCUMENT: {
      LARGE_FILE: (mb) => `Large file (${mb} MB) — loading may be slow`,
      READONLY: "This document is read-only",
      LOCKED: (user) => `Document is currently locked by ${user}`,
      DEPRECATED_SCHEMA: "This document uses a deprecated TEI schema version",
    },

    SYNC: {
      PENDING: (n) => `${n} change${n === 1 ? "" : "s"} pending sync`,
    },

    TEI: {
      VALIDATION: (count) => `${count} TEI validation error${count === 1 ? "" : "s"} detected`,
    }

  },

  INFO: {
    DIALOG_OPEN: "Dialog opened",
    DIALOG_CLOSE: "Dialog closed",
    LOADING: "Loading…",

    CONNECTION: {
      CONNECTING: "Connecting to eXist-db…",
    },

    AUTH: {
      WELCOME: (user) => `Welcome, ${user}`,
    },

    DOCUMENT: {
      OPENING: (name) => `Opening "${name}"…`,
      PROCESSING: "Processing document…",
      NO_RESULTS: "No results found",
      READONLY: "Viewing document in read-only mode",
    },

    SYNC: {
      IN_PROGRESS: "Sync in progress…",
      UP_TO_DATE: "Everything is up to date",
    },

    CLIPBOARD: {
      PASTE_READY: "Ready to paste",
    },

    TEI: {
      VALIDATING: "Validating current TEI..."
    }

  },

  TEST: {
    GENERIC: "🧪 Alert system test",
    MESSAGE: "🧪 This is a test alert message",
    PAYLOAD: (data) => `🧪 Payload: ${JSON.stringify(data)}`,
    ROUNDTRIP: (ms) => `🧪 Round-trip: ${ms} ms`,
    CUSTOM: (msg) => `🧪 ${msg}`,
  },

};
