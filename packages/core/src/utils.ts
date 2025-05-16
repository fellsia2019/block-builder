export const isEqual = (val1: any, val2: any) => {
    if (typeof val1 === 'number' && typeof val2 === 'number') {
        return val1 === val2
    } else {
        return JSON.stringify(val1) === JSON.stringify(val2)
    }
}