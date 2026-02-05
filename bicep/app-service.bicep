// Paramètres
param location string
param appServicePlanName string
param webAppName string
param sku string = 'F1' // Free tier par défaut, peut être changé en B1, S1, etc.

// App Service Plan (serveur hébergeant l'app)
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: sku
    tier: sku == 'F1' ? 'Free' : (sku == 'B1' ? 'Basic' : 'Standard')
  }
  kind: 'linux'
  properties: {
    reserved: true // Requis pour Linux
  }
}

// Web App (App Service)
resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: webAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts' // Runtime Node.js 20 LTS
      alwaysOn: sku != 'F1' // AlwaysOn non disponible en Free tier
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
      ]
    }
  }
}

// Configuration pour le déploiement depuis GitHub (optionnel)
resource webAppConfig 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: webApp
  name: 'web'
  properties: {
    numberOfWorkers: 1
    defaultDocuments: [
      'index.html'
    ]
  }
}

// Outputs
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output webAppName string = webApp.name
output appServicePlanId string = appServicePlan.id

