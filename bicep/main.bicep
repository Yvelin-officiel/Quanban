// Paramètres principaux
param location string = 'norwayeast'
param sqlServerName string = 'quanban-server-${uniqueString(resourceGroup().id)}'
param sqlAdminUser string = 'quanbanadmin'
@secure()
param sqlAdminPassword string
param databaseName string = 'quanban-db'

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

// Outputs
output sqlServerFqdn string = sqlDatabase.outputs.serverFqdn
output sqlDatabaseName string = sqlDatabase.outputs.databaseName

