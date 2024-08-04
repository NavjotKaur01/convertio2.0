export interface ConvertedFileStateModel {
  isLoading: boolean;
  isSuccess: boolean;
  FileExtension: FileExtensions;
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
