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
    DB_PASSWORD: sqlAdminPassword
    DB_SERVER: sqlServerFqdn
    DB_NAME: databaseName
    ConnectionStrings__DefaultConnection: sqlConnectionString
    WEBSITES_PORT: '3000'
    PORT: '3000'
  }
}

output appUrl string = 'https://${webApp.properties.defaultHostName}'
