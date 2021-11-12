import Logo from './Logo';
import './Header.css';
import {useContext, useState, useRef} from 'react';

import Button from './Button';
import FormInput from './FormInput';
import Dialog from './Dialog';
import Form from './Form';
import schema from '../config/schema';

import DataContext from '../contexts/DataContext';
import RouteContext from '../contexts/RouteContext';

function Header({onSearch}) {
  const {data, updateData} = useContext(DataContext);
  const {route, updateRoute} = useContext(RouteContext);
  const [addNew, setAddNew] = useState(route.add);

  const form = useRef(null);

  function saveNew(action) {
    setAddNew(false);
    updateRoute();
    if (action === 'dismiss') {
      return;
    }

    const formData = {};
    Array.from(form.current).forEach(
      (input) => (formData[input.id] = input.value),
    );
    data.unshift(formData);
    updateData(data);
  }

  function onAdd() {
    setAddNew(true);
    updateRoute('add');
  }

  const count = data.length;
  const placeholder = count > 1 ? `Search ${count} items` : 'Search';
  return (
    <>
      <div className="Header">
        <Logo />
        <div>
          <FormInput
            placeholder={placeholder}
            id="search"
            onChange={onSearch}
            defaultValue={route.filter}
          />
        </div>
        <div>
          <Button onClick={onAdd}>
            <b>&#65291;</b> Add whine
          </Button>
        </div>
      </div>
      {addNew ? (
        <Dialog
          modal={true}
          header="Add new item"
          confirmLabel="Add"
          onAction={(action) => saveNew(action)}>
          <Form ref={form} fields={schema} />
        </Dialog>
      ) : null}
    </>
  );
}

export default Header;
