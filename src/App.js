import React from "react";
import "./App.css";

import web3  from "./web3";
import lottery from "./lottery";

class App extends React.Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message : '',
    winner : ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager , players, balance });
  }

  onSubmit = async(event) => {
    event.preventDefault();
     
    const accounts = await web3.eth.getAccounts();

    this.setState({ message : 'Waiting on transaction success...' });

    await lottery.methods.Enter().send(
      {
        from : accounts[0],
        value : web3.utils.toWei(this.state.value, 'ether')
      }
    );

    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ players, balance, message : 'You have been entered!', value : '' });
    
  }

  onClick = async() => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message : 'Waiting on transaction success...' });

    await lottery.methods.pickWinner().send(
      {
        from : accounts[0]
      }
    );

    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const winner  = await lottery.methods.winner().call();

    this.setState({ players, balance, message : 'A winner has been picked!', winner, value : '' });
  }

  render() {
    return (
      <div style = {
          {
            margin : "25px"
          }
        }>
         <h2>Lottery Contract</h2>
         <p style={{fontSize:"18px"}}>
            This constant managed by <b style={{fontSize:"16px",fontFamily:"inherit",color:"darkcyan"}}>{this.state.manager}</b>. <br />
            There are currently <b style={{fontSize:"20px",fontFamily:"cursive"}}>{this.state.players.length}</b> people entered, <br />
            Competing to win <b style={{fontSize:"20px",fontFamily:"cursive"}}>{web3.utils.fromWei(this.state.balance, 'ether') - (web3.utils.fromWei(this.state.balance, 'ether') * 0.05)}</b> ether! <br />
          </p> 

          <hr />

          <form onSubmit = {this.onSubmit}>
            <h4>Want to try your luck?</h4>
            <div style = {
                {
                  fontSize:"18px "
                }
              }
              >
              <label>Amount of ether to enter </label>
              <input 
                style = {
                  {
                    textAlign: "right",
                    margin : "10px"
                  }
                }
                value = { this.state.value }
                onChange = { event => this.setState({value : event.target.value})}
              />
              <button disabled = { this.state.players.length === 2 ? true : false } >Enter</button>
            </div>
          </form>

          <h4>Ready to pick a winner?</h4>

          <button
            disabled = {this.state.players.length === 2 ? false : true}
            onClick = {this.onClick}  
          >Pick a winner</button>
          <br />
          <br />
          <hr />
          <h2>{this.state.message}</h2>
          {this.state.winner !== '' && <p>Here your winner is {this.state.winner}</p>}
          
      </div>
    );
  }
}
export default App;
