// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error Exchange__NoTokenAddress();
error Exchange__TokenAmountZero();
error Exchange__TokenTransferFailed();
error Exchange__InsufficientOutputAmount();
error Exchange__InvalidReserve();

contract Exchange is ERC20 {
    ERC20 public tokenA;
    ERC20 public tokenB;

    uint256 private supplyTokenA;
    uint256 private supplyTokenB;

    constructor(address _addressTokenA, address _addressTokenB)
        ERC20("CryptoTurtle LP Token", "CTLP")
    {
        if (_addressTokenA == address(0) || _addressTokenB == address(0)) {
            revert Exchange__NoTokenAddress();
        }
        tokenA = ERC20(_addressTokenA);
        tokenB = ERC20(_addressTokenB);
    }

    /**Functions */

    /**
     * @dev addLiquidity to the contract
     */
    function addLiquidity(uint256 _amountA, uint256 _amountB)
        public
        returns (uint256)
    {
        //get the total Amount of tokens
        uint256 reserveA = getReserveTokenA();
        uint256 reserveB = getReserveTokenA();
        uint256 liquidity;

        if (_amountA == 0 || _amountB == 0) {
            revert Exchange__TokenAmountZero();
        }

        // if the reserveA is empty the initial Supply will be added
        if (reserveA == 0) {
            bool transferTokenA = tokenA.transferFrom(
                msg.sender,
                address(this),
                _amountA
            );
            bool transferTokenB = tokenB.transferFrom(
                msg.sender,
                address(this),
                _amountB
            );

            if (!transferTokenA || !transferTokenB) {
                revert Exchange__TokenTransferFailed();
            }

            //after succesfull transferred the tokens to the contract mint the LP tokens
            liquidity = _amountA;

            _mint(msg.sender, _amountA);
        } else {
            /*
            If the reserve is not empty, intake any user supplied value for
            `tokenA` and determine according to the ratio how many `tokenB` tokens
            need to be supplied to prevent any large price impacts because of the additional
            liquidity
            */
            uint256 requiredTokenB = ((_amountA * reserveB) / reserveA);

            bool transferTokenA = tokenA.transferFrom(
                msg.sender,
                address(this),
                _amountA
            );
            bool transferTokenB = tokenB.transferFrom(
                msg.sender,
                address(this),
                _amountB
            );

            if (!transferTokenA || !transferTokenB) {
                revert Exchange__TokenTransferFailed();
            }
            liquidity = (totalSupply() * _amountA) / reserveA;
            _mint(msg.sender, liquidity);
        }
        return liquidity;
    }

    /**
     * @dev Returns the amount Eth/Crypto Dev tokens that would be returned to the user
     * in the swap
     */
    function removeLiquidity(uint256 _amount)
        public
        returns (uint256, uint256)
    {
        if (_amount == 0) {
            revert Exchange__TokenAmountZero();
        }

        uint256 reserveTokenA = getReserveTokenA();
        uint256 reserveTokenB = getReserveTokenB();
        uint256 totalLiquidity = totalSupply();

        uint256 amountTokenA = (reserveTokenA * _amount) / totalLiquidity;
        uint256 amountTokenB = (reserveTokenB * _amount) / totalLiquidity;

        _burn(msg.sender, _amount);

        bool transferTokenA = tokenA.transfer(msg.sender, _amount);
        bool transferTokenB = tokenB.transfer(msg.sender, _amount);
        if (!transferTokenA || !transferTokenB) {
            revert Exchange__TokenTransferFailed();
        }

        return (amountTokenA, amountTokenB);
    }

    /**
     * @dev Swap tokenA for tokenB
     * @param _minAmountTokenB - if the calclulated output amount is lower than the transaction will be reverted
     * @param _amount - the amount of tokens the sender want to swap
     */
    function swapTokenA(uint256 _amount, uint256 _minAmountTokenB) external {
        uint256 reserveTokenA = getReserveTokenA();
        uint256 reserveTokenB = getReserveTokenB();

        uint256 outputTokenB = getAmountOfTokens(
            _amount,
            reserveTokenA,
            reserveTokenB
        );

        if (outputTokenB < _minAmountTokenB) {
            revert Exchange__InsufficientOutputAmount();
        }

        bool transferTokenA = tokenA.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        bool transferTokenB = tokenB.transfer(address(this), outputTokenB);

        if (!transferTokenA || !transferTokenB) {
            revert Exchange__TokenTransferFailed();
        }
    }

    /**
     * @dev Swap tokenB for tokenA
     * @param _minAmountTokenA - if the calclulated output amount is lower than the transaction will be reverted
     * @param _amount - the amount of tokens the sender want to swap
     */
    function swapTokenB(uint256 _amount, uint256 _minAmountTokenA) external {
        uint256 reserveTokenA = getReserveTokenA();
        uint256 reserveTokenB = getReserveTokenB();

        uint256 outputTokenA = getAmountOfTokens(
            _amount,
            reserveTokenB,
            reserveTokenA
        );

        if (outputTokenA < _minAmountTokenA) {
            revert Exchange__InsufficientOutputAmount();
        }

        bool transferTokenB = tokenB.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        bool transferTokenA = tokenA.transfer(address(this), outputTokenA);

        if (!transferTokenA || !transferTokenB) {
            revert Exchange__TokenTransferFailed();
        }
    }

    /** View/Pure Functions */

    /**
     * @dev Returns the amount TokenA / TokenB that would be returned to the user in the swap
     */
    function getAmountOfTokens(
        uint256 _inputAmount,
        uint256 _inputReserve,
        uint256 _outputReserve
    ) public pure returns (uint256) {
        if (_inputReserve == 0 || _outputReserve == 0) {
            revert Exchange__InvalidReserve();
        }
        // Because we need to follow the concept of `XY = K` curve
        // We need to make sure (x + Δx) * (y - Δy) = x * y
        // So the final formula is Δy = (y * Δx) / (x + Δx)
        // Δy in our case is `tokens to be received`
        // Δx = ((input amount)*99)/100, x = inputReserve, y = outputReserve
        uint256 _outputAmount = (_outputReserve * _inputAmount) /
            (_inputReserve + _inputAmount);
        return _outputAmount;
    }

    function getReserveTokenA() public view returns (uint256) {
        return tokenA.balanceOf(address(this));
    }

    function getReserveTokenB() public view returns (uint256) {
        return tokenB.balanceOf(address(this));
    }
}
