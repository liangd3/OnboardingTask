import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <Menu inverted>
      <Menu.Item header>React</Menu.Item>

      <Menu.Item as={Link} to="/">Customer</Menu.Item>
      <Menu.Item as={Link} to="/product">Product</Menu.Item>
      <Menu.Item as={Link} to="/store">Store</Menu.Item>
      <Menu.Item as={Link} to="/sales">Sales</Menu.Item>
    </Menu>
  );
}


export default Header;
