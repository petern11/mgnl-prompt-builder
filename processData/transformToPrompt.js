export function transformDataToSchema(data) {
    const result = {};
    
    function cleanComponentName(name) {
        return name.split('.').pop().split('_')[0];
    }
    
    data.forEach(component => {
        const componentTitle = component.componentName || getComponentNameFromTemplate(component.parentTemplate);
        
        result[componentTitle] = {
            type: "object",
            properties: {
                components: {
                    type: "array",
                    items: []
                }
            }
        };
        
        component.properties.forEach(prop => {
            Object.entries(prop).forEach(([key, value]) => {
                const cleanName = cleanComponentName(key);
                
                // Handle image type
                if (value.type === "image") {
                    const imageItem = {
                        name: cleanName,
                        type: "image",
                        description: value.description,
                        assetFolder: value.assetFolder
                    };
                    result[componentTitle].properties.components.items.push(imageItem);
                }
                // Handle HTML type with components
                else if (value.type === "html" && value.components) {
                    const componentItem = {
                        name: cleanName,
                        type: "html",
                        components: value.components.map(comp => ({
                            tag: comp.tag,
                            maxCharacters: comp.maxCharacters,
                            class: comp.class,
                            description: comp.description
                        }))
                    };
                    result[componentTitle].properties.components.items.push(componentItem);
                }
                // Handle other fields
                else if (value.description) {
                    const componentItem = {
                        name: cleanName,
                        type: determineType(cleanName),
                        description: value.description,
                        ...(value.assetFolder && { assetFolder: value.assetFolder })
                    };
                    result[componentTitle].properties.components.items.push(componentItem);
                }
            });
        });
        
        // Sort items to ensure consistent order
        result[componentTitle].properties.components.items.sort((a, b) => {
            // Put images first, then text content
            if (a.type === "image" && b.type !== "image") return -1;
            if (a.type !== "image" && b.type === "image") return 1;
            return a.name.localeCompare(b.name);
        });
    });
    
    return result;
}

function determineType(name) {
    if (name.toLowerCase().includes('image')) {
        return 'image';
    }
    return 'html';
}

function getComponentNameFromTemplate(template) {
    if (!template) return "Unknown Component";
    
    const parts = template.split('/');
    const lastPart = parts[parts.length - 1];
    
    return lastPart
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2');
}