import { fetchData } from "./fetchMagnoliaData.js";
import { transformDataToSchema } from "./processData/transformToPrompt.js";
import { pageGenTemplate } from "./template-page-prompt.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Saves data to a JSON file
 * @param {Object} data - The data to save
 * @param {string} filename - The name of the file
 * @returns {Promise<void>}
 */
async function saveToFile(data, filename) {
    const outputPath = path.join(__dirname, 'output', filename);
    
    try {
        // Create output directory if it doesn't exist
        await fs.mkdir(path.join(__dirname, 'output'), { recursive: true });
        
        // Save the file with pretty formatting
        await fs.writeFile(
            outputPath, 
            JSON.stringify(data, null, 2), 
            'utf8'
        );
        
        console.log(`✨ Successfully saved to ${outputPath}`);
    } catch (error) {
        console.error('Error saving file:', error);
        throw error;
    }
}

/**
 * Generates a page prompt by fetching data, transforming it, and merging with template
 * @returns {Promise<Object>} The generated page prompt
 * @throws {Error} If data fetching or transformation fails
 */
export async function generatePagePrompt() {
    try {
        // Fetch and transform data
        const pagePromptData = await fetchData();
        if (!pagePromptData) {
            throw new Error("Failed to fetch page data");
        }

        // Transform the data to schema format
        const generatedContentSchema = transformDataToSchema(pagePromptData);
        if (!generatedContentSchema) {
            throw new Error("Failed to transform data to schema");
        }

        // Create a deep copy of the template to avoid mutation
        const finalTemplate = JSON.parse(JSON.stringify(pageGenTemplate));

        // Merge the generated schema with the template
        finalTemplate.properties.contentSchema.properties = {
            ...finalTemplate.properties.contentSchema.properties,
            ...generatedContentSchema,
        };

        return finalTemplate;
    } catch (error) {
        console.error("Error generating page prompt:", error.message);
        throw error;
    }
}

/**
 * Main execution function
 */
export async function run() {
    try {
        const prompt = await generatePagePrompt();
        
        // Generate timestamp for filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        // const filename = `generated-prompt-${timestamp}.json`;
        const filename = `generated-prompt.json`;
        
        // Save both raw and final prompts
        await saveToFile(prompt, filename);
        
        return prompt;
    } catch (error) {
        console.error("❌ Failed to generate prompt:", error.message);
        throw error;
    }
}

// Optional: Export a function to directly execute and handle errors
export async function execute() {
    try {
        const prompt = await run();
        console.log('✨ Generated Prompt:');
        // console.log(JSON.stringify(prompt, null, 2));
        return prompt;
    } catch (error) {
        process.exit(1);
    }
}

// Execute if running directly
execute();