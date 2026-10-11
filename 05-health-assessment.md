---
description: Daily health feeds and clinical attestation rails
---

# Health assessment & daily feeds

{% hint style="warning" %}
**L2 — Farm health rail (amber / hay).** Barn notes and AI scores are the *raw feed*. Markets need a signed daily health grade — like an ear-tag that banks and token gates can read.
{% endhint %}

## Role in the stack

Think of this layer as the **vet desk between the paddock and the market**:

| Farm side (inputs) | Market side (outputs) |
| --- | --- |
| Passport / farm-app health events | Attested **daily health feed** |
| Local vet & lab notes | Grade **A / B / C / Quarantine** |
| Flock mortality & feed flags | Freeze / mint eligibility signals |

Proposed institutional path from the notebook: **clinical credibility** (e.g. AKUH standards path) plus **public-health policy** (Ministry of Health) with livestock / veterinary ministries. These are **design counterparts**, not claimed partners.

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'16px' }}}%%
flowchart TB
  RAW[Barn / passport<br/>health events] --> NORM[Normalize<br/>to farm schema]
  NORM --> VET[Vet / lab<br/>attestation]
  VET --> STD[Protocol check<br/>vs SLAS-HEALTH]
  STD --> FEED[Daily health<br/>feed record]
  FEED --> GATE{Grade OK?}
  GATE -->|yes · green lane| TOK[Eligible for<br/>token / credit]
  GATE -->|no · red pen| HOLD[Quarantine /<br/>remediate]
  FEED --> SURV[MoH / livestock<br/>surveillance]
  classDef barn fill:#E9F5EE,stroke:#1B4332,color:#081C15,stroke-width:2px
  classDef yard fill:#FFF3CD,stroke:#B7791F,color:#5C3B00,stroke-width:2px
  classDef gate fill:#D8F3DC,stroke:#2D6A4F,color:#081C15,stroke-width:2px
  classDef ok fill:#95D5B2,stroke:#1B4332,color:#081C15,stroke-width:2px
  classDef stop fill:#F8D7DA,stroke:#9B2226,color:#5C0008,stroke-width:2px
  classDef sky fill:#D6EAF8,stroke:#1D6A9F,color:#0B3C5D,stroke-width:2px
  class RAW,NORM barn
  class VET,STD,FEED yard
  class GATE gate
  class TOK ok
  class HOLD stop
  class SURV sky
```

{% hint style="success" %}
**Green lane** = grade passes → credit / token mint may proceed.\
**Red pen** = quarantine → freeze transfers until cleared.
{% endhint %}

## Two cadences (farm clock)

| Cadence | What the farm sees | What the market uses it for |
| --- | --- | --- |
| **Daily / near-daily** | Mortality, feed intake flags, flock alerts, movement | Outbreak alerts + token freeze |
| **Periodic** | Vaccination, lab panels, body condition, AI age/health scores | Insurance bands + mint eligibility |

## Feed record (ear-tag style stub)

```text
registry_id          # the animal / flock "tag"
timestamp_utc
metrics[]            # coded barn observations
attestor_id          # vet / lab / protocol agent
attestor_sig
protocol_version     # e.g. SLAS-HEALTH-0.1
grade                # A / B / C / Quarantine
validity_until
source_refs[]        # passport event IDs, lab report IDs
```

## Who does what on the farm vs in town

| Actor | On the farm / yard | Does **not** |
| --- | --- | --- |
| Animal Passport / farm apps | Capture raw signals & history | Issue market certificates alone |
| Local vets / labs | Attest what they see | Set national protocol alone |
| Standards partner (e.g. AKUH path) | Protocol, audit, training | Run every shed |
| MoH + livestock ministries | Outbreak / zoonoses rails | Replace farm capture |

{% hint style="danger" %}
**Why this layer matters:** a token that cannot be frozen when herd health collapses is a fiction sold to investors. L2 is the ethical core of the stack — the difference between a living asset and a paper cow.
{% endhint %}
