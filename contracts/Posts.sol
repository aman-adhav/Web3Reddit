// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Posts {
    uint totalPosts;

    event Log(string message);

    struct Post{
        address madeBy;
        uint[] subPosts;
        uint postId; 
        string message;
        uint timestamp;
        uint likes;
    }

    mapping(uint => Post) posts;
    uint[] rootPostIds;

    constructor() payable {
    }

    function _createPost(uint postId, string memory _message, address author) private view returns (Post memory){
        return Post({
            madeBy: author,
            subPosts: new uint[](0),
            postId: postId,
            message: _message,
            timestamp: block.timestamp,
            likes: 1
        });
    }

    function rootPost(string memory _postMessage, address author) public {
        posts[totalPosts] = _createPost(totalPosts, _postMessage, author);
        rootPostIds.push(totalPosts);
        totalPosts += 1;
    }

    function subPost(string memory _postMessage, uint _parentId, address author) public {

        require (totalPosts > _parentId, "Problem adding comment, invalid _parentId.");

        posts[_parentId].subPosts.push(totalPosts);
        posts[totalPosts] = _createPost(totalPosts, _postMessage, author);
        totalPosts += 1;
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