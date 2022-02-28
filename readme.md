# Political Breakdown

## USER STORIES

As a user, I want to:

- Create or edit a watchlist political officials by:
  - Entering my address (ideally just zipcode, working on this...) and populating the list with local representatives with an option for higher offices AND/OR
  - Typing in an incumbent official and adding it to the list
  - Clicking 'DELETE' or 'ADD' to perform the respective action on the list
- Go to my profile (user) page and view my watchlist
- Click on official's name to go to a breakdown page of the candidate
  - View their total contributions, breakdown of their contributions (i.e. individual vs corporations vs PAC)
  - More information on the candiate (party, wiki link, link to their socials and their website, ...) 

## WIREFRAMEs (WIP)

### WELCOME PAGE
![wireframe of welcome page](./Login\ Wireframe.drawio.png)

### LOGIN PAGE
![wireframe of login page](./Login2_Wireframe.drawio.png)

### SIGN-UP PAGE
![wireframe of signup page](./Sign-up_Wireframe.drawio.png)

### WATCHLIST PAGE
![wireframe of watchlist page](./Watchlist_Wireframe.drawio.png)

### DETAILED OFFICIAL PAGE
![wireframe of detailed official page](./Detailed_Official_Wireframe.drawio.png)

### LEADERBOARD
![wireframe of leaderboard page](./Leaderboard_Wireframe.drawio.png)

## BACKGROUND

Ever wonder who's contributing to the really hip and cool politicians?? Well look no further than the Politcal Breakdown web app!

Track who is contributing to your favorite local and federal politicians! Add and delete from your watchlist to track those devious officials who are definitely voting with our best interests in mind!

A leaderboard page summarizes who has the most contributions and by which category.

## DEVELOPMENT

### ROUTES

|HTTP VERB|ROUTE                    |ACTION|USED FOR                    |
|---------|-------------------------|------|----------------------------|
|GET      |'/login'                 |index |accessing log-in page       |
|GET      |'/signup'                |index |accessing sign-up page      | 
|GET      |'user/:id/watchlist'     |index |accessing watchlist page    |
|GET      |'/leaderboard'           |index |accessing leaderboard page  |
|POST     |'/user/:id/watchlist/new'|create|add person to watchlist     |
|DELETE   |'/user/:id/watchlist'    |delete|remove person from watchlist|
|PUT      |'/user/:id/watchlist'    |update|replace person in watchlist |

### ERD

![an ERD of my project](./ERD.drawio.png)
