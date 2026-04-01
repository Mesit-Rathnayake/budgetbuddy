# Project-Issue-Based DevOps Mock Question Series

This set is based on real issues you faced while building/deploying BudgetBuddy.
Use these to answer with confidence in scenario-based interviews.

---

## 1) Stale deployment after successful pipeline
**Question:** Your Jenkins pipeline is green, but users still see old UI. What happened and how did you fix it?
**Model Answer:**
- Root cause was mutable image tags (`latest`) and Docker layer caching on server.
- I switched to immutable Git SHA tags for each build.
- Deployment now pulls exact SHA tag and recreates containers.
- This made deployments deterministic and rollback easy.

---

## 2) Docker Hub authentication failure
**Question:** CI failed with `unauthorized` when pushing images. What is your troubleshooting flow?
**Model Answer:**
- Validate credential type first (password vs access token).
- Check Jenkins credential mapping and environment variable usage.
- Re-login via CLI to confirm account and repo permissions.
- Replace password with Docker Hub access token (read/write) and retry.

---

## 3) Secret interpolation warning in Jenkins
**Question:** Jenkins warns about insecure Groovy interpolation for secret values. Why is it risky and how do you fix it?
**Model Answer:**
- Groovy interpolation may expose secrets in command history/log contexts.
- I moved secret usage into shell environment variables inside `sh ''' ... '''`.
- This avoids interpolating secrets in Groovy strings.
- It removes warning and improves pipeline secret hygiene.

---

## 4) EC2 disk full during image pull
**Question:** Deployment fails with `no space left on device` while pulling containers. How do you recover and prevent recurrence?
**Model Answer:**
- Immediate recovery: prune old images/containers/build cache and clean package cache.
- Prevention: add disk-space precheck in deploy playbook.
- Add regular cleanup tasks and log rotation.
- If recurring, increase EBS volume size.

---

## 5) Package update failed due to low disk
**Question:** Ansible failed while updating Docker package due to insufficient disk. What change did you apply?
**Model Answer:**
- I changed package install behavior from forced update to ensure-present state.
- This prevents unnecessary large RPM upgrades during deploy.
- It keeps deployment lightweight and stable on small instances.

---

## 6) Local Jenkins not reachable from GitHub
**Question:** You run Jenkins locally. How did you enable GitHub webhook-triggered automation?
**Model Answer:**
- Used ngrok to expose local Jenkins over HTTPS.
- Configured GitHub webhook to `/github-webhook/` on ngrok URL.
- Verified via webhook delivery logs and Jenkins build trigger.
- Caveat: free ngrok URLs change, so webhook URL must be updated after restart.

---

## 7) Build vs deploy responsibility on low-resource EC2
**Question:** Why did you choose local image build + remote image run instead of building on EC2?
**Model Answer:**
- t3.micro has limited CPU/RAM; local build is faster and more reliable.
- Jenkins builds/pushes images to registry, EC2 only pulls/runs.
- This separates CI compute from runtime host and improves stability.

---

## 8) Data loss concern on redeploy
**Question:** How do you preserve user data after redeployment?
**Model Answer:**
- Keep DB state on persistent volume (`mongo-data`/PVC), not in ephemeral container FS.
- Avoid destructive commands like `down -v` unless intended.
- Maintain backup + restore procedures for recovery scenarios.

---

## 9) Health checks after deployment
**Question:** Why did you add health checks and what do they verify?
**Model Answer:**
- Health checks verify service readiness after rollout.
- Backend health endpoint confirms app and dependency availability.
- They reduce false-success deployments and improve confidence.

---

## 10) Deployment traceability and rollback readiness
**Question:** How do you trace exactly what version is running in production?
**Model Answer:**
- Every image is tagged with commit SHA.
- Deploy logs contain the SHA used.
- If issue occurs, redeploy previous SHA quickly for rollback.

---

## 11) Pipeline robustness for flaky network pushes
**Question:** Docker push sometimes fails with transient TLS/network errors. What did you do?
**Model Answer:**
- Added retry logic with bounded attempts and sleep interval.
- Retries only around transient operations (image push).
- Avoids random pipeline failures without masking real errors.

---

## 12) Ansible Python bootstrap issue
**Question:** Why did you include a Python bootstrap stage before normal Ansible tasks?
**Model Answer:**
- Target host had Python constraints for module compatibility.
- Bootstrap ensures required Python is available before normal tasks run.
- Prevents module failures and keeps playbook execution consistent.

---

## 13) Config drift control
**Question:** How do you avoid manual config drift on the server?
**Model Answer:**
- Keep deployment/config in Ansible playbooks and templates.
- Re-run playbooks as source of truth.
- Avoid one-off manual edits except emergency fixes, then codify them.

---

## 14) Security of deployment credentials
**Question:** What credentials exist in your pipeline and how are they protected?
**Model Answer:**
- Docker Hub token, SSH private key, and app secrets are in Jenkins credentials store.
- Secrets are injected at runtime, never committed to Git.
- Access is role-scoped and logs avoid secret exposure.

---

## 15) Post-incident learning loop
**Question:** Give one example of turning an incident into a permanent improvement.
**Model Answer:**
- Incident: disk-full during pull caused failed release.
- Action: added Docker cleanup and pre-pull disk-space checks in playbook.
- Result: failures now happen early with clear reason, recovery is faster.

---

## Quick Practice Pattern (30 seconds each)
For every answer, use this format:
1. Problem observed
2. Root cause
3. Fix implemented
4. Prevention added
5. Outcome

Example closing line:
"I focus on making failures predictable, recoverable, and less likely next time through automation and guardrails."
