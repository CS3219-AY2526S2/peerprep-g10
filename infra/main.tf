terraform {
  required_version = ">= 1.7.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "peerprep-g10-tfstate-001"
    prefix = "peerprep/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "networking" {
  source     = "./modules/networking"
  project_id = var.project_id
  region     = var.region
}

module "artifact_registry" {
  source     = "./modules/artifact_registry"
  project_id = var.project_id
  region     = var.region
}

module "databases" {
  source               = "./modules/databases"
  project_id           = var.project_id
  region               = var.region
  vpc_id               = module.networking.vpc_id
  db_password_question = var.db_password_question
  db_password_user     = var.db_password_user
  db_password_collab   = var.db_password_collab

  depends_on = [module.networking]
}

module "secrets" {
  source         = "./modules/secrets"
  project_id     = var.project_id
  jwt_secret     = var.jwt_secret
  service_secret = var.service_secret
  resend_api_key = var.resend_api_key
}

module "cloud_run" {
  source           = "./modules/cloud_run"
  project_id       = var.project_id
  region           = var.region
  vpc_connector_id = module.networking.vpc_connector_id
  registry_url     = module.artifact_registry.registry_url
  db_connection    = module.databases.cloud_sql_connection_name
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
}
