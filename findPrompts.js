export function extractAndGroupPromptRteObjects(obj) {
    // First, get all promptRte objects
    const allPrompts = {};
    
    function traverse(current, path = '') {
        if (current && typeof current === 'object') {
            Object.entries(current).forEach(([key, value]) => {
                const newPath = path ? `${path}.${key}` : key;
                
                if (key.endsWith('_promptRte')) {
                    const parentTemplate = findParentTemplate(newPath, obj);
                    allPrompts[newPath] = {
                        promptData: value,
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
        
        // Find existing group with same template
        let group = acc.find(g => g.parentTemplate === template);
        
        if (!group) {
            group = {
                parentTemplate: template,
                properties: []
            };
            acc.push(group);
        }
        
        // Add property to group
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
    
    // Ensure valid JSON
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

