provider "azurerm" {
  features {}
  subscription_id = "a98d0e19-0c0e-4a5b-91ac-c6923c6331bc"
}

# 1. Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "python-webapp-rg"
  location = "East US"
}

# 2. App Service Plan (Linux)
resource "azurerm_app_service_plan" "asp" {
  name                = "python-webapp-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  kind = "Linux"

  reserved = true  # Required for Linux plans

  sku {
    tier = "Basic"
    size = "B1"
  }
}

# 3. App Service (Python Web App)
resource "azurerm_linux_web_app" "webapp" {
  name                = "python-webapp-demo"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_app_service_plan.asp.id

  site_config {
    application_stack {
      python_version = "3.10"
    }

    always_on = true
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "PORT"                                = "8000"
    "APP_ENV"                             = "Production"
  }
}
