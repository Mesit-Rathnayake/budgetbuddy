# DevOps Production Scenarios - 25 Question Mock Round (With Model Answers)

Use this as a rapid interview drill. Keep answers short, structured, and production-focused.

---

## 1) Deployment failed in production after release. What do you do first?
**Model Answer:**
1. Stop further rollouts.
2. Check blast radius (all users or subset).
3. Triage logs, metrics, and recent changes.
4. If critical, rollback to last known good version.
5. Open incident timeline and communicate status.

---

## 2) How do you design rollback for container deployments?
**Model Answer:**
1. Use immutable image tags (git SHA, not only latest).
2. Keep previous stable release available in registry.
3. Roll back by redeploying old tag.
4. Validate health checks and error rates.
5. Document rollback runbook.

---

## 3) Users report 500 errors after deployment. How do you troubleshoot?
**Model Answer:**
1. Confirm via monitoring and health endpoints.
2. Compare pre/post deployment metrics.
3. Check app logs for stack trace, DB connection, env var mismatches.
4. Verify migrations and dependent services.
5. Rollback if error budget is being burned.

---

## 4) Docker image is too large. How do you reduce size?
**Model Answer:**
1. Use multi-stage builds.
2. Use slim/alpine base where compatible.
3. Copy only build artifacts into runtime image.
4. Add .dockerignore.
5. Install only production dependencies.
6. Remove caches in the same layer.

---

## 5) How do you avoid stale container deployments?
**Model Answer:**
1. Tag images with commit SHA.
2. Deploy using explicit tag.
3. Pull before up and force recreate if needed.
4. Never rely only on latest in production.

---

## 6) What causes no space left on device during docker pull, and fix?
**Model Answer:**
1. Root disk exhausted by old images, layers, logs, build cache.
2. Run docker image/container/builder prune.
3. Rotate logs.
4. Add disk-space precheck in pipeline.
5. Expand EBS/disk if needed.

---

## 7) How do you preserve database data during redeploy?
**Model Answer:**
1. Keep DB on persistent volumes (named volume/PVC).
2. Never use destructive flags like down -v unless intended.
3. Separate stateless app rollout from stateful DB storage.
4. Add automated backups and restore tests.

---

## 8) How do you manage secrets securely in CI/CD?
**Model Answer:**
1. Store secrets in Jenkins/GitHub/AWS secret store.
2. Inject at runtime; never commit to repo.
3. Mask in logs.
4. Rotate periodically and on incidents.
5. Use least privilege for credentials.

---

## 9) What is your approach to zero-downtime deployment?
**Model Answer:**
1. Use rolling or blue-green strategy.
2. Health/readiness checks gate traffic.
3. Shift traffic gradually.
4. Auto-rollback on SLO breach.

---

## 10) Difference between liveness and readiness probes?
**Model Answer:**
1. Readiness: Is app ready to receive traffic?
2. Liveness: Is app alive or stuck?
3. Readiness prevents bad traffic routing; liveness restarts hung containers.

---

## 11) Your pipeline is flaky. How do you stabilize it?
**Model Answer:**
1. Identify flaky stage and root cause category (network, timing, env).
2. Add retries only for transient failures.
3. Make builds deterministic (pin versions, clean workspace).
4. Add stage-level timeouts.
5. Improve test isolation.

---

## 12) How do you secure SSH access to servers?
**Model Answer:**
1. Disable password auth; use key-based auth only.
2. Restrict source IP in security group.
3. Rotate keys.
4. Use separate non-root user and least privileges.
5. Audit SSH logs.

---

## 13) What monitoring would you set up first in production?
**Model Answer:**
1. Golden signals: latency, traffic, errors, saturation.
2. Uptime/health endpoint checks.
3. CPU/memory/disk/network dashboards.
4. Alerting with severity and on-call routing.
5. Centralized logs.

---

## 14) High CPU on one node during traffic spike. What do you do?
**Model Answer:**
1. Confirm with metrics and top offenders.
2. Check recent deploy/config changes.
3. Scale horizontally if needed.
4. Apply temporary traffic shaping.
5. Do root cause post-incident (hot path, query, memory leak).

---

## 15) DB connection timeouts after release. Steps?
**Model Answer:**
1. Check DB health and connection limits.
2. Verify app connection pool settings.
3. Confirm security rules/network routes.
4. Check query latency and locks.
5. Roll back if needed, then fix pool/query config.

---

## 16) How do you design backup and restore for critical data?
**Model Answer:**
1. Define RPO/RTO.
2. Schedule full + incremental backups.
3. Store encrypted backups off-host.
4. Test restore regularly.
5. Monitor backup success and age.

---

## 17) What are SLI, SLO, and SLA?
**Model Answer:**
1. SLI: Measured indicator (e.g., error rate).
2. SLO: Target objective (e.g., 99.9% uptime).
3. SLA: Contractual commitment with penalties.

---

## 18) What if migration fails midway during deployment?
**Model Answer:**
1. Stop rollout immediately.
2. Use backward-compatible migration strategy.
3. Prefer expand-contract DB migration pattern.
4. Restore from backup if data risk.
5. Re-run with verified migration order.

---

## 19) How do you enforce least privilege in cloud?
**Model Answer:**
1. Separate IAM roles per service.
2. Grant only required actions/resources.
3. Avoid wildcard permissions.
4. Use short-lived credentials where possible.
5. Periodic permission audits.

---

## 20) What security checks in container pipeline?
**Model Answer:**
1. Dependency scanning (SCA).
2. Image vulnerability scan.
3. Secret scan in repo and image layers.
4. Policy checks (non-root user, minimal base).
5. Block high-severity issues in release gates.

---

## 21) How do you handle config drift on servers?
**Model Answer:**
1. Use IaC + config management as source of truth.
2. Avoid manual server edits.
3. Run periodic drift detection.
4. Auto-remediate with playbooks where safe.

---

## 22) Why infrastructure as code in production?
**Model Answer:**
1. Reproducibility and version control.
2. Peer review and audit trail.
3. Safer change management.
4. Faster disaster recovery.

---

## 23) How do you troubleshoot webhook-triggered CI failures?
**Model Answer:**
1. Check webhook delivery status and response codes.
2. Validate endpoint reachability and TLS.
3. Confirm payload signature/secret.
4. Check CI trigger rules/branch filters.
5. Replay failed delivery after fix.

---

## 24) How do you reduce MTTR during incidents?
**Model Answer:**
1. Clear runbooks and ownership.
2. Better alert quality (less noise, actionable).
3. Dashboards for quick diagnosis.
4. Predefined rollback procedures.
5. Postmortems with corrective actions.

---

## 25) You are asked: Tell me one real production-like issue you solved.
**Model Answer (example):**
We faced stale deployments where new code did not appear even after successful CI/CD. Root cause was mutable latest tags and image caching. I switched to immutable git SHA tags, deployed explicit tags, and added force-recreate plus health verification. Result: deterministic deployments and easy rollback by tag.

---

## Bonus: 30-Second Answer Framework (Use for any scenario)
1. Situation: What happened?
2. Impact: What broke and who was affected?
3. Action: What did you do immediately and why?
4. Result: What improved (time, stability, failures)?
5. Prevention: What controls were added?

Example ending line:
"I focus on fast recovery first, then long-term prevention through automation, observability, and safer deployment design."
