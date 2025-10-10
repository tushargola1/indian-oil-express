import CryptoJS from "crypto-js";

// Encrypt function
export function Encryption(text) {
  const key = CryptoJS.enc.Utf8.parse("hjk52uwz043z9l25");  
  const iv = CryptoJS.enc.Utf8.parse("5g724wvq5421lwxy");  

  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString()   ; 
}

// Decrypt function for debugging
export function Decryption(cipherText) {
  const key = CryptoJS.enc.Utf8.parse("hjk52uwz043z9l25");  
  const iv = CryptoJS.enc.Utf8.parse("5g724wvq5421lwxy");  
  

  const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

