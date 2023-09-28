// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Impl{
    uint public a;
    function testA(uint _a) public returns(uint){
         a+=_a;
         return _a;
    }

}