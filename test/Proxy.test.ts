import { loadFixture, ethers, expect } from "./setup";
import { Impl__factory } from "../typechain-types";

describe("Deploy", function () {
	async function deploy() {
		const [user] = await ethers.getSigners();

		const Impl = await ethers.getContractFactory("Impl");
		const impl = await Impl.deploy();
		await impl.waitForDeployment();

		const CloneFactory = await ethers.getContractFactory("CloneFactory");
		const maker = await CloneFactory.deploy();
		await maker.waitForDeployment();

		return {
			user,
			impl,
			maker,
		};
	}

	it("should delegate", async function () {
		const { impl, maker, user } = await loadFixture(deploy);

		const implAddress = await impl.getAddress();

		const createProxyClone = await maker.createClone(implAddress);
		await createProxyClone.wait();


		const lastClone = await maker.clones(
			parseInt(await ethers.provider.getStorage(maker.target, 0x0)) - 1
		);

		const proxy = Impl__factory.connect(lastClone, user);

		expect(await proxy.a()).to.eq(0);

		const setATx = await proxy.testA(1);
		await setATx.wait();

		expect(await proxy.a()).to.eq(1);
	});
});
