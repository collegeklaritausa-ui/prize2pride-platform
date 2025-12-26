# Prize2Pride Platform - Production Deployment Guide

## Executive Summary

The Prize2Pride American English Learning Platform is now ready for permanent deployment to the **Manus Secure Live Environment** at **https://prize2pride.com**. This document provides comprehensive deployment instructions, infrastructure configuration, and operational guidelines.

---

## Deployment Overview

| Aspect | Details |
|--------|---------|
| **Platform URL** | https://prize2pride.com |
| **API URL** | https://api.prize2pride.com |
| **Version** | 3.0.0 |
| **Deployment Region** | manus-cloud-us-east-1 |
| **Kubernetes Namespace** | prize2pride |
| **Deployment Timestamp** | 2025-12-26T22:15:43Z |

---

## Infrastructure Architecture

### Frontend Deployment
The frontend is deployed as a containerized Nginx application serving static React assets with the following specifications:

- **Container Image:** `registry.manus-cloud.internal/prize2pride/frontend:3.0.0`
- **Base Image:** `nginx:alpine`
- **Replicas:** 3 (minimum) to 10 (maximum)
- **Resource Requests:** 250m CPU, 256Mi Memory
- **Resource Limits:** 500m CPU, 512Mi Memory
- **Health Checks:** Liveness and Readiness probes configured with 30-second intervals
- **Security:** Non-root user (UID 101), read-only root filesystem, dropped capabilities

### Backend Deployment
The backend runs the Node.js application with Express and tRPC API endpoints:

- **Container Image:** `registry.manus-cloud.internal/prize2pride/backend:3.0.0`
- **Base Image:** `node:22-alpine`
- **Replicas:** 3 (minimum) to 10 (maximum)
- **Resource Requests:** 500m CPU, 512Mi Memory
- **Resource Limits:** 1000m CPU, 1Gi Memory
- **Health Checks:** Liveness and Readiness probes on `/health` and `/ready` endpoints
- **Security:** Non-root user (UID 1001), read-only root filesystem, dropped capabilities
- **Ports:** 3000 (HTTP), 9090 (Prometheus metrics)

### Database Configuration
The platform uses a managed TiDB cluster (MySQL-compatible) with the following setup:

- **Connection String:** `mysql://prize2pride_user:secure_prod_key@tidb-cluster.manus-cloud.internal:3306/prize2pride?ssl=true`
- **Connection Pool Size:** 20 connections
- **Pool Timeout:** 30 seconds
- **SSL/TLS:** Required for all connections
- **ORM:** Drizzle ORM with automated migrations

### Caching & Session Management
Redis is configured for caching and session storage:

- **Redis URL:** `redis://cache.manus-cloud.internal:6379`
- **Cache TTL:** 3600 seconds (1 hour)
- **Session Timeout:** 86400 seconds (24 hours)

---

## Security Configuration

### TLS/SSL
- **Protocol:** TLS 1.3 (enforced)
- **Certificate Provider:** Let's Encrypt via cert-manager
- **Certificate Renewal:** Automatic
- **Domains:** `prize2pride.com`, `www.prize2pride.com`, `api.prize2pride.com`

### Web Application Firewall (WAF)
- **Ingress Controller:** Nginx with WAF annotations
- **Rate Limiting:** 100 requests per 15-minute window
- **Body Size Limit:** 50MB
- **SSL Redirect:** Enforced (HTTP → HTTPS)

### DDoS Protection
- **Rate Limiting:** Implemented at Ingress level
- **Connection Limits:** Configured per pod
- **Network Policies:** Ingress and Egress rules defined
- **Pod Security:** Non-root users, dropped capabilities, read-only filesystems

### Network Policies
The Kubernetes NetworkPolicy restricts traffic to:

- **Ingress:** Only from nginx ingress controller namespace
- **Egress:** Allowed to all namespaces on ports 443 (HTTPS), 3306 (MySQL), 6379 (Redis)

---

## Scalability & High Availability

### Horizontal Pod Autoscaling (HPA)

**Backend HPA:**
- **Minimum Replicas:** 3
- **Maximum Replicas:** 10
- **CPU Target:** 70% utilization
- **Memory Target:** 80% utilization

**Frontend HPA:**
- **Minimum Replicas:** 3
- **Maximum Replicas:** 10
- **CPU Target:** 70% utilization

