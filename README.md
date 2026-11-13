# Tokenizer – Jotudela42Token (JT42T)

Un token ERC-20 écrit en Solidity, compilé et déployé avec Hardhat, avec un portefeuille multisignature optionnel (bonus) qui contrôle le token.

Ce README explique **les choix effectués** pour ce projet et **les raisons de ces choix**. La documentation technique complète se trouve dans le dossier [`documentation/`](./documentation).

---

## 1. Le projet en un coup d'œil

| Élément | Valeur |
|---------|--------|
| Nom du token | `Jotudela42Token` |
| Symbole | `JT42T` |
| Décimales | 18 (valeur par défaut d'OpenZeppelin) |
| Supply initiale | 10 000 JT42T (créés au profit du déployeur) |
| Standard | ERC-20 |
| Langage | Solidity `^0.8.28` |
| Framework | Hardhat 3 (ethers v6) |
| Réseaux de test | Sepolia (testnet Ethereum) + nœud Hardhat local |
| Bonus | Multisig 2 sur 3 (`multisig.sol`) |

---

## 2. Choix et raisons

### 2.1 Blockchain : Ethereum (testnet Sepolia)
- **Pourquoi Ethereum ?** C'est l'écosystème de référence pour les smart contracts : la meilleure documentation, les outils les plus mûrs, et le standard ERC-20 y est né.
- **Pourquoi Sepolia ?** Déployer sur le mainnet coûte de l'argent réel. Sepolia est le testnet Ethereum actuellement recommandé : ETH de test gratuit, comportement identique au mainnet, et des explorateurs de blocs (Etherscan) sont disponibles.
- **Pourquoi aussi un nœud local ?** Itérer rapidement sans faucet ni RPC : `npx hardhat node` fournit 20 comptes déjà financés, idéal pour les démonstrations et le débogage.

### 2.2 Langage : Solidity
Solidity est le langage principal de l'EVM, supporté par tous les outils (Hardhat, OpenZeppelin, vérification sur Etherscan). La version `0.8.28` est fixée dans `hardhat.config.ts` pour que les builds soient reproductibles, et les versions `0.8.x` incluent des vérifications natives contre les dépassements (overflow/underflow).

### 2.3 Standard : ERC-20 via OpenZeppelin
Plutôt que de réécrire le standard à la main, `Jotudela42Token` hérite de l'implémentation `ERC20` d'OpenZeppelin, auditée. Cela évite les bugs classiques (mauvaise gestion des allowances dans `transferFrom`, événements manquants, etc.) et garantit la compatibilité avec les wallets (MetaMask), les explorateurs et les exchanges.

### 2.4 Supply et décimales
- **18 décimales** : la valeur standard, la même que l'ETH, pour que les montants se comportent comme les utilisateurs l'attendent.
- **Supply initiale de 10 000 tokens** (`10000 * 10^18` unités de base), créée une seule fois dans le constructeur au profit du déployeur. Une supply fixe et modeste suffit pour une démonstration et garde les soldes lisibles.

### 2.5 Propriété (`owner`)
Le token a un `owner` simple (le déployeur) et un modifier `onlyOwner` qui protège `mint`, `transferToken`, `burnToken` et `transferOwnership`.
- **Pourquoi une gestion de propriété personnalisée plutôt que `Ownable` d'OpenZeppelin ?** Cela garde le contrat court et explicite à des fins pédagogiques, et facilite le transfert de la propriété au multisig.
- **Pourquoi `transferOwnership` ?** C'est nécessaire pour le bonus : le multisig doit devenir owner afin qu'aucune personne seule ne puisse créer ou détruire des tokens.

### 2.6 Bonus : portefeuille multisignature 2 sur 3
- **3 admins, 2 approbations requises.** C'est le compromis classique : aucune clé seule ne peut agir (sécurité), et la perte d'une clé ne bloque pas le système (disponibilité).
- **Les admins sont fixés au déploiement** (`admins[0]` est le déployeur, les deux autres sont des arguments du constructeur). Un tableau fixe de 3 est simple, peu coûteux en gas et facile à auditer.
- **Le multisig n'appelle que le token** (mint / transfer / burn). Les transactions sont créées par des fonctions dédiées `proposeMint`, `transferToken` et `burnToken` qui encodent elles-mêmes l'appel : un admin ne peut donc pas glisser un appel arbitraire vers un autre contrat.
- **Checks-effects-interactions** : `execute` met `executed = true` *avant* l'appel externe, ce qui empêche la ré-entrance et la double exécution.
- **Un vote par admin et par transaction** (tableau `hasVoted`) pour empêcher le bourrage de votes.

### 2.7 Outils : Hardhat + TypeScript + Makefile
- **Hardhat** : compilation, nœud local, déploiements scriptés, configuration des réseaux au même endroit.
- **Script de déploiement TypeScript** (`deployment/deploy.ts`) : un seul script gère le déploiement *et* un menu interactif en ligne de commande pour utiliser le token, ce qui permet de tout démontrer sans front-end.
- **Makefile** : des commandes courtes et mémorisables (`make run1`, `make run6`…) plutôt que de longues lignes de commande avec des variables d'environnement.
- **Secrets dans `.env`** : l'URL RPC et la clé privée ne sont jamais commitées (`.env` est ignoré par git).

### 2.8 Wallets de test sur Sepolia
Sur Sepolia, le script génère 20 wallets aléatoires (`deployment/generated_wallets.json`) et envoie 0.0005 ETH de test à chacun, afin de pouvoir montrer des transferts entre de nombreux comptes sans avoir besoin de 20 clés préexistantes.

---

## 3. Structure du dépôt

```
.
├── code/
│   ├── NewToken.sol        # Token ERC-20 (Jotudela42Token)
│   └── multisig.sol        # Multisig 2 sur 3 (bonus)
├── deployment/
│   └── deploy.ts           # déploiement + menu interactif
├── documentation/          # documentation complète (voir plus bas)
├── hardhat.config.ts       # configuration Solidity + réseaux
├── Makefile                # raccourcis
└── README.md               # ce fichier
```

## 4. Démarrage rapide

```bash
# 1. Installer les dépendances
make install

# 2. Compiler
make compile

# 3. Créer un fichier .env (nécessaire pour Sepolia uniquement)
#    SEPOLIA_RPC_URL=https://...
#    PRIVATE_KEY=0x...

# 4. Utilisation en local – lancer un nœud dans un premier terminal
make node

# 5. Dans un second terminal
make run1     # partie obligatoire, menu interactif
make run5     # partie bonus (multisig)

# Sepolia
make run3     # partie obligatoire
make run6     # partie bonus
```

| Commande | Réseau | Partie | Description |
|----------|--------|--------|-------------|
| `make run1` | localhost | obligatoire | Menu interactif (envoyer / solde / supply) |
| `make run2` | localhost | obligatoire | Déploiement seul (`MOD=2`, sans menu) |
| `make run3` | sepolia | obligatoire | Menu interactif |
| `make run4` | sepolia | obligatoire | Déploiement seul |
| `make run5` | localhost | bonus | Token + multisig, interactif |
| `make run6` | sepolia | bonus | Token + multisig, interactif |

## 5. Documentation

Tout ce qu'il faut pour comprendre et utiliser le token se trouve dans [`documentation/`](./documentation) :

- [`index.md`](./documentation/0_Index.md) – vue d'ensemble et sommaire
- [`installation.md`](./documentation/1_Installation.md) – prérequis et installation
- [`token.md`](./documentation/2_Token.md) – le contrat ERC-20
- [`multisig.md`](./documentation/3_Multisig.md) – le multisig (bonus)
- [`deployment.md`](./documentation/4_Deployment.md) – déploiement et utilisation (local et Sepolia)
- [`security.md`](./documentation/5_Security.md) – modèle de sécurité et limites connues