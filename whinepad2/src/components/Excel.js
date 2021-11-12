import {useState, useRef, useContext, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import clone from '../modules/clone';
import schema from '../config/schema';
import DataContext from '../contexts/DataContext';
import RouteContext from '../contexts/RouteContext';

import './Excel.css';
import Actions from './Actions';
import Dialog from './Dialog';
import Form from './Form';
import Rating from './Rating';

function dataMangler(data, action, payload) {
  if (action === 'sort') {
    const {column, descending} = payload;
    return data.sort((a, b) => {
      if (a[column] === b[column]) {
        return 0;
      }
      return descending
        ? a[column] < b[column]
          ? 1
          : -1
        : a[column] > b[column]
          ? 1
          : -1;
    });
  }
  if (action === 'save') {
    const {int, edit} = payload;
    data[edit.row][edit.column] = int
      ? parseInt(payload.value, 10)
      : payload.value;
  }
  if (action === 'delete') {
    data = clone(data);
    data.splice(payload.rowidx, 1);
  }
  if (action === 'saveForm') {
    Array.from(payload.form.current).forEach(
      (input) => (data[payload.rowidx][input.id] = input.value),
    );
  }
  return data;
}

function Excel({filter}) {
  const {data, updateData} = useContext(DataContext);
  const {route, updateRoute} = useContext(RouteContext);
  const [sorting, setSorting] = useState({
    column: '',
    descending: false,
  });
  const [edit, setEdit] = useState(null);
  const [dialog, setDialog] = useState(null);
  const form = useRef(null);

  function sort(e) {
    const column = e.target.dataset.id;
    if (!column) {
      return;
    }
    const descending = sorting.column === column && !sorting.descending;
    setSorting({column, descending});
    const newData = dataMangler(data, 'sort', {column, descending});
    updateData(newData);
  }

  function showEditor(e) {
    const config = e.target.dataset.schema;
    if (!config || config === 'rating') {
      return;
    }
    setEdit({
      row: parseInt(e.target.parentNode.dataset.row, 10),
      column: config,
    });
  }

  function save(e) {
    e.preventDefault();
    setEdit(null);
    const value = e.target.firstChild.value;
    const valueType = schema[e.target.parentNode.dataset.schema].type;
    updateData(
      dataMangler(data, 'save', {
        edit,
        value,
        updateData,
        int: valueType === 'year' || valueType === 'rating',
      }),
    );
  }

  const handleAction = useCallback(
    (rowidx, type) => {
      if (type === 'delete') {
        setDialog(
          <Dialog
            modal
            header="Confirm deletion"
            confirmLabel="Delete"
            onAction={(action) => {
              setDialog(null);
              if (action === 'confirm') {
                updateData(
                  dataMangler(data, 'delete', {
                    rowidx,
                    updateData,
                  }),
                );
              }
            }}>
            {`Are you sure you want to delete "${data[rowidx].name}"?`}
          </Dialog>,
        );
      }
      const isEdit = type === 'edit';
      if (type === 'info' || isEdit) {
        const formPrefill = data[rowidx];
        updateRoute(type, rowidx);
        setDialog(
          <Dialog
            modal
            extendedDismiss={!isEdit}
            header={isEdit ? 'Edit item' : 'Item details'}
            confirmLabel={isEdit ? 'Save' : 'ok'}
            hasCancel={isEdit}
            onAction={(action) => {
              setDialog(null);
              updateRoute();
              if (isEdit && action === 'confirm') {
                updateData(
                  dataMangler(data, 'saveForm', {
                    rowidx,
                    form,
                    updateData,
                  }),
                );
              }
            }}>
            <Form
              ref={form}
              fields={schema}
              initialData={formPrefill}
              readonly={!isEdit}
            />
          </Dialog>,
        );
      }
    },
    [data, updateData, updateRoute],
  );

  useEffect(() => {
    if (route.edit !== null && route.edit < data.length) {
      handleAction(route.edit, 'edit');
    } else if (route.info !== null && route.info < data.length) {
      handleAction(route.info, 'info');
    }
  }, [route, handleAction, data]);

  return (
    <div className="Excel">
      <table>
        <thead onClick={sort}>
          <tr>
            {Object.keys(schema).map((key) => {
              let {label, show} = schema[key];
              if (!show) {
                return null;
              }
              if (sorting.column === key) {
                label += sorting.descending ? ' \u2191' : ' \u2193';
              }
              return (
                <th key={key} data-id={key}>
                  {label}
                </th>
              );
            })}
            <th className="ExcelNotSortable">Actions</th>
          </tr>
        </thead>
        <tbody onDoubleClick={showEditor}>
          {data.map((row, rowidx) => {
            if (filter) {
              const needle = filter.toLowerCase();
              let match = false;
              const fields = Object.keys(schema);
              for (let f = 0; f < fields.length; f++) {
                if (row[fields[f]].toString().toLowerCase().includes(needle)) {
                  match = true;
                }
              }
              if (!match) {
                return null;
              }
            }

            return (
              <tr key={rowidx} data-row={rowidx}>
                {Object.keys(row).map((cell, columnidx) => {
                  const config = schema[cell];
                  if (!config.show) {
                    return null;
                  }
                  let content = row[cell];
                  if (edit && edit.row === rowidx && edit.column === cell) {
                    content = (
                      <form onSubmit={save}>
                        <input type="text" defaultValue={content} />
                      </form>
                    );
                  } else if (config.type === 'rating') {
                    content = (
                      <Rating
                        id={cell}
                        readonly
                        key={content}
                        defaultValue={Number(content)}
                      />
                    );
                  }

                  return (
                    <td
                      key={columnidx}
                      data-schema={cell}
                      className={classNames({
                        [`schema-${cell}`]: true,
                        ExcelEditable: config.type !== 'rating',
                        ExcelDataLeft: config.align === 'left',
                        ExcelDataRight: config.align === 'right',
                        ExcelDataCenter:
                          config.align !== 'left' && config.align !== 'right',
                      })}>
                      {content}
                    </td>
                  );
                })}
                <td>
                  <Actions onAction={handleAction.bind(null, rowidx)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {dialog}
    </div>
  );
}

Excel.propTypes = {
  filter: PropTypes.string,
};
export default Excel;
