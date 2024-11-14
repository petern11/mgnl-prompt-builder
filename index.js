const axios = require("axios");
// const { extractAndGroupPromptRteObjects } = require("./findPrompts");
const { extractAndGroupPromptRteObjects } = require("./findPromptsForRTE");

const endpoint =
    "http://localhost:8080/local/.rest/delivery/prompt-content/hubspot-email/allegra-allergies-relief-1731442902282/body";

async function fetchData() {
    try {
        const response = await axios.get(endpoint);
        // console.log('Response Data:', response.data);

        let inputJson = response.data;
        // console.log("inputJson", inputJson);

        // Example usage:
        try {
            const groupedPrompts = extractAndGroupPromptRteObjects(inputJson);
            console.log("Grouped JSON output:", JSON.stringify(groupedPrompts, null, 2));
        } catch (error) {
            console.error("Error processing JSON:", error.message);
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

fetchData();
