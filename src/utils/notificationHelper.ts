import * as mailgun from 'mailgun-js';
const { API_KEY, DOMAIN } = process.env;

let transporter = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN
});
/**
 * Sends notification.
 * @param {string}to
 * @param {string}from
 * @param {string}subject
 * @param {string}html
 * @Returns {object}
 */
const notify = async (
  to: string,
  from: string,
  subject: string,
  html: string
): Promise<any> => {
  const msg = {
    to,
    from,
    subject,
    html
  };
  return transporter.messages().send(msg);
};
export default notify;
