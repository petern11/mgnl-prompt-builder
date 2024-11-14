import axios from "axios";
import { pageGenTemplate } from "./page-prompt-template.js";
// const { extractAndGroupPromptRteObjects } = require("./findPrompts");
// const { extractAndGroupPromptRteObjects } = require("./findPromptsForRTE");
import {extractAndGroupPromptRteObjects} from "./findPromptsInstructions.js"

const endpoint =
    "http://localhost:8080/local/.rest/delivery/prompt-content/hubspot-email/allegra-allergies-for-midwest-segment/body";

async function fetchData() {
    try {
        const response = await axios.get(endpoint);
        // console.log('Response Data:', response.data);

        let inputJson = response.data;
        // console.log("inputJson", inputJson);

        // Example usage:
        try {
            const groupedPrompts = extractAndGroupPromptRteObjects(inputJson);
            // console.log("Grouped JSON output:", JSON.stringify(groupedPrompts, null, 4));
            return JSON.stringify(groupedPrompts, null, 4);
        } catch (error) {
            console.error("Error processing JSON:", error.message);
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

let pagePromptData = await fetchData();

console.log('pagePromptData',pagePromptData);


let contentSchemaProps = pageGenTemplate.properties.contentSchema.properties
// console.log('contentSchemaProps',contentSchemaProps);