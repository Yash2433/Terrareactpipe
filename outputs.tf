output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.rg.name
}

output "app_service_plan_name" {
  description = "The name of the App Service Plan"
  value       = azurerm_app_service_plan.asp.name
}

output "app_service_plan_sku" {
  description = "The SKU of the App Service Plan"
  value       = azurerm_app_service_plan.asp.sku[0].size
}

output "web_app_name" {
  description = "The name of the Web App"
  value       = azurerm_linux_web_app.webapp.name
}

output "web_app_url" {
  description = "The default URL of the Web App"
  value       = azurerm_linux_web_app.webapp.default_hostname
}
