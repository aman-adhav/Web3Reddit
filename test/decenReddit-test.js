const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecenReddit", function () {

    const threadBody = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    let threadsContractFactory;
    let threadsContract;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function() {
        threadsContractFactory = await ethers.getContractFactory("DecenReddit");
        threadsContract = await threadsContractFactory.deploy({
            value: hre.ethers.utils.parseEther('0.1'),
            });
        await threadsContract.deployed();

        [owner, addr1, addr2] = await ethers.getSigners();

    });

    it("creates a new thread with different threadIds", async function () {
        let threadTitle = "Title 1"
        let firstThread = await threadsContract.createThread(threadBody, threadTitle);
        await firstThread.wait()

        threadTitle = "Title 2"; 

        let secondThread = await threadsContract.createThread(threadBody, threadTitle);
        await secondThread.wait();  

        let threadIds = await threadsContract.getThreadIds();

        firstThread = await threadsContract.getThread(threadIds[0]);
        secondThread = await threadsContract.getThread(threadIds[1]);
        
        expect(firstThread.threadId).to.not.equal(secondThread.threadId);
        
    });

    it("adds posts that through a thread's attribute posts ", async function () {
        let threadTitle = "Title 1"
        let thread = await threadsContract.createThread(threadBody, threadTitle);
        let threadId = 0;
        thread = await threadsContract.getThread(threadId);
        
        let postMessage = "Blah Blah Blah";
        let threadPost = await threadsContract.rootPost(threadId, postMessage);
        await threadPost.wait();

        let postId = 0;

        let post = await threadsContract.getPost(threadId, postId);

        expect(post.message).to.equal(postMessage);
        expect(post.madeBy).to.equal(owner.address);
        
    });

    it("creates posts with different addresses for different signers", async function() {

        let threadTitle = "Title 1"
        let thread = await threadsContract.createThread(threadBody, threadTitle);
        let threadId = 0;
        thread = await threadsContract.getThread(threadId);

        let rootPost = await threadsContract.connect(addr1).rootPost(threadId, "cool comment");
        await rootPost.wait();

        const rootPostId = 0;

        let subPost = await threadsContract.connect(addr2).subPost(threadId, "nice", rootPostId);
        await subPost.wait();
        
        rootPost = await threadsContract.getPost(threadId, rootPostId);
        await rootPost;

        const subPostId = rootPost.subPosts[0];

        subPost = await threadsContract.getPost(threadId, subPostId);
        await subPost;

        expect(thread.madeBy).to.equal(owner.address);

        expect(rootPost.madeBy).to.equal(addr1.address);

        expect(subPost.madeBy).to.equal(addr2.address);
    });

});