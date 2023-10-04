let uniqueIdCounter: number = Number.MIN_SAFE_INTEGER;

function getUniqueId(): number
{
    return ++uniqueIdCounter;
}

export default getUniqueId;