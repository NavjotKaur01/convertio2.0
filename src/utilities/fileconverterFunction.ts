import { FileExtensions } from "../models/convertedFileModel";
import { ConversionFormat, FileDetails } from "../models/uploadedFileModal";
import { formatBytes, getConverter } from "./utils";
const PageList = ["/heif-jpg-converter", "/heif-converter", "/image-converter"];
export const processFiles = (
  files: File[],
  possibleFormat: FileExtensions,
  pageName: string,
  FileType?: string
) => {
  const specialCase = PageList.includes(pageName);
  const newFiles: FileDetails[] = [];
  const updateConversion: ConversionFormat[] = [];
  const initialActiveState: { [fileName: string]: string } = {};
  files.forEach((file: any) => {
    const fileDetails = file;
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    const fileType = file.type.split("/")[0];
    const type = getConverter(fileType);
    if (!fileExtension) {
      console.log(`File extension is undefined for file: ${fileName}`);
      return;
    }
    newFiles.push({
      fileName: fileName,
      size: formatBytes(file.size),
      fileExtension: fileExtension,
      fileType: fileType,
      fileDetails: fileDetails,
    });
    if (pageName && specialCase && type === FileType) {
      const formatProperties: any = possibleFormat[type];
      const allFormats = formatProperties.images || [];
      if (allFormats.length > 0) {
        const index = allFormats.indexOf("jpg");
        updateConversion.push({
          fileName: fileName,
          conversionFormat: allFormats[index],
          fileType: fileType,
        });
      }
      const propertyToUse = formatProperties.images ? "images" : "";
      initialActiveState[fileName] = `tab-${fileName}-1-${propertyToUse}`;
    } else if (possibleFormat.hasOwnProperty(type)) {
      const formatProperties: any = possibleFormat[type];
      const allFormats =
        formatProperties.images ||
        formatProperties.documents ||
        formatProperties.Audio ||
        [];

      if (allFormats.length > 0) {
        const randomIndex = Math.floor(Math.random() * allFormats.length);
        updateConversion.push({
          fileName: fileName,
          conversionFormat: allFormats[randomIndex],
          fileType: fileType,
        });
      }

      const propertyToUse = formatProperties.images
        ? "images"
        : "documents"
        ? "Audio"
        : [];
      initialActiveState[fileName] = `tab-${fileName}-1-${propertyToUse}`;
    }
  });

  return {
    newFiles,
    updateConversion,
    initialActiveState,
  };
};
// filter filetype function
export function filterFileType(
  fileName: string,
  searchStr: string,
  type: keyof FileExtensions,
  possibleFormat: FileExtensions,
  verticalActive: any
): string[] {
  if (
    possibleFormat &&
    possibleFormat[type] &&
    Object.keys(verticalActive).includes(fileName) &&
    searchStr
  ) {
    let filterData: string[] = [];
    // Access the correct key within the type
    const activeTabData: string[] = Object.values(possibleFormat[type]).flat();
    if (activeTabData.length) {
      filterData = activeTabData.filter((item: string) =>
        item.toLowerCase().includes(searchStr.toLowerCase())
      );
    }
    return filterData;
  } else {
    return [];
  }
}

// Uploaded file is not converted to another format
export const isNotPossibleFormat = (
  fileExtension: string,
  possibleFormat: FileExtensions
): boolean => {
  return Object.keys(possibleFormat).includes(fileExtension);
};
