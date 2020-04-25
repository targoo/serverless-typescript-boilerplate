import { arg } from '@nexus/schema';
import * as crypto from 'crypto';

import { EmailInputData } from '../args';
import logger from '../../../../utils/logger';
import { IUser } from '../../../../types/types';
import { MutationFieldType } from '../../types';

export const sendEmail: MutationFieldType<'sendEmail'> = {
  type: 'Boolean',

  args: {
    data: arg({
      type: EmailInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { data }, { dynamo, user, emailService }) => {
    const { email, subject, replyTo, emailTemplate, params } = data;
    const { boardUuid, content, ctaUrl, userNickname } = params;

    if (!user) {
      throw new Error('Not authorized to send an email');
    }

    const followingUserUuid = crypto
      .createHmac('sha1', process.env.SIGNIN_USER_SECRET)
      .update(`${email}`.toLowerCase())
      .digest('hex');

    const userKey = {
      id: `USER#${followingUserUuid}`,
      relation: `USER`,
    };
    const { Item } = await dynamo.getItem(userKey);

    // Create user if it does not exist yet.
    if (!Item) {
      const userParams = ({
        id: `USER#${followingUserUuid}`,
        relation: `USER`,
        uuid: JSON.stringify({ format: 'string', value: followingUserUuid }),
        email: JSON.stringify({ format: 'string', value: email }),
        isEmailVerified: JSON.stringify({ format: 'boolean', value: false }),
        isDeleted: JSON.stringify({ format: 'boolean', value: false }),
        createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      } as unknown) as IUser;
      await dynamo.saveItem(userParams);
    }

    // Create board following if it does not exist yet.
    const boardKey = {
      id: `USER#${followingUserUuid}`,
      relation: `FOLLOWING_BOARD#${boardUuid}`,
    };
    const { Item: Item2 } = await dynamo.getItem(boardKey);
    if (Item2) {
      const params = {
        UpdateExpression: 'set #isDeleted = :isDeleted, #updated = :updated',
        ExpressionAttributeNames: {
          '#isDeleted': 'isDeleted',
          '#updated': 'updated',
        },
        ExpressionAttributeValues: {
          ':isDeleted': JSON.stringify({ format: 'boolean', value: false }),
          ':updated': JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
        },
      };
      await dynamo.updateItem(params, boardKey);
    } else {
      const board = ({
        id: `USER#${followingUserUuid}`,
        relation: `FOLLOWING_BOARD#${boardUuid}`,
        fid: `USER#${user.uuid}`,
        userUuid: JSON.stringify({ format: 'string', value: user.uuid }),
        boardUuid: JSON.stringify({ format: 'string', value: boardUuid }),
        isDeleted: JSON.stringify({ format: 'boolean', value: false }),
        createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      } as unknown) as IUser;
      await dynamo.saveItem(board);
    }

    const emailContent = `
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
        <img align="center" alt="JobPod" src="https://jobpod.xyz/logo.svg" style="display: block; padding-bottom: 0; display: inline !important; vertical-align: bottom; width: auto; height: 60px;">
      </div>
      <div style="display:block; box-sizing: border-box; width: 100%; padding: 40px 50px; line-height: 30px; font-family: 'Lucida Grande',Verdana,Arial,sans-serif; font-size: 16px; color:#1C1C1C; background-color: #ffffff; border-bottom: 6px solid #F0E0F0">
        <p>Hi,</p>
        <p>${content}</p>
        <p>
          <strong>How it works:</strong>
          <ul>
            <li>Create new Job Opportunity for ${userNickname}</li>
            <li>Track and amend ${userNickname}'s job opportunities</li>
            <li>Download ${userNickname}'s latest and up to date CVs</li>
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
        <p><strong>JobPod</strong> is a smart dashboard for your entire job search.</p>
        <p>If you have any questions please reply to this email or contact us at <a href="mailto:support@jobpod.xyz">support@jobpod.xyz</a></p>
        <p>Thanks,<br />JopPod Team</p>
      </div>
    </div>
    </body>
    </html>
    `;

    try {
      await emailService.sendRawEmail(email, subject, emailContent, { replyTo });
    } catch (error) {
      logger.error(error);
      return false;
    }

    return true;
  },
};
