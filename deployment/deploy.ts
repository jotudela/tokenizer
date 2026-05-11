import { network } from "hardhat";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import fs from "fs";
import { access } from "fs/promises";

const network_mod = process.env.NETWORK;
const chainType = process.env.CHAINTYPE;

const { ethers } = await network.create({
  network: network_mod,
  chainType: chainType,
});

async function fileExists(path: any) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// Create 20 accounts for network sepolia
async function generateWallets() {
  const wallets = [];
  
  for (let i = 0; i < 20; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      address: wallet.address,
      privateKey: wallet.privateKey
    });
  }
  
  fs.writeFileSync(
    "deployment/generated_wallets.json", 
    JSON.stringify(wallets, null, 2)
  );
  
  return wallets;
}

// Donate 0.0005 sepoila eth for test to all new wallet
async function fundWallets() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const mainWallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  
  const walletsData = JSON.parse(
    fs.readFileSync("deployment/generated_wallets.json", "utf-8")
  );

  const amountPerWallet = ethers.parseEther("0.0005"); // 0.0005 ETH par wallet
  
  for (let i = 0; i < walletsData.length; i++) {
    const walletData = walletsData[i];
    
    const tx = await mainWallet.sendTransaction({
      to: walletData.address,
      value: amountPerWallet
    });
  }
}

// Get all new wallet
function loadWallets(provider: any) {
  const walletsData = JSON.parse(
    fs.readFileSync("deployment/generated_wallets.json", "utf-8")
  );
  
  return walletsData.map((w: any) => 
    new ethers.Wallet(w.privateKey, provider)
  );
}

async function deployment(PART: string) {

  if (network_mod == "localhost")
  {
    if (PART == "mandatory")
    {
      const Token = await ethers.getContractFactory("Jotudela42Token");
      const token = await Token.deploy(ethers.parseUnits("10000", 18));
    
      await token.waitForDeployment();
    
      const address = await token.getAddress();
      fs.writeFileSync("deployment/token_address.txt", address);
    }
    else if (PART == "bonus")
    {
      //Token
      const Token = await ethers.getContractFactory("Jotudela42Token");
      const token = await Token.deploy(ethers.parseUnits("10000", 18));
    
      await token.waitForDeployment();
  
      const address = await token.getAddress();
      fs.writeFileSync("deployment/token_address.txt", address);
  
      //MULTISIG
      const Multisig = await ethers.getContractFactory("Multisig");
      const [ownwer, admin2, admin3] = await ethers.getSigners();
      const multisig = await Multisig.deploy(
        await token.getAddress(),
        await admin2.getAddress(),
        await admin3.getAddress()
      );
  
      await multisig.waitForDeployment();
  
      const mulAddress = await multisig.getAddress();
      fs.writeFileSync("deployment/multisig_address.txt", mulAddress);
    }
  }
  else if (network_mod == "sepolia")
  {
    const provider = ethers.provider;

    await generateWallets();
    await fundWallets();

    const generatedWallets = await loadWallets(provider);
    const [mainWallet] = await ethers.getSigners();

    if (PART == "mandatory")
    {
      const Token = await ethers.getContractFactory("Jotudela42Token");
      const token = await Token.deploy(ethers.parseUnits("10000", 18));
    
      await token.waitForDeployment();
    
      const address = await token.getAddress();
      fs.writeFileSync("deployment/token_address.txt", address);
    }
    else if (PART == "bonus")
    {
      //Token
      const Token = await ethers.getContractFactory("Jotudela42Token");
      const token = await Token.deploy(ethers.parseUnits("10000", 18));
    
      await token.waitForDeployment();
  
      const address = await token.getAddress();
      fs.writeFileSync("deployment/token_address.txt", address);
  
      //MULTISIG
      const Multisig = await ethers.getContractFactory("Multisig");
      const multisig = await Multisig.deploy(
        await token.getAddress(),
        await generatedWallets[0].address,
        await generatedWallets[1].address
      );
  
      await multisig.waitForDeployment();
  
      const mulAddress = await multisig.getAddress();
      fs.writeFileSync("deployment/multisig_address.txt", mulAddress);
    }
  }
}

