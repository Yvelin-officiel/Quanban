// Paramètres
param location string
param serverName string
param adminUser string
@secure()
param adminPassword string
param databaseName string = 'quanban'
param skuName string = 'Standard_B1ms'
param skuTier string = 'Burstable'
param storageSizeGB int = 32
param postgresVersion string = '16'

// Serveur PostgreSQL Flexible
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: serverName
  location: location
  sku: {
    name: skuName
    tier: skuTier
  }
  properties: {
    administratorLogin: adminUser
    administratorLoginPassword: adminPassword
    version: postgresVersion
    storage: {
      storageSizeGB: storageSizeGB
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

// Règle de pare-feu pour autoriser les services Azure
resource firewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = {
  name: 'AllowAllAzureServicesAndResourcesWithinAzureIps'
  parent: postgresServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Base de données
resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  name: databaseName
  parent: postgresServer
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

// Outputs
output serverFqdn string = postgresServer.properties.fullyQualifiedDomainName
output databaseName string = database.name
output serverId string = postgresServer.id

