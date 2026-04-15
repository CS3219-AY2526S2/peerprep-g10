variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "Primary GCP region"
  type        = string
  default     = "asia-southeast1"
}

variable "domain" {
  description = "Public domain (e.g. peerprep.example.com)"
  type        = string
}

variable "github_repo" {
  description = "GitHub repo in org/repo format for Workload Identity"
  type        = string
}

variable "db_password_question" {
  type      = string
  sensitive = true
}

variable "db_password_user" {
  type      = string
  sensitive = true
}

variable "db_password_collab" {
  type      = string
  sensitive = true
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

variable "admin_seed_password" {
  description = "Seed password for the admin account"
  type        = string
  sensitive   = true
}

variable "artifact_registry_reader_service_accounts" {
  description = "Service account emails that need Artifact Registry read access in this project."
  type        = list(string)
  default = [
    "peerprep-cicd@pivotal-racer-490116-c3.iam.gserviceaccount.com"
  ]
}

variable "artifact_registry_reader_project_ids" {
  description = "Project IDs whose Cloud Run service agents need Artifact Registry read access in this project."
  type        = list(string)
  default = [
    "pivotal-racer-490116-c3"
  ]
}
