# AI Assistance Disclosure:
# Tool: GitHub Copilot (model: GPT-5.3-Codex), date: 2026-04-08
# Scope: I used Copilot to help with implementation work in this file, mainly drafting/refactoring config and troubleshooting issues.
# Author review: I reviewed each suggestion, kept only what fit this project, rewrote parts where needed, and validated the final configuration myself.

output "lb_ip" {
  value = module.load_balancer.lb_ip
}

output "ssl_cert" {
  value = module.load_balancer.ssl_cert
}

output "cloud_run_sa_email" {
  value = module.cloud_run.cloud_run_sa_email
}

output "cloud_sql_question_connection_name" {
  value = module.databases.cloud_sql_question_connection_name
}

output "cloud_sql_question_private_ip" {
  value = module.databases.cloud_sql_question_private_ip
}

output "cloud_sql_user_connection_name" {
  value = module.databases.cloud_sql_user_connection_name
}

output "cloud_sql_user_private_ip" {
  value = module.databases.cloud_sql_user_private_ip
}

output "cloud_sql_collab_connection_name" {
  value = module.databases.cloud_sql_collab_connection_name
}

output "cloud_sql_collab_private_ip" {
  value = module.databases.cloud_sql_collab_private_ip
}

output "redis_host" {
  value = module.databases.redis_host
}

output "auth_redis_host" {
  value = module.databases.auth_redis_host
}

output "collab_redis_host" {
  value = module.databases.collab_redis_host
}

output "workload_identity_provider" {
  value = google_iam_workload_identity_pool_provider.github.name
}

output "cicd_sa_email" {
  value = google_service_account.cicd_sa.email
}
