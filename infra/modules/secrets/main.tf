variable "project_id" {
  type = string
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

locals {
  secrets = {
    "peerprep-jwt-secret" = var.jwt_secret
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
