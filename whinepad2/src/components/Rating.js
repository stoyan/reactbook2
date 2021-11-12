import classNames from 'classnames';
import {useState} from 'react';
import PropTypes from 'prop-types';
import './Rating.css';

function Rating({id, defaultValue = 0, max = 5, readonly = false}) {
  const [rating, setRating] = useState(defaultValue);
  const [tempRating, setTempRating] = useState(defaultValue);

  const stars = [];
  for (let i = 1; i <= max; i++) {
    stars.push(
      <span
        className={i <= tempRating ? 'RatingOn' : null}
        key={i}
        onClick={() => (readonly ? null : setRating(i))}
        onMouseOver={() => (readonly ? null : setTempRating(i))}>
        &#128514;
      </span>,
    );
  }
  return (
    <span
      className={classNames({
        Rating: true,
        RatingReadonly: readonly,
      })}
      onMouseOut={() => setTempRating(rating)}>
      {stars}
      <input id={id} type="hidden" value={rating} />
    </span>
  );
}

Rating.propTypes = {
  defaultValue: PropTypes.number,
  readonly: PropTypes.bool,
  max: PropTypes.number,
};

export default Rating;