async function mandatoryLocalhost(token: any) {

  const signers = await ethers.getSigners();

  const [account1, account2, account3, account4, account5, account6,
    account7, account8, account9, account10, account11, account12,
    account13, account14, account15, account16, account17, account18,
    account19, account20
  ] = signers.slice(0, 20);

  const accounts = [account1, account2, account3, account4, account5,
      account6, account7, account8, account9, account10, account11,
      account12, account13, account14, account15, account16, account17,
      account18, account19, account20];

  console.log("Owner address:", accounts[0].address);
  console.log("Name of token:", (await token.name()).toString());
  console.log("Symbol of token:", (await token.symbol()).toString());

  const mod = process.env.MOD;

  if (mod == "1")
  {
    console.log("\n\n\n");
    const rl = readline.createInterface({ input, output });

    while (true) {
      console.log("Send 100 JT42T tokens from owner to an account (1).");
      console.log("See the total number of tokens of an account (2).");
      console.log("See total of tokens created (3).");
      console.log("Exit (4).\n\n");
      console.log("What do you want to do ?: ");
  
  
      const answer = await rl.question("");
      const index = Number(answer);

      if (isNaN(index) || index < 1 || index > 4) {
        console.error("\nInvalid choice\n");
        continue;
      }

      if (answer == "1")
      {
        console.log("\nOwner(0), account1(1), account2(2), account3(3), account4(4)");
        console.log("account5(5), account6(6), account7(7), account8(8), account9(9)");
        console.log("account10(10), account11(11), account12(12), account13(13), account14(14)");
        console.log("account15(15), account16(16), account17(17), account18(18), account19(19)\n\n");
        console.log("Which acount you want to send tokens ?: ");
  
        const answer = await rl.question("");
        if (answer == "0")
          console.error("\nYou can't send tokens from owner to owner !\n");
        else
        {
          const index = Number(answer);

          if (isNaN(index) || index < 1 || index > 19) {
            console.error("Invalid account");
            continue;
          }

          await token.transfer(
            accounts[Number(answer)].address,
            ethers.parseUnits("100", 18)
          );

          console.log("\nAccount%d has now : %d JT42T",
            answer,
            ethers.formatUnits(await token.balanceOf(accounts[Number(answer)].address))
          );

          console.log("Remining tokens for owner : %d JT42T\n",
            ethers.formatUnits(await token.balanceOf(accounts[0].address)));
        }
      }

      else if (answer == "2")
      {
        console.log("\nOwner(0), account1(1), account2(2), account3(3), account4(4)");
        console.log("account5(5), account6(6), account7(7), account8(8), account9(9)");
        console.log("account10(10), account11(11), account12(12), account13(13), account14(14)");
        console.log("account15(15), account16(16), account17(17), account18(18), account19(19)\n\n");
        console.log("Which acount you want to send tokens ?: ");

        const answer = await rl.question("");

        if (answer == "0")
          console.log("\nNumber of tokens JT42T for owner : %d JT42T\n",
            ethers.formatUnits(await token.balanceOf(accounts[0].address)));

        else {
          const index = Number(answer);

          if (isNaN(index) || index < 1 || index > 19) {
            console.error("Invalid account");
            continue;
          }

          console.log("\nNumber of tokens JT42T for account%d : %d JT42T\n",
            answer,
            ethers.formatUnits(await token.balanceOf(accounts[Number(answer)].address))
          );
        }
      }

      else if (answer == "3") {
        console.log('\nTotal number of tokens created : %d JT42T\n',
          ethers.formatUnits(await token.totalSupply()));
      }

      else if (answer == "4") {
        rl.close();
        break;
      }
    }
  }
}

