// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Posts {
    uint totalPosts;


    struct Post{
        address postFrom;
        uint[] subPosts;
        uint postId; 
        string message;
        uint timestamp;
        uint likes;
    }

    mapping(uint => Post) posts;
    uint[] rootPostIds;

    constructor() payable {
        console.log("We have been constructed!");
    }

    function _createPost(uint postId, string memory _message) private view returns (Post memory){
        return Post({
            postFrom: msg.sender,
            subPosts: new uint[](0),
            postId: postId,
            message: _message,
            timestamp: block.timestamp,
            likes: 1
        });
    }

    // function addPost(string memory _postMessage) public {
    //     posts[totalPosts] = _createPost(totalPosts, _postMessage);
    //     rootPostIds.push(totalPosts);
    // }

    // function addPost(string memory _postMessage, uint _parentId) public {
    //     posts[totalPosts] = _createPost(totalPosts, _postMessage);

    //     if (_parentId != totalPosts){
    //         posts[_parentId].subPosts.push(totalPosts);
    //     }

    //     totalPosts += 1;

    // }

    function f(uint _in) public pure returns (uint out) {
        out = _in;
    }

    function f(uint _in, bool _really) public pure returns (uint out) {
        if (_really) {
            out = _in;
        }
    }

    function getPost(uint postId) public view returns (Post memory){
        return posts[postId];
    }

    function getTotalPosts() public view returns(uint){
        return totalPosts;
    }

    function getRootPostIds() public view returns(uint[] memory){
        return rootPostIds;
    }
}