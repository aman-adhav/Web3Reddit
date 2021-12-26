const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Posts", function () {

    let postsContractFactory;
    let postsContract;
    let address;

    beforeEach(async function() {
        postsContractFactory = await ethers.getContractFactory("Posts");
        postsContract = await postsContractFactory.deploy({
            value: hre.ethers.utils.parseEther('0.1'),
            });
        await postsContract.deployed();

        address = postsContract.address;
    });

    it("without a parentId are added to rootPostIds mapping.", async function () {

        let createPost = await postsContract.rootPost('First Post', address);
        await createPost.wait();

        let createSecondPost = await postsContract.rootPost('Second Post', address);
        await createSecondPost.wait();
        
        let rootPostIds = await postsContract.getRootPostIds();
        await rootPostIds;

        expect(rootPostIds[0]).to.equal(0);

        expect(rootPostIds[1]).to.equal(1);
        
    });

    it("returns total number of posts per thread.", async function () {

        let createPost = await postsContract.rootPost('First Post', address);
        await createPost.wait();

        let createSecondPost = await postsContract.rootPost('Second Post', address);
        await createSecondPost.wait();
        
        let totalPosts = await postsContract.getTotalPosts();
        await totalPosts;

        expect(totalPosts).to.equal(2);
    });

    it("raises an exception if invalid _parentId provided for subpost.", async function () {

        let createPost = await postsContract.rootPost('First Post', address);
        await createPost.wait();

        let createSecondPost = await postsContract.rootPost('Second Post', address);
        await createSecondPost.wait();

        try{
            let createThirdPost = await postsContract.subPost('third Post', 3, address);
            await createThirdPost.wait();

        } catch(err){
            expect(err.toString()).to.equal("Error: VM Exception while processing transaction: reverted with reason string 'Problem adding comment, invalid _parentId.'");
        }
    });

    it("raises an exception if invalid postId provided.", async function () {

        const invalidPostId = 5;

        let getPost = await postsContract.getPost(invalidPostId);
        expect(getPost.timestamp).to.equal(0);
    });

    it ("returns a list of subPosts for a given post", async function () {

        let firstPost = await postsContract.rootPost('First Post', address);
        await firstPost.wait();

        let secondPost = await postsContract.subPost('Second Post', 0, address);
        await secondPost.wait();

        let thirdPost = await postsContract.subPost("Third Post", 0, address);
        await thirdPost.wait();
        
        let getPost = await postsContract.getPost(0);

        expect(getPost.subPosts.toString()).to.equal('1,2');
    
        getPost = await postsContract.getPost(2);

        expect(getPost.subPosts.toString()).to.equal('');
    });

  });