async function mandatorySepolia(token: any) {

  const signers = await ethers.getSigners();
  const provider = ethers.provider;

  const generatedWallets = await loadWallets(provider);

  for (let i = 1; i < 21; i++)
    signers[i] = generatedWallets[i - 1];

  const [account1, account2, account3, account4, account5, account6,
    account7, account8, account9, account10, account11, account12,
    account13, account14, account15, account16, account17, account18,
    account19, account20
  ] = [signers[1], ...signers.slice(2, 21)];

  const accounts = [signers[0], account1, account2, account3, account4, account5,
      account6, account7, account8, account9, account10, account11,
      account12, account13, account14, account15, account16, account17,
      account18, account19, account20];

  console.log("Owner address:", accounts[0].address);
  console.log("Name of token:", (await token.name()).toString());
  console.log("Symbol of token:", (await token.symbol()).toString());

  const mod = process.env.MOD;

  if (mod == "1")
  {
    console.log("\n\n\n");
    const rl = readline.createInterface({ input, output });

    while (true) {
      console.log("Send 100 JT42T tokens from owner to an account (1).");
      console.log("See the total number of tokens of an account (2).");
      console.log("See total of tokens created (3).");
      console.log("Exit (4).\n\n");
      console.log("What do you want to do ?: ");
  
  
      const answer = await rl.question("");
      const index = Number(answer);

      if (isNaN(index) || index < 1 || index > 4) {
        console.error("\nInvalid choice\n");
        continue;
      }

      if (answer == "1")
      {
        console.log("\nOwner(0), account1(1), account2(2), account3(3), account4(4)");
        console.log("account5(5), account6(6), account7(7), account8(8), account9(9)");
        console.log("account10(10), account11(11), account12(12), account13(13), account14(14)");
        console.log("account15(15), account16(16), account17(17), account18(18), account19(19), account20(20)\n\n");
        console.log("Which acount you want to send tokens ?: ");
  
        const answer = await rl.question("");
        if (answer == "0")
          console.error("\nYou can't send tokens from owner to owner !\n");
        else
        {
          const index = Number(answer);

          if (isNaN(index) || index < 1 || index > 20) {
            console.error("Invalid account");
            continue;
          }

          await token.transfer(
            accounts[Number(answer)].address,
            ethers.parseUnits("100", 18)
          );
        }
      }

      else if (answer == "2")
      {
        console.log("\nOwner(0), account1(1), account2(2), account3(3), account4(4)");
        console.log("account5(5), account6(6), account7(7), account8(8), account9(9)");
        console.log("account10(10), account11(11), account12(12), account13(13), account14(14)");
        console.log("account15(15), account16(16), account17(17), account18(18), account19(19), account20(20)\n\n");
        console.log("Which acount you want to send tokens ?: ");

        const answer = await rl.question("");

        if (answer == "0")
          console.log("\nNumber of tokens JT42T for owner : %d JT42T\n",
            ethers.formatUnits(await token.balanceOf(accounts[0].address)));

        else {
          const index = Number(answer);

          if (isNaN(index) || index < 1 || index > 20) {
            console.error("Invalid account");
            continue;
          }

          console.log("\nNumber of tokens JT42T for account%d : %d JT42T\n",
            answer,
            ethers.formatUnits(await token.balanceOf(accounts[Number(answer)].address))
          );
        }
      }

      else if (answer == "3") {
        console.log('\nTotal number of tokens created : %d JT42T\n',
          ethers.formatUnits(await token.totalSupply()));
      }

      else if (answer == "4") {
        rl.close();
        break;
      }
    }
  }
}

async function mandatory() {

  if (!await fileExists("deployment/token_address.txt"))
    await deployment("mandatory");
  const address = fs.readFileSync("deployment/token_address.txt", "utf-8");

  const token = await ethers.getContractAt(
    "Jotudela42Token",
    address
  );

  console.log("Contract deployed to:", await token.getAddress());

  if (network_mod == "localhost")
    mandatoryLocalhost(token);
  else if (network_mod == "sepolia")
    mandatorySepolia(token);
  else
    console.error("Bad network");
}

