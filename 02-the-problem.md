---
description: Why Pakistan livestock and poultry remain unbankable
---

# The problem

{% hint style="danger" %}
**Core failure:** Pakistan’s animal wealth is economically huge but financially **off-book** — hard to prove, hard to insure, hard to price, hard to finance.
{% endhint %}

## Three failures that keep animal wealth “off-book”

{% hint style="warning" %}
### 1. Identity fails when it matters most
{% endhint %}

Paper tags, notebooks, and informal village knowledge collapse under floods, theft disputes, and cross-district sales. When water rises, **proof of ownership disappears with the paper**. Digital biometric and national-traceability systems exist precisely because this pain is real — but they are not yet wired into capital markets.

{% hint style="info" %}
### 2. Health risk is local and non-portable
{% endhint %}

A buyer, lender, or insurer rarely receives a **standardized, signed health feed** tied to a durable animal ID. Outbreak risk therefore stays informal. Without portable health grades, insurance pricing and token mint gates cannot be honest.

{% hint style="success" %}
### 3. Price discovery is fragmented
{% endhint %}

Live animal and poultry value is discovered in mandis and farm-gate deals that do not produce a **national daily value surface**. Capital markets see equities and bonds; they do not see a clean livestock grid. Illiquidity is structural, not accidental.

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontFamily':'Inter, sans-serif' }}}%%
flowchart TB
  P1[Paper identity] --> X1[Disputes / flood loss]
  P2[Local health notes] --> X2[Unpriced disease risk]
  P3[Fragmented mandis] --> X3[No daily value feed]
  X1 --> U[Unbankable animal wealth]
  X2 --> U
  X3 --> U
  classDef bad fill:#FEE2E2,stroke:#DC2626,color:#7F1D1D,stroke-width:2px
  classDef mid fill:#FFEDD5,stroke:#D97706,color:#7C2D12,stroke-width:2px
  classDef sink fill:#FEF3C7,stroke:#B45309,color:#78350F,stroke-width:3px
  class P1,P2,P3 mid
  class X1,X2,X3 bad
  class U sink
```

## Why “just build an app” is not enough

{% hint style="info" %}
An app can register a cow. A **smart asset stack** must also answer market-infrastructure questions.
{% endhint %}

| Question the stack must answer | Layer |
| --- | --- |
| Who is the **legal issuer of record**? | Registry company |
| Who may **query** (bank, insurer, exchange)? | Access control |
| What **attestation** upgrades a farm note into a market-grade health feed? | Health feeds |
| When may a **token** be minted or frozen? | PVARA mint gate |
| How does a **price** get published without misleading investors? | Value grid |

## Design principle

{% hint style="success" %}
**Identity without custody is a database.**\
**Custody without identity is fiction.**\
**Price without both is noise.**
{% endhint %}

SLAS requires identity + health + token + exchange rails before claiming that livestock is “on the grid.”
