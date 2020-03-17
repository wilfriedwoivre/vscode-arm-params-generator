export namespace commmands {
    export const generateParameters = "arm.generateParameterFile";
    export const consolidateFiles = "arm.consolidateFiles";
    export const extractor = "arm.extractor";
}

export namespace config {
    export const projectName = "arm-params-generator"; 
    export const ignoreDefaultParameters = "ignoreDefaultParameters"; 
    export const useNewerVersion = "useNewerSchema";
}

export namespace schema {
    export const armParameterSchema2015 = "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#";
    export const armParameterSchema2019 = "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#";
    
    export const armSchema2015 = "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#";
    export const armSchema2019 = "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#";
}