# @futuretense/secret-box

Simple symmetric-key encryption for nodejs and browsers

Draws inspiration from `secret box` of NaCl, but uses AES 
instead of ChaCha20-Poly1305. The benefit is less code, and faster code,
since AES is implemented natively by the `crypto` module in nodejs, and by the Web Cryptography API in browsers.

## Usage

```
import { encrypt, decrypt } from '@futuretense/secret-box'

const cipherText = await encrypt(data, key, nonce, useAuthentication);
const plainText  = await decrypt(cipherText, key, nonce, useAuthentication);
```

## Authentication

_Authenticated mode_ (which is the default) uses AES-256-GCM to add integrity control to the pot, to make it possible to verify that the provided cipher output has been encrypted by someone with access to the encryption key.

Authentication adds sixteen bytes of data to the output.

_Un-authenticated mode_ uses AES in counter mode (AES-256-CTR), and doesn't add any extra data.

## Nonces

Authenticated mode has a twelve byte nonce, and un-authenticated mode has a sixteen byte nonce.

In both modes, the nonces provided are used as initial values for the counters.

#### Nonce re-use

Don't.

Both modes use stream ciphers that divide the input data into 128-bit blocks, which are then _exclusive-or:ed_
with the result of a function based on the encryption key and the counter value for a block.

If a _(key, counter)_-combination is ever used twice, this can be exploited to arrive at a block that's the _exclusive-or_ of the two unencrypted input blocks.

---
Copyright &copy; 2020 Future Tense, LLC
