# Le portefeuille multisig (bonus)

Source : [`code/multisig.sol`](../code/multisig.sol)

## Objectif

Un portefeuille multisignature garantit que les opérations sensibles sur le token (création, transfert depuis la trésorerie, destruction) ne sont jamais décidées par une seule personne. Ici, **2 admins sur 3** doivent approuver une transaction avant qu'elle puisse être exécutée.

Pour que cela fonctionne, le multisig doit être l'**owner** du token et détenir sa supply (c'est fait automatiquement par les scripts du bonus).

## Rôles

| Rôle | Qui | Droits |
|------|-----|--------|
| Admin | Les 3 adresses de `admins[3]` (`admins[0]` est le déployeur) | Proposer, voter, exécuter |
| Toute autre personne | – | Lecture seule |

Toute fonction qui modifie l'état est protégée par `onlyAdmin` (revert avec `"Not an admin"`).

## Constructeur

```solidity
constructor(address _token, address admin2, address admin3)
```

- `admins[0] = msg.sender` (le déployeur)
- `admins[1] = admin2`, `admins[2] = admin3`
- stocke l'adresse du token.

## Modèle de données

```solidity
struct Transaction {
    address to;            // toujours le contrat du token
    uint256 value;         // toujours 0
    bytes   data;          // appel encodé (mint / transferToken / burnToken)
    bool    executed;
    uint8   confirmations; // nombre de votes "oui"
    bool[3] hasVoted;      // quel admin a déjà voté
}
mapping(uint256 => Transaction) public transactions;
uint256 public txCount;
```

## Cycle de vie d'une transaction

```
 proposer ──► voter (3 admins) ──► exécuter (≥ 2 "oui" requis)
```

### 1. Proposer

N'importe quel admin crée une transaction. Elle reçoit l'id `txCount`, puis `txCount` est incrémenté.

| Fonction | Appel résultant sur le token |
|----------|------------------------------|
| `proposeMint(address _to, uint256 _amount)` | `mint(_to, _amount)` |
| `transferToken(address _to, uint256 _amount)` | `transferToken(_to, _amount)` |
| `burnToken(address _to, uint256 _amount)` | `burnToken(_to, _amount)` |

> Malgré leurs noms, `transferToken` et `burnToken` sur le multisig ne font que **créer une proposition** ; rien ne se passe sur le token tant que la transaction n'est pas exécutée.

### 2. Voter

```solidity
vote(uint256 _txId, bool approve)
```

- Chaque admin ne peut voter qu'**une fois** par transaction (`"Already voted"`).
- `approve = true` ajoute une confirmation ; `false` enregistre un refus (aucune confirmation ajoutée).
- Impossible sur une transaction inexistante (`"Tx does not exist"`) ou déjà exécutée (`"Already executed"`).

### 3. Exécuter

```solidity
execute(uint256 _txId)
```

- Nécessite `confirmations >= 2` (`"Not enough confirmations"`).
- Marque la transaction comme exécutée **avant** l'appel externe (protection contre la ré-entrance / double exécution).
- Appelle le token avec les données stockées. Si l'appel échoue, toute la transaction est annulée (`"Tx failed"`), donc la transaction reste exécutable.

## Exemple de scénario

1. L'admin 1 appelle `proposeMint(adresseMultisig, 500e18)` → transaction `0`.
2. Les admins 1 et 2 appellent `vote(0, true)` ; l'admin 3 appelle `vote(0, false)`.
3. N'importe quel admin appelle `execute(0)` → 2 confirmations, le token crée 500 JT42T au profit du multisig.

## Utilisation depuis le menu du projet

Après `make run5` (local) ou `make run6` (Sepolia) :

1. Choisis un admin (1, 2 ou 3).
2. Choisis *mint*, *transfer* ou *burn* et saisis le montant (et le destinataire pour un transfert).
3. Chacun des 3 admins doit ensuite approuver (1) ou refuser (2).
4. Le script appelle `execute` ; le succès ou l'erreur est affiché (❌ + raison en cas d'échec).

## Limites

- La liste des admins est fixée au déploiement (pas d'ajout/suppression d'admin, pas de changement de seuil).
- Un refus n'annule pas la transaction ; il ne compte simplement pas comme une confirmation.
- Il ne communique qu'avec le contrat du token, pas avec des contrats arbitraires.

Voir [security.md](./5_Security.md) pour plus de détails.