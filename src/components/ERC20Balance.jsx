import { useMoralis } from "react-moralis";
import { useERC20Balance } from "../hooks/useERC20Balance";
import { Skeleton, Table } from "antd";
import { getEllipsisTxt } from "../helpers/formatters";
import { Button } from "react-bootstrap";
import ABI from "./SendingTokenABI.json";
import { Transaction } from "@ethereumjs/tx";
import Common from "@ethereumjs/common";
import { Buffer } from "buffer";

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "700",
  },
};
function ERC20Balance(props) {
  const { assets } = useERC20Balance(props);
  const { Moralis, web3 } = useMoralis();

  const columns = [
    {
      title: "",
      dataIndex: "logo",
      key: "logo",
      render: (logo) => (
        <img
          src={logo || "https://etherscan.io/images/main/empty-token.png"}
          alt="nologo"
          width="28px"
          height="28px"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => symbol,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value, item) =>
        parseFloat(Moralis.Units.FromWei(value, item.decimals).toFixed(6)),
    },
    {
      title: "Address",
      dataIndex: "token_address",
      key: "token_address",
      render: (address) => getEllipsisTxt(address, 5),
    },
  ];

  var key = "KEY";

  var contractAddress = "0xaDDa728E07122454EAB349B2a673f2CfF303DB91";
  var privatekey = new Buffer(key, "hex");
  var myAddress = "0xB30663279E1B0f4deD5dbbd3aad43f4494cAcd92";
  var toAddress = "0x0c0Ab27CFC2cdA6C2c05F5fa672a4b0853c41B81";

  var Contract = new web3.eth.Contract(ABI, contractAddress);
  var amount = web3.utils.toWei("1", "ether");
  // const common = Common.custom({ chainId: 80001 });
  const common = Common.custom("polygon-mumbai");

  var rawTx = {
    chainId: 80001,
    nonce: "0x00",
    gasPrice: "0x09184e72a000",
    gasLimit: "0x2710",
    from: myAddress,
    data: Contract.methods.transfer(toAddress, amount).encodeABI(),
  };

  var tx = new Transaction(rawTx, {
    common,
  });
  tx.sign(privatekey);

  var serializedTx = tx.serialize();
  // var signed_tx = web3.eth.accounts.signTransaction(rawTx, privatekey);

  return (
    <div style={{ width: "65vw", padding: "15px" }}>
      <h1 style={styles.title}>💰Token Balances</h1>
      <Skeleton loading={!assets}>
        <Table
          dataSource={assets}
          columns={columns}
          rowKey={(record) => {
            return record.token_address;
          }}
        />
      </Skeleton>
      <Button
        style={{ marginTop: "15px" }}
        variant="outline-primary"
        onClick={() => {
          console.log(serializedTx);
          web3.eth
            .sendSignedTransaction("0x" + serializedTx.toString("hex"))
            .then((res) => {
              console.log(res);
            });
        }}
      >
        Sending the token
      </Button>
    </div>
  );
}
export default ERC20Balance;
