import { default as stripJson } from "strip-json-comments";


export function cleanJsonContext(text: string):string {
    text = text.replace(/\\n/g, "\\n")  
           .replace(/\\'/g, "\\'")
           .replace(/\\"/g, '\\"')
           .replace(/\\&/g, "\\&")
           .replace(/\\r/g, "\\r")
           .replace(/\\t/g, "\\t")
           .replace(/\\b/g, "\\b")
           .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
    text = text.replace(/[\u0000-\u0019]+/g,""); 
    text = text.trim();

    return text;
}

export function isValidARMFile(text: string): any {
    try {
        var content = JSON.parse(stripJson(cleanJsonContext(text)));
        return content.$schema.includes("schema.management.azure.com");
    }
    catch (error) {
        console.error(error);
        return error; 
    }
}