export const pageGenTemplate = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "task": {
            "type": "string",
            "const": "Generate content for ${brand} ${product_type} medication. Content should be written for the target audience."
        },
        "brand": {
            "type": "string",
            "const": "${brand}"
        },
        "product_type": {
            "type": "string",
            "const": "${product_type} relief medication"
        },
        "target_audience": {
            "type": "string",
            "const": "Make sure to mention the target audience: ${hubspot_list}"
        },
        "tone": {
            "type": "string",
            "const": "Professional, reassuring, and informative"
        },
        "key_benefits": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "const": [
                "Fast-acting relief",
                "Non-drowsy formula",
                "24-hour protection"
            ]
        },
        "instructions": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "const": [
                "Use the following JSON as a schema for each instance of the description property.",
                "Choose the most appropriate image based on the fileName property of each asset & don’t use the same asset more than once.",
                "Ensure all content aligns with FDA guidelines for over-the-counter allergy medication advertising.",
                "Maintain a consistent brand voice across all generated content.",
                "Incorporate key benefits and product features where appropriate.",
                "Tailor language to the target audience, using clear and accessible terms.",
                "Optimize content for email viewing, considering mobile responsiveness."
            ]
        },
        "contentSchema": {
            "type": "object",
            "properties": {
                "default": {
                    "type": "string",
                    "description": "Generate a dynamic, SEO-optimized page title and URL that includes ${brand} ${product_type} for ${hubspot_list}. Make the title varied by incorporating related keywords, product benefits, or usage scenarios to improve search ranking and click-through rates."
                },
            }
        },
        "required": [
            "task",
            "brand",
            "product_type",
            "target_audience",
            "tone",
            "key_benefits",
            "instructions",
            "hubspotVariables",
            "contentSchema"
        ]
    }
}
