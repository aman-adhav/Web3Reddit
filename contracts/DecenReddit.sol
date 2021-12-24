// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./Posts.sol";

contract DecenReddit {
    uint totalThreads;

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

    function createThread(string memory _message, string memory _title) public{
        uint threadId = uint(keccak256(abi.encodePacked(_message, _title)));
        threads[threadId] = Thread({
            madeBy: msg.sender,
            title: _title,
            message: _message,
            timestamp: block.timestamp,
            likes: 1,
            threadId: threadId,
            posts: new Posts()
        });

        totalThreads += 1;
    }

    function getThread(uint threadId) public view returns(Thread memory){
        return threads[threadId];
    }
}