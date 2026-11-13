# Déploiement et utilisation

Tout le flux est piloté par [`deployment/deploy.ts`](../deployment/deploy.ts) et le [`Makefile`](../Makefile).

## Comportement du script

1. Lit `NETWORK`, `CHAINTYPE`, `PART` (et `MOD`) depuis l'environnement.
2. Si aucun fichier d'adresse n'existe, il **déploie** le ou les contrats et enregistre leurs adresses :
   - `deployment/token_address.txt`
   - `deployment/multisig_address.txt` (bonus)
3. Se connecte au(x) contrat(s) déployé(s) et lance le menu interactif.

`make deploy` exécute d'abord `rmadrs`, qui supprime les fichiers d'adresses et les wallets générés : **chaque `make runX` effectue donc un déploiement neuf**.

## Réseau local (nœud Hardhat)

Ouvre deux terminaux.

**Terminal 1** – démarre le nœud (20 comptes financés, chain id 31337) :

```bash
make node
```

**Terminal 2** – lance ce dont tu as besoin :

| Commande | Ce qu'elle fait |
|----------|-----------------|
| `make run1` | Déploie le token et ouvre le menu interactif |
| `make run2` | Déploie le token, affiche nom/symbole/owner (sans menu) |
| `make run5` | Déploie token + multisig et ouvre le menu multisig |

## Testnet Sepolia

Prérequis : `.env` rempli (voir [installation.md](./1_Installation.md)) et déployeur financé en ETH Sepolia.

| Commande | Ce qu'elle fait |
|----------|-----------------|
| `make run3` | Partie obligatoire, menu interactif |
| `make run4` | Partie obligatoire, sans menu |
| `make run6` | Partie bonus (token + multisig) |

Sur Sepolia, le script :

1. Génère **20 wallets aléatoires** et les sauvegarde dans `deployment/generated_wallets.json`.
2. Envoie **0.0005 ETH Sepolia** à chacun, pour qu'ils puissent exister et payer le gas.
3. Utilise les deux premiers wallets générés comme `admin2` et `admin3` du multisig (bonus).

> ⚠️ `generated_wallets.json` contient les **clés privées** des wallets de test. Ne les réutilise pour rien de valable, et ne commite pas ce fichier.

Le compte déployeur doit donc détenir au moins `20 × 0.0005 = 0.01` ETH Sepolia, plus le gas.

## Menu de la partie obligatoire (`make run1` / `make run3`)

```
(1) Envoyer 100 JT42T de l'owner vers un compte
(2) Voir le nombre de tokens d'un compte
(3) Voir le total de tokens créés
(4) Quitter
```

- Les comptes sont numérotés : `0` = owner, `1…19` en localhost (`1…20` sur Sepolia).
- L'option 1 transfère exactement 100 JT42T de l'owner vers le compte choisi.

## Menu de la partie bonus (`make run5` / `make run6`)

Au démarrage, le script transfère tout le solde de l'owner au multisig et **transfère la propriété du token au multisig**. À partir de là, seules les décisions du multisig peuvent créer des tokens, transférer depuis la trésorerie ou en détruire.

```
(1)(2)(3) Choisir un admin → proposer mint / transfer / burn
(4)       Voir le solde d'un compte
(5)       Voir la supply totale
(6)       Quitter
```

Pour chaque proposition, les trois admins sont invités à voter, puis `execute` est appelé. Voir [multisig.md](./3_Multisig.md).

## Vérifier le résultat

- **Local** : le script affiche les soldes et la supply totale après les opérations.
- **Sepolia** : colle l'adresse du contrat (dans `deployment/token_address.txt` ou dans la sortie du script) sur <https://sepolia.etherscan.io> pour voir le token, les détenteurs et les transferts.

## Dépannage

| Problème | Cause probable / solution |
|----------|---------------------------|
| `Bad network` | `NETWORK` n'est ni `localhost` ni `sepolia` – utilise les cibles `make runX` |
| Connexion refusée en localhost | Le nœud ne tourne pas – lance-le avec `make node` |
| `insufficient funds` sur Sepolia | Finance le déployeur via un faucet Sepolia |
| `Not an admin` / `Not owner` | L'appelant n'est pas admin / n'est pas l'owner du token |
| `Not enough confirmations` | Moins de 2 admins ont approuvé la transaction |
| État incohérent après modification | `make clean && make compile`, puis relance |