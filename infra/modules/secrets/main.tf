variable "project_id" {
  type = string
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "service_secret" {
  type      = string
  sensitive = true
}

variable "resend_api_key" {
  type      = string
  sensitive = true
}

locals {
  secrets = {
    "peerprep-jwt-secret"     = var.jwt_secret
    "peerprep-service-secret" = var.service_secret
    "peerprep-resend-key"     = var.resend_api_key
  }
}

resource "google_secret_manager_secret" "secrets" {
  for_each  = local.secrets
  secret_id = each.key

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "versions" {
  for_each    = local.secrets
  secret      = google_secret_manager_secret.secrets[each.key].id
  secret_data = each.value
}
