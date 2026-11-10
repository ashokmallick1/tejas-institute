import json
import random

domains = {
    'cloud-engineering-devops': [
        "Zero-downtime blue/green deployment pipeline for a payments API (10K TPS)",
        "Multi-region active-active Kubernetes cluster with global load balancing",
        "GitOps platform: ArgoCD + Flux + policy enforcement (OPA Gatekeeper)",
        "Chaos engineering suite: 50 failure injection scenarios with automated recovery",
        "Developer self-service portal: Backstage IDP with golden path templates",
        "Cloud cost anomaly detection system with Slack+Jira automated ticketing",
        "Serverless event-driven architecture for an insurance claims processing system",
        "Automated compliance scanner: CIS benchmarks across 500 AWS resources",
        "Observability platform: OpenTelemetry -> Grafana Loki/Tempo/Prometheus stack",
        "Database-as-a-service platform with automated backups and PITR"
    ],
    'platform-engineering-kubernetes': [
        "Internal Developer Platform (IDP) serving 200 developers with self-service infra",
        "Service mesh implementation: Istio + mTLS + circuit breaking for 50 microservices",
        "Multi-tenant Kubernetes cluster with hard namespace isolation and resource quotas",
        "Kubernetes operator for automated database schema migrations",
        "GitOps pipeline: code commit -> staging -> canary -> production in <15 minutes",
        "Platform metrics: DORA metrics dashboard for engineering leadership",
        "eBPF-based network policy enforcement without sidecar overhead",
        "Kubernetes cost allocation: per-team chargeback with Kubecost",
        "Self-healing stateful workloads: Redis Sentinel + PostgreSQL HA on Kubernetes",
        "Cross-cluster service discovery for a hybrid cloud (AWS + on-prem)"
    ],
    'cloud-architecture-finops': [
        "Cloud cost reduction from $180K/month to $80K/month for a Series B startup",
        "Multi-cloud landing zone (AWS + Azure) with unified governance and CSPM",
        "Reserved instance strategy engine with automated purchase recommendations",
        "FinOps dashboard: real-time cost by team, product, environment, service",
        "Cloud carbon footprint calculator and reduction roadmap",
        "Architecture review: migrate monolith to microservices without downtime",
        "Disaster recovery plan: RPO 15min, RTO 1hr for a core banking system",
        "Network topology optimisation: reduce data transfer costs by 60%",
        "Automated tagging enforcement across 2000 cloud resources",
        "Cloud security posture score with weekly executive dashboard"
    ],
    'cybersecurity-soc-cloud-security': [
        "Build a SOC from scratch: SIEM + SOAR + threat intelligence for a 500-employee company",
        "Red team exercise: compromise a realistic corporate AD environment and document TTPs",
        "Zero-trust network implementation: BeyondCorp model for a remote-first company",
        "Malware analysis sandbox: automated dynamic analysis with IOC extraction",
        "Cloud incident response playbook: detect + contain + eradicate AWS breach in <2hrs",
        "Vulnerability management program: triage 10,000 CVEs by business risk",
        "Phishing simulation + security awareness training for 1000 employees",
        "DPDP Act compliance implementation for an Indian e-commerce company",
        "Container security: runtime protection + image scanning CI gate",
        "Threat hunting: identify APT lateral movement in 90 days of SIEM logs"
    ],
    'ai-fullstack-software-engineering': [
        "AI-powered SaaS platform: multi-tenant, subscription billing, AI feature flags",
        "Real-time collaborative whiteboard with AI diagram generation (Next.js + WebSockets)",
        "Full-stack RAG application with document upload, processing, and citation",
        "E-learning platform with AI-generated quizzes and adaptive learning paths",
        "B2B CRM with AI lead scoring, email generation, and pipeline forecasting",
        "Progressive web app for offline-first field data collection with AI form autofill",
        "Social platform with AI content moderation at 100K posts/day",
        "Real-time AI coding assistant (VS Code extension + backend inference API)",
        "Multi-tenant API platform with rate limiting, usage analytics, developer portal",
        "Healthcare patient portal with ABDM integration and AI symptom checker"
    ],
    'business-software-erp-saas': [
        "Custom ERP module: manufacturing bill of materials + production planning",
        "Odoo customisation: unified procurement + inventory for a 50-branch retail chain",
        "SAP BTP extension: real-time delivery tracking integrated with customer WhatsApp",
        "SaaS billing engine: usage-based pricing + Stripe integration + dunning management",
        "Multi-entity accounting system with intercompany eliminations",
        "HR + Payroll SaaS for Indian compliance: PF, ESI, TDS, Form-16 automation",
        "Field service management platform: job scheduling + technician mobile app",
        "Contract lifecycle management with e-sign (DocuSign API) and renewal alerts",
        "Business intelligence platform: 50 KPI dashboards with drill-down capability",
        "WhatsApp Business API order management for a D2C food brand"
    ]
}

