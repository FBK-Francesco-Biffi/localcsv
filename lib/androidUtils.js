function formatAndroidResources(data) {
    const normalizedArray = normalizeStringArray(data.resources['string-array'])
    const resources = []
    resources.push(...data.resources.string)
    resources.push(...normalizedArray)
    return resources
}

function normalizeStringArray(stringArray) {
    const normalized = []
    stringArray.forEach(array => {
        array.item.forEach((value, index) => {
            normalized.push({
                _: value,
                $: {
                    name: `${array.$.name}_item_${index + 1}`
                }
            })
        })
    })
    return normalized
}

module.exports = { formatAndroidResources };