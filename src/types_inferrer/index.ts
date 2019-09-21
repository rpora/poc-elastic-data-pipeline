function inferTypeFromString(value: string): { value: any; type: string; } {

    let infer : any = inferAsBool(value);
    if (infer) return infer;

    infer = inferAsFloat(value);
    if( infer) return infer;

    infer = inferAsInteger(value);
    if( infer ) return infer;

    infer = inferAsDate(value);
    if( infer ) return infer;

    return { type: "string", value };
}

export {inferTypeFromString};


function isValidNumber(value) {
    return typeof value === "number" && !isNaN(value);
}

function inferAsBool(value) {
    let lcValue = value.toLowerCase();
    if (lcValue === "true") return {type: "boolean", value: true};
    if (lcValue === "false") return {type: "boolean", value: false};
}

function inferAsFloat(value) {
    if (/\./.test(value)) {
        let floatValue = parseFloat(value);
        if (isValidNumber(floatValue)) {
            return { type: "float", value: floatValue };
        }
    }
}

function inferAsInteger(value) {
    if (/^\d+$/.test(value)) {
        let intValue = parseInt(value, 10);
        if (isValidNumber(intValue)) {
            return {type: "integer", value: intValue};
        }
    }
}

function inferAsDate(value){
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value))  return false;
    return {type: "date", value: new Date(value)};
}
