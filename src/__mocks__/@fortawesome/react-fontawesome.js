import React from 'react';
import PropTypes from 'prop-types';

export function FontAwesomeIcon({ icon }) {
  const iconClass = Array.isArray(icon) ? icon.join('-') : icon;

  return <i className={`fa ${iconClass}`} />;
}

FontAwesomeIcon.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      prefix: PropTypes.string,
      iconName: PropTypes.string,
      icon: PropTypes.arrayOf(PropTypes.any)
    })
  ]).isRequired
};
