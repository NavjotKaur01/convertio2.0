import { FileExtensions } from "./convertedFileModel";

export interface uploadedFileInitialModel {
    isLoading: boolean;
    isSuccess: boolean;
    uploadedFileList :any
    conversionFormat:any
    verticalActive:object
    ExtensionName:string
    IsErrorShow:boolean,
    IsFileExtension:boolean
  }
  export  interface FileDetails {
    fileName: string;
    size: string;
    fileExtension: string;
    fileType: keyof FileExtensions
  }
  
  export  interface ConversionFormat {
    fileName: string;
    conversionFormat: string;
    fileType: string;
  }