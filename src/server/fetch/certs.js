import { promises as fs } from 'fs';

const loadFiles = ({ caPath, certChainPath, keyPath }) =>
  Promise.all([
    fs.readFile(caPath, 'UTF-8'),
    fs.readFile(certChainPath, 'UTF-8'),
    fs.readFile(keyPath, 'UTF-8'),
  ]);

const getCert = async () => {
  const caPath = '/etc/pki/tls/certs/ca-bundle.crt';
  const certChainPath = '/etc/pki/tls/certs/client.crt';
  const keyPath = '/etc/pki/tls/private/client.key';

  try {
    const [ca, certChain, key] = await loadFiles({
      caPath,
      certChainPath,
      keyPath,
    });

    return { ca, certChain, key };
  } catch (error) {
    return { error };
  }
};

export default getCert;
