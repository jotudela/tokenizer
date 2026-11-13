# Documentation – Jotudela42Token (JT42T)

Bienvenue. Ce dossier explique le fonctionnement du projet et ce qu'il faut pour utiliser le token.

## Qu'est-ce que ce projet ?

`JT42T` est un **token ERC-20** déployé dans l'écosystème Ethereum (nœud Hardhat local ou testnet Sepolia). Un **portefeuille multisignature** optionnel (2 approbations sur 3 admins) peut prendre la propriété du token afin que la création, le transfert et la destruction de tokens nécessitent une décision collective.

## Sommaire

| Fichier | Contenu |
|---------|---------|
| [installation.md](./1_Installation.md) | Prérequis, installation, variables d'environnement |
| [token.md](./2_Token.md) | Le contrat du token : fonctions, rôles, événements |
| [multisig.md](./3_Multisig.md) | Le contrat multisig : cycle de vie d'une transaction |
| [deployment.md](./4_Deployment.md) | Déploiement et interaction en localhost et sur Sepolia |
| [security.md](./5_Security.md) | Modèle de sécurité, limites, améliorations possibles |

## Vue d'ensemble de l'architecture

```
            ┌────────────────────┐
            │  deployment/deploy │  (TypeScript, ethers v6)
            └─────────┬──────────┘
                      │ déploie / appelle
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌──────────────────┐   owner   ┌──────────────────┐
│ Jotudela42Token  │◄──────────│     Multisig     │
│  (ERC-20)        │  appelle  │  3 admins, 2/3   │
└──────────────────┘           └──────────────────┘
```

- **Partie obligatoire** : seul le token est déployé. Le déployeur en est l'owner et détient toute la supply.
- **Partie bonus** : le token **et** le multisig sont déployés. Toute la supply et la propriété sont ensuite transférées au multisig.

## Points clés

- Nom : `Jotudela42Token` – Symbole : `JT42T` – Décimales : `18`
- Supply initiale : `10 000 JT42T`
- Solidity : `0.8.28` – Bibliothèques : OpenZeppelin Contracts (ERC20)
- Framework : Hardhat 3 avec ethers v6