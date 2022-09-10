export const publicKeyShortenerHelper = (publicKey: string) => {
  if (!publicKey) {
    return publicKey;
  }
  if (!publicKey.startsWith('0x')) {
    publicKey = '0x' + publicKey;
  }

  return `${publicKey.slice(0, 5)}...${publicKey.slice(-5)}`;
};
