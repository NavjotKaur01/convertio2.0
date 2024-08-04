import CryptoJS from "crypto-js";
const secretKey = "$''@n&ao[-0Vq*m";

export const encryptDatawith1Days = (
  name: string,
  data: string | string[] | boolean,
  expiryTime?: number
): void => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  saveCookie(name, encrypted, expiryTime ? expiryTime : 1 * 24);
};
// Decrypt Data
export const decryptData = (name: string) => {
  const encrypted = getCookie(name);
  if (encrypted) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  }
  return null;
};
// get cookies function
export const getCookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

// save cookies function
const saveCookie = (
  cookieName: string,
  cookieValue: string,
  hourToExpire: number
) => {
  //setting cookie with expiry time
  const currentDate = new Date();
  currentDate.setTime(currentDate.getTime() + hourToExpire * 3600 * 1000);
  document.cookie =
    cookieName +
    " = " +
    cookieValue +
    "; expires = " +
    currentDate.toUTCString();
};
//file converted format
export function getConverter(format: string) {
  switch (format.toLowerCase()) {
    // Image formats
    case "image":
      return "image";
    //video format
    case "video":
      return "video";
    // Default case for unknown formats
    default:
      return "unknownFormat";
  }
} 


//
 // calculate file size in bytes,KB,MB,GB
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};