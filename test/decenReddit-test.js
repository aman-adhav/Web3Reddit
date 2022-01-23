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

        [firstThread, thread1Votes] = await threadsContract.getThread(threadIds[0]);
        [secondThread, thread2Votes] = await threadsContract.getThread(threadIds[1]);

        expect(firstThread.threadId).to.not.equal(secondThread.threadId);
        expect(thread1Votes).to.equal(thread2Votes);
        expect(firstThread.votes).to.equal(1);


    });

    it("adds posts through a thread ", async function () {
        let threadTitle = "Title 1"
        let thread = await threadsContract.createThread(threadBody, threadTitle);
        let threadId = 0;
        [thread, threadVotes] = await threadsContract.getThread(threadId);
        
        let postMessage = "Blah Blah Blah";
        let threadPost = await threadsContract.rootPost(threadId, postMessage);
        await threadPost.wait();

        let postId = 0;
        let downvote = -1;

        let postVote = await threadsContract.postVote(threadId, postId, downvote);
        await postVote.wait();

        let [post, votes] = await threadsContract.getPost(threadId, postId);

        expect(post.message).to.equal(postMessage);
        expect(post.madeBy).to.equal(owner.address);

        expect(votes).to.equal(-1);
        expect(post.votes).to.equal(0);
        
    });


    it ("upvote and downvote a thread by threadId", async function () {
        let threadTitle = "Title 1";

        let firstThread = await threadsContract.connect(addr1).createThread(threadBody, threadTitle);
        await firstThread.wait()

        let downvote = await threadsContract.connect(addr2).threadVote(0, -1);

        let [getThread, voteByAddr1] = await threadsContract.connect(addr1).getThread(0);

        expect(voteByAddr1).to.equal(1);
        expect(getThread.votes).to.equal(0);

        let upVote = await threadsContract.connect(owner).threadVote(0, 1);

        [getPost, voteByAddr2] = await threadsContract.connect(addr2).getThread(0);

        expect(voteByAddr2).to.equal(-1);

        expect(getPost.votes).to.equal(1);
    });


    it("creates posts with different addresses for different signers", async function() {

        let threadTitle = "Title 1"
        let thread = await threadsContract.createThread(threadBody, threadTitle);
        let threadId = 0;
        [thread, addrVote]  = await threadsContract.getThread(threadId);

        let rootPost = await threadsContract.connect(addr1).rootPost(threadId, "cool comment");
        await rootPost.wait();

        const rootPostId = 0;

        let subPost = await threadsContract.connect(addr2).subPost(threadId, "nice", rootPostId);
        await subPost.wait();
        
        [rootPost, addr1Vote] = await threadsContract.getPost(threadId, rootPostId);
        await rootPost;

        const subPostId = rootPost.subPosts[0];

        [subPost, postVotes] = await threadsContract.getPost(threadId, subPostId);
        await subPost;

        expect(thread.madeBy).to.equal(owner.address);

        expect(rootPost.madeBy).to.equal(addr1.address);

        expect(subPost.madeBy).to.equal(addr2.address);
    });

    it("emits threadId when thread is created ", async function () {
        let threadTitle = "Title 1"
        expect(await threadsContract.createThread(threadBody, threadTitle))
            .to.emit(threadsContract, "NewThread")
            .withArgs(0);
    });


});