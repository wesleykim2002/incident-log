# Incident Log

## How to get started
* download `.env` file and move to `incident-log` folder
* download incident-logger firebase auth JSON file and move to `src/config`

## To get auth token:

Send POST request to: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[firebasekey]`

With:
'''
{
  "email": "wesleykim2002@gmail.com",
  "password": "Password123",
  "returnSecureToken": true
}
'''
