import * as sgMail from '@sendgrid/mail';

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);
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
  return sgMail.send(msg);
};
export default notify;