async function bonusLocalhost(token: any, multisig: any) {

  let txId = 0;

  const signers = await ethers.getSigners();

  const [account1, account2, account3, account4, account5, account6,
    account7, account8, account9, account10, account11, account12,
    account13, account14, account15, account16, account17, account18,
    account19, account20
  ] = signers.slice(0, 20);

  const accounts = [account1, account2, account3, account4, account5,
      account6, account7, account8, account9, account10, account11,
      account12, account13, account14, account15, account16, account17,
      account18, account19, account20];
  
  token.transfer(await multisig.getAddress(), await token.balanceOf(accounts[0].address));
  token.transferOwnership(await multisig.getAddress());

  console.log("Admin1 address:", accounts[0].address);
  console.log("Admin2 address:", accounts[1].address);
  console.log("Admin3 address:", accounts[2].address);

  console.log("\n\n\n");
  const rl = readline.createInterface({ input, output });

  while (true) {
    console.log("Select an admin account (1), (2) or (3).");
    console.log("See the total number of tokens of an account (4).")
    console.log("See the total number of JT42T tokens (5).")
    console.log("Exit (6).\n\n");
    console.log("What do you want to do ?: ");

    const answer = await rl.question("");
    const index = Number(answer);

    if (isNaN(index) || index < 1 || index > 6) {
      console.error("\nInvalid choice\n");
      continue;
    }

    const indexAdmin = index;
    if (index >= 1 && index <= 3)
    {
      console.log("\nPropose a new mint (1).");
      console.log("Propose to transfer JT42T tokens from multisig to an account (2).");
      console.log("Propose to burn tokens for the total supply (3).");
      console.log("Back (4).\n\n");
      console.log("What do you want to do ?: ");

      const answer = await rl.question("");
      const index = Number(answer);

      if (isNaN(index) || index < 1 || index > 4) {
        console.error("\nInvalid choice, back\n");
        continue;
      }

      if (index == 1)
      {
        console.log("\nAdmin%d, what is the number of JT42T tokens, you want to mint ?: ",
          Number(indexAdmin)
        );

        const number = await rl.question("");
        const indexToken = Number(number);

        if (isNaN(indexToken) || indexToken < 0) {
          console.error("\nInvalid choice, back\n");
          continue;
        }

        try {
          await multisig.proposeMint(await multisig.getAddress(), ethers.parseUnits(number, 18));
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }

        for (let i = 0; i < 3; i++)
        {
          console.log("\nAdmin%d, do you approve to mint %d JT42T tokens ? yes(1) or no(2).",
            Number(i + 1), indexToken
          );
          const number = await rl.question("");
          const index = Number(number);

          if (isNaN(index) || index < 1 || index > 2) {
            console.error("\nInvalid choice\n");
            --i;
            continue;
          }

          let approve = index == 1;

          try {
            await multisig.connect(accounts[i]).vote(txId, approve);
          }
          catch (e: any) {
            console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
          }
        }

        try {
          await multisig.execute(txId);
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }
        txId++;
      }
      else if (index == 2)
      {
        console.log("\nAdmin%d, what is the number of JT42T tokens, you want to transfer ?: ",
          Number(indexAdmin)
        );

        const numberTokens = await rl.question("");
        const indexTokens = Number(numberTokens);

        if (isNaN(indexTokens) || indexTokens < 0) {
          console.error("\nInvalid choice, back\n");
          continue;
        }

        console.log("\nadmin1(1), admin2(2), admin3(3), account4(4), account5(5)");
        console.log("account6(6), account7(7), account8(8), account9(9), account10(10)");
        console.log("account11(11), account12(12), account13(13), account14(14), account15(15)");
        console.log("account16(16), account17(17), account18(18), account19(19), account20(20)\n\n");
        console.log("Admin%d, you want to transfer %d JT42T tokens to which account ?: ",
          Number(indexAdmin), Number(indexTokens)
        );

        const numberAccount = await rl.question("");
        const indexAccount = Number(numberAccount);

        if (isNaN(indexAccount) || indexAccount < 0 || indexAccount > 20) {
          console.error("\nInvalid choice, back\n");
          continue;
        }

        try {
          await multisig.transferToken(await accounts[indexAccount - 1].getAddress(),
            ethers.parseUnits(numberTokens, 18));
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }

        for (let i = 0; i < 3; i++)
        {
          if (indexAccount >= 1 && indexAccount <= 3)
          {
            console.log("\nAdmin%d, do you approve to transfer %d JT42T tokens to admin%d ? yes(1) or no(2).",
              Number(i + 1), Number(indexTokens), Number(indexAccount));
          }
          else
          {
            console.log("\nAdmin%d, do you approve to transfer %d JT42T tokens to account%d ? yes(1) or no(2).",
              Number(i + 1), Number(indexTokens), Number(indexAccount));
          }

          const number = await rl.question("");
          const index = Number(number);

          if (isNaN(index) || index < 1 || index > 2) {
            console.error("\nInvalid choice\n");
            --i;
            continue;
          }

          let approve = index == 1;

          try {
            await multisig.connect(accounts[i]).vote(txId, approve);
          }
          catch (e: any) {
            console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
          }
        }

        try {
          await multisig.execute(txId);
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }
        txId++;
      }
      else if (index == 3)
      {
        console.log("\nAdmin%d, what is the number of JT42T tokens, you want to burn ?: ",
          Number(indexAdmin)
        );

        const numberTokens = await rl.question("");
        const indexTokens = Number(numberTokens);

        if (isNaN(indexTokens) || indexTokens < 0) {
          console.error("\nInvalid choice, back\n");
          continue;
        }

        if (indexTokens > Number(ethers.formatUnits(await token.totalSupply()))) {
          console.error("\nCant burn plus than the total supply, back\n");
          continue;
        }

        try {
          await multisig.burnToken(
            await multisig.getAddress(),
            ethers.parseUnits(numberTokens, 18)
          );
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }

        for (let i = 0; i < 3; i++)
        {
          console.log("\nAdmin%d, do you approve to burn %d JT42T tokens to total supply ? yes(1) or no(2).",
            Number(i + 1), Number(indexTokens));

          const number = await rl.question("");
          const index = Number(number);

          if (isNaN(index) || index < 1 || index > 2) {
            console.error("\nInvalid choice\n");
            --i;
            continue;
          }

          let approve = index == 1;

          try {
            await multisig.connect(accounts[i]).vote(txId, approve);
          }
          catch (e: any) {
            console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
          }
        }

        try {
          await multisig.execute(txId);
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }
        txId++;
      }
      else if (index == 4)
        console.log("\nBack.");
    }
    else if (answer == "4")
    {
      console.log("\nadmin1(1), admin2(2), admin3(3), account4(4), account5(5)");
      console.log("account6(6), account7(7), account8(8), account9(9), account10(10)");
      console.log("account11(11), account12(12), account13(13), account14(14), account15(15)");
      console.log("account16(16), account17(17), account18(18), account19(19), account20(20)\n\n");
      console.log("Which acount you want to see ?: ");

      const answer = await rl.question("");

      if (answer == "1" || answer == "2" || answer == "3")
        console.log("\nNumber of tokens JT42T for admin%d : %d JT42T\n",
          answer,
          ethers.formatUnits(await token.balanceOf(accounts[Number(answer) - 1].address))
        );
      else
      {
        const index = Number(answer);

        if (isNaN(index) || index < 1 || index > 20) {
          console.error("Invalid account");
          continue;
        }

        console.log("\nNumber of tokens JT42T for account%d : %d JT42T\n",
          answer,
          ethers.formatUnits(await token.balanceOf(accounts[Number(answer) - 1].address))
        );
      }
    }
    else if (answer == "5")
    {
      console.log('\nTotal number of tokens created : %d JT42T\n',
        ethers.formatUnits(await token.totalSupply()));
    }
    else if (answer == "6")
    {
      rl.close();
      break;
    }
  }
}

