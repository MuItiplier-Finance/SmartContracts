// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity 0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Multiplier is ERC20 {
    constructor() public ERC20("Multiplier", "MXX") {
        _setupDecimals(8);
        _mint(msg.sender, 9000000000 * (10**uint256(decimals())));
    }
}
