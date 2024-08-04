import { FileExtensions } from "../models/convertedFileModel";
import { ConversionFormat, FileDetails } from "../models/uploadedFileModal";
import { formatBytes, getConverter } from "./utils";


export const processFiles = (files: File[], possibleFormat: FileExtensions) => {
    const newFiles: FileDetails[] = [];
    const updateConversion: ConversionFormat[] = [];
    const initialActiveState: { [fileName: string]: string } = {};
    files.forEach((file: any) => {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      const fileType =file.type.split('/')[0]
      const type = getConverter(fileType);
      if (!fileExtension) {
        console.log(`File extension is undefined for file: ${fileName}`);
        return;
      }
      newFiles.push({
        fileName: fileName ,
        size: formatBytes(file.size),
        fileExtension: fileExtension,
        fileType: fileType,
      });
      if (possibleFormat.hasOwnProperty(type)) {
        const formatProperties:any = possibleFormat[type];
        const allFormats =
          formatProperties.images ||
          formatProperties.documents ||
          formatProperties.Audio ||
          [];

        if (allFormats.length > 0) {
          const randomIndex = Math.floor(Math.random() * allFormats.length);
          updateConversion.push({
            fileName: fileName ,
            conversionFormat: allFormats[randomIndex],
            fileType: fileType,
          });
        }

        const propertyToUse = formatProperties.images
          ? "images"
          : "documents"
          ? "Audio"
          : [];

        initialActiveState[
            fileName 
        ] = `tab-${fileName }-1-${propertyToUse}`;
      }
    });
  
    return { newFiles, updateConversion ,initialActiveState};
  };