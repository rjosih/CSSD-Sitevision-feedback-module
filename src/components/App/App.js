import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './App.scss';
import i18n from "@sitevision/api/common/i18n";
import TextInput from "../TextInput";
import requester from "@sitevision/api/client/requester";
import router from "@sitevision/api/common/router";
import toasts from "@sitevision/api/client/toasts";
import events from "@sitevision/api/common/events";

import Posts from './Posts/Posts';

const App = ({
  mail,
  published,
  previousFeedback,
}) => {
  const [posts, setPosts] = React.useState([])

  React.useEffect(() => {
    if (previousFeedback) {
      setPosts(previousFeedback);
    }
  }, [])

  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
      
    requester
      .doPost({
        url: router.getStandaloneUrl("/feedback"),
        data: formData,
        fileUpload: true,
      })
      .then((response, content, options) => {
        if (options.status == 204) {
          form.reset();
          toasts.publish({
            message: i18n.get("feedbackSuccess"),
            type: "success",
            ttl: 3,
          });

          // Triggs reload and visualizing live uploading
          events.trigger("feedback:reload");
        } else {
            toasts.publish({
            message: i18n.get("feedbackFailed"),
            type: "danger",
            ttl: 3,
          });
        }

      })
      .catch(() => alert("Wrong in  catch"));
  };
  
  return (
    <div className={styles.container}>
      {!published ? 
        <div>WebAppen kan endast användas i visningsläget.</div>
        : published && mail ? 
          <form className="env-form" encType="multipart/form-data" onSubmit={submit}>
            <TextInput name="feedback" type="text" />
            <div className="env-form-element">
              <button type="submit" className="env-button env-button--primary">
                {i18n.get("sendFeedback")}
              </button>
              {posts ? (<Posts posts={posts} />) : 'då'}
            </div>
          </form>
          : published && !mail ? 
            <h3>Konfigurera mailen i webappen</h3>
            : ''}
    </div>
  );
};

App.propTypes = {
  mail: PropTypes.string,
  published: PropTypes.bool,
  previousFeedback: PropTypes.array,
};

export default App;
