import Logo from './Logo';
import './Header.css';

import Button from './Button';
import FormInput from './FormInput';

function Header({onSearch, onAdd, count = 0}) {
  const placeholder = count > 1 ? `Search ${count} items` : 'Search';
  return (
    <div className="Header">
      <Logo />
      <div>
        <FormInput placeholder={placeholder} id="search" onChange={onSearch} />
      </div>
      <div>
        <Button onClick={onAdd}>
          <b>&#65291;</b> Add whine
        </Button>
      </div>
    </div>
  );
}

export default Header;
