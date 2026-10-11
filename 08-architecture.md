---
description: End-to-end SLAS architecture and process flows
---

# End-to-end architecture & flows

## Layer map

```mermaid
flowchart TB
  subgraph Edge["Edge / L0"]
    AP[Animal Passport]
    PEERS[Other certified apps]
    PAITS[PAITS]
  end
  subgraph Core["Core / L1–L2"]
    REG[Registry company]
    HEALTH[Health feed service]
    STD[Protocol standards body]
  end
  subgraph Capital["Capital / L3–L4"]
    ISSUER[Token issuer]
    PVARA[PVARA rule perimeter]
    GRID[Value grid / oracle]
    PSX[PSX]
    CDC[CDC]
  end
  subgraph Users["Users"]
    F[Farmers]
    B[Banks]
    I[Insurers]
    INV[Investors]
  end
  F --> AP
  F --> PAITS
  AP --> REG
  PEERS --> REG
  PAITS --> REG
  REG --> HEALTH
  STD --> HEALTH
  HEALTH --> ISSUER
  REG --> ISSUER
  ISSUER --> PVARA
  ISSUER --> CDC
  REG --> GRID
  HEALTH --> GRID
  ISSUER --> GRID
  GRID --> PSX
  B --> REG
  I --> HEALTH
  INV --> PSX
  INV --> CDC
```

## Happy path: cow (or flock) becomes a priced, custody-ready claim

```mermaid
sequenceDiagram
  autonumber
  participant Farmer
  participant Passport as Animal Passport
  participant Registry
  participant Health as Health feed
  participant Issuer as Token issuer
  participant Grid as Value grid
  participant Market as PSX / CDC
  Farmer->>Passport: Register + muzzle verify
  Passport->>Registry: Promote field ID
  Registry-->>Farmer: Canonical registry ID
  Farmer->>Health: Vet / lab attestation cycle
  Health-->>Registry: Grade A/B attached
  Issuer->>Registry: Check mint gate
  Issuer->>Health: Check grade validity
  Issuer-->>Issuer: Mint token under PVARA rules
  Issuer->>Market: Book-entry (CDC phase)
  Grid->>Registry: Pull verified inventory
  Grid->>Market: Publish daily value feed
  Market-->>Farmer: Price visibility / financing options
```

## Control flow: when something goes wrong

```mermaid
flowchart TD
  E1[Dispute filed] --> F1[Freeze transfers]
  E2[Health quarantine] --> F1
  E3[Biometric mismatch] --> F1
  F1 --> R{Resolve}
  R -->|Owner confirmed| U1[Unfreeze + audit note]
  R -->|Health cleared| U1
  R -->|Fraud / death| BURN[Burn / settle / write-off path]
  R -->|Unresolved| ESC[Escrow + local hearing]
```

## Achievement checklist (architecture readiness)

| Capability | Ready when… |
| --- | --- |
| Capture | ≥1 certified edge app writing promotes |
| Legal ID | Registry company live with ACL + audit log |
| Health | Protocol v0.1 published; ≥1 attestor network |
| Token | Mint gate enforced in code + legal docs |
| Grid | Daily feed auto-publishes with methodology note |
| Market | At least Stage-1 PSX information product **or** private benchmark with bank consumers |

## Reference deployment topology (logical)

```text
[Mobile edge] → [Promote API] → [Registry service]
                                      ↓
                              [Health feed service] ← [Attestor portal]
                                      ↓
                              [Issuer / token service] → [CDC adapter]
                                      ↓
                              [Grid publisher] → [PSX data channel]
                                      ↓
                              [Bank / insurer query API]
```

All components can start as separate services behind a single pilot operator; they should remain **logically separable** so no vendor lock-in collapses the stack.
