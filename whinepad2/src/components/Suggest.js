import PropTypes from 'prop-types';

function Suggest({id, defaultValue = '', options=[]}) {

  const randomid = Math.random().toString(16).substring(2);
  return (
    <>
      <input
        id={id}
        list={randomid}
        defaultValue={defaultValue}
      />
      <datalist id={randomid}>
        {options.map((item, idx) => (
          <option value={item} key={idx} />
        ))}
      </datalist>
    </>
  );
}

Suggest.propTypes = {
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
};

export default Suggest;