async function bonusSepolia(token: any, multisig: any) {

  let txId = 0;

  const signers = await ethers.getSigners();
  const provider = ethers.provider;

  const generatedWallets = await loadWallets(provider);

  for (let i = 1; i < 21; i++)
    signers[i] = generatedWallets[i - 1];

  const [account1, account2, account3, account4, account5, account6,
    account7, account8, account9, account10, account11, account12,
    account13, account14, account15, account16, account17, account18,
    account19, account20
  ] = [signers[1], ...signers.slice(2, 21)];

  const accounts = [signers[0], account1, account2, account3, account4, account5,
      account6, account7, account8, account9, account10, account11,
      account12, account13, account14, account15, account16, account17,
      account18, account19, account20];
  
  const transferTx = await token.transfer(
    await multisig.getAddress(), 
    await token.balanceOf(accounts[0].address)
  );
  await transferTx.wait();
  const ownershipTx = await token.transferOwnership(await multisig.getAddress());
  await ownershipTx.wait();

  console.log("Admin1 address:", accounts[0].address);
  console.log("Admin2 address:", accounts[1].address);
  console.log("Admin3 address:", accounts[2].address);

  console.log("\n\n\n");
  const rl = readline.createInterface({ input, output });

  while (true) {
    console.log("Select an admin account (1), (2) or (3).");
    console.log("See the total number of tokens of an account (4).")
    console.log("See the total number of JT42T tokens (5).")
    console.log("Exit (6).\n\n");
    console.log("What do you want to do ?: ");

    const answer = await rl.question("");
    const index = Number(answer);

    if (isNaN(index) || index < 1 || index > 6) {
      console.error("\nInvalid choice\n");
      continue;
    }

    const indexAdmin = index;
    if (index >= 1 && index <= 3)
    {
      console.log("\nPropose a new mint (1).");
      console.log("Propose to transfer JT42T tokens from multisig to an account (2).");
      console.log("Propose to burn tokens for the total supply (3).");
      console.log("Back (4).\n\n");
      console.log("What do you want to do ?: ");

      const answer = await rl.question("");
      const index = Number(answer);

      if (isNaN(index) || index < 1 || index > 4) {
        console.error("\nInvalid choice, back\n");
        continue;
      }

      if (index == 1)
      {
        console.log("\nAdmin%d, what is the number of JT42T tokens, you want to mint ?: ",
          Number(indexAdmin)
        );

        const number = await rl.question("");
        const indexToken = Number(number);

        if (isNaN(indexToken) || indexToken < 0) {
          console.error("\nInvalid choice, back\n");
          continue;
        }

        try {
          const proposeTx = await multisig.proposeMint(
            await multisig.getAddress(), 
            ethers.parseUnits(number, 18)
          );
          await proposeTx.wait();
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }

        for (let i = 0; i < 3; i++)
        {
          console.log("\nAdmin%d, do you approve to mint %d JT42T tokens ? yes(1) or no(2).",
            Number(i + 1), indexToken
          );
          const number = await rl.question("");
          const index = Number(number);

          if (isNaN(index) || index < 1 || index > 2) {
            console.error("\nInvalid choice\n");
            --i;
            continue;
          }

          let approve = index == 1;

          try {
            const voteTx = await multisig.connect(accounts[i]).vote(txId, approve);
            await voteTx.wait();
          }
          catch (e: any) {
            console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
          }
        }

        try {
          const executeTx = await multisig.execute(txId);
          await executeTx.wait();
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }
        txId++;
      }
      else if (index == 2)
      {
        console.log("\nAdmin%d, what is the number of JT42T tokens, you want to transfer ?: ",
          Number(indexAdmin)
        );

        const numberTokens = await rl.question("");
        const indexTokens = Number(numberTokens);

        if (isNaN(indexTokens) || indexTokens < 0) {
          console.error("\nInvalid choice, back\n");
          continue;
        }

        console.log("\nadmin1(1), admin2(2), admin3(3), account4(4), account5(5)");
        console.log("account6(6), account7(7), account8(8), account9(9), account10(10)");
        console.log("account11(11), account12(12), account13(13), account14(14), account15(15)");
        console.log("account16(16), account17(17), account18(18), account19(19), account20(20), account21(21)\n\n");
        console.log("Admin%d, you want to transfer %d JT42T tokens to which account ?: ",
          Number(indexAdmin), Number(indexTokens)
        );

        const numberAccount = await rl.question("");
        const indexAccount = Number(numberAccount);

        if (isNaN(indexAccount) || indexAccount < 0 || indexAccount > 21) {
          console.error("\nInvalid choice, back\n");
          continue;
        }

        try {
          const transferTx = await multisig.transferToken(await accounts[indexAccount - 1].getAddress(),
            ethers.parseUnits(numberTokens, 18));
          await transferTx.wait();
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }

        for (let i = 0; i < 3; i++)
        {
          if (indexAccount >= 1 && indexAccount <= 3)
          {
            console.log("\nAdmin%d, do you approve to transfer %d JT42T tokens to admin%d ? yes(1) or no(2).",
              Number(i + 1), Number(indexTokens), Number(indexAccount));
          }
          else
          {
            console.log("\nAdmin%d, do you approve to transfer %d JT42T tokens to account%d ? yes(1) or no(2).",
              Number(i + 1), Number(indexTokens), Number(indexAccount));
          }

          const number = await rl.question("");
          const index = Number(number);

          if (isNaN(index) || index < 1 || index > 2) {
            console.error("\nInvalid choice\n");
            --i;
            continue;
          }

          let approve = index == 1;

          try {
            const voteTx = await multisig.connect(accounts[i]).vote(txId, approve);
            await voteTx.wait();
          }
          catch (e: any) {
            console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
          }
        }

        try {
          const executeTx = await multisig.execute(txId);
          await executeTx.wait();
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }
        txId++;
      }
      else if (index == 3)
      {
        console.log("\nAdmin%d, what is the number of JT42T tokens, you want to burn ?: ",
          Number(indexAdmin)
        );

        const numberTokens = await rl.question("");
        const indexTokens = Number(numberTokens);

        if (isNaN(indexTokens) || indexTokens < 0) {
          console.error("\nInvalid choice, back\n");
          continue;
        }

        if (indexTokens > Number(ethers.formatUnits(await token.totalSupply()))) {
          console.error("\nCant burn plus than the total supply, back\n");
          continue;
        }

        try {
          const burnTx = await multisig.burnToken(
            await multisig.getAddress(),
            ethers.parseUnits(numberTokens, 18)
          );
          await burnTx.wait();
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }

        for (let i = 0; i < 3; i++)
        {
          console.log("\nAdmin%d, do you approve to burn %d JT42T tokens to total supply ? yes(1) or no(2).",
            Number(i + 1), Number(indexTokens));

          const number = await rl.question("");
          const index = Number(number);

          if (isNaN(index) || index < 1 || index > 2) {
            console.error("\nInvalid choice\n");
            --i;
            continue;
          }

          let approve = index == 1;

          try {
            const voteTx = await multisig.connect(accounts[i]).vote(txId, approve);
            await voteTx.wait();
          }
          catch (e: any) {
            console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
          }
        }

        try {
          const executeTx = await multisig.execute(txId);
          await executeTx.wait();
        }
        catch (e: any) {
          console.log("\n❌", e.reason ?? e.message ?? "Unknown error");
        }
        txId++;
      }
      else if (index == 4)
        console.log("\nBack.");
    }
    else if (answer == "4")
    {
      console.log("\nadmin1(1), admin2(2), admin3(3), account4(4), account5(5)");
      console.log("account6(6), account7(7), account8(8), account9(9), account10(10)");
      console.log("account11(11), account12(12), account13(13), account14(14), account15(15)");
      console.log("account16(16), account17(17), account18(18), account19(19), account20(20), account21(21)\n\n");
      console.log("Which acount you want to see ?: ");

      const answer = await rl.question("");

      if (answer == "1" || answer == "2" || answer == "3")
        console.log("\nNumber of tokens JT42T for admin%d : %d JT42T\n",
          answer,
          ethers.formatUnits(await token.balanceOf(accounts[Number(answer) - 1].address))
        );
      else
      {
        const index = Number(answer);

        if (isNaN(index) || index < 1 || index > 21) {
          console.error("Invalid account");
          continue;
        }

        console.log("\nNumber of tokens JT42T for account%d : %d JT42T\n",
          answer,
          ethers.formatUnits(await token.balanceOf(accounts[Number(answer) - 1].address))
        );
      }
    }
    else if (answer == "5")
    {
      console.log('\nTotal number of tokens created : %d JT42T\n',
        ethers.formatUnits(await token.totalSupply()));
    }
    else if (answer == "6")
    {
      rl.close();
      break;
    }
  }
}

async function bonus() {

  if (!await fileExists("deployment/token_address.txt") &&
      !await fileExists("deployment/multisig_address.txt"))
    await deployment("bonus");
  const token_address = fs.readFileSync("deployment/token_address.txt", "utf-8");
  const multisig_address = fs.readFileSync("deployment/multisig_address.txt", "utf-8");

  const token = await ethers.getContractAt(
    "Jotudela42Token",
    token_address
  );

  const multisig = await ethers.getContractAt(
    "Multisig",
    multisig_address
  );

  console.log("Token Contract deployed to:", await token.getAddress());
  console.log("Multisig Contract deployed to:", await multisig.getAddress());

  if (network_mod == "localhost")
    bonusLocalhost(token, multisig);
  else if (network_mod == "sepolia")
    bonusSepolia(token, multisig);
  else
    console.error("Bad network");
}

async function main() {

  const part = process.env.PART;

  if (part == "mandatory")
    mandatory();
  else if (part == "bonus")
    bonus();
  else
    console.log("Not a good PART.");
}

main();