///// GEO HELPERS ////////////////////////////

export function isValidLatitude(lat) {
    // Assuming latitude range is -90 to 90 degrees
    const latitude = parseFloat(lat);

    const isNumeric = !isNaN(lat) && !isNaN(parseFloat(lat)) && /^-?\d+(\.\d+)?$/.test(lat);

    if (!isNumeric) {
        return false;
    }

    const valid = !isNaN(latitude) && latitude >= -90 && latitude <= 90;
    return valid;
}

export function isValidLongitude(long) {
    // Assuming longitude range is -180 to 180 degrees
    const longitude = parseFloat(long);

    const isNumeric = !isNaN(long) && !isNaN(parseFloat(long)) && /^-?\d+(\.\d+)?$/.test(long);

    if (!isNumeric) {
        return false;
    }

    const valid = !isNaN(longitude) && longitude >= -180 && longitude <= 180;
    return valid;
}

//// STRING HELPERS //////////////////////////

export function toTitleCase(str) {
    if (typeof str !== "string") {
        throw new TypeError("Input must be a string");
    }

    // Handles cases of "   " provided
    if (str.trim() === "") {
        return "";
    }

    return str
        .trim()
        .split(/\s+/) // split by any amount of whitespace
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
