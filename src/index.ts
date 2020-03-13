import {
    CipherGCM,
    DecipherGCM,
    createCipheriv,
    createDecipheriv,
} from 'crypto';

export async function encrypt(
    input: Uint8Array,
    key: Uint8Array,
    nonce: Uint8Array | null,
    authenticate: Boolean = true
): Promise<Uint8Array> {
    const iv = nonce ? nonce : new Uint8Array(authenticate ? 12 : 16);

    const algorithm = authenticate ? 'aes-256-gcm' : 'aes-256-ctr';
    const cipher = createCipheriv(algorithm, Buffer.from(key), iv);
    const output = [cipher.update(input), cipher.final()];

    if (authenticate) {
        output.push((cipher as CipherGCM).getAuthTag());
    }

    return new Uint8Array(Buffer.concat(output));
}

export async function decrypt(
    input: Uint8Array,
    key: Uint8Array,
    nonce: Uint8Array | null,
    authenticate: Boolean = true
): Promise<Uint8Array> {
    const iv = nonce ? nonce : new Uint8Array(authenticate ? 12 : 16);

    const algorithm = authenticate ? 'aes-256-gcm' : 'aes-256-ctr';
    const cipher = createDecipheriv(algorithm, Buffer.from(key), iv);

    if (authenticate) {
        const size = input.byteLength;
        const authTag = input.slice(-16); //
        (cipher as DecipherGCM).setAuthTag(authTag);
        input = input.slice(0, -16);
    }

    const output = Buffer.concat([cipher.update(input), cipher.final()]);
    return new Uint8Array(output);
}
