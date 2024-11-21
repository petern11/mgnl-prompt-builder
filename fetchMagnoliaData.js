import axios from "axios";
import { processPageDelieveryData } from "./processData/findPromptsInstructions.js"

const endpoint =
    "http://localhost:8080/local/.rest/delivery/prompt-content/hubspot-email/prompt-builder/email-prompt-builder/body";
    

export async function fetchData() {
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
