# Loginsignup_P2

Login- Signup is done in Three Parts With Node.js, Framework - Express.js and Database - MongoDB(Mongoose)

*Authentication is the process of verifying who someone is, whereas authorization is the process of verifying what specific applications, files, and data a user has access to.

Authentication by otp verification

Nodemailer is a Node. js module that allows you to send emails from your server with ease

User is Registered with name, email, password and otp.
APIs are created to get all users, register user with sending otp to email, resend otp, verify user with given otp and login user.
Saved password in database securely with bcrypt.js.
Otp is sent to user's email using nodemailer npm package and otp is saved in database for further verification.
Otp is checked in verify api and same user is allowed to login, this is done by updating activation field in database as true.
If user's activation is true, user can login successfully.
Authentication by Google authenticator

Speakeasy is a one-time passcode generator, ideal for use in two-factor authentication, that supports Google Authenticator

User is Registered with name, email, password, id and temp_secret.
APIs are created to get all users, register user with using speakeasy, verify user with given otp and login user.
Saved password in database securely with bcrypt.js.
Speakeasy is used to generate temp_secret. uuid npm package used to generate id. account is opened on google authenticator extension in chrome using issuer - 2fa and secret - temp_secret of user.
User is verified by the token in google authenticator app which is updating after every 15 seconds.
Token verified user is allowed to login, this is done by updating activation field in database as true.
If user's activation is true, user can login successfully.
Authentication by Authy

Two-factor authentication (2FA) adds an additional layer of protection beyond passwords. makes it really easy to use Two-Factor Authentication on your online accounts using smartphone.

User is Registered with name, email, password, mobile, countryCode, authyID.
APIs are created to get all users, registering user in db and on authy console app , verify user with authyID in authy app and login user.
Saved password in database securely with bcrypt.js.
New app is will be created on Authy console as well as authy app, and user is registered in it.
User is verified by the token in authy app which is updating after every 15 seconds.
Token verified user is allowed to login, this is done by updating activation field in database as true.
If user's activation is true, user can login successfully.
