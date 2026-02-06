param location string
param appServiceName string
param appServicePlanName string

param sqlAdminUser string
@secure()
param sqlAdminPassword string
param sqlServerFqdn string
param databaseName string

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

resource appSettings 'Microsoft.Web/sites/config@2022-09-01' = {
  name: 'appsettings'
  parent: webApp
  properties: {
    DB_USER: sqlAdminUser
    DB_SERVER: sqlServerFqdn
    DB_NAME: databaseName
    DB_PASSWORD: sqlAdminPassword
  }
}

output appUrl string = 'https://${webApp.properties.defaultHostName}'
