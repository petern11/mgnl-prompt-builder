// Target Prompt Instruction Fields
const FIELDS_ENDWITH = "_prompt"

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
                    componentName: current['componentName'] || null
                };
            }
            parts.pop();
        }
        return {
            template: null,
            componentName: null
        };
    }
    
    function processClassNames(classNamesString) {
        if (!classNamesString) return [];
        return classNamesString.split(' ').filter(Boolean);
    }
    
    function processPromptData(value, key) {
        // Handle image prompts differently
        if (key.toLowerCase().includes('image')) {
            return {
                type: "image",
                description: value.description || "",
                assetFolder: value.targetDamFolder || ""
            };
        }
        
        // Handle RTE components
        const components = [];
        Object.entries(value).forEach(([fieldKey, fieldValue]) => {
            if (fieldKey.match(/^\w+\d+$/)) {
                const component = {
                    tag: fieldValue.htmlProps?.tag,
                    description: fieldValue.description,
                    class: processClassNames(fieldValue.classNames)
                };
                
                if (fieldValue.htmlProps?.maxCharacters) {
                    component.maxCharacters = parseInt(fieldValue.htmlProps.maxCharacters, 10);
                }
                
                components.push(component);
            }
        });
        
        if (components.length > 0) {
            const baseName = key.replace(/_prompt$/, '');
            return {
                type: "html",
                name: baseName,
                components: components
            };
        }
        
        // Handle other fields
        return {
            description: value.description,
            ...(value.targetDamFolder && { assetFolder: value.targetDamFolder })
        };
    }
    
    function traverse(current, path = '') {
        if (current && typeof current === 'object') {
            Object.entries(current).forEach(([key, value]) => {
                const newPath = path ? `${path}.${key}` : key;
                
                if (key.endsWith(FIELDS_ENDWITH)) {
                    const parentInfo = findParentInfo(newPath, obj);
                    const processedValue = processPromptData(value, key);
                    
                    allPrompts[newPath] = {
                        promptData: processedValue,
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
        
        if (Object.keys(data.promptData).length > 0) {
            group.properties.push({
                [path]: data.promptData
            });
        }
        
        return acc;
    }, []);
    
    return groupedResult;
}