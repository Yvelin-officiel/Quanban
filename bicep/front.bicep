param location string
param appServiceName string
param appServicePlanName string
param backendApiUrl string

// App Service Plan for Frontend (can share with backend or create separate)
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

// Frontend Web App
resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: appServiceName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appCommandLine: 'pm2 serve /home/site/wwwroot/dist --no-daemon --spa'
      alwaysOn: true
    }
    httpsOnly: true
  }
}

// App Settings for Frontend
resource appSettings 'Microsoft.Web/sites/config@2022-09-01' = {
  name: 'appsettings'
  parent: webApp
  properties: {
    // Backend API URL
    VITE_API_URL: backendApiUrl
    // Node.js settings
    WEBSITE_NODE_DEFAULT_VERSION: '~20'
    SCM_DO_BUILD_DURING_DEPLOYMENT: 'true'
    // Static site configuration
    WEBSITES_PORT: '8080'
  }
}

// CORS configuration (if needed)
resource webAppCors 'Microsoft.Web/sites/config@2022-09-01' = {
  name: 'web'
  parent: webApp
  properties: {
    cors: {
      allowedOrigins: [
        '*'
      ]
      supportCredentials: false
    }
  }
}

output appUrl string = 'https://${webApp.properties.defaultHostName}'
output appServicePlanId string = appServicePlan.id

