import i18n from "@sitevision/api/common/i18n";
import PropTypes from "prop-types";
import * as React from "react";

const EditModeMessage = ({ message }) => {
  return (
    <div class="example-demo-dark">
          <h3>{message}</h3>
    </div>
  );
};

EditModeMessage.propTypes = {
  message: PropTypes.string,
};

export default EditModeMessage;
