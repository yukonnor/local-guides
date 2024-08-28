# Capstone Project Two | Local Guides 

**Local Guides** is a web application where users can both create guides highlighting places they recommend and find guides created by others to get curated recommendations about a place they are visiting. 

**https://local-guides.onrender.com/** 

<img width="741" alt="local_guides" src="https://github.com/user-attachments/assets/19951492-0e73-4f0e-9816-91eaf39808c9">



## About the Local Guides

This web app allows users to both create and consume guides with place recommendations based on places from the Google Maps Places API. 

**Users creating guides can:**
-   Add a guide title, description, and places from Google to their guide.
-   For each place added to the guide, the creator can add a description, recommendation level and tags about the place. There will also be some data from Google appended to the place, like the Google star rating, a description and a link to view the place on Google Maps. 
-   They can make their guide public or private. If private, only users that the guide owner has shared the guide with can view it. 
-   See which genres are associated with the tracks on a playlist
-   Jump to genre exploration pages to listen to other songs in that genre
-   Save genres as favorites or saved to review them later

**Users looking for guides can:**
- Search for a city or town (which again uses the Google Places API for geocoding) to see if there are any public guides near that location.
- See which tags have been applied to the guide to know whether or not it has types of places that interest them.
- See the places on the guide, along with their descriptions, rec level and other metadata. 
- See guides shared with them.

**Example Happy Path Flow:**
1. Go to the home page, where you will be prompted to search for a city or town where you'd like to see guides. Search for a location and select a location from the results.
2. You will be directed to a guide results page for that location. If there are public guides within a ~70 mile radius of that location, they will appear in a list, where you can see the title, how many places are one the guide and an accumulation of tags applied to the places to help gauge if the guide has places you may be interested in. 
3. You can click the link to view a guide, where you can see the description of the guide as well as the list of all places that the guide author added. Each place will have a recommendation level, a description, a rating, and a link to view the place on Google Maps. You can also sort and filter the places to make them easier to browse. 
4. You think that you'd like to make a guide for your city! You click the "Create guide" link in the top navigation. You then search for the city you'd like to create a guide for and follow the 'guide create' flow, setting a title for your guide and whether or not you want your guide to be public.
5. Once you've created the skeleton of your guide, you can then add places to it. You search for the places you want to add and then add details about each place.
6. You can then share your guide with friends using the email sharing feature, which lets them view that guide if they log in to a Local Guides account with that email address.

## Future Functionality

In the future, I'd like to add the following features to this app:

-   Organizing guide places into itineraries. Let the guide author suggest multiple different possible 'days' of activities where they can suggest an order in which the places should be explored. 
-   Guide search results should also have sorting and filters.
-   Find ways to be less reliant on Google data to avoid requests to Google Places API.
-   Sharing a guide should send an email to the user that the guide was shared with.
-   Ability to update password and a forgot password flow.

## API Selection

Google Places API: https://developers.google.com/maps/documentation/places/web-service

*Authentication:* I opted to use the [API Key](https://developers.google.com/maps/documentation/places/web-service/get-api-key) method for authentication. 

*Avoiding Payment:* To help stay within Google's free tier of usage, I've set up quotas limiting how many requests can be made per day in Google's developer console. I will get alerted if limits are hit, but please let me know if you run into any quota issues when interacting with the app and I can increase them for you! **Note**: Google provides $200 in credit per month. Each request to the Places API costs $0.00283. This equates to roughly 70k free requests per month. 


## Tech Stack

The app is built using **Next.js** in a full-stack manner, leveraging its powerful server-side rendering (SSR) capabilities to deliver fast and dynamic web pages. **React** is used extensively, both for frontend client components and server-side components, allowing for a seamless user experience. 

Data is managed with **PostgreSQL**. Security (authentication, tokenization, etc.) are managed by the **jose** and **bcyrpt** modules. JSON sent to the API is validated using the **ajv** module. 

Styling and layout was done via the `reactstrap` **Bootstrap** module, Google Fonts and some custom CSS.  

For web hosting, I'm using [Render.com](https://render.com/). For psql database hosting, I'm using [Supabase](https://supabase.com/).

**Error Handling**

In general, there are two client-facing providers of data: API Routes & Pages. Errors caught in deepers operations will be passed up to one of these providers, at which point the final try/catch block will determine what to display to the client based on the final error object that the catch block catches. For the web UI, in some cases toasts with the error message are displayed and in other cases Next.js error boundary will catch the error and display the Error component. 

## Set Up & Run
Follow the steps below to run this application.

**Setting Up Local DBs**
1. Ensure that your device has a PostgreSQL instance that has two PostgreSQL (psql) databases named 1) 'local_guides' (for production use) and 2) `local_guides_test` (for development and testing use).
2. From the root directory, open the PostgreSQL Command Line Interface: `psql`
3. Run this command: `\i local-guides.sql`

