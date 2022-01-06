// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./Posts.sol";

contract DecenReddit {
    uint totalThreads;
    
    event NewThread(uint threadId);
    
    struct Thread{
        address madeBy;
        string title;
        string message;
        uint timestamp;
        int likes;
        uint threadId;
        Posts posts;
    }

    mapping(uint => Thread) threads;

    uint[] threadIds;

    constructor() payable {
    }


    function createThread(string memory _message, string memory _title) public {
        // uint threadId = uint(keccak256(abi.encodePacked(_message, _title)));
        threads[totalThreads] = Thread({
            madeBy: msg.sender,
            title: _title,
            message: _message,
            timestamp: block.timestamp,
            likes: 1,
            threadId: totalThreads,
            posts: new Posts()
        });
    
        threadIds.push(totalThreads);
        emit NewThread(totalThreads);
        totalThreads += 1;
    }

    function getThread(uint threadId) public view returns(Thread memory){
        return threads[threadId];
    }

    function getThreadIds() public view returns(uint[] memory){
        return threadIds;
    }

    function rootPost(uint threadId, string memory _postMessage) public {
        threads[threadId].posts.rootPost(_postMessage, msg.sender);
    }

    function subPost(uint threadId, string memory _postMessage, uint _parentId) public {
        threads[threadId].posts.subPost(_postMessage, _parentId, msg.sender);
    }

    function totalPosts(uint threadId) public view returns(uint){
        return threads[threadId].posts.getTotalPosts();
    }

    function rootPostIds(uint threadId) public view returns(uint[] memory){
        return threads[threadId].posts.getRootPostIds();
    }

    function getPost(uint threadId, uint postId) public view returns (Posts.Post memory){
        return threads[threadId].posts.getPost(postId);
    }
}