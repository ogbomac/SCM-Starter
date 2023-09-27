// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract calculator {

    int public value;

    function add(uint x, uint y) public pure returns(uint) {
        return (x + y);
    }

    function subtract(int x, int y) public pure returns(int) {
        return (x - y);
    }

    function save(int z) public {
        value = z;
    }
}
