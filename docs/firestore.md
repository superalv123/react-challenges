All calls to Firebase functions are placed into src/utilities/firebase.js for easier updating. 

Import into your firestore database the JSON you've been testing with:

https://courses.cs.northwestern.edu/394/guides/data/cs-courses-firestore.php

The json is also in cs-courses-firestore.json

The task is done when the version is deployed to the public site gets its class data from Firebase. There should be no visual difference in how the app behaves. This includes refactoring any use of SCHEDULE_URL. Create a useDataQuery function in firestore.ts to replace uses of useJsonQuery.

Respect clean code principles that allow easy refactoring if needed. For example this means keeping features that can be separated into functions or components outside of app(). 