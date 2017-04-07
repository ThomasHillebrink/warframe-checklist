import React, { Component } from 'react';
import emptyList from './data/empty-list.js';
import listData from './data/list-data.js';
import BrowserCompatability from './components/BrowserCompatability.js';
import ItemList from './components/ItemList.js'
import './App.css';

class App extends Component {
  constructor(props) {
      super(props);
      this.setProperty = this.setProperty.bind(this);
      this.toggleHideMaxRank = this.toggleHideMaxRank.bind(this);
      this.reset = this.reset.bind(this);
      var list = emptyList;
      if (typeof(Storage) !== "undefined") {
        if(localStorage.getItem("warframe-item-checklist")){
          list = JSON.parse(localStorage.getItem("warframe-item-checklist"));
        }
      }
      if (list.version !== emptyList.version){
        emptyList.lists.forEach((category) => {
          for( let i = 0; i < category.list.length; i++ ){
            let currentCategory = (list.lists.find(x => x.title === category.title ));
            console.log(currentCategory[i]);
            if( !currentCategory.list[i] ){
              currentCategory.list.push(category.list[i]);
            }else if( currentCategory.list[i].title !== category.list[i].title ){
              currentCategory.list[i].title = category.list[i].title;
            }
          }
        });
        list.lists = list.lists.sort((a,b) => {
          return emptyList.lists.findIndex( x => x.title === a.title) - emptyList.lists.findIndex( x => x.title === b.title);
        })
        list.version = emptyList.version;
      }
      localStorage.setItem("warframe-item-checklist", JSON.stringify( list ));
      this.state = {
        listData,
        list,
        hideMaxRank: true,
      };
  }

  toggleHideMaxRank(){
    let newValue = this.state.hideMaxRank;
    this.setState({hideMaxRank: !newValue});
  }

  setProperty(category, item, property, value) {
    let newList  = this.state.list;
    newList.lists.find(
      x => x.title === category
    ).list.find(
      x => x.title === item
    )[property] = value;
    this.setState({list: newList});

    localStorage.setItem("warframe-item-checklist", JSON.stringify( newList ));
  }

  reset(){
    localStorage.setItem("warframe-item-checklist", JSON.stringify( emptyList ));
    this.setState({ list: emptyList });
  }

  render() {
    const subLists = this.state.list.lists.map((list) =>
      <ItemList list={list} itemDataList={this.state.listData.lists.find(x => x.title === list.title)} hideMaxRank={this.state.hideMaxRank} updateFunction={this.setProperty} key={list.title}></ItemList>
    );

    return (
      <div className="App">
        <div className="App-header">
          <h2>Warframe Checklist</h2>
          <p>Last Updated For:</p>
          <p>OCTAVIA'S ANTHEM | 2017.04.05.15.18</p>
        </div>
        <br />
        <i className="alert">Attention Tenno: asdfjackal is an idiot that broke everything. If you used this app between 8:00PM and 8:30PM EST on 4/6/2017 your local store is probably broken. I'm gonna set up a staging environment so this doesn't happen again.</i><br /><br />
        <i>Please Note: Clearing your Cache or Cookies will delete your progress.</i><br />
        <i>WARNING: I am still fixing bugs and data may sometimes become corrupted or lost</i><br/ >
        <i>If this happens please reset by clicking here: <button onClick={this.reset}>Reset Local Storage</button></i><br/ >
        <p className="App-intro">
          Created by asdfjackal and CommissarXyz<br />
          If you would like to support future versions you can send us stuff in-game using our names above<br />
          -or-<br />
          <a href='https://ko-fi.com/A067YUP'>Buy Us Some Plat</a><br />
          Contribute at <a href="https://github.com/asdfjackal/warframe-checklist">github</a> or follow development at <a href="https://twitter.com/asdfJackal">twitter</a>
        </p>
        <BrowserCompatability>
          <div>
            <div className="container">
              <div className="toggleButton"><input type="checkbox" checked={this.state.hideMaxRank} onChange={this.toggleHideMaxRank}/>Hide Max Rank Items</div>
              {subLists}
            </div>
          </div>
        </BrowserCompatability>
      </div>
    );
  }
}

export default App;
