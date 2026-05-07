NAME = tokenizer

HARDHAT = npx hardhat

DEPLOY_SCRIPT = deployment/deploy.ts

NETWORK = localhost

# =========================
# BASIC
# =========================

all: compile

install:
	npm install

compile:
	$(HARDHAT) compile

node:
	$(HARDHAT) node

deploy: rmadrs
	$(HARDHAT) run $(DEPLOY_SCRIPT) --network $(NETWORK)

run: deploy

# =========================
# CLEAN
# =========================

clean:
	rm -rf artifacts
	rm -rf cache
	rm -rf typechain-types
	rm -rf types

fclean: clean rmadrs
	rm -rf node_modules
	rm -f package-lock.json
	
rmadrs:
	@rm -f deployment/token_address.txt
	@rm -f deployment/multisig_address.txt

re: fclean install compile

.PHONY: all install compile node deploy run clean fclean re