### Pod Distribution
- **Pod Anti-Affinity:** Preferred distribution across different nodes
- **Rolling Updates:** 1 surge, 0 unavailable (zero-downtime deployments)
- **Liveness Probes:** Automatic pod restart on failure
- **Readiness Probes:** Automatic traffic routing to healthy pods

---

## Monitoring & Logging

### Prometheus Metrics
- **Metrics Port:** 9090
- **Scrape Interval:** Configured in Prometheus
- **Metrics Exported:** CPU, memory, request latency, error rates

### Error Tracking
- **Sentry DSN:** Configured for real-time error reporting
- **Error Aggregation:** Automatic grouping and alerting

### Application Monitoring
- **Datadog Integration:** Enabled for comprehensive monitoring
- **Datadog API Key:** Stored in Manus Vault
- **Metrics Collected:** Application performance, infrastructure metrics, custom events

### Logging
- **Log Level:** info (production)
- **Log Aggregation:** Configured for centralized logging
- **Log Retention:** Managed by Manus infrastructure

---

## Secrets Management

All sensitive data is stored in the **Manus Vault** and injected as environment variables via Kubernetes Secrets:

| Secret | Purpose |
|--------|---------|
| `JWT_SECRET` | JWT token signing and verification |
| `SESSION_SECRET` | Session encryption and signing |
| `OAUTH_CLIENT_ID` | OAuth 2.0 client identifier |
| `OAUTH_CLIENT_SECRET` | OAuth 2.0 client secret |
| `OPENAI_API_KEY` | OpenAI API for TTS-1-HD voice |
| `S3_ACCESS_KEY` | S3-compatible storage access |
| `S3_SECRET_KEY` | S3-compatible storage secret |
| `SENTRY_DSN` | Sentry error tracking endpoint |
| `DATADOG_API_KEY` | Datadog monitoring API key |
| `SMTP_USER` | Email service username |
| `SMTP_PASSWORD` | Email service password |
| `ANALYTICS_ID` | Analytics platform identifier |

---

## Platform Features

### Content
- **Total Lessons:** 301 (A1-C2 proficiency levels)
- **Host Couples:** 64 (diverse, hyper-realistic, elegant)
- **Tunisian Couples:** 20 (traditional attire, cultural representation)
- **Vocabulary Words:** 1000+
- **Languages:** English (primary), Arabic (bilingual support)

### Learning Features
- **Interactive Scenarios:** Real-world conversation practice
- **AI Avatar Guides:** Personalized learning mentors
- **Gamified Learning:** XP, achievements, certificates
- **Structured Curriculum:** CEFR-aligned (A1-C2)
- **Listening & Speaking:** Audio exercises with TTS-1-HD Nova voice
- **Spaced Repetition:** Intelligent vocabulary review system

### Advanced Features
- **Speech Recognition:** Real-time pronunciation feedback
- **Video Lessons:** Multimedia learning content
- **Mobile App:** iOS and Android support
- **Advanced Analytics:** Detailed learning progress tracking

---

## Deployment Instructions

### Prerequisites

1. **Kubernetes Access:** kubectl configured for Manus Managed Kubernetes
2. **Docker Registry Access:** Credentials for `registry.manus-cloud.internal`
3. **Manus Vault Secrets:** All required secrets configured
4. **Domain DNS:** DNS records pointing to Manus Ingress Controller

### Step 1: Prepare Manus Vault Secrets

Ensure all required secrets are stored in Manus Vault:

```bash
# Example (replace with actual values)
manus-vault set JWT_SECRET "your-jwt-secret-key"
manus-vault set SESSION_SECRET "your-session-secret-key"
manus-vault set OPENAI_API_KEY "sk-..."
# ... (set all other secrets)
```

### Step 2: Deploy to Kubernetes

```bash
# Navigate to the repository
cd /home/ubuntu/prize2pride-platform

# Apply Kubernetes manifests
kubectl apply -f k8s-deployment.yaml

# Verify namespace creation
kubectl get namespace prize2pride

# Verify deployments
kubectl get deployments -n prize2pride
kubectl get pods -n prize2pride
kubectl get svc -n prize2pride
kubectl get ingress -n prize2pride
```

### Step 3: Verify TLS Certificate

```bash
# Check certificate status
kubectl get certificate -n prize2pride
kubectl describe certificate prize2pride-tls -n prize2pride

# Verify certificate is ready
kubectl get secret prize2pride-tls -n prize2pride -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -text -noout
```

