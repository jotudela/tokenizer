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


### Mandatory Localhost && Sepolia
run1:
	@make deploy PART=mandatory MOD=1 NETWORK=localhost CHAINTYPE=op

run2:
	@make deploy PART=mandatory MOD=2 NETWORK=localhost CHAINTYPE=op

run3:
	@make deploy PART=mandatory MOD=1 NETWORK=sepolia CHAINTYPE=l1

run4:
	@make deploy PART=mandatory MOD=2 NETWORK=sepolia CHAINTYPE=l1


### Bonus Localhost && Sepolia
run5:
	@make deploy PART=bonus NETWORK=localhost CHAINTYPE=op

run6:
	@make deploy PART=bonus NETWORK=sepolia CHAINTYPE=l1

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
	@rm -f deployment/generated_wallets.json

re: fclean install compile

.PHONY: all install compile node deploy run clean fclean re