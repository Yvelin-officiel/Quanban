param location string
param appServiceName string
param appServicePlanName string
param sqlConnectionString string

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
    DB_PASSWORD: sqlAdminPassword
    // Key Vault configuration
    KEY_VAULT_NAME: keyVaultName
    DB_PASSWORD_SECRET_NAME: dbPasswordSecretName
    ConnectionStrings__DefaultConnection: sqlConnectionString
    WEBSITES_PORT: '3000'
    PORT: '3000'
  }
}

// Autoscale Configuration for Backend
resource autoscaleSetting 'Microsoft.Insights/autoscalesettings@2022-10-01' = {
  name: '${appServicePlanName}-autoscale'
  location: location
  properties: {
    enabled: true
    targetResourceUri: appServicePlan.id
    profiles: [
      {
        name: 'CPU-based scaling'
        capacity: {
          minimum: '2'
          maximum: '4'
          default: '2'
        }
        rules: [
          {
            // Scale-out rule: increase when CPU > 75%
            metricTrigger: {
              metricName: 'CpuPercentage'
              metricResourceUri: appServicePlan.id
              timeGrain: 'PT1M'
              statistic: 'Average'
              timeWindow: 'PT5M'
              timeAggregation: 'Average'
              operator: 'GreaterThan'
              threshold: 75
            }
            scaleAction: {
              direction: 'Increase'
              type: 'ChangeCount'
              value: '1'
              cooldown: 'PT5M'
            }
          }
          {
            // Scale-in rule: decrease when CPU < 25%
            metricTrigger: {
              metricName: 'CpuPercentage'
              metricResourceUri: appServicePlan.id
              timeGrain: 'PT1M'
              statistic: 'Average'
              timeWindow: 'PT10M'
              timeAggregation: 'Average'
              operator: 'LessThan'
              threshold: 25
            }
            scaleAction: {
              direction: 'Decrease'
              type: 'ChangeCount'
              value: '1'
              cooldown: 'PT5M'
            }
          }
        ]
      }
    ]
  }
}

output appUrl string = 'https://${webApp.properties.defaultHostName}'
