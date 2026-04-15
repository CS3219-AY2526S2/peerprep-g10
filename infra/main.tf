# AI Assistance Disclosure:
# Tool: GitHub Copilot (model: GPT-5.3-Codex), date: 2026-04-08
# Scope: I used Copilot to help with implementation work in this file, mainly drafting/refactoring config and troubleshooting issues.
# Author review: I reviewed each suggestion, kept only what fit this project, rewrote parts where needed, and validated the final configuration myself.

terraform {
  required_version = ">= 1.7.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.11"
    }
  }

  # Use environment-specific backend files, for example:
  # terraform init -backend-config=backends/staging.tfbackend
  backend "gcs" {}
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Automatically enable required Google APIs for the project
locals {
  required_apis = [
    "serviceusage.googleapis.com",
    "sts.googleapis.com",
    "iamcredentials.googleapis.com",
    "compute.googleapis.com",
    "vpcaccess.googleapis.com",
    "artifactregistry.googleapis.com",
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "servicenetworking.googleapis.com",
    "redis.googleapis.com",
    "iam.googleapis.com"
  ]
}

resource "google_project_service" "required" {
  for_each           = toset(local.required_apis)
  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}

# API enablement is eventually consistent; wait before creating dependent resources.
resource "time_sleep" "api_propagation" {
  create_duration = "90s"
  depends_on      = [google_project_service.required]
}

module "networking" {
  source     = "./modules/networking"
  project_id = var.project_id
  region     = var.region

  depends_on = [time_sleep.api_propagation]
}

module "artifact_registry" {
  source     = "./modules/artifact_registry"
  project_id = var.project_id
  region     = var.region

  depends_on = [time_sleep.api_propagation]
}

module "databases" {
  source               = "./modules/databases"
  project_id           = var.project_id
  region               = var.region
  vpc_id               = module.networking.vpc_id
  db_password_question = var.db_password_question
  db_password_user     = var.db_password_user
  db_password_collab   = var.db_password_collab

  depends_on = [time_sleep.api_propagation, module.networking]
}

module "secrets" {
  source               = "./modules/secrets"
  project_id           = var.project_id
  jwt_secret           = var.jwt_secret
  service_secret       = var.service_secret
  resend_api_key       = var.resend_api_key
  db_password_question = var.db_password_question
  db_password_user     = var.db_password_user
  db_password_collab   = var.db_password_collab
  admin_seed_password  = var.admin_seed_password

  depends_on = [time_sleep.api_propagation]
}

module "cloud_run" {
  source           = "./modules/cloud_run"
  project_id       = var.project_id
  region           = var.region
  vpc_connector_id = module.networking.vpc_connector_id
  registry_url     = module.artifact_registry.registry_url

  depends_on = [time_sleep.api_propagation, module.networking, module.artifact_registry]
}

module "load_balancer" {
  source            = "./modules/load_balancer"
  project_id        = var.project_id
  domain            = var.domain
  frontend_neg      = module.cloud_run.frontend_neg
  user_neg          = module.cloud_run.user_neg
  question_neg      = module.cloud_run.question_neg
  matching_neg      = module.cloud_run.matching_neg
  collaboration_neg = module.cloud_run.collaboration_neg

  depends_on = [time_sleep.api_propagation, module.cloud_run]
}
