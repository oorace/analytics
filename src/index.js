/* eslint-disable no-unused-vars */
import INTERCEPTOR from './interceptor';
import LOG from './logger';
import Tracker from './tracker';

class CustomTracker extends Tracker {
}

class Integration {

  constructor(documentObject) {
    this.document = documentObject;
  }

  start() {
    this.tracker = new CustomTracker(
      process.env.TRACKER_NAME,
      process.env.TRACKER_NAMESPACE,
      process.env.COLLECTOR_HOST,
      process.env.TRACKER_APP_ID,
      process.env.TRACKER_COOKIE_DOMAIN
    );

    // Use INTERCEPTOR to intercept methods
    // Use this.tracker.trackStructEvent to track events
  }

}

const integration = new Integration(document);
integration.start();

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    // revert any side effect
  });
}
