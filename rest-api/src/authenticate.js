// This is a security module.

const bigInt = require("big-integer");
const base = 16; // numbers are expressed in hexadecimal form

// large prime and corresponding generator taken from
// https://www.ietf.org/rfc/rfc3526.txt
// on June 17, 2021
// selection from site: 1536-bit MODP Group
const prime = bigInt(
    "FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA237327FFFFFFFFFFFFFFFF",
    base
);
const generator = bigInt("2", base);

// const masterEncryptedPassword = bigInt(' PLACE ENCRYPTED PASSWORD HERE ', base);
const masterEncryptedPassword = "password";

function encrypt(passwordString) {
    try {
        const password = bigInt(passwordString, base);
        return generator.modPow(password, prime);
    } catch {
        return passwordString;
    }
}

function authenticate(passwordString) {
    try {
        return encrypt(passwordString).equals(masterEncryptedPassword);
    } catch {
        return passwordString === masterEncryptedPassword;
    }
}

module.exports = authenticate;
