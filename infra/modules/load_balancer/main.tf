variable "project_id" {
  type = string
}

variable "domain" {
  type = string
}

variable "frontend_neg" {
  type = string
}

variable "user_neg" {
  type = string
}

variable "question_neg" {
  type = string
}

variable "matching_neg" {
  type = string
}

variable "collaboration_neg" {
  type = string
}

resource "google_compute_global_address" "lb_ip" {
  name = "peerprep-lb-ip"
}

resource "google_compute_managed_ssl_certificate" "cert" {
  name = "peerprep-ssl-cert"

  managed {
    domains = [var.domain]
  }
}

locals {
  backends = {
    frontend      = { neg = var.frontend_neg, websocket = false }
    user          = { neg = var.user_neg, websocket = false }
    question      = { neg = var.question_neg, websocket = false }
    matching      = { neg = var.matching_neg, websocket = true }
    collaboration = { neg = var.collaboration_neg, websocket = true }
  }
}

resource "google_compute_security_policy" "armor" {
  name = "peerprep-armor-policy"

  rule {
    action   = "allow"
    priority = 1000
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-stable')"
      }
    }
    description = "Audit XSS"
  }

  rule {
    action   = "allow"
    priority = 1001
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-stable')"
      }
    }
    description = "Audit SQLi"
  }

  rule {
    action   = "rate_based_ban"
    priority = 2000
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }

    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"

      rate_limit_threshold {
        count        = 100
        interval_sec = 60
      }

      ban_duration_sec = 300
    }

    description = "Rate-limit per IP"
  }

  rule {
    action   = "allow"
    priority = 2147483647
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow"
  }
}

resource "google_compute_backend_service" "services" {
  for_each = local.backends

  name                  = "peerprep-${each.key}-backend"
  protocol              = "HTTPS"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  session_affinity      = each.value.websocket ? "CLIENT_IP" : "NONE"
  security_policy       = google_compute_security_policy.armor.id

  backend {
    group = each.value.neg
  }

  # Enable Cloud CDN on frontend only
  dynamic "cdn_policy" {
    for_each = each.key == "frontend" ? [1] : []
    content {
      cache_mode = "USE_ORIGIN_HEADERS"
      
      cache_key_policy {
        include_host         = true
        include_protocol     = true
        include_query_string = true
      }
    }
  }

  log_config {
    enable      = true
    sample_rate = 0.1
  }
}

resource "google_compute_url_map" "url_map" {
  name            = "peerprep-url-map"
  default_service = google_compute_backend_service.services["frontend"].id

  host_rule {
    hosts        = [var.domain]
    path_matcher = "peerprep-paths"
  }

  path_matcher {
    name            = "peerprep-paths"
    default_service = google_compute_backend_service.services["frontend"].id

    path_rule {
      paths   = ["/api/user", "/api/user/*"]
      service = google_compute_backend_service.services["user"].id
      route_action {
        url_rewrite {
          path_prefix_rewrite = "/"
        }
      }
    }

    path_rule {
      paths   = ["/api/question", "/api/question/*"]
      service = google_compute_backend_service.services["question"].id
      route_action {
        url_rewrite {
          path_prefix_rewrite = "/"
        }
      }
    }

    path_rule {
      paths   = ["/api/matching", "/api/matching/*"]
      service = google_compute_backend_service.services["matching"].id
      route_action {
        url_rewrite {
          path_prefix_rewrite = "/"
        }
      }
    }

    path_rule {
      paths   = ["/api/collab", "/api/collab/*"]
      service = google_compute_backend_service.services["collaboration"].id
      route_action {
        url_rewrite {
          path_prefix_rewrite = "/"
        }
      }
    }
  }
}

resource "google_compute_url_map" "redirect" {
  name = "peerprep-http-redirect"

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "peerprep-https-proxy"
  url_map          = google_compute_url_map.url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.cert.id]
}

resource "google_compute_target_http_proxy" "http_proxy" {
  name    = "peerprep-http-proxy"
  url_map = google_compute_url_map.redirect.id
}

resource "google_compute_global_forwarding_rule" "https" {
  name                  = "peerprep-https-rule"
  target                = google_compute_target_https_proxy.https_proxy.id
  port_range            = "443"
  ip_address            = google_compute_global_address.lb_ip.address
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "peerprep-http-rule"
  target                = google_compute_target_http_proxy.http_proxy.id
  port_range            = "80"
  ip_address            = google_compute_global_address.lb_ip.address
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

output "lb_ip" {
  value = google_compute_global_address.lb_ip.address
}

output "ssl_cert" {
  value = google_compute_managed_ssl_certificate.cert.id
}
