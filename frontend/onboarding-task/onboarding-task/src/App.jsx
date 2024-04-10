import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { Container } from 'semantic-ui-react';
import Customer from './pages/Customer';
import Product from './pages/Product';
import Store from './pages/Store';
import Sales from './pages/Sales';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header/>
            <Container>
              <Routes>
                <Route path="/" element={<Customer />} />
                <Route path="/product" element={<Product />} />
                <Route path="/store" element={<Store />} />
                <Route path="/sales" element={<Sales />} />
              </Routes>
            </Container>
        </div>
      </Router>
    );
  }
}

export default App;
