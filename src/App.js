import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import TripContainer from "./components/TripContainer";
import Form from "./components/Form";
import Search from "./components/Search";
import Favourites from "./components/Favourites";
import Appbar from "./components/Appbar";
// import FinalPage from "./components/FinalPage";
import 'semantic-ui-css/semantic.min.css'

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar/>
                <main>
                    <Appbar/>
                    <Switch>
                        <Route exact strict path="/" component={Dashboard}/>
                        <Route exact strict path="/main" component={Dashboard}/>
                        <Route exact strict path="/trip" component={TripContainer}/>
                        <Route exact strict path="/search" component={Search}/>
                        <Route exact strict path="/fav" component={Favourites}/>
                        <Route exact strict path="/form" component={Form}/>
                        <Route component={() => <h1>404 - sadface</h1>}/>
                    </Switch>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
