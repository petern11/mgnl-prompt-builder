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
                "Hubspot Email: Content EmailProducts": {
                    "type": "object",
                    "properties": {
                        "components": {
                            "type": "array",
                            "items": [
                                {
                                    "name": "title",
                                    "type": "html",
                                    "components": [
                                        {
                                            "tag": "p",
                                            "description": "A personalized greeting for the email. Consider using a variable like {{ contact.firstname }}.",
                                            "class": [
                                                "text-titleSize3",
                                                "text-primary1"
                                            ]
                                        },
                                        {
                                            "tag": "p",
                                            "content": "JUST FOR YOU",
                                            "class": [
                                                "text-titleSize2",
                                                "text-primary1",
                                                "font-bold"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "name": "product1Image",
                                    "type": "image",
                                    "value": "allegra-email-products-1.png",
                                    "description": "Choose an image for the first featured Allegra product."
                                },
                                {
                                    "name": "product1Content",
                                    "type": "html",
                                    "components": [
                                        {
                                            "tag": "h3",
                                            "class": [
                                                "text-primary1",
                                                "text-titleSize3"
                                            ],
                                            "description": "Create a heading to promote the discount. Consider using a variable like {{ contact.firstname }} and {{ contact.city }}."
                                        },
                                        {
                                            "tag": "p",
                                            "maxCharacters": 120,
                                            "class": "text-titleSize4",
                                            "description": "Provide details about the first product’s benefits and usage. Personalize using a HubL variable like {{ contact.firstname }}."
                                        }
                                    ]
                                },
                                {
                                    "name": "product1ButtonContent",
                                    "type": "text",
                                    "maxCharacters": 20,
                                    "description": "Create a call-to-action for the first product. Consider using personalization with {{ contact.firstname }} and {{ contact.city }}."
                                },
                                {
                                    "name": "product2Image",
                                    "type": "image",
                                    "value": "allegra-email-products-2.png",
                                    "description": "Choose an image for the second featured Allegra product."
                                },
                                {
                                    "name": "product2Content",
                                    "type": "html",
                                    "components": [
                                        {
                                            "tag": "h3",
                                            "class": [
                                                "text-primary1",
                                                "text-titleSize3"
                                            ],
                                            "description": "Create a heading to promote the discount. Consider using a variable like {{ contact.firstname }}."
                                        },
                                        {
                                            "tag": "p",
                                            "maxCharacters": 120,
                                            "class": "text-titleSize4",
                                            "description": "Provide details about the second product’s benefits and usage. Personalize using a HubL variable like {{ contact.firstname }}."
                                        }
                                    ]
                                },
                                {
                                    "name": "product2ButtonContent",
                                    "type": "text",
                                    "maxCharacters": 20,
                                    "description": "Create a call-to-action for the second product. Consider using personalization with {{ contact.firstname }}."
                                }
                            ]
                        }
                    }
                }
                
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
