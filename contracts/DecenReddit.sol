// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./Posts.sol";

contract DecenReddit {
    uint totalThreads;
    
    event NewThread(uint threadId, int userVote);
    
    struct Thread{
        address madeBy;
        string title;
        string message;
        uint timestamp;
        int votes;
        uint threadId;
        Posts posts;
    }

    mapping(uint => Thread) threads;

    uint[] threadIds;

    constructor() payable {
    }

    mapping(address => mapping(uint => int)) public threadVotes;

    function createThread(string memory _message, string memory _title) public {
        // uint threadId = uint(keccak256(abi.encodePacked(_message, _title)));
        
        threads[totalThreads] = Thread({
            madeBy: msg.sender,
            title: _title,
            message: _message,
            timestamp: block.timestamp,
            votes: 1,
            threadId: totalThreads,
            posts: new Posts()
        });

        threadVotes[msg.sender][totalThreads] = 1;
        threadIds.push(totalThreads);
        emit NewThread(totalThreads, threadVotes[msg.sender][totalThreads]);
        totalThreads += 1;
    }

    function threadVote(uint threadId, int udvote) public {
        threadVotes[msg.sender][threadId] = udvote;
        threads[threadId].votes += udvote;
    }

    function getThread(uint threadId) public view returns(Thread memory, int){
        return (threads[threadId], threadVotes[msg.sender][threadId]);
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

    function getPost(uint threadId, uint postId) public view returns (Posts.Post memory, int){
        return threads[threadId].posts.getPost(postId, msg.sender);
    }

    function postVote(uint threadId, uint postId, int udvote) public {
        return threads[threadId].posts.vote(postId, msg.sender, udvote);
    }
}