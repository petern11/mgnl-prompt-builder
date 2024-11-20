import { fetchData } from "./fetchMagnoliaData.js";
import { transformDataToSchema } from "./processData/transformToPrompt.js";
import { pageGenTemplate } from "./template-page-prompt.js";

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

        // console.log('✨ Generated Prompt:');
        // console.log(JSON.stringify(prompt, null, 2));

        return prompt;
    } catch (error) {
        console.error("❌ Failed to generate prompt:", error.message);
        throw error;
    }
}

// Optional: Export a function to directly execute and handle errors
export async function execute() {
    try {
        return await run();
    } catch (error) {
        process.exit(1);
    }
}
