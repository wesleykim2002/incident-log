# Incident Log

## How to get started
* download `.env` file and move to `incident-log` folder
* download incident-logger firebase auth JSON file and move to `src/config`
* download `.env.local` file and move to `frontend` folder

* run `npx ts-node-dev src/index.ts` to get backend running
  * to ensure that frontend isn't running on the same port as the backend, please run the frontend with `npm run dev -- -p 3001` from the frontend directory

## To get auth token:

Send POST request to: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[firebasekey]`

With:
'''
{
  "email": "dummyemail@abc.com",
  "password": "Password123",
  "returnSecureToken": true
}
'''

## Create incident:

Send POST request to: `http://localhost:3000/incidents/`

Requires Bearer Token

With:
'''
{
  "type": "fall",
  "description": "Resident fell near the dining hall at 7 PM."
}
'''

## Summarize with OpenAI:

Send POST request to `http://localhost:3000/incidents/:id/summarize`

Requires Bearer Token