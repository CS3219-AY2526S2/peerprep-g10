variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "vpc_connector_id" {
  type = string
}

variable "registry_url" {
  type = string
}

locals {
  services = ["frontend", "user", "question", "matching", "collaboration"]
}

resource "google_compute_region_network_endpoint_group" "negs" {
  for_each              = toset(local.services)
  name                  = "peerprep-${each.key}-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region

  cloud_run {
    service = "peerprep-${each.key}"
  }
}

resource "google_service_account" "cloud_run_sa" {
  account_id   = "peerprep-cloud-run"
  display_name = "PeerPrep Cloud Run Service Account"
}

resource "google_project_iam_member" "sa_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_project_iam_member" "sa_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

output "frontend_neg" {
  value = google_compute_region_network_endpoint_group.negs["frontend"].id
}

output "user_neg" {
  value = google_compute_region_network_endpoint_group.negs["user"].id
}

output "question_neg" {
  value = google_compute_region_network_endpoint_group.negs["question"].id
}

output "matching_neg" {
  value = google_compute_region_network_endpoint_group.negs["matching"].id
}

output "collaboration_neg" {
  value = google_compute_region_network_endpoint_group.negs["collaboration"].id
}

output "cloud_run_sa_email" {
  value = google_service_account.cloud_run_sa.email
}
