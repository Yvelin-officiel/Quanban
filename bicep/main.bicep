// Paramètres principaux
param location string = 'norwaywest'
param postgresServerName string = 'quanban-server'
param postgresAdminUser string = 'quanbanadmin'
@secure()
param postgresAdminPassword string
param databaseName string = 'quanban'

// Module PostgreSQL
module postgres './postgres.bicep' = {
  name: 'postgresModule'
  params: {
    location: location
    serverName: postgresServerName
    adminUser: postgresAdminUser
    adminPassword: postgresAdminPassword
    databaseName: databaseName
  }
}

// Outputs
output postgresServerFqdn string = postgres.outputs.serverFqdn
output postgresDatabaseName string = postgres.outputs.databaseName

