
export async function encrypt(
    input: Uint8Array,
    key: Uint8Array,
    nonce: Uint8Array | null,
    authenticate: Boolean = true
): Promise<Uint8Array> {
    return common('encrypt', input, key, nonce, authenticate);
}

export async function decrypt(
    input: Uint8Array,
    key: Uint8Array,
    nonce: Uint8Array | null,
    authenticate: Boolean = true
): Promise<Uint8Array> {
    return common('decrypt', input, key, nonce, authenticate);
}

async function common(op, input, key, nonce, authenticate): Promise<Uint8Array> {
    const iv = nonce ? nonce : new Uint8Array(authenticate ? 12 : 16);
    const name = authenticate ? 'AES-GCM' : 'AES-CTR';
    const k = await window.crypto.subtle.importKey('raw', key, name, false, ['decrypt', 'encrypt']);
    const output = await window.crypto.subtle[op]({name, iv}, k, input);
    return new Uint8Array(output);
}
