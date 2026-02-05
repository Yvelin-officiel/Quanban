// Paramètres
param location string
param sqlServerName string
param adminUser string
@secure()
param adminPassword string
param databaseName string = 'quanban-db'

// Serveur Azure SQL
resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: adminUser
    administratorLoginPassword: adminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

// Règle de pare-feu pour autoriser les services Azure
resource firewallRuleAzure 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  name: 'AllowAzureServices'
  parent: sqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Règle de pare-feu pour autoriser tous les accès (à restreindre en production)
resource firewallRuleAll 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  name: 'AllowAll'
  parent: sqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '255.255.255.255'
  }
}


// Base de données Azure SQL
resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  name: databaseName
  parent: sqlServer
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
    capacity: 5
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648 // 2 GB
    catalogCollation: 'SQL_Latin1_General_CP1_CI_AS'
    zoneRedundant: false
    readScale: 'Disabled'
    requestedBackupStorageRedundancy: 'Local'
  }
}

// Outputs
output sqlServerName string = sqlServer.name
output databaseName string = sqlDatabase.name
output serverFqdn string = sqlServer.properties.fullyQualifiedDomainName


