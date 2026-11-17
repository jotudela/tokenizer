FROM node:22-slim

# make est nécessaire pour ton Makefile, git/python/g++ pour certaines dépendances npm
RUN apt-get update && apt-get install -y --no-install-recommends \
    make git python3 g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Installer les dépendances d'abord (cache Docker)
COPY package*.json ./
RUN npm install

COPY . .
RUN npx hardhat compile

# Port RPC du nœud Hardhat
EXPOSE 8545

# --hostname 0.0.0.0 est indispensable : sans ça, le nœud n'écoute que
# sur 127.0.0.1 DANS le conteneur et MetaMask ne peut pas l'atteindre.
CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0", "--port", "8545"]