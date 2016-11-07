import LOG from '../logger';

const SESSION_COOKIE_TIMEOUT_IN_SECONDS = 1800;

export default class Tracker {

  constructor(trackerName, trackerNamespace, collectorHost, appId, cookieDomain) {
    if (!window[trackerName]) {
      window.GlobalSnowplowNamespace = window.GlobalSnowplowNamespace || [];
      window.GlobalSnowplowNamespace.push(trackerName);
      window[trackerName] = (...args) => (window[trackerName].q = window[trackerName].q || []).push(args);
      window[trackerName].q = window[trackerName].q || [];
    }

    require('../../lib/snowplow-2.6.2.js'); // eslint-disable-line global-require

    window[trackerName]('newTracker', trackerNamespace, collectorHost, {
      appId,
      cookieDomain,
      sessionCookieTimeout: SESSION_COOKIE_TIMEOUT_IN_SECONDS
    });

    this.tracker = window[trackerName];
  }

  trackStructEvent(category, action, identifier, contexts) {
    this.tracker('trackStructEvent', category, action, identifier, null, null, contexts);
    LOG.info('Tracking', category, action, identifier, contexts);
  }

}
