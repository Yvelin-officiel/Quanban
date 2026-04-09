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
      appCommandLine: 'echo "VITE_API_URL=${backendApiUrl}/api" > .env && npm start'
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
    VITE_API_URL: '${backendApiUrl}/api'
    WEBSITE_NODE_DEFAULT_VERSION: '~20'
    SCM_DO_BUILD_DURING_DEPLOYMENT: 'true'
    WEBSITES_PORT: '8080'
    ENABLE_ORYX_BUILD: 'true'
    SCM_BUILD_ARGS: '--prod'
  }
}

// CORS configuration
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

// Autoscale Configuration for Frontend
resource autoscaleSetting 'Microsoft.Insights/autoscalesettings@2022-10-01' = {
  name: '${appServicePlanName}-autoscale'
  location: location
  dependsOn: [
    appServicePlan
  ]
  properties: {
    enabled: true
    targetResourceUri: appServicePlan.id
    profiles: [
      {
        name: 'Auto scale based on CPU'
        capacity: {
          minimum: '1'
          maximum: '3'
          default: '1'
        }
        rules: [
          {
            metricTrigger: {
              metricName: 'CpuPercentage'
              metricResourceUri: appServicePlan.id
              timeGrain: 'PT1M'
              statistic: 'Average'
              timeWindow: 'PT5M'
              timeAggregation: 'Average'
              operator: 'GreaterThan'
              threshold: 70
            }
            scaleAction: {
              direction: 'Increase'
              type: 'ChangeCount'
              value: '1'
              cooldown: 'PT5M'
            }
          }
          {
            metricTrigger: {
              metricName: 'CpuPercentage'
              metricResourceUri: appServicePlan.id
              timeGrain: 'PT1M'
              statistic: 'Average'
              timeWindow: 'PT10M'
              timeAggregation: 'Average'
              operator: 'LessThan'
              threshold: 20
            }
            scaleAction: {
              direction: 'Decrease'
              type: 'ChangeCount'
              value: '1'
              cooldown: 'PT5M'
            }
          }
        ]
      }
    ]
  }
}

output appUrl string = 'https://${webApp.properties.defaultHostName}'
output appServicePlanId string = appServicePlan.id

