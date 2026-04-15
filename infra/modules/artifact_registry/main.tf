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

resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "peerprep"
  format        = "DOCKER"
  description   = "PeerPrep Docker images"
}

output "registry_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/peerprep"
}
