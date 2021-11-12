import {useState, useRef} from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Body from './Body';
import Dialog from './Dialog';
import Excel from './Excel';
import Form from './Form';

function commitToStorage(data) {
  localStorage.setItem('data', JSON.stringify(data));
}

function DataFlow({schema, initialData}) {
  const [data, setData] = useState(initialData);
  const [addNew, setAddNew] = useState(false);
  const [filter, setFilter] = useState(null);

  const form = useRef(null);

  function saveNew(action) {
    setAddNew(false);
    if (action === 'dismiss') {
      return;
    }

    const formData = {};
    Array.from(form.current).forEach(
      (input) => (formData[input.id] = input.value),
    );
    data.unshift(formData);
    commitToStorage(data);
    setData(data);
  }

  function onExcelDataChange(updatedData) {
    commitToStorage(updatedData);
    setData(data);
  }

  function onSearch(e) {
    setFilter(e.target.value);
  }

  return (
    <div className="DataFlow">
      <Header
        onAdd={() => setAddNew(true)}
        onSearch={onSearch}
        count={data.length}
      />
      <Body>
        <Excel
          schema={schema}
          initialData={data}
          key={data}
          onDataChange={(updatedData) => onExcelDataChange(updatedData)}
          filter={filter}
        />
        {addNew ? (
          <Dialog
            modal={true}
            header="Add new item"
            confirmLabel="Add"
            onAction={(action) => saveNew(action)}>
            <Form ref={form} fields={schema} />
          </Dialog>
        ) : null}
      </Body>
    </div>
  );
}

DataFlow.propTypes = {
  schema: PropTypes.object.isRequired,
  initialData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DataFlow;
