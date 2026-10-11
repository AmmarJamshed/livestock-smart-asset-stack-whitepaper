---
description: Animal Passport, PAITS, and the capture edge of the stack
---

# Field identity: Animal Passport & PAITS

{% hint style="info" %}
**Role:** L0 — capture and verification. Not the registry, not the exchange, not the token issuer. This is how living animals **enter** the smart process.
{% endhint %}

```mermaid
%%{init: {'theme':'base'}}%%
flowchart LR
  F[Farmer] --> SCAN[Muzzle / tag / PAITS]
  SCAN --> PASS[Digital record]
  PASS --> VERIFY[Field verify]
  VERIFY --> PROMOTE[Promote]
  PROMOTE --> L1[L1 Legal ID]
  classDef teal fill:#CCFBF1,stroke:#0F766E,color:#134E4A,stroke-width:2px
  classDef green fill:#DCFCE7,stroke:#15803D,color:#14532D,stroke-width:2px
  class F,SCAN,PASS,VERIFY teal
  class PROMOTE,L1 green
```

## Animal Passport — private product edge

{% hint style="success" %}
Pakistan-rooted biometric livestock platform: muzzle/nose ID, owner binding, health/breeding history, APIs, flood-recovery identity.
{% endhint %}

| SLAS need | How it assists |
| --- | --- |
| Unique living asset | Biometric ID + optional tag |
| Owner binding | Owner account + contacts |
| Disaster continuity | Cloud ID survives lost tags |
| Integration | Verification API |
| Health raw events | Farm history → L2 inputs |

## PAITS — public policy edge

{% hint style="warning" %}
**PAITS** (PITB + FAO for GoP): national ID, tracing, health check, monitoring — **government data gravity**. Map private biometric IDs to PAITS keys (dual-rail).
{% endhint %}

## Integration models

| Model | Idea | Prefer when |
| --- | --- | --- |
| **A** Edge vendor | Apps onboard; registry is SoR | Fast multi-vendor pilot |
| **B** Dual-rail | PAITS + Animal Passport | Legitimacy + innovation |
| **C** Licensed operator | One capture agent / province | Deep MVP |
| **D** Standards-only | Any certified app | Open long-term market |

{% hint style="success" %}
**v1 recommendation:** Model **B (dual-rail)** — one province, one species.
{% endhint %}

{% hint style="danger" %}
Do **not** claim Animal Passport or PAITS are already wired to PSX, CDC, PVARA, or AKUH without a signed MoU.
{% endhint %}
