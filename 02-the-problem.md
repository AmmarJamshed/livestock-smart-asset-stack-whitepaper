---
description: Why Pakistan livestock and poultry remain unbankable
---

# The problem

{% hint style="danger" %}
**Broken fence:** animal wealth is huge on the farm — but **off-book** for banks, insurers, and markets.
{% endhint %}

## Three failures that keep animal wealth “off-book”

{% hint style="warning" %}
### 1. The ear tag washes away
{% endhint %}

Paper tags, notebooks, and village memory collapse under floods, theft disputes, and cross-district sales. When water rises, **proof of ownership disappears with the paper**. Biometric and national-traceability tools exist because this pain is real — but they are not yet wired into capital markets.

{% hint style="info" %}
### 2. The vet note never leaves the yard
{% endhint %}

A buyer, lender, or insurer rarely gets a **standardized, signed health feed** tied to a durable animal ID. Outbreak risk stays informal. Without portable health grades, insurance pricing and token mint gates cannot be honest.

{% hint style="success" %}
### 3. The mandi board never becomes a national board
{% endhint %}

Live animal and poultry value is discovered in mandis and farm-gate deals that do not produce a **national daily value surface**. Capital markets see equities and bonds — not a clean livestock grid. Illiquidity is structural, not accidental.

```mermaid
%%{init: {'theme':'base'}}%%
flowchart TB
  P1[Paper ear tags] --> X1[Flood / dispute loss]
  P2[Yard-only health notes] --> X2[Unpriced disease risk]
  P3[Local mandi prints] --> X3[No national value feed]
  X1 --> U[Off-book animal wealth]
  X2 --> U
  X3 --> U
  classDef yard fill:#FFF3CD,stroke:#B7791F,color:#5C3B00,stroke-width:2px
  classDef break fill:#F8D7DA,stroke:#9B2226,color:#5C0008,stroke-width:2px
  classDef sink fill:#E9F5EE,stroke:#1B4332,color:#081C15,stroke-width:3px
  class P1,P2,P3 yard
  class X1,X2,X3 break
  class U sink
```

## Why “just build a farm app” is not enough

{% hint style="info" %}
An app can register a cow. A **smart asset stack** must also answer title, access, attestation, mint, and price questions.
{% endhint %}

| Question the stack must answer | Farm metaphor | Layer |
| --- | --- | --- |
| Who is the **legal issuer of record**? | Title desk | Registry company |
| Who may **query** (bank, insurer, exchange)? | Who holds the keys | Access control |
| What upgrades a barn note into a market health feed? | Vet desk stamp | Health feeds |
| When may a **token** be minted or frozen? | Green lane / red pen | PVARA mint gate |
| How does a **price** get published safely? | Market board | Value grid |

## Design principle

{% hint style="success" %}
**Identity without custody is a database.**\
**Custody without identity is fiction.**\
**Price without both is noise.**
{% endhint %}

SLAS requires identity + health + token + market rails before claiming livestock is “on the grid.”
