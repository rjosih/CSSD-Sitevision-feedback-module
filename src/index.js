import * as React from 'react';
import { renderToString } from 'react-dom/server';
import router from '@sitevision/api/common/router';
import appData from '@sitevision/api/server/appData';
import storage from '@sitevision/api/server/storage';
import portletContextUtil from "@sitevision/api/server/PortletContextUtil";
import properties from '@sitevision/api/server/Properties';
import systemUserUtil from "@sitevision/api/server/SystemUserUtil";
import versionUtil from '@sitevision/api/server/VersionUtil';
import roleUtil from '@sitevision/api/server/RoleUtil';
import mailUtil from '@sitevision/api/server/MailUtil';

import App from './components/App';
import { getPrevFeedback } from './helpers/getFeedbackPosts';

const dataStore = storage.getCollectionDataStore('feedback');

// Middleware for unauthorized, executed before any route
router.use((req, res, next) => {
  const currentUser = portletContextUtil.getCurrentUser();
  const currentPage = portletContextUtil.getCurrentPage();
  const roleMatcherBuilder = roleUtil.getRoleMatcherBuilder();
  roleMatcherBuilder.setUser(currentUser);
  roleMatcherBuilder.addRole(roleUtil.getRoleByName('Administrator'));
  // roleMatcherBuilder.addRole(roleUtil.getRoleByName('Editor'));
  const roleMatcher = roleMatcherBuilder.build();
  const userIsAdmin = roleMatcher.matchesAny(currentPage);

  // If a user is anonymous 
  if (systemUserUtil.isAnonymous()) {
    // Error handling, 401 - unauthorized
    res.status(401);
    return;
  }
  
  if (userIsAdmin) {
    req.data = { role: 'admin' };
  } else {
    req.data = { role: 'other' };
  }

  next();
});


router.get('/', (req, res) => {
  const mail = appData.get('mail');
  const published = versionUtil.ONLINE_VERSION === versionUtil.getCurrentVersion();
  const pageId = portletContextUtil.getCurrentPage().getIdentifier();
  
  let previousFeedback = [];

  if (req.data.role === 'admin') {
    previousFeedback = getPrevFeedback(pageId);
  }

  res.agnosticRender(renderToString(<App
    mail={mail}
    published={published}
    previousFeedback={previousFeedback}
  />), {
    mail,
    published,
    previousFeedback,
  });
});


router.post('/feedback', (req, res) => {
  // Feedback in string
  const { feedback } = req.params;
  // Get the current user (JCR Node)
  const currentUser = portletContextUtil.getCurrentUser();
  // Get author's name
  const author = properties.get(currentUser, 'displayName');
  // Pages identifier who's linked to the feedback
  const pageId = portletContextUtil.getCurrentPage().getIdentifier();
  // Get the page's title
  const pageName = properties.get(pageId, 'displayName');
  // Get the page's URL
  const pageURL = properties.get(pageId, 'URL');
  

  const newPost = true;

  // Configured mail
  const configuredMail = appData.get('mail');


  try {
    // Adds feedback data to the data store
    const { dsid } = dataStore.add({
      pageId,
      author,
      feedback,
      newPost
    });

    dataStore.instantIndex(dsid);

    // Sends a mail to the configured mail
    const mailBuilder = mailUtil.getMailBuilder();
    const mail = mailBuilder
    .setSubject(`The page ${pageName} has new feedback!`)
    .setHtmlMessage(`Go to the page to see the new feedback (if you are an administrator) <a href='${pageURL}'>${pageName}</a>`)
    .addRecipient(configuredMail)
    .build();

    mail.send();
    
    // Set status 204 when a feedback message is created 
    res.status(204);
  } catch (e) {
    // Error handling, 400 - bad request
    res.status(400);
  }
});