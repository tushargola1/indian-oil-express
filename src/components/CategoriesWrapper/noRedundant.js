export function noRedundant(array) {
    let unique = []
    if (Array.isArray(array) && array.length > 0) {
        array.forEach((item) => {
            if (item.hasOwnProperty("category") && !unique.includes(item['category'])) {
                unique.push(item.category)
            }
        })
        return unique;
    }
    throw new SyntaxError("Please Provide a correct Array")
}


