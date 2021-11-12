import {forwardRef} from 'react';
import PropTypes from 'prop-types';
import Rating from './Rating';
import FormInput from './FormInput';
import './Form.css';

const Form = forwardRef(({fields, initialData = {}, readonly = false}, ref) => {
  return (
    <form className="Form" ref={ref}>
      {Object.keys(fields).map((id) => {
        const prefilled = initialData[id];
        const {label, type, options} = fields[id];
        if (readonly) {
          if (!prefilled) {
            return null;
          }
          return (
            <div className="FormRow" key={id}>
              <span className="FormLabel">{label}</span>
              {type === 'rating' ? (
                <Rating
                  readonly={true}
                  defaultValue={parseInt(prefilled, 10)}
                />
              ) : (
                <div>{prefilled}</div>
              )}
            </div>
          );
        }
        return (
          <div className="FormRow" key={id}>
            <label className="FormLabel" htmlFor={id}>
              {label}
            </label>
            <FormInput
              id={id}
              type={type}
              options={options}
              defaultValue={prefilled}
            />
          </div>
        );
      })}
    </form>
  );
});

Form.propTypes = {
  fields: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['textarea', 'input', 'year', 'suggest', 'rating']),
      options: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
  initialData: PropTypes.object,
  readonly: PropTypes.bool,
};

export default Form;
