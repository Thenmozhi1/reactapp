import React from "react";
import Employee from "./Employee";
import Department from "./Department";
import { Route, Switch, Link } from "react-router-dom";
class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">
                  <p>Employee</p>
                </Link>
              </li>
              <li>
                <Link to="Department">
                  <p>Department</p>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <Switch>
          <Route path="/" exact component={Employee} />
          <Route path="/Department" component={Department} />
        </Switch>
      </div>
    );
  }
}
export default App;