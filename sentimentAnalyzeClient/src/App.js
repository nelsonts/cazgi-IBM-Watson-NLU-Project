import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';
import axios from 'axios';

class App extends React.Component {
  state = {innercomp:<textarea rows="4" cols="50" id="textinput"/>,
            mode: "text",
          sentimentOutput:[],
          sentiment:true
        }
  
  renderTextArea = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "url") {
      this.setState({innercomp:<textarea rows="4" cols="50" id="textinput"/>,
      mode: "text",
      sentimentOutput:[],
      sentiment:true
    })
    } 
  }

  renderTextBox = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "text") {
      this.setState({innercomp:<textarea rows="1" cols="50" id="textinput"/>,
      mode: "url",
      sentimentOutput:[],
      sentiment:true
    })
    }
  }

  sendForSentimentAnalysis = () => {
    this.setState({sentiment:true});
    let ret = "";
    let url = ".";
    let sentimentMessage = "";

    if(this.state.mode === "url") {
      url = url+"/url/sentiment?url="+document.getElementById("textinput").value;
      sentimentMessage = "url sentiment for " + document.getElementById("textinput").value;
    } else {
      url = url+"/text/sentiment?text="+document.getElementById("textinput").value;
      sentimentMessage = "text sentiment for " + document.getElementById("textinput").value;
    }
    ret = axios.get(url);
    ret.then((response)=>{

      //Include code here to check the sentiment and format the data accordingly

      let output = response.data;
      let sentimentLabel = response.data.result.sentiment.document.label;
      //console.log("sentimentOutput = " + JSON.stringify(output, null, 2));
      
      if(sentimentLabel === "positive") {
        output = <div style={{color:"green",fontSize:20}}>{sentimentMessage} is {sentimentLabel}</div>;
      } else if (sentimentLabel === "negative"){
        output = <div style={{color:"red",fontSize:20}}>{sentimentMessage} is {sentimentLabel}</div>;
      } else {
        output = <div style={{color:"yellow",fontSize:20}}>{sentimentMessage} is {sentimentLabel}</div>;
      }
      this.setState({sentimentOutput:output});
    });
  }

  sendForEmotionAnalysis = () => {
    this.setState({sentiment:false});
    let ret = "";
    let url = ".";
    if(this.state.mode === "url") {
      url = url+"/url/emotion?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/emotion/?text="+document.getElementById("textinput").value;
    }
    ret = axios.get(url);

    ret.then((response)=>{
      //console.log("emotionOutput = " + JSON.stringify(response.data.result.emotion.document.emotion, null, 2));
      this.setState({sentimentOutput:<EmotionTable emotions={response.data.result.emotion.document.emotion}/>});
  });
  }
  

  render() {
    // Set the Title of the page
    document.title = "Sentiment Analyzer";
    return (  
      <div className="App">
      <button className="btn btn-info" onClick={this.renderTextArea}>Text</button>
        <button className="btn btn-dark"  onClick={this.renderTextBox}>URL</button>
        <br/><br/>
        {this.state.innercomp}
        <br/>
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br/>
            {this.state.sentimentOutput}
      </div>
    );
    }
}

export default App;
