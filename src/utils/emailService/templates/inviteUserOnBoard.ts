import { IUser } from '../../../types/types';

export const inviteUserOnBoard = ({
  content,
  ctaUrl,
  user,
}: {
  content: string;
  ctaUrl: string;
  user: IUser;
}): string => {
  return `
    <html>
    <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style>
      ul {
        list-style: none;
        padding: 10px 0px;
        margin: 0;
      }
      ul li::before {
        content: "\\2022";
        color: #C0AAC0;
        font-weight: bold;
        display: inline-block;
        width: 20px
      }
    </style>
    <div style="padding: 10px ; line-height: 18px; font-family: 'Lucida Grande',Verdana,Arial,sans-serif; font-size: 12px; color:#1C1C1C; max-width: 800px; margin: 0 auto; text-align: left;">
      <div style="display:block; padding: 20px; width: 100%; background-color: #AAC0AA">
        <img align="center" alt="JobsBoard" src="https://jobpod.xyz/logo.svg" style="display: block; padding-bottom: 0; display: inline !important; vertical-align: bottom; width: auto; height: 60px;">
      </div>
      <div style="display:block; box-sizing: border-box; width: 100%; padding: 40px 50px; line-height: 30px; font-family: 'Lucida Grande',Verdana,Arial,sans-serif; font-size: 16px; color:#1C1C1C; background-color: #ffffff; border-bottom: 6px solid #F0E0F0">
        <p>Hi,</p>
        <p>${content}</p>
        <p>
          <strong>How it works:</strong>
          <ul>
            <li>Create new Job Opportunity for ${user.nickname}</li>
            <li>Track and amend ${user.nickname}'s job opportunities</li>
            <li>Download ${user.nickname}'s latest and up to date CVs</li>
          </ul>
        </p>
        <p style="text-align: center; margin-bottom: 30px;">
          <a style="display: inline-block; padding: 20px 40px; background-color: #AAC0AA; text-decoration: none; border-bottom: 3px solid #C0AAC0"
            href="${ctaUrl}" itemprop="url">
            <strong style=" color: #000000;">
              CREATE JOB OPPORTUNITY
            </strong>
          </a>
        </p>
        <p><strong>JobsBoard</strong> is a smart dashboard for your entire job search.</p>
        <p>If you have any questions please reply to this email or contact us at <a href="mailto:support@jobsboard.io">support@jobsboard.io</a></p>
        <p>Thanks,<br />JopPod Team</p>
      </div>
    </div>
    </body>
    </html>
    `;
};
