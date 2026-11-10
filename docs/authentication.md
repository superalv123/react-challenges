Currently, this app will only be using Google authentication, which has already been enabled in the firebase console. Additionally permissions have already been changed in firestore.rules, but modify it if there are any mistakes.

Change the app so that only users who are authenticated, i.e., signed in, can edit class information. This involves the following changes on the front-end React web app side:
    Adding code to the app to track the current authenticated user, if any
    Adding code to the app to let a user sign in and out
    Adding code to show a course edit button on each course card only to authenticated users
This code should go in either firebase.ts or firestore.ts, whichever is better.

The best place for a button for signing in or out would be a banner component that appears on all screens. Avoid splitting items in imports unless the import line is too long.