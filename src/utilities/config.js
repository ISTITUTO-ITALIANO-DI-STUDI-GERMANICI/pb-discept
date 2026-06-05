// Centralized application configuration.
// Organizes settings for eXist-db connection, user notifications, and Monaco editor options.

const PORT = {
    CLIENT: 3000,
    PROXY: 3001,
    SERVER: 8080,
}

export const CONFIG = {

    // Will change after testing
    EXISTDB: {
        DEFAULT: {
            URL: "https://existdb2.websoupcloud.it/exist",
            COLLECTION: "/db/apps/discept-sync/data/alignments",
            USER: "tei",
            PASSWORD: "",
            PROXY: `http://localhost:${PORT.PROXY}`,
        }
    },

    MESSAGE: {

        OPTIONS: {
            DEFAULT: {
                ICON: "ℹ️",
                COLOR: "#3b82f6",
            },
            ALERT_TIMEOUT: 3000,
        },

        SUCCESS: {
            ICON: "✅",
            COLOR: "#16a34a",
        },
        ERROR: {
            ICON: "❌",
            COLOR: "#dc2626",
        },
        WARNING: {
            ICON: "⚠️",
            COLOR: "#f59e0b",
        },
        INFO: {
            ICON: "ℹ️",
            COLOR: "#3b82f6",
        },
        DEBUG: {
            ICON: "🐞",
            COLOR: "#8b5cf6",
        },
        TIP: {
            ICON: "💡",
            COLOR: "#14b8a6",
        },
        CRITICAL: {
            ICON: "💀",
            COLOR: "#7e1212",
        },
    },

    TEI: {
        TEMPLATE: (title = "Untitled", lang) => `
            <TEI version="3.3.0" xmlns="http://www.tei-c.org/ns/1.0">
                <teiHeader>
                    <fileDesc>
                        <titleStmt>
                            <title>${title}</title>
                        </titleStmt>
                        <publicationStmt>
                            <p>${lang}</p>
                        </publicationStmt>
                    </fileDesc>
                    <profileDesc>
                        <langUsage>
                            <language ident="${lang}">${lang}</language>
                        </langUsage>
                    </profileDesc>
                </teiHeader>
                <text>
                    <body>
                        <div>
                            <p><!-- Write something here --></p>
                        </div>
                    </body>
                </text>
            </TEI>`
    },

    MONACO: {
        LANGUAGE: "xml",
        THEME: "vs-light",
        AUTO_LAYOUT: true,
        LINE_NUMBERS: "on",
        MINIMAP: {
            enabled: false
        },
        SCROLL_BEYOND_LAST_LINE: false,
        FONT_SIZE: 14,
        WORD_WRAP: "on",
        MARGIN: {
            top: 12,
            bottom: 12
        },
        PADDING: {
            top: 24,
            bottom: 24
        },
        USE_SHADOW_DOM: false
    }

}
