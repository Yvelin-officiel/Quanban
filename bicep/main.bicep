param location string = 'norwayeast'
param sqlServerName string = 'quanban-server-${uniqueString(resourceGroup().id)}'
param sqlAdminUser string = 'quanbanadmin'
@secure()
param sqlAdminPassword string
param databaseName string = 'quanban-db'
// Paramètres backend
param backendAppName string = 'quanban-backend-${uniqueString(resourceGroup().id)}'
param backendPlanName string = 'quanban-plan'

// Paramètres frontend
param frontendAppName string = 'quanban-frontend-${uniqueString(resourceGroup().id)}'
param frontendPlanName string = 'quanban-frontend-plan'

// Module Azure SQL Database
module sqlDatabase './sql-db.bicep' = {
  name: 'sqlDatabaseModule'
  params: {
    location: location
    sqlServerName: sqlServerName
    adminUser: sqlAdminUser
    adminPassword: sqlAdminPassword
    databaseName: databaseName
  }
}

// Construction de la connection string SQL
var sqlConnectionString = 'Server=tcp:${sqlDatabase.outputs.serverFqdn},1433;Database=${databaseName};User ID=${sqlAdminUser};Password=${sqlAdminPassword};Encrypt=True;'

// Module backend App Service
module backend './backend.bicep' = {
  name: 'backendModule'
  params: {
    location: location
    appServiceName: backendAppName
    appServicePlanName: backendPlanName
    sqlConnectionString: sqlConnectionString
    sqlAdminUser: sqlAdminUser
    sqlAdminPassword: sqlAdminPassword
    sqlServerFqdn: sqlDatabase.outputs.serverFqdn
    databaseName: databaseName
  }
}

// Module frontend App Service
module frontend './front.bicep' = {
  name: 'frontendModule'
  params: {
    location: location
    appServiceName: frontendAppName
    appServicePlanName: frontendPlanName
    backendApiUrl: backend.outputs.appUrl
  }
}

// Outputs
output sqlServerFqdn string = sqlDatabase.outputs.serverFqdn
output sqlDatabaseName string = databaseName
output backendUrl string = backend.outputs.appUrl
output backendAppName string = backendAppName
output frontendUrl string = frontend.outputs.appUrl
output frontendAppName string = frontendAppName
