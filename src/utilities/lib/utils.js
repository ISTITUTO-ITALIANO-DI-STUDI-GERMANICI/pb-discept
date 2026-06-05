// Function for intending XML sources

export function formatXML(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");

    const xslt = `
    <xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

        <xsl:output method="xml" indent="yes"/>

        <xsl:strip-space elements="*"/>

        <xsl:template match="@*|node()">
            <xsl:copy>
                <xsl:apply-templates select="@*|node()"/>
            </xsl:copy>
        </xsl:template>

    </xsl:stylesheet>`;

    const xsltParser = new DOMParser();
    const xsltDoc = xsltParser.parseFromString(xslt, "application/xml");

    const processor = new XSLTProcessor();
    processor.importStylesheet(xsltDoc);

    const result = processor.transformToDocument(xml);

    return new XMLSerializer().serializeToString(result);
}