# DevSnaps

> Everyday solutions to everyday dev problems

As a developer, I stumble upon dev problems *every single day*.<br>
Most of the time the fixes are trivial, but in some cases they need a thorough investigation.

In order to *keep track* of how I solved each of those problems, this application allows to keep track of each 'snap' of code/solution I may have encountered and used.


## Technologies

The DevSnaps application is composed of two parts:
- The [front-end](https://github.com/AlexandreBonneau/devSnaps) with [Vue.js](https://github.com/vuejs/vue), [Nuxt.js](https://github.com/nuxt/nuxt.js) and [Vuetify.js](https://vuetifyjs.com/), and
- The [back-end](https://github.com/AlexandreBonneau/devSnaps-back) with Laravel's lightweight [Lumen framework](https://github.com/laravel/lumen).

**This repository *DevSnaps* is the code for the front-end.**

## Goal of this project

This project has been created to serve as a playground for Nuxt and Vuetify (and Lumen to some extends since it's a bit different than Laravel), and to learn from it.

**Be sure to check the code and tell me what can be improved so that we could all learn from you!**

## Work in progress

Since this is a work in progress, the features for now are pretty bare but the roadmap for the near future includes adding the following ones:
- [ ] Add the 'Hot snaps' page showing the latest public snaps with the most views recently
- [ ] Add the home page with the global data about snaps, hand picked one, etc.
- [ ] Add the documentation page
- [ ] Add the favorite page for each user
- [ ] Add the my snaps page for showing all the snaps of a given user (only the public snaps when the page is not served to the author)
- [ ] Add a 'settings' page for allowing the user to configure his profile
- [ ] Fix the search feature in the toolbar
- [ ] Allow creating *private* snap that only the authenticated user can see/edit
- [ ] Allow anonymous snaps to be edited by the original user (ie. allow the user to set a snap author as anonymous, while retaining the edit permission on it).
  - [ ] All purely anonymous snaps should then be read-only.
- [ ] Add a way to fetch the Snap data in case of server error, without having to reload the page
- [ ] Code refactorization
- [ ] Add the most used pages in the toolbar as shortcuts
- [ ] Allow users to specify/upload an avatar
- [ ] Prevent displaying the `Edit` button on Snaps that are owned by other users
  - [ ] Allow editing Anonymous snaps by 'forking' them
- [ ] Fix the scrim bug when clicking outside of the remove dialog
- [ ] Modify how snaps are retrieved from the server; Cache those and limit the number of queries to the server
- [ ] Add a re-captcha in the sign-up process
- [ ] Add OAuth for sign-ups
- [ ] Use an Auth middleware
- [ ] Add an homepage with the favorite / most viewed snaps and other info
- [ ] Fix the favorite system so that each user can favorite whatever snap the want
- [ ] Add a 'project' feature so that multiple snap could be aggregated for a given project
- [ ] Add tags for easier snap searches
- [ ] Use Elasticsearch/Algolia/Solr for better snap search results?
- [ ] Remove all the default unused Nuxt files
- [ ] ...and more code improvements (*Thanks to you, hopefully!*) :)

## Build Setup

1. Clone this repository
```bash
git clone https://github.com/AlexandreBonneau/devSnaps.git
```
2. Install the dependencies
```bash
cd devSnaps
yarn # or `npm install`
```
3. Launch the back-end server (you can checkout the back-end code in the [DevSnaps-back](https://github.com/AlexandreBonneau/devSnaps-back) repository)
```bash
yarn back
```
*Note: for the `yarn back` command to work, this project should be put in `~/devsnaps/front-end`, while the back should be in `~/devsnaps/back-end`*

4. Launch the front-end server
```bash
yarn front
```
5. Browse your local app by opening the [http://localhost:3000](http://localhost:3000) url!

Do note that the server is setup for hot reload out of the box, and that the back-end will use port `4242` for the API endpoint.

## Contributing

I'm open to **any** critique regarding the code, so *please* create an [issue](https://github.com/AlexandreBonneau/devSnaps/issues/new)/[pull request](https://github.com/AlexandreBonneau/devSnaps/compare) if you think any part of it can be improved!

## Support

I'll just leave my patreon page link here (I work on [AutoNumeric](https://github.com/autoNumeric/autoNumeric/) and [vue-autoNumeric](https://github.com/autoNumeric/vue-autoNumeric) too for instance), you never know :)

[![Donate][patreon-image]][patreon-url]

## Licence

DevSnaps is an [MIT-licensed](http://opensource.org/licenses/MIT) open-source project, feel free to copy/edit/study its code!


[patreon-url]: https://www.patreon.com/user?u=4810062
[patreon-image]: https://img.shields.io/badge/patreon-donate-orange.svg
