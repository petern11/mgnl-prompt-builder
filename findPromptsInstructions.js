export function extractAndGroupPromptRteObjects(obj) {
    // First, get all promptRte objects
    const allPrompts = {};
    
    function traverse(current, path = '') {
        if (current && typeof current === 'object') {
            Object.entries(current).forEach(([key, value]) => {
                const newPath = path ? `${path}.${key}` : key;
                
                if (key.endsWith('_promptRte')) {
                    const parentTemplate = findParentTemplate(newPath, obj);
                    // Convert nested promptRte items to array
                    const nestedItems = [];
                    Object.entries(value).forEach(([k, v]) => {
                        if (k.startsWith('textContent_promptRte') && !isNaN(k.slice(-1))) {
                            nestedItems.push(v);
                        }
                    });
                    
                    // Create modified value object with array if needed
                    const modifiedValue = {...value};
                    if (nestedItems.length > 0) {
                        modifiedValue.items = nestedItems;
                        // Remove the original numbered properties
                        Object.keys(modifiedValue).forEach(k => {
                            if (k.startsWith('textContent_promptRte') && !isNaN(k.slice(-1))) {
                                delete modifiedValue[k];
                            }
                        });
                    }
                    
                    allPrompts[newPath] = {
                        promptData: modifiedValue,
                        parentTemplate
                    };
                }
                
                if (value && typeof value === 'object') {
                    traverse(value, newPath);
                }
            });
        }
    }
    
    function findParentTemplate(path, originalObj) {
        const parts = path.split('.');
        let current = originalObj;
        parts.pop();
        
        while (parts.length > 0) {
            current = parts.reduce((obj, part) => obj && obj[part], originalObj);
            if (current && current['mgnl:template']) {
                return current['mgnl:template'];
            }
            parts.pop();
        }
        return null;
    }
    
    traverse(obj);
    
    // Group by prefix and template
    const groupedResult = Object.entries(allPrompts).reduce((acc, [path, data]) => {
        const prefix = path.split('.')[0];
        const template = data.parentTemplate;
        
        let group = acc.find(g => g.parentTemplate === template);
        
        if (!group) {
            group = {
                parentTemplate: template,
                properties: []
            };
            acc.push(group);
        }
        
        group.properties.push({
            [path]: data.promptData
        });
        
        return acc;
    }, []);
    
    // Sort groups and properties
    groupedResult.sort((a, b) => {
        const aPrefix = a.properties[0] ? Object.keys(a.properties[0])[0] : '';
        const bPrefix = b.properties[0] ? Object.keys(b.properties[0])[0] : '';
        return aPrefix.localeCompare(bPrefix);
    });
    
    try {
        const jsonString = JSON.stringify(groupedResult, (key, value) => {
            if (value === undefined) return null;
            if (value === Infinity) return "Infinity";
            if (Number.isNaN(value)) return "NaN";
            return value;
        }, 2);
        
        return JSON.parse(jsonString);
    } catch (error) {
        throw new Error(`Failed to create valid JSON: ${error.message}`);
    }
}