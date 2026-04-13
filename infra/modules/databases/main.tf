variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "vpc_id" {
  type = string
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

resource "google_sql_database_instance" "main" {
  name             = "peerprep-postgres"
  database_version = "POSTGRES_17"
  region           = var.region

  settings {
    tier              = "db-g1-small"
    availability_type = "ZONAL"

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_id
    }

    backup_configuration {
      enabled    = true
      start_time = "02:00"
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }

  deletion_protection = true
}

resource "google_sql_database" "question_db" {
  name     = "question_service"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_database" "user_db" {
  name     = "user_service"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_database" "collaboration_db" {
  name     = "peerprep"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "question_user" {
  name     = "peerprep"
  instance = google_sql_database_instance.main.name
  password = var.db_password_question
}

resource "google_sql_user" "user_user" {
  name     = "peerprep_user"
  instance = google_sql_database_instance.main.name
  password = var.db_password_user
}

resource "google_sql_user" "collab_user" {
  name     = "postgres"
  instance = google_sql_database_instance.main.name
  password = var.db_password_collab
}

resource "google_redis_instance" "cache" {
  name               = "peerprep-redis"
  tier               = "BASIC"
  memory_size_gb     = 1
  region             = var.region
  authorized_network = var.vpc_id
  redis_version      = "REDIS_7_0"
  display_name       = "PeerPrep Matching Cache"
}

output "cloud_sql_connection_name" {
  value = google_sql_database_instance.main.connection_name
}

output "cloud_sql_private_ip" {
  value = google_sql_database_instance.main.private_ip_address
}

output "redis_host" {
  value = google_redis_instance.cache.host
}

output "redis_port" {
  value = google_redis_instance.cache.port
}
