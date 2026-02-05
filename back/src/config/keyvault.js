import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';
import dotenv from 'dotenv';

dotenv.config();

let secretClient = null;

/**
 * Initialize Azure Key Vault client
 * Uses Managed Identity when deployed on Azure, or local credentials for development
 */
export const initKeyVaultClient = () => {
  try {
    const keyVaultName = process.env.KEY_VAULT_NAME;

    if (!keyVaultName) {
      console.warn('KEY_VAULT_NAME not set. Key Vault integration disabled.');
      return null;
    }

    const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();

    secretClient = new SecretClient(keyVaultUrl, credential);
    console.log('Azure Key Vault client initialized');

    return secretClient;
  } catch (error) {
    console.error('Failed to initialize Key Vault client:', error.message);
    return null;
  }
};

/**
 * Get a secret from Azure Key Vault
 * @param {string} secretName - The name of the secret to retrieve
 * @returns {Promise<string|null>} The secret value or null if not found
 */
export const getSecret = async (secretName) => {
  try {
    if (!secretClient) {
      secretClient = initKeyVaultClient();
    }

    if (!secretClient) {
      console.warn(`Key Vault not available. Cannot retrieve secret: ${secretName}`);
      return null;
    }

    const secret = await secretClient.getSecret(secretName);
    return secret.value;
  } catch (error) {
    console.error(`Failed to retrieve secret '${secretName}':`, error.message);
    return null;
  }
};

export default { initKeyVaultClient, getSecret };

