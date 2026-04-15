resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github-pool"
  display_name              = "GitHub Actions Pool"

  depends_on = [time_sleep.api_propagation]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub Actions Provider"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }

  attribute_condition = "assertion.repository == '${var.github_repo}'"
}

resource "google_service_account" "cicd_sa" {
  account_id   = "peerprep-cicd"
  display_name = "PeerPrep CI/CD Service Account"

  depends_on = [time_sleep.api_propagation]
}

resource "google_project_iam_member" "cicd_roles" {
  for_each = toset([
    "roles/run.admin",
    "roles/artifactregistry.writer",
    "roles/iam.serviceAccountUser",
    "roles/cloudsql.viewer",
    "roles/redis.viewer",
    "roles/secretmanager.secretAccessor"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.cicd_sa.email}"
}

resource "google_project_iam_member" "artifact_registry_readers" {
  for_each = toset(var.artifact_registry_reader_service_accounts)

  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${each.value}"
}

data "google_project" "artifact_registry_reader_projects" {
  for_each   = toset(var.artifact_registry_reader_project_ids)
  project_id = each.value
}

resource "google_project_iam_member" "artifact_registry_run_service_agents" {
  for_each = data.google_project.artifact_registry_reader_projects

  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:service-${each.value.number}@serverless-robot-prod.iam.gserviceaccount.com"
}

resource "google_service_account_iam_member" "wif_binding" {
  service_account_id = google_service_account.cicd_sa.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}"
}