templates = [
    "Our enterprise client is struggling with legacy systems that cause significant delays and operational overhead. To address this, the project requires building a robust, scalable {title} that ensures high availability and performance under heavy load. The system must seamlessly integrate with existing infrastructure while providing advanced capabilities for monitoring, security, and automated workflows. You will design and implement the core architecture, ensuring it meets strict industry compliance and SLA requirements. Key challenges involve managing distributed state, handling concurrent requests efficiently, and reducing overall operational costs. The final solution must include comprehensive documentation, CI/CD automation, and a clear migration strategy for zero-downtime deployment. This capstone will test your ability to synthesize complex requirements into a production-ready system that delivers immediate business value while maintaining long-term maintainability.",
    "A rapidly growing startup requires a state-of-the-art {title} to handle their expanding user base and transaction volume. The current manual processes and monolithic architecture are becoming major bottlenecks, leading to frequent outages and security vulnerabilities. Your task is to architect and develop a resilient, cloud-native solution that automates key workflows and provides real-time visibility into system performance. This involves implementing robust security controls, optimizing resource utilization, and establishing a scalable deployment strategy. You must also account for disaster recovery, data integrity, and compliance with data protection regulations. The deliverable should encompass the entire software development lifecycle, from initial system design to a fully functional prototype ready for production deployment. Successful completion of this project demonstrates your expertise in designing modern, enterprise-grade cloud systems.",
    "An industry-leading organization is undertaking a major digital transformation and requires a highly customized {title}. The objective is to modernize their technology stack, improve developer productivity, and enhance overall system reliability. You will be responsible for defining the system architecture, selecting the appropriate tools and frameworks, and implementing a secure, scalable solution. The project demands a deep understanding of distributed systems, automated testing, and continuous integration methodologies. You must also tackle complex integration challenges, ensuring smooth data flow between disparate services and legacy applications. The ultimate goal is to deliver a solution that not only meets current operational needs but is also flexible enough to adapt to future business requirements. This project serves as a comprehensive test of your technical design and implementation skills.",
    "To maintain a competitive edge, a global enterprise is looking to implement a highly efficient {title}. The current infrastructure suffers from high costs, poor scalability, and lack of adequate security measures. Your mission is to build a comprehensive solution that leverages the latest cloud computing paradigms, ensuring optimal performance and cost-efficiency. This requires meticulous planning, robust coding practices, and a strong focus on security and compliance standards. You will need to address challenges related to data synchronization, fault tolerance, and cross-region deployment. The final product must feature detailed analytics, automated alerting, and self-healing capabilities to minimize manual intervention. This capstone project requires you to apply advanced architectural patterns and engineering best practices to solve a critical, high-impact business problem.",
    "An emerging tech company is in urgent need of an innovative {title} to support their new product launch. The project involves designing a highly scalable, fault-tolerant system capable of handling sudden spikes in traffic without performance degradation. You will implement advanced caching strategies, asynchronous message processing, and comprehensive monitoring solutions to ensure system health. The architecture must be secure by design, incorporating zero-trust principles and robust access controls. Additionally, you will be required to develop automated deployment pipelines and write extensive technical documentation for future maintenance. The final deliverable must be a robust, production-ready environment that can be seamlessly handed over to the operations team. This project will challenge you to design solutions that are both technically sophisticated and highly practical."
]

projects = []
id_counter = 1

for slug, titles in domains.items():
    for title in titles:
        problem_statement = random.choice(templates).format(title=title.lower())
        projects.append({
            "id": f"proj-{id_counter:03d}",
            "programSlug": slug,
            "title": title,
            "difficulty": random.choice(["Foundation", "Intermediate", "Advanced", "Expert"]),
            "estimatedWeeks": random.randint(4, 12),
            "tags": ["cloud", "capstone", slug.split('-')[0]],
            "problemStatement": problem_statement,
            "context": "Industry standard enterprise context.",
            "deliverables": ["Source Code", "Architecture Document", "Deployment Scripts"],
            "evaluationCriteria": ["Code Quality", "Scalability", "Security"],
            "techStack": ["AWS", "Docker", "Kubernetes", "Terraform", "TypeScript"],
            "hiringRoles": ["Cloud Engineer", "DevOps Engineer"],
            "sampleCompanies": ["Amazon", "Google", "Microsoft"],
            "isCapstone": True
        })
        id_counter += 1

ts_code = "import { DomainProject } from './projects';\n\n"
ts_code += "export const CLOUD_PROJECTS: DomainProject[] = [\n"
for p in projects:
    ts_code += "  {\n"
    for k, v in p.items():
        if isinstance(v, str):
            ts_code += f"    {k}: {json.dumps(v)},\n"
        elif isinstance(v, bool):
            ts_code += f"    {k}: {'true' if v else 'false'},\n"
        else:
            ts_code += f"    {k}: {json.dumps(v)},\n"
    ts_code += "  },\n"
ts_code += "];\n\n"

ts_code += "export const CLOUD_PROJECTS_BY_PROGRAM: Record<string, DomainProject[]> = {\n"
for slug in domains.keys():
    ts_code += f"  '{slug}': CLOUD_PROJECTS.filter(p => p.programSlug === '{slug}'),\n"
ts_code += "};\n"

with open("f:/antigravity/tejas institute/lib/data/projects-cloud.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print("projects-cloud.ts generated successfully.")
