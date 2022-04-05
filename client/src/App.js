import "./App.css";
import logo from "./logo.png";
import ApolloClient from "apollo-boost";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import Launches from "./Components/Launches";
import Launch from "./Components/Launch";

const client = new ApolloClient({
  uri: "/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="container">
          <img
            src={logo}
            alt="SpaceX"
            style={{ width: 300, display: "block", margin: "auto" }}
          />
          <Routes>
            <Route path="/" element={<Launches />} />
            <Route path="/launch/:flight_number" element={<Launch />} />
           
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
