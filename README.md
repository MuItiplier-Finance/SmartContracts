## `YieldContract`

TO NOTE
Store collateral and provide interest MXX or burn MXX <br />
Interest (contractFee, penaltyFee etc) is always represented 10 power 6 times the actual value<br />
Note that only 4 decimal precision is allowed for interest<br />
If interest is 5%, then value to input is 0.05 * 10 pow 6 = 5000<br />
mFactor or mintFactor is represented 10 power 18 times the actual value.<br />
If value of 1 ETH is 380 USD, then mFactor of ETH is (380 * (10 power 18))<br />
Collateral should always be in its lowest denomination (based on the coin or Token)<br />
If collateral is 6 USDT, then value is 6 * (10 power 6) as USDT supports 6 decimals<br />
startTime and endTime are represented in Unix time<br />
tenure for contract is represented in days (90, 180, 270) etc<br />
mxxToBeMinted or mxxToBeMinted is always in its lowest denomination (8 decimals)<br />
For e.g if mxxToBeMinted = 6 MXX, then actual value is 6 * (10 power 8)<br />


