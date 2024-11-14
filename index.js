import axios from "axios";

import { pageGenTemplate } from "./page-prompt-template.js";
import { processPageDelieveryData } from "./findPromptsInstructions.js"
import { transformComponentData } from "./transformToPrompt.js"

const endpoint =
    "http://localhost:8080/local/.rest/delivery/prompt-content/hubspot-email/allegra-allergies-for-midwest-segment/body";

async function fetchData() {
    try {
        const response = await axios.get(endpoint);
        const resData = response.data;
        
        // console.log('resData',resData);
        try {
            const groupedPrompts = processPageDelieveryData(resData);
            // return JSON.stringify(groupedPrompts, null, 4);
            return groupedPrompts
        } catch (error) {
            console.error("Error processing JSON:", error.message);
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}



let pagePromptData = await fetchData();


const generatedContentSchema = transformComponentData(pagePromptData);
pageGenTemplate.properties.contentSchema.properties = {...pageGenTemplate.properties.contentSchema.properties, ...generatedContentSchema}


console.log(JSON.stringify(pageGenTemplate, null, 2));

