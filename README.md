# Auth frontend for peng.kiwi

## Your password is never saved in DB, even the hashed version

For normal websites, when you signup, you need to send your email and plaintext password to backend, then backend hashes the password and save it to DB.

Instead of doing that, I am trying to derive a keypair from your password, on your device, and only send username and the public key to backend during sigup. Your password and derived private key never leave your device.

To achieve this, I use [libsodium](https://doc.libsodium.org/public-key_cryptography/public-key_signatures).

When you signin, you provide your username and password, the frontend will derive the same keypair from your password. 

Then you will get a challenge(a uuid) from backend, you sign this challenge with your private key, and send the signature together with your username to backend.

Backend then verifies your signature with your public key. If your signature is valid, you will be asked to provide a 2FA token, then you get your access token and refresh token.

Btw, the endpoints are built with [claudiajs](https://www.claudiajs.com/)
