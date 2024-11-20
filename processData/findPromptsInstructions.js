
// Target Prompt Instruction Fields
const FIELDS_ENDWITH = "_promptRte"
const  RTE_FIELDS = "textContent_promptRte" // Need to know so we can dig deeper

export function processPageDelieveryData(obj) {
    const allPrompts = {};
    
    function findParentInfo(path, originalObj) {
        const parts = path.split('.');
        let current = originalObj;
        parts.pop();
        
        while (parts.length > 0) {
            current = parts.reduce((obj, part) => obj && obj[part], originalObj);
            if (current && current['mgnl:template']) {
                return {
                    template: current['mgnl:template'],
                    componentName: current['componentName'] || null // Get the direct componentName property
                };
            }
            parts.pop();
        }
        return {
            template: null,
            componentName: null
        };
    }
    
    function traverse(current, path = '') {
        if (current && typeof current === 'object') {
            Object.entries(current).forEach(([key, value]) => {
                const newPath = path ? `${path}.${key}` : key;
                
                if (key.endsWith(FIELDS_ENDWITH)) {
                    const parentInfo = findParentInfo(newPath, obj);
                    const nestedItems = [];
                    
                    Object.entries(value).forEach(([k, v]) => {
                        if (k.startsWith(RTE_FIELDS) && !isNaN(k.slice(-1))) {
                            nestedItems.push(v);
                        }
                    });
                    
                    const modifiedValue = {...value};
                    if (nestedItems.length > 0) {
                        modifiedValue.items = nestedItems;
                        Object.keys(modifiedValue).forEach(k => {
                            if (k.startsWith(RTE_FIELDS) && !isNaN(k.slice(-1))) {
                                delete modifiedValue[k];
                            }
                        });
                    }
                    
                    allPrompts[newPath] = {
                        promptData: modifiedValue,
                        parentTemplate: parentInfo.template,
                        componentName: parentInfo.componentName
                    };
                }
                
                if (value && typeof value === 'object') {
                    traverse(value, newPath);
                }
            });
        }
    }
    
    traverse(obj);
    
    const groupedResult = Object.entries(allPrompts).reduce((acc, [path, data]) => {
        const prefix = path.split('.')[0];
        const template = data.parentTemplate;
        const componentName = data.componentName;
        
        let group = acc.find(g => g.parentTemplate === template);
        
        if (!group) {
            group = {
                parentTemplate: template,
                componentName: componentName,
                properties: []
            };
            acc.push(group);
        }
        
        group.properties.push({
            [path]: data.promptData
        });
        
        return acc;
    }, []);
    
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