param location string
param appServiceName string
param appServicePlanName string
param sqlConnectionString string

// Paramètres nécessaires pour alimenter DB_* (attendus par back/src/config/database.js)
param sqlAdminUser string
@secure()
param sqlAdminPassword string
param sqlServerFqdn string
param databaseName string

// Key Vault parameters
param keyVaultName string = 'kv-quanban'
param dbPasswordSecretName string = 'sql-admin-password'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: appServiceName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
    }
  }
}

// Reference existing Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
  scope: resourceGroup()
}

// Grant the web app access to Key Vault
resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2023-07-01' = {
  name: 'add'
  parent: keyVault
  properties: {
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: webApp.identity.principalId
        permissions: {
          secrets: [
            'get'
            'list'
          ]
        }
      }
    ]
  }
}

resource appSettings 'Microsoft.Web/sites/config@2022-09-01' = {
  name: 'appsettings'
  parent: webApp
  dependsOn: [
    keyVaultAccessPolicy
  ]
  properties: {
    DB_USER: sqlAdminUser
    DB_SERVER: sqlServerFqdn
    DB_NAME: databaseName
    // Key Vault configuration
    KEY_VAULT_NAME: keyVaultName
    DB_PASSWORD_SECRET_NAME: dbPasswordSecretName
    ConnectionStrings__DefaultConnection: sqlConnectionString
    WEBSITES_PORT: '3000'
    PORT: '3000'
  }
}

output appUrl string = 'https://${webApp.properties.defaultHostName}'
