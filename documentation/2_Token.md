# Le token – `Jotudela42Token`

Source : [`code/NewToken.sol`](../code/NewToken.sol)

## Vue d'ensemble

`Jotudela42Token` est un token ERC-20 construit sur le contrat `ERC20` d'OpenZeppelin, étendu avec un rôle d'owner simple.

| Propriété | Valeur |
|-----------|--------|
| Nom | `Jotudela42Token` |
| Symbole | `JT42T` |
| Décimales | `18` |
| Supply initiale | définie au déploiement (`10 000 * 10^18` dans les scripts) |
| Détenteur initial | le déployeur (aussi premier `owner`) |

## Fonctions ERC-20 standard (héritées)

| Fonction | Description |
|----------|-------------|
| `name()` / `symbol()` / `decimals()` | Métadonnées du token |
| `totalSupply()` | Nombre total de tokens existants |
| `balanceOf(address)` | Solde d'un compte |
| `transfer(to, amount)` | Envoie des tokens depuis l'appelant |
| `approve(spender, amount)` | Autorise `spender` à dépenser des tokens |
| `allowance(owner, spender)` | Allowance restante |
| `transferFrom(from, to, amount)` | Dépense à partir d'une allowance |

Les événements `Transfer` et `Approval` sont émis conformément au standard, donc les wallets et explorateurs affichent correctement l'activité.

## Fonctions personnalisées (bonus – owner uniquement)

Toutes sont protégées par le modifier `onlyOwner` (revert avec `"Not owner"` sinon).

| Fonction | Description |
|----------|-------------|
| `transferOwnership(address newOwner)` | Donne le rôle d'owner à une autre adresse (utilisé pour confier le token au multisig) |
| `mint(address to, uint256 amount)` | Crée de nouveaux tokens et les attribue à `to` |
| `transferToken(address to, uint256 amount)` | Envoie des tokens **depuis le solde de l'owner** vers `to` (wrapper autour de `transfer`) |
| `burnToken(address to, uint256 amount)` | Détruit `amount` tokens détenus par l'adresse `to` |

> Remarque : `transferToken` appelle `transfer` en interne, donc les tokens sortent du solde de l'**appelant** (l'owner). Quand l'owner est le multisig, les tokens sortent du solde du multisig.

## Constructeur

```solidity
constructor(uint256 initialSupply)
```

- Définit le nom et le symbole.
- Définit `owner = msg.sender`.
- Crée `initialSupply` (en unités de base, c'est-à-dire déjà multiplié par `10^18`) au profit de `msg.sender`.

Exemple (comme dans `deploy.ts`) :

```ts
const token = await Token.deploy(ethers.parseUnits("10000", 18));
```

## Unités

Les montants on-chain sont des entiers en **unités de base** : `1 JT42T = 1 * 10^18` unités. Utilise `ethers.parseUnits("100", 18)` pour convertir 100 tokens en unités de base et `ethers.formatUnits(value, 18)` pour afficher un solde.

## Ajouter le token à un wallet (MetaMask)

1. Sélectionne le bon réseau (Sepolia).
2. *Importer des tokens* → *Token personnalisé*.
3. Colle l'adresse du token (dans `deployment/token_address.txt` après le déploiement, ou dans la sortie du script).
4. Le symbole `JT42T` et les 18 décimales sont remplis automatiquement.

## Interagir avec le token

Via le menu interactif du projet (voir [deployment.md](./4_Deployment.md)), ou avec n'importe quelle console ethers/Hardhat :

```ts
const token = await ethers.getContractAt("Jotudela42Token", "<adresse>");
await token.balanceOf("<compte>");
await token.transfer("<destinataire>", ethers.parseUnits("100", 18));
```