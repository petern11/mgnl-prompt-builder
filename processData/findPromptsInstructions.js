// Target Prompt Instruction Fields and type mappings
const TYPE_SUFFIXES = {
    '_promptRte': 'html',
    '_promptImage': 'image',
    '_promptText': 'text'
};

export function processPageDelieveryData(obj) {
    // Store the @nodes order at the top level
    const nodeOrder = obj['@nodes'] || [];
    const allPrompts = {};
    
    function getTypeFromKey(key) {
        for (const [suffix, type] of Object.entries(TYPE_SUFFIXES)) {
            if (key.endsWith(suffix)) {
                return {
                    type,
                    baseName: key.slice(0, -suffix.length)
                };
            }
        }
        return null;
    }
    
    function processClassNames(classNamesString) {
        if (!classNamesString) return [];
        return classNamesString.split(' ').filter(Boolean);
    }
    
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
    
    function processRTEComponents(promptObj) {
        const components = [];
        
        Object.entries(promptObj).forEach(([key, value]) => {
            const match = key.match(/^(.+?)(\d+)$/);
            if (match && value && typeof value === 'object') {
                const component = {
                    tag: value.htmlProps?.tag,
                    description: value.description,
                    class: processClassNames(value.classNames)
                };
                
                if (value.htmlProps?.maxCharacters) {
                    component.maxCharacters = parseInt(value.htmlProps.maxCharacters, 10);
                }
                
                if (component.tag && component.description) {
                    components.push(component);
                }
            }
        });
        
        return components;
    }
    
    function processPromptValue(value, key) {
        const typeInfo = getTypeFromKey(key);
        if (!typeInfo) return null;
        
        const { type, baseName } = typeInfo;
        
        switch (type) {
            case 'text':
                return {
                    name: baseName,
                    type: 'text',
                    maxCharacters: parseInt(value.maxCharacters, 10) || null,
                    description: value.description || ''
                };
            case 'image':
                return {
                    name: baseName,
                    type: 'image',
                    description: value.description || '',
                    ...(value.targetDamFolder && { assetFolder: value.targetDamFolder })
                };
            case 'html':
                const components = processRTEComponents(value);
                return {
                    name: baseName,
                    type: 'html',
                    components
                };
            default:
                return null;
        }
    }
    
    function getNodeKeyFromPath(path) {
        const match = path.match(/\.(\d+)/);
        return match ? match[1] : null;
    }
    
    function getSortIndex(path) {
        const nodeKey = getNodeKeyFromPath(path);
        return nodeKey ? nodeOrder.indexOf(nodeKey) : -1;
    }
    
    function traverse(current, path = '') {
        if (current && typeof current === 'object') {
            Object.entries(current).forEach(([key, value]) => {
                const newPath = path ? `${path}.${key}` : key;
                const typeInfo = getTypeFromKey(key);
                
                if (typeInfo) {
                    const parentInfo = findParentInfo(newPath, obj);
                    const processedValue = processPromptValue(value, key);
                    
                    if (processedValue) {
                        allPrompts[newPath] = {
                            promptData: processedValue,
                            parentTemplate: parentInfo.template,
                            componentName: parentInfo.componentName
                        };
                    }
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

    // Sort groups based on their first property's position in @nodes
    groupedResult.sort((a, b) => {
        const aPath = a.properties[0] ? Object.keys(a.properties[0])[0] : '';
        const bPath = b.properties[0] ? Object.keys(b.properties[0])[0] : '';
        
        const aIndex = getSortIndex(aPath);
        const bIndex = getSortIndex(bPath);
        
        // Handle cases where one or both paths don't have matching nodes
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        
        return aIndex - bIndex;
    });

    // Sort properties within each group based on @nodes order
    groupedResult.forEach(group => {
        group.properties.sort((a, b) => {
            const aPath = Object.keys(a)[0];
            const bPath = Object.keys(b)[0];
            
            const aIndex = getSortIndex(aPath);
            const bIndex = getSortIndex(bPath);
            
            // Handle cases where one or both paths don't have matching nodes
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            
            return aIndex - bIndex;
        });
    });
    
    return groupedResult;
}