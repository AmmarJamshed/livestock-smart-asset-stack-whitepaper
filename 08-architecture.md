---
description: End-to-end SLAS architecture and process flows
---

# End-to-end architecture & flows

{% hint style="info" %}
This chapter is the **visual spine** of the whitepaper — follow the coloured layers from farm to market.
{% endhint %}

## Layer map

```mermaid
%%{init: {'theme':'base'}}%%
flowchart TB
  subgraph Edge["Edge / L0 — teal"]
    AP[Animal Passport]
    PEERS[Other certified apps]
    PAITS[PAITS]
  end
  subgraph Core["Core / L1–L2 — green & amber"]
    REG[Registry company]
    HEALTH[Health feed service]
    STD[Protocol standards]
  end
  subgraph Capital["Capital / L3–L4 — sky & forest"]
    ISSUER[Token issuer]
    PVARA[PVARA perimeter]
    GRID[Value grid]
    PSX[PSX]
    CDC[CDC]
  end
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
  classDef teal fill:#CCFBF1,stroke:#0F766E,color:#134E4A
  classDef green fill:#DCFCE7,stroke:#15803D,color:#14532D
  classDef amber fill:#FEF3C7,stroke:#D97706,color:#78350F
  classDef sky fill:#E0F2FE,stroke:#0284C7,color:#0C4A6E
  classDef forest fill:#BBF7D0,stroke:#166534,color:#14532D
  class AP,PEERS,PAITS teal
  class REG green
  class HEALTH,STD amber
  class ISSUER,PVARA sky
  class GRID,PSX,CDC forest
```

## Happy path

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
  Farmer->>Health: Vet / lab attestation
  Health-->>Registry: Grade A/B
  Issuer->>Registry: Mint gate check
  Issuer->>Health: Grade validity
  Issuer-->>Issuer: Mint under PVARA rules
  Issuer->>Market: Book-entry (CDC phase)
  Grid->>Registry: Verified inventory
  Grid->>Market: Daily value feed
  Market-->>Farmer: Price / financing options
```

## When something goes wrong

```mermaid
flowchart TD
  E1[Dispute] --> F1[Freeze transfers]
  E2[Health quarantine] --> F1
  E3[Biometric mismatch] --> F1
  F1 --> R{Resolve}
  R -->|Confirmed| U1[Unfreeze + audit]
  R -->|Health cleared| U1
  R -->|Fraud / death| BURN[Burn / settle]
  R -->|Unresolved| ESC[Escrow hearing]
  classDef bad fill:#FEE2E2,stroke:#DC2626,color:#7F1D1D
  classDef warn fill:#FFEDD5,stroke:#D97706,color:#7C2D12
  classDef ok fill:#DCFCE7,stroke:#15803D,color:#14532D
  class E1,E2,E3,BURN bad
  class F1,ESC,R warn
  class U1 ok
```

## Readiness checklist

| Capability | Ready when… |
| --- | --- |
| Capture | ≥1 certified edge app writing promotes |
| Legal ID | Registry live with ACL + audit log |
| Health | Protocol v0.1 + attestor network |
| Token | Mint gate enforced in code + docs |
| Grid | Daily feed with methodology note |
| Market | Stage-1 PSX info product **or** private benchmark used by a bank |
