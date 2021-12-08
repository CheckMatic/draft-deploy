import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/quickstart">
        <NavLink to="/quickstart">HOME</NavLink>
      </Menu.Item>
      <Menu.Item key="/wallet">
        <NavLink to="/wallet">WALLET</NavLink>
      </Menu.Item>
      <Menu.Item key="/1inch">
        <NavLink to="/1inch">DEX</NavLink>
      </Menu.Item>
      <Menu.Item key="/erc20balance">
        <NavLink to="/erc20balance">BALANCE</NavLink>
      </Menu.Item>

      <Menu.Item key="/nftBalance">
        <NavLink to="/nftBalance">NFT</NavLink>
      </Menu.Item>
      <Menu.Item key="/nft">
        <NavLink to="/nft">Mint Your NFT</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
