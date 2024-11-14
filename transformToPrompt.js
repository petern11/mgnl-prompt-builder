export function transformComponentData(data) {
    const result = {};
    
    // Helper function to clean component names
    function cleanComponentName(name) {
        // Remove everything before and including the dot
        return name.split('.').pop();
    }
    
    // Process each component group
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
        
        // Process each property in the component
        component.properties.forEach(prop => {
            Object.entries(prop).forEach(([key, value]) => {
                // Clean the component name by removing prefix and dot
                const cleanName = cleanComponentName(key.split('_')[0]);
                
                // Handle items array if it exists
                if (value.items) {
                    value.items.forEach(item => {
                        const componentItem = {
                            name: cleanName,
                            type: getTypeFromTag(item.htmlProps?.tag),
                            components: [{
                                tag: item.htmlProps?.tag,
                                maxCharacters: parseInt(item.htmlProps?.maxCharacters) || null,
                                description: item.description,
                                className: item.classNames
                            }]
                        };
                        result[componentTitle].properties.components.items.push(componentItem);
                    });
                } else {
                    let targetType = 'html' // this needs to change 
                    if((cleanName.toLowerCase()).includes('image')){
                        targetType = 'image'
                    }
                    // Handle single items
                    const componentItem = {
                        name: cleanName,
                        type: targetType,
                        components: [{
                            description: value.description,
                            ...(value.targetDamFolder && { targetDamFolder: value.targetDamFolder })
                        }]
                    };
                    result[componentTitle].properties.components.items.push(componentItem);
                }
            });
        });
    });
    
    return result;
}

// Helper function to get component name from template if not directly provided
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

// Helper function to determine type based on HTML tag
function getTypeFromTag(tag) {
    switch (tag) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'p':
            return 'html';
        default:
            return 'html';
    }
}

