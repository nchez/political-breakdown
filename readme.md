# Political Breakdown

## USER STORIES

As a user, I want to:

- Create or edit a watchlist of stocks by:
  - Typing in a search term and adding it to the list
  - Clicking 'DELETE' or 'ADD' to perform the respective action on the list
- Go to my profile (user) page and view my watchlist
- Click on stock's name to go to a breakdown page of the stock
  - View stock transactions by different elected officials

## WIREFRAMEs (WIP)

### NOTE: REPLACE 'CONTRIBUTIONS' WITH 'STOCKS' IN THE WIREFRAMES BELOW

### WELCOME PAGE

![wireframe of welcome page](./readme_docs/Welcome_page_Wireframe.drawio.png)

### LOGIN PAGE

![wireframe of login page](./readme_docs/Login2_Wireframe.drawio.png)

### SIGN-UP PAGE

![wireframe of signup page](./readme_docs/Sign-up_Wireframe.drawio.png)

### WATCHLIST PAGE

![wireframe of watchlist page](./readme_docs/Watchlist_Wireframe.drawio.png)

### DETAILED OFFICIAL PAGE

![wireframe of detailed official page](./readme_docs/Detailed_Official_Wireframe.drawio.png)

### LEADERBOARD

![wireframe of leaderboard page](./readme_docs/Leaderboard_Wireframe.drawio.png)

## BACKGROUND

Ever wonder what stocks our really hip and cool politicians are trading?? Well look no further than the Politcal Breakdown web app!

Track what stocks your favorite local and federal politicians are trading! Add and delete from your watchlist to track stock transactions our devious officials (who are definitely voting with our best interests in mind) are making!

## DEVELOPMENT

### ROUTES

| HTTP VERB | ROUTE                     | ACTION | USED FOR                        |
| --------- | ------------------------- | ------ | ------------------------------- |
| GET       | '/login'                  | index  | accessing log-in page           |
| GET       | '/signup'                 | index  | accessing sign-up page          |
| GET       | 'users/watchlist'         | index  | accessing watchlist page        |
| GET       | '/officials'              | index  | accessing officials search page |
| GET       | '/officials/:name'        | index  | accessing official page         |
| GET       | '/stocks/:symbol'         | index  | accessing stock page            |
| GET       | '/stocks'                 | index  | accessing stock search page     |
| POST      | '/officials/add'          | create | add person to watchlist         |
| POST      | '/stocks/add'             | create | add stock to watchlist          |
| DELETE    | '/officials/:name/delete' | delete | remove person from watchlist    |
| DELETE    | '/stocks/:symbol/delete'  | delete | remove stock from watchlist     |
| PUT       | '/users/profile/changepw' | update | change user's password          |

### ERD

![an ERD of my project](./readme_docs/ERD.drawio.png)

### APIs and other TECHNOLOGY

To track stock transaction of the officials, Quiver API will be used. Shoutout ot QuiverQuant!

To get background information on the officials, Wikiepedia API will be used. Shoutout to Wikipedia! Consider donating if you haven't already.

Plotly.js to make charts, graphs, and other cool views of data.

### MVP

- Create login, signup, logout pages for users.
- Create editable watchlist for users that will track stocks and officials.
- Detailed stock page with what elected officials traded the stock

### STRETCH

- Detailed stock page with which officials own stocks and transaction history of stock
- Detailed stock page with graphs and other visualizations
- Leaderboards page with who has made the most trades and other cool stats
- Cool dashboard page with quick info and stats
