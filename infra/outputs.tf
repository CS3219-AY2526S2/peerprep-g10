output "lb_ip" {
  value = module.load_balancer.lb_ip
}

output "ssl_cert" {
  value = module.load_balancer.ssl_cert
}

output "cloud_run_sa_email" {
  value = module.cloud_run.cloud_run_sa_email
}

output "cloud_sql_private_ip" {
  value = module.databases.cloud_sql_private_ip
}

output "redis_host" {
  value = module.databases.redis_host
}

output "workload_identity_provider" {
  value = google_iam_workload_identity_pool_provider.github.name
}

output "cicd_sa_email" {
  value = google_service_account.cicd_sa.email
}
