import axios from "axios";
import { processPageDelieveryData } from "./processData/findPromptsInstructions.js"


    
export async function fetchData(endpoint) {
    console.log('endpoint',endpoint);
    if(!endpoint) {
        endpoint =
    "http://localhost:8080/local/.rest/delivery/prompt-content/hubspot-email/prompt-builder/email-prompt-builder/body";
    }
    try {
        const response = await axios.get(endpoint);
        
        if (!response?.data) {
            throw new Error("No data received from endpoint");
        }
        
        try {
            const groupedPrompts = processPageDelieveryData(response.data);
            
            if (!groupedPrompts) {
                throw new Error("Failed to process page delivery data");
            }
            
            return groupedPrompts;
            
        } catch (processingError) {
            console.error("Error processing page delivery data:", processingError);
            throw processingError;
        }
    } catch (error) {
        console.error("Error in fetchData:", error.message);
        
        if (error.response) {
            console.error("Response error details:", {
                status: error.response.status,
                data: error.response.data
            });
        }
        
        throw error;
    }
}