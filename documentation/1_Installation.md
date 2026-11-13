# Installation

## Prérequis

- **Node.js** (version LTS recommandée ; Hardhat 3 nécessite un Node récent)
- **npm**
- **make**
- Pour Sepolia uniquement :
  - L'URL d'un endpoint RPC (Alchemy, Infura, QuickNode, RPC public…)
  - La clé privée d'un wallet contenant de l'**ETH de test Sepolia** (obtenu via un faucet)
  - (Optionnel) Un wallet de navigateur comme MetaMask pour visualiser le token

## Installation

```bash
git clone <url-du-depot>
cd <depot>
make install        # exécute : npm install
make compile        # exécute : npx hardhat compile
```

## Variables d'environnement

Crée un fichier `.env` à la racine du dépôt (il n'est **jamais** commité) :

```env
SEPOLIA_RPC_URL=https://sepolia.example-rpc.io/ta-cle
PRIVATE_KEY=0xta_cle_privee
```

| Variable | Utilisation | Obligatoire |
|----------|-------------|-------------|
| `SEPOLIA_RPC_URL` | Connexion à Sepolia | Sepolia uniquement |
| `PRIVATE_KEY` | Compte qui déploie et finance les wallets de test | Sepolia uniquement |

> ⚠️ Utilise un **wallet dédié aux tests**. Ne mets jamais dans `.env` une clé privée qui contient de vrais fonds.

Les variables suivantes sont définies par le Makefile pour chaque cible (tu n'as normalement pas à les définir toi-même) :

| Variable | Valeurs | Signification |
|----------|---------|---------------|
| `PART` | `mandatory`, `bonus` | Partie du projet à exécuter |
| `NETWORK` | `localhost`, `sepolia` | Réseau cible |
| `CHAINTYPE` | `op`, `l1` | Type de chaîne Hardhat (`op` pour le nœud local, `l1` pour Sepolia) |
| `MOD` | `1`, `2` | `1` = menu interactif, `2` = déploiement seul (partie obligatoire) |

## Nettoyage

| Commande | Effet |
|----------|-------|
| `make clean` | Supprime `artifacts`, `cache`, `typechain-types`, `types` |
| `make rmadrs` | Supprime les adresses sauvegardées et les wallets générés |
| `make fclean` | `clean` + `rmadrs` + supprime `node_modules` et `package-lock.json` |
| `make re` | Réinstallation et recompilation complètes |