# Sécurité

## Mesures en place

- **Base auditée** : la logique ERC-20 provient d'OpenZeppelin, pas d'un code maison.
- **Solidity ≥ 0.8** : les dépassements arithmétiques (overflow/underflow) provoquent automatiquement un revert.
- **Contrôle d'accès** : `mint`, `transferToken`, `burnToken` et `transferOwnership` sont `onlyOwner`.
- **Gouvernance multisig** : dans le bonus, l'owner est le multisig, donc 2 admins sur 3 doivent être d'accord pour toute action sensible.
- **Checks-effects-interactions** : `Multisig.execute` marque une transaction comme exécutée avant l'appel externe.
- **Un vote par admin** et par transaction.
- **Cibles restreintes** : le multisig ne construit que des appels vers le token (mint / transferToken / burnToken).
- **Secrets** : la clé privée et l'URL RPC sont dans `.env`, ignoré par git.

## Limites connues (projet pédagogique)

| Sujet | Détail |
|-------|--------|
| Pouvoir de l'owner | L'owner peut créer des tokens sans limite et détruire des tokens de **n'importe quelle** adresse (`burnToken(to, …)`). C'est un risque de centralisation, atténué uniquement par le multisig. |
| Admins fixes | Les 3 admins et le seuil de 2 ne peuvent pas être modifiés après le déploiement ; perdre 2 clés fige le multisig. |
| Pas d'annulation | Une transaction proposée ne peut pas être annulée ; un vote « non » retient seulement une confirmation. |
| Transfert de propriété en une étape | `transferOwnership` prend effet immédiatement et ne vérifie pas `address(0)` ; une faute de frappe peut verrouiller le contrat. |
| Valeur de retour de `transferToken` | Le résultat du `transfer` interne n'est pas vérifié explicitement (OpenZeppelin fait un revert en cas d'échec, donc c'est sûr en pratique). |
| Wallets de test | `generated_wallets.json` stocke les clés privées en clair ; usage testnet uniquement. |
| Pas d'audit | Le code n'a pas été formellement audité. Ne le déploie pas tel quel avec de la valeur réelle. |

## Bonnes pratiques pour les utilisateurs

- Utilise un wallet dédié aux tests.
- Ne commite jamais `.env` ni `generated_wallets.json`.
- Vérifie bien les adresses avant de confirmer un vote.