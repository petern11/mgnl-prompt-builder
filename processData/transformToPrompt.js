// In transformToPrompt.js:

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
                
                let item;
                switch (value.type) {
                    case 'text':
                        item = {
                            name: cleanName,
                            type: "text",
                            maxCharacters: value.maxCharacters,
                            description: value.description
                        };
                        break;
                        
                    case 'image':
                        item = {
                            name: cleanName,
                            type: "image",
                            description: value.description,
                            ...(value.assetFolder && { assetFolder: value.assetFolder })
                        };
                        break;
                        
                    case 'html':
                        if (value.components && value.components.length > 0) {
                            item = {
                                name: cleanName,
                                type: "html",
                                components: value.components.map(comp => ({
                                    tag: comp.tag,
                                    maxCharacters: comp.maxCharacters,
                                    class: comp.class,
                                    description: comp.description
                                }))
                            };
                        }
                        break;
                }
                
                if (item) {
                    result[componentTitle].properties.components.items.push(item);
                }
            });
        });
        
        // Sort items - images first, then text, then html
        result[componentTitle].properties.components.items.sort((a, b) => {
            const typeOrder = { image: 1, text: 2, html: 3 };
            if (typeOrder[a.type] !== typeOrder[b.type]) {
                return typeOrder[a.type] - typeOrder[b.type];
            }
            return a.name.localeCompare(b.name);
        });
    });
    
    return result;
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