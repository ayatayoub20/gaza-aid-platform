const nodemailer = require('nodemailer')


exports.send = async function (to, template, data) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_EMAIL_PASS
        }
    })
    const templateObj = templates[template](data)

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to,
        subject: templateObj.subject,
        html: templateObj.html,
    }

    return transporter.sendMail(mailOptions)
}
const templates = {
    activation: function (data) {
        return {
            subject: 'تم تفعيل حسابك بنجاح',
            html: `<style>
            html,
            body {
                padding: 0;
                margin: 0;
                font-family: Cairo, sans-serif;
            }
        
            * {
                direction: rtl;
                text-align: right;
        
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;700;900&display=swap" rel="stylesheet">
        
        <div style="font-weight: normal; font-size: 15px; color: #2F3044; min-height: 100%; margin:0; padding:0; width:100%; background-color:#edf2f7; direction: rtl; text-align: right;" dir="rtl">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="border-collapse:collapse;margin:0 auto; padding:0; max-width:600px">
                <tbody>
                    <tr>
                        <td align="center" valign="center" style="text-align:center; padding: 40px">
                            <a href="https://bareqrescue.com" rel="noopener" target="_blank">
                                <img alt="Logo" style="max-height: 150px;"
                                    src="/assets/media/logos/logo-main.png" />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" valign="center">
                            <div
                                style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                                <!--begin:Email content-->
                                <div style="padding-bottom: 30px; font-size: 17px;">
                                    <strong>اهلا بك في فريق معاً الإغاثي!</strong>
                                </div>
                                <div style="padding-bottom: 30px">شكرا لإنضمامك لفريق معاً الإغاثي
                                    <a href="bareqrescue@gmail.com" rel="noopener" target="_blank"
                                        style="text-decoration:none;color: #50CD89">bareqrescue@gmail.com</a>
                                </div>
                                <table>
        
                                    <tr>
                                        <td>اسم المستخدم : ${data.fullName}</td>
                                    </tr>
        
                                    <tr>
                                        <td>البريد الإلكتروني : ${data.email}</td>
                                    </tr>
                                    <tr>
                                        <td>كلمة المرور : ${data.password}</td>
                                    </tr>
                                </table>
                                <div style="padding-bottom: 40px; padding-top: 40px; text-align:center;">
                                    <a href="https://bareqrescue.com/sign-in" rel="noopener"
                                        style="text-decoration:none;display:inline-block;text-align:center;padding:0.75575rem 1.3rem;font-size:0.925rem;line-height:1.5;border-radius:0.35rem;color:#ffffff;background-color:#50CD89;border:0px;margin-right:0.75rem!important;font-weight:600!important;outline:none!important;vertical-align:middle"
                                        target="_blank">تسجيل الدخول</a>
                                </div>
        
        
                    <tr>
                        <td align="center" valign="center"
                            style="font-size: 13px; text-align:center;padding: 20px; color: #6d6e7c;">
                            <p>Copyright ©
                                <a href="https://bareqrescue.com" rel="noopener" target="_blank">فريق معاً الإغاثي</a>.
                            </p>
                        </td>
                    </tr></br>
        </div>
        </div>
        </td>
        </tr>
        </tbody>
        </table>
        </div>`
        }
    },

    rejection: function (data) {

        return {
            subject: 'تم رفض طلب التطوع الخاص بك.',
            html: `<style>
            html,
            body {
                padding: 0;
                margin: 0;
                font-family: Cairo, sans-serif;
            }
        
            * {
                direction: rtl;
                text-align: right;
        
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;700;900&display=swap" rel="stylesheet">
        
        <div style="font-weight: normal; font-size: 15px; color: #2F3044; min-height: 100%; margin:0; padding:0; width:100%; background-color:#edf2f7; direction: rtl; text-align: right;" dir="rtl">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="border-collapse:collapse;margin:0 auto; padding:0; max-width:600px">
                <tbody>
                    <tr>
                        <td align="center" valign="center" style="text-align:center; padding: 40px">
                            <a href="https://bareqrescue.com" rel="noopener" target="_blank">
                                <img alt="Logo" style="max-height: 150px;"
                                    src="/assets/media/logos/logo-main.png" />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" valign="center">
                            <div
                                style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                                <!--begin:Email content-->
                                <div style="padding-bottom: 30px; font-size: 17px;">
                                    <strong>اهلا بك في فريق معاً الإغاثي!</strong>
                                </div>
                                <div style="padding-bottom: 30px">شكرا لزيارة فريق معاً الإغاثي
                                    <a href="bareqrescue@gmail.com" rel="noopener" target="_blank"
                                        style="text-decoration:none;color: #50CD89">bareqrescue@gmail.com</a>
                                </div>
                                <div>
                                    نعتذر عن رفض طلب التطوع الخاص بك نتمنى لك يوما سعيداً.
                                </div>
                                
                             
        
        
                    <tr>
                        <td align="center" valign="center"
                            style="font-size: 13px; text-align:center;padding: 20px; color: #6d6e7c;">
                            <p>Copyright ©
                                <a href="https://bareqrescue.com" rel="noopener" target="_blank">فريق معاً الإغاثي</a>.
                            </p>
                        </td>
                    </tr></br>
        </div>
        </div>
        </td>
        </tr>
        </tbody>
        </table>
        </div>`
        }
    },
     forgetpassword: function (data) {
        return {
            subject: 'الإعدادات الخاصة في حسابك.',
            html: `<style>
            html,
            body {
                padding: 0;
                margin: 0;
                font-family: Cairo, sans-serif;
            }
        
            * {
                direction: rtl;
                text-align: right;
        
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;700;900&display=swap" rel="stylesheet">
        
        <div style="font-weight: normal; font-size: 15px; color: #2F3044; min-height: 100%; margin:0; padding:0; width:100%; background-color:#edf2f7; direction: rtl; text-align: right;" dir="rtl">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="border-collapse:collapse;margin:0 auto; padding:0; max-width:600px">
                <tbody>
                    <tr>
                        <td align="center" valign="center" style="text-align:center; padding: 40px">
                            <a href="https://bareqrescue.com" rel="noopener" target="_blank">
                                <img alt="Logo" style="max-height: 150px;"
                                    src="/assets/media/logos/logo-main.png" />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" valign="center">
                            <div
                                style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                                <!--begin:Email content-->
                                <div style="padding-bottom: 30px; font-size: 17px;">
                                    <strong>اهلا بك في فريق معاً الإغاثي!</strong>
                                </div>
                                <div style="padding-bottom: 30px">شكرا لإنضمامك لفريق معاً الإغاثي
                                    <a href="bareqrescue@gmail.com" rel="noopener" target="_blank"
                                        style="text-decoration:none;color: #50CD89">bareqrescue@gmail.com</a>
                                </div>
                                <table>
        
                                    <tr>
                                        <td>اسم المستخدم : ${data.fullName}</td>
                                    </tr>
        
                                    <tr>
                                        <td>البريد الإلكتروني : ${data.email}</td>
                                    </tr>
                                    <tr>
                                        <td>كلمة المرور : ${data.password}</td>
                                    </tr>
                                </table>
                                <div style="padding-bottom: 40px; padding-top: 40px; text-align:center;">
                                    <a href="https://bareqrescue.com/sign-in" rel="noopener"
                                        style="text-decoration:none;display:inline-block;text-align:center;padding:0.75575rem 1.3rem;font-size:0.925rem;line-height:1.5;border-radius:0.35rem;color:#ffffff;background-color:#50CD89;border:0px;margin-right:0.75rem!important;font-weight:600!important;outline:none!important;vertical-align:middle"
                                        target="_blank">تسجيل الدخول</a>
                                </div>
        
        
                    <tr>
                        <td align="center" valign="center"
                            style="font-size: 13px; text-align:center;padding: 20px; color: #6d6e7c;">
                            <p>Copyright ©
                                <a href="https://bareqrescue.com" rel="noopener" target="_blank">فريق معاً الإغاثي</a>.
                            </p>
                        </td>
                    </tr></br>
        </div>
        </div>
        </td>
        </tr>
        </tbody>
        </table>
        </div>`
        }
    },
}