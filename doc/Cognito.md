# Cognito

Amazon Cognito allows user sign-up, sign-in, and access control to the AWS services quickly and easily. Amazon Cognito provides features that let you authenticate the user, while also providing features to let you authorize access to your AWS resources.

## Tokens

- The `ID Token` contains claims about the identity of the authenticated user such as name, email, and phone_number. The token allows the `Authentication` which is the process of verification that an individual, entity or website is who it claims to be. The ID token expires one hour after the user authenticates. We should not process the ID token after it has expired.

```Json
{
  "sub": "8b7ef4f6-431b-499b-aa4b-1c411a1171ed", // Unique and invariant ID representing the user.
  "email_verified": "true",
  "iss": "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_EyA3dOTLj",
  "phone_number_verified": "false",
  "cognito:username": "8b7ef4f6-431b-499b-aa4b-1c411a1171ed", // Custom Cognito attribute which contains the user name
  "aud": "v07gjcoqlum0eihgv86kjrtn1", // Client ID used to obtain the JWT access code. This should match the client ID defined in the user pool.
  "event_id": "0aab4693-9b00-4d90-ad87-da66f68d43ca",
  "token_use": "id", // Token Use
  "auth_time": "1575571630",
  "phone_number": "+4407548589864",
  "exp": "Thu Dec 05 20:48:02 UTC 2019", // Expiry timestamp, after which the JWT access code should no longer be trusted.
  "iat": "Thu Dec 05 19:48:02 UTC 2019", // The time the JWT was issued
  "email": "targoo@gmail.com"
}
```

- The `Access Token` grant access to authorized resources. The token allows the `Authorization` which is the function of specifying access rights to AWS resources like S3. The access token will expire after one hour.

- The `Refresh Token` contains the information necessary to obtain a new ID or access token. By default, the refresh token expires 30 days after your app user signs in to your user pool. When you create an app for your user pool, you can set the app's refresh token expiration (in days) to any value between 1 and 3650.

## Limits

Hard Limits on Code Validity in Amazon Cognito User Pools

| Resource                                  | Limit     |
| ----------------------------------------- | --------- |
| Sign-up confirmation code                 | 24 hours  |
| User attribute verification code validity | 24 hours  |
| Multi-factor authentication code          | 3 minutes |
| Forgot password code                      | 1 hour    |
| Number of emails sent daily per user pool | 50        |
