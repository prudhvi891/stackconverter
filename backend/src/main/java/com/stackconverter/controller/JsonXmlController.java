package com.stackconverter.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/json-xml")
public class JsonXmlController {

    private final ObjectMapper mapper = new ObjectMapper();

    public JsonXmlController() {
        mapper.writerWithDefaultPrettyPrinter(); // Pretty JSON
    }

    // =====================================================================================
    // 1️⃣ JSON → XML  (pretty formatted + correct attributes)
    // =====================================================================================
    @PostMapping("/json-to-xml")
    public ResponseEntity<?> jsonToXml(@RequestParam("file") MultipartFile file) {
        try {
            String jsonText = new String(file.getBytes(), StandardCharsets.UTF_8);
            JsonNode rootNode = mapper.readTree(jsonText);

            // Determine root element
            String rootName = "root";
            JsonNode content = rootNode;

            if (rootNode.isObject() && rootNode.size() == 1) {
                rootName = rootNode.fieldNames().next();
                content = rootNode.get(rootName);
            }

            // Create XML DOM document
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            secureXml(dbf);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.newDocument();

            // Build XML recursively
            Element rootElem = buildXml(doc, rootName, content);
            doc.appendChild(rootElem);

            // Convert DOM to pretty XML string
            String prettyXml = toPrettyXml(doc);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"converted.xml\"")
                    .contentType(MediaType.APPLICATION_XML)
                    .body(prettyXml.getBytes(StandardCharsets.UTF_8));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(("Invalid JSON: " + e.getMessage()).getBytes());
        }
    }


    // Build XML element recursively
    private Element buildXml(Document doc, String tag, JsonNode node) {
        Element elem = doc.createElement(tag);

        if (node == null || node.isNull()) return elem;
        if (node.isValueNode()) {
            elem.setTextContent(node.asText());
            return elem;
        }

        if (node.isArray()) {
            // Arrays handled separately — caller loops over array
            return elem;
        }

        ObjectNode obj = (ObjectNode) node;

        // Handle attributes (@attr) and #text
        List<String> childTags = new ArrayList<>();
        String textValue = null;

        for (Iterator<String> it = obj.fieldNames(); it.hasNext(); ) {
            String key = it.next();
            JsonNode val = obj.get(key);

            if (key.startsWith("@")) {
                elem.setAttribute(key.substring(1), val.asText());
            } else if (key.equals("#text")) {
                textValue = val.asText();
            } else {
                childTags.add(key);
            }
        }

        if (textValue != null) elem.setTextContent(textValue);

        // Process child elements
        for (String childTag : childTags) {
            JsonNode childNode = obj.get(childTag);

            if (childNode.isArray()) {
                for (JsonNode arrItem : childNode)
                    elem.appendChild(buildXml(doc, childTag, arrItem));
            } else {
                elem.appendChild(buildXml(doc, childTag, childNode));
            }
        }

        return elem;
    }


    // Pretty-print XML from Document
    private String toPrettyXml(Document doc) throws Exception {
        Transformer t = TransformerFactory.newInstance().newTransformer();
        t.setOutputProperty(OutputKeys.INDENT, "yes");
        t.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
        t.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
        t.setOutputProperty(OutputKeys.METHOD, "xml");

        StringWriter sw = new StringWriter();
        t.transform(new DOMSource(doc), new StreamResult(sw));
        return sw.toString();
    }


    // =====================================================================================
    // 2️⃣ XML → JSON  (pretty formatted + correct @attribute + #text)
    // =====================================================================================
    @PostMapping("/xml-to-json")
    public ResponseEntity<?> xmlToJson(@RequestParam("file") MultipartFile file) {
        try {
            String xmlText = new String(file.getBytes(), StandardCharsets.UTF_8);

            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            secureXml(dbf);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new ByteArrayInputStream(xmlText.getBytes()));

            Element root = doc.getDocumentElement();
            ObjectNode jsonRoot = mapper.createObjectNode();
            jsonRoot.set(root.getNodeName(), elementToJson(root));

            String prettyJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonRoot);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"converted.json\"")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(prettyJson.getBytes(StandardCharsets.UTF_8));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(("Invalid XML: " + e.getMessage()).getBytes());
        }
    }


    // Convert XML Element into JSON
    private JsonNode elementToJson(Element elem) {
        ObjectNode json = mapper.createObjectNode();

        // Attributes → @attr
        NamedNodeMap attrs = elem.getAttributes();
        for (int i = 0; i < attrs.getLength(); i++) {
            Node a = attrs.item(i);
            json.put("@" + a.getNodeName(), a.getNodeValue());
        }

        NodeList children = elem.getChildNodes();

        boolean hasElementChildren = false;
        StringBuilder text = new StringBuilder();
        Map<String, List<JsonNode>> grouped = new LinkedHashMap<>();

        for (int i = 0; i < children.getLength(); i++) {
            Node n = children.item(i);

            if (n.getNodeType() == Node.ELEMENT_NODE) {
                hasElementChildren = true;
                Element child = (Element) n;
                grouped.computeIfAbsent(child.getNodeName(), k -> new ArrayList<>())
                        .add(elementToJson(child));

            } else if (n.getNodeType() == Node.TEXT_NODE) {
                String t = n.getNodeValue().trim();
                if (!t.isEmpty()) text.append(t);
            }
        }

        // Child elements
        for (var entry : grouped.entrySet()) {
            if (entry.getValue().size() == 1)
                json.set(entry.getKey(), entry.getValue().get(0));
            else {
                ArrayNode arr = mapper.createArrayNode();
                entry.getValue().forEach(arr::add);
                json.set(entry.getKey(), arr);
            }
        }

        // Add #text if exists
        if (text.length() > 0) json.put("#text", text.toString());

        return json;
    }


    // Secure XML parser
    private void secureXml(DocumentBuilderFactory dbf) {
        try {
            dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
            dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        } catch (Exception ignored) {}
    }
}
