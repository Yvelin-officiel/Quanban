// Paramètres
param location string
param sqlServerName string
param adminUser string
@secure()
param adminPassword string
param databaseName string = 'quanban-db'


// Serveur PostgreSQL Flexible
resource sqlServer 'Microsoft.Sql/servers@2022-11-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: adminUser
    administratorLoginPassword: adminPassword
  }
}

// Règle de pare-feu pour autoriser les services Azure
resource firewallRule 'Microsoft.Sql/servers/firewallRules@2022-11-01-preview' = {
  name: 'AllowAzureServices'
  parent: sqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}


// Base de données
resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-11-01-preview' = {
  name: databaseName
  parent: sqlServer
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
}

// Outputs
output sqlServerName string = sqlServer.name
output databaseName string = sqlDatabase.name
output serverFqdn string = sqlServer.properties.fullyQualifiedDomainName


