# AI Assistance Disclosure:
# Tool: GitHub Copilot (model: GPT-5.3-Codex), date: 2026-04-08
# Scope: I used Copilot to help with implementation work in this file, mainly drafting/refactoring config and troubleshooting issues.
# Author review: I reviewed each suggestion, kept only what fit this project, rewrote parts where needed, and validated the final configuration myself.

variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

resource "google_compute_network" "vpc" {
  name                    = "peerprep-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "private" {
  name          = "peerprep-private"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id

  private_ip_google_access = true
}

resource "google_vpc_access_connector" "connector" {
  name          = "peerprep-connector"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.vpc.name
  min_instances = 2
  max_instances = 10
  max_throughput = 1000
}

resource "google_compute_global_address" "private_ip_range" {
  name          = "peerprep-private-ip-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "private_vpc_conn" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
}

output "vpc_id" {
  value = google_compute_network.vpc.id
}

output "vpc_connector_id" {
  value = google_vpc_access_connector.connector.id
}
