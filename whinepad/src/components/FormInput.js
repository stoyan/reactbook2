import PropTypes from 'prop-types';
import Rating from './Rating';
import Suggest from './Suggest';

function FormInput({type = 'input', defaultValue = '', options = [], ...rest}) {
  switch (type) {
    case 'year':
      return (
        <input
          {...rest}
          type="number"
          defaultValue={
            (defaultValue && parseInt(defaultValue, 10)) ||
            new Date().getFullYear()
          }
        />
      );
    case 'suggest':
      return (
        <Suggest defaultValue={defaultValue} options={options} {...rest} />
      );
    case 'rating':
      return (
        <Rating
          {...rest}
          defaultValue={defaultValue ? parseInt(defaultValue, 10) : 0}
        />
      );
    case 'textarea':
      return <textarea defaultValue={defaultValue} {...rest} />;
    default:
      return <input defaultValue={defaultValue} type="text" {...rest} />;
  }
}

FormInput.propTypes = {
  type: PropTypes.oneOf(['textarea', 'input', 'year', 'suggest', 'rating']),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array,
};

export default FormInput;