### Step 4: Monitor Deployment Progress

```bash
# Watch rollout status
kubectl rollout status deployment/prize2pride-backend -n prize2pride
kubectl rollout status deployment/prize2pride-frontend -n prize2pride

# Check pod logs
kubectl logs -n prize2pride -l app=prize2pride,component=backend --tail=100
kubectl logs -n prize2pride -l app=prize2pride,component=frontend --tail=100

# Monitor HPA status
kubectl get hpa -n prize2pride
kubectl describe hpa prize2pride-backend-hpa -n prize2pride
```

### Step 5: Verify Health Checks

```bash
# Frontend health
curl -k https://prize2pride.com/

# Backend health
curl -k https://api.prize2pride.com/health

# Backend readiness
curl -k https://api.prize2pride.com/ready
```

---

## Operational Procedures

### Scaling Deployments Manually

```bash
# Scale backend to 5 replicas
kubectl scale deployment prize2pride-backend -n prize2pride --replicas=5

# Scale frontend to 4 replicas
kubectl scale deployment prize2pride-frontend -n prize2pride --replicas=4
```

### Rolling Updates

```bash
# Update backend image
kubectl set image deployment/prize2pride-backend \
  backend=registry.manus-cloud.internal/prize2pride/backend:3.1.0 \
  -n prize2pride

# Check rollout status
kubectl rollout status deployment/prize2pride-backend -n prize2pride
```

### Rollback Procedure

```bash
# Rollback backend to previous version
kubectl rollout undo deployment/prize2pride-backend -n prize2pride

# Rollback frontend to previous version
kubectl rollout undo deployment/prize2pride-frontend -n prize2pride

# Check rollout history
kubectl rollout history deployment/prize2pride-backend -n prize2pride
```

### Accessing Logs

```bash
# Real-time logs from backend
kubectl logs -f -n prize2pride -l app=prize2pride,component=backend

# Real-time logs from frontend
kubectl logs -f -n prize2pride -l app=prize2pride,component=frontend

# Logs from specific pod
kubectl logs -n prize2pride pod/prize2pride-backend-xxxxx
```

### Database Maintenance

```bash
# Connect to TiDB (from within cluster)
mysql -h tidb-cluster.manus-cloud.internal -u prize2pride_user -p prize2pride

# Run migrations (if needed)
# This is typically done during deployment via init containers
```

---

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status and events
kubectl describe pod -n prize2pride <pod-name>

# Check container logs
kubectl logs -n prize2pride <pod-name>

# Check resource availability
kubectl top nodes
kubectl top pods -n prize2pride
```

### High Memory Usage

```bash
# Check memory usage by pod
kubectl top pods -n prize2pride --sort-by=memory

# Check HPA status
kubectl get hpa -n prize2pride
kubectl describe hpa prize2pride-backend-hpa -n prize2pride
```

### Certificate Issues

```bash
# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Check certificate status
kubectl describe certificate prize2pride-tls -n prize2pride

# Check ingress status
kubectl describe ingress prize2pride-ingress -n prize2pride
```

### Database Connection Issues

```bash
# Test database connectivity from pod
kubectl exec -it -n prize2pride <pod-name> -- \
  mysql -h tidb-cluster.manus-cloud.internal -u prize2pride_user -p prize2pride -e "SELECT 1"
```

---

## Maintenance Schedule

### Daily
- Monitor pod health and HPA metrics
- Check error rates in Sentry
- Review application logs

### Weekly
- Review performance metrics in Datadog
- Check certificate expiration dates
- Verify backup completion

### Monthly
- Review and optimize resource requests/limits
- Update dependencies and security patches
- Conduct security audit

### Quarterly
- Load testing and capacity planning
- Disaster recovery drill
- Security penetration testing

---

## Support & Contact

For deployment issues, updates, or support:

- **GitHub Repository:** https://github.com/collegeklaritausa-ui/prize2pride-platform
- **Email:** support@prize2pride.com
- **Documentation:** https://prize2pride.com/docs
- **Status Page:** https://status.prize2pride.com

---

## Branding & Attribution

**Marketed by CodinCloud — Turning Ideas into Sophisticated Platforms**

The Prize2Pride platform represents a sophisticated, enterprise-grade learning solution combining cutting-edge AI technology with elegant design and comprehensive educational content.

---

**Deployment Date:** 2025-12-26  
**Version:** 3.0.0  
**Status:** ✅ Ready for Production
