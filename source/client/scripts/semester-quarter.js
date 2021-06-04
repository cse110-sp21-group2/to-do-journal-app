/**
 * TODO:
 *      - Know when it's quarterly or semesterly(User Setting)
 *      - GET journal
 *      - GET entries (semester or quqarter)
 *      - Go through each entry to see if there exist an entry for current date
 *          - Make new entry otherwise based on date
 *      - In that entry, create new task
 */

import session from './session';

if (!session.isUserLoggedIn()) {
  // eslint-disable-next-line no-alert
  alert('You must sign in to view your journal');
  window.location.href = '/signin';
}
