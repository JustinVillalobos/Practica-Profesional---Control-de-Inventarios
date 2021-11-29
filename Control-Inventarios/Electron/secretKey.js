var CryptoJS = require("crypto-js");
const SECRET = require("./key");
const ENCODE_SECRET = SECRET.environment();
// Encrypt

module.exports = {
  encryptData: function (data) {
    let code = CryptoJS.AES.encrypt(data, ENCODE_SECRET).toString();
    return code;
  },
  desEncryptData: function (data) {
    let decode = CryptoJS.AES.decrypt(data, ENCODE_SECRET).toString(
      CryptoJS.enc.Utf8
    );
    return decode;
  },
  encryptMethod: function () {
    var ciphertext = CryptoJS.AES.encrypt(
      "my message",
      ENCODE_SECRET
    ).toString();

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, ENCODE_SECRET);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    console.log(originalText); // 'my message'
  },
};
