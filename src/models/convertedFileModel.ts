export interface ConvertedFileStateModel {
  isLoading: boolean;
  isSuccess: boolean;
  FileExtension: FileExtensions;
  allConvertedFiles: AllConvertedFiles[];
  isDelete: boolean;
}
export interface FileExtensions {
  image: {
    images: string[];
    documents: string[];
  };
  video: {
    Audio: string[];
  };
  unknownFormat: {};
}
export interface AllConvertedFiles {
  fileName: string;
  converted: boolean;
  status: boolean;
  fileSize: string;
  _id: string;
  createdAt: string;
}
export interface ChangeStatusPayload {
  fileId: string;
  newStatus: boolean;
}
export interface DeleteFilePayload {
  fileId: string;
}