**Run The App in Dev Mode**
1. cd to the root directory
2. run command: `npm run dev`

**Run The App in Prod Mode**
1. cd to the root directory
2. (Optional) To lint the app before building, run command: `npm run lint`
3. To build the app, run command: `npm run build`
4. To run the build, run command: `npm run start`
--> This will mimick what users see on the deployed app and will use the production db.


## Testing
This app employs a frontend and backend unit testing suite using **Jest** and **React Testing Library**. There is a separate **Cypress** test suite that can be used to run end-to-end tests. 

**Notes:**
-   At this time, Jest doesn't handle dynamic action props in forms well (see: https://github.com/vercel/next.js/issues/54757). These dynamic action props are used heavily in the application based on NextJS suggestions for how to handle form submissions. There will be some gaps in unit tests when functions specified in the action component are fired upon submission.
-   You'll see that there aren't unit tests for some async server components. NextJS documentation notes: "Since async Server Components are new to the React ecosystem, some tools do not fully support them. In the meantime, we recommend using End-to-End Testing over Unit Testing for async components."
-   To cover gaps in unit testing coverage, Cypress is used for end-to-end tests.

**Run Unit Tests**
1. Ensure that your device have a psql database called `local_guides_test`
2. In the root directory, run this script command: `npm run test`
3. If you'd just like to run unit tests for the fronend or backend suites, you can run scripts: `npm run test:frontend` or `npm run test:backend`
   
**Run E2E Tests**
1. Before testing, ensure that the server is running by executing `npm run dev`
2. In the root directory, run this script command: `npm run cypress:run`
3. If you'd just like to view the specs running in the Cypress UI, run the command `npm run cypress:open`

## DB Schema
<img width="865" alt="local_guides_schema" src="https://github.com/user-attachments/assets/dd534ab9-9fb7-4ccf-8220-2779e76394af">

-   **Users**
    -   id (PK)
    -   username (varchar, unique, required)
    -   email (text, required)
    -   password (text, required)
    -   is_admin (bool, required, default false)
    -   created_at (timestamp)
    -   updated_at (timestamp)
-   **Guides**
    -   id (PK)
    -   author_id (int, FK to users.id)
    -   google_place_id (text)
    -   title (text, required)
    -   is_private (bool, required, default false)
    -   latitude (float, required)
    -   longitude (float, required)
    -   description (text)
    -   created_at (timestamp)
    -   updated_at (timestamp)
-   **Guide_Places**
    -   id (PK)
    -   guide_id (int, FK to guides.id)
    -   google_place_id (text)
    -   description (text)
    -   rec_type (enum: 'dontmiss', 'recommend', 'iftime', 'avoid')
    -   created_at (timestamp)
    -   updated_at (timestamp)
-   **Guide_Shares**
    -   id (PK)
    -   guide_id (int, FK to guides.id)
    -   email (text, FK to users.email)
    -   created_at (timestamp)
-   **Tags**
    -   id (PK)
    -   name (text, required)
    -   created_at (timestamp)
    -   updated_at (timestamp)
-   **Place_Tag**
    -   place_id (PK, FK to places.id)
    -   tag_id (PK, FK to tags.id)
    -   created_at (timestamp)
