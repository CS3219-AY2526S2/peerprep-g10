variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "peerprep"
  format        = "DOCKER"
  description   = "PeerPrep Docker images"
}

output "registry_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/peerprep"
}
