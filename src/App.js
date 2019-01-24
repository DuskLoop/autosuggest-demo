import React, { Component } from "react";
import Autocomplete from "./Autocomplete";
import { Dialog } from "@material-ui/core";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Dialog open={true}>
          <div style={{ margin: "20px" }}>
            <Autocomplete />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default App;
