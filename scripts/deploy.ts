import { ethers } from "hardhat";

async function main() {
	const [signer] = await ethers.getSigners();
	const Impl = await ethers.getContractFactory("Impl");
	const impl = await Impl.deploy();
	await impl.waitForDeployment();

	const implAddress = await impl.getAddress();

	const CloneFactory = await ethers.getContractFactory("CloneFactory");
	const cloneFactory = await CloneFactory.deploy();
	await cloneFactory.waitForDeployment();

	const createProxyClone = await cloneFactory.createClone(implAddress);
	await createProxyClone.wait();

	const lastClone = await cloneFactory.clones(
		parseInt(await ethers.provider.getStorage(cloneFactory.target, 0x0)) - 1
	);

	console.log(`Implementation deployed to :${implAddress},
  Proxy deployed to :${lastClone}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
