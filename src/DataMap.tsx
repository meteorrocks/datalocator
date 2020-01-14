import { Ocean } from "@oceanprotocol/squid";
import { Card, Input, message } from "antd";
import * as React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import Web3 from "web3";

let web3: any;

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

//@ts-disable
if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
  window.ethereum.enable();
}

type StateType = {
  inputVal: string;
  markers: any[];
};

export class DataMap extends React.Component {
  state: StateType = {
    inputVal: "",
    markers: []
  };

  // parse = (file: any) => {
  //   console.log(file);
  //   return JSON.parse(file);
  // };

  async getFileFromDid(did: string) {
    message.loading({ content: "Loading...", key: "message", duration: 300000 });
    // @ts-ignore
    const ocean: any = await new Ocean.getInstance({
      web3Provider: web3,
      nodeUri: "https://pacific.oceanprotocol.com",
      aquariusUri: "https://aquarius.commons.oceanprotocol.com",
      brizoUri: "https://brizo.commons.oceanprotocol.com",
      brizoAddress: "0x00bd138abd70e2f00903268f3db08f2d25677c9e",
      parityUri: "https://pacific.oceanprotocol.com",
      secretStoreUri: "https://secret-store.oceanprotocol.com/",
      verbose: true
    });
    try {
      const accounts = await ocean.accounts.list();
      const agreement = await ocean.assets.order(did, 0, accounts[0]);
      await ocean.assets.consume(agreement, did, 0, accounts[0], "", 0);
      console.log("done");
      message.success({
        content: "Ressource consumed. If GPS are detected, it will de displayed here.",
        key: "message",
        duration: 5
      });
    } catch (error) {
      console.error(error.message);
      message.error({ content: "Could not consume ressource...", key: "message", duration: 5 });
    }
  }

  handleKeyPress = async (event: any) => {
    if (event.key === "Enter") {
      console.log("input:", this.state.inputVal);

      await this.getFileFromDid(this.state.inputVal);
      /*
        I have not been able to read the file from the browser after downloading it with the consume method.
        It would be great to have a callback method with the data of the file.
      */
      if (this.state.inputVal === "did:op:f6cb0812a89f46b99467136022ebc16f56321becd98f4e83b38bc9c46f19a836") {
        fetch("./capitals-of-the-world.json")
          .then(res => res.json())
          .then(data => {
            this.setState({
              markers: data
            });
            console.log(this.state.markers);
          });
      } else {
        message.error({ content: "Could not consume ressource...", key: "message", duration: 5 });
      }
    }
  };

  render() {
    return (
      <div>
        <Card className="input-card">
          <Input
            placeholder="Enter a Commons DID"
            onKeyPress={e => this.handleKeyPress(e)}
            onChange={e => this.setState({ inputVal: e.target.value })}
          />
        </Card>
        <Map center={[40, 0]} zoom={3}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {this.state.markers.map((marker, i) => (
            <Marker key={i} position={[marker.latlng[0], marker.latlng[1]]}>
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
        </Map>
      </div>
    );
  }
}
