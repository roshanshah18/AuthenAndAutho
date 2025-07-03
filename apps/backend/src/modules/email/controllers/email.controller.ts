import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { sendEmailContract } from '@expense-tracker/contract/routers/sendEmail.contract';
import { sendEmailByNodemailer } from '../../../utils/mailer';

export const sendEmailToUserHandler: AppRouteImplementationOrOptions<
  typeof sendEmailContract.sendEmailToUser
> = async ({ req }) => {
  try {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return {
        status: 400,
        body: { message: 'All fields are required' },
      };
    }
    await sendEmailByNodemailer({ to, subject, html });
    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'Email Sent Successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: { isSuccess: false, message: error.message },
    };
  }
};
