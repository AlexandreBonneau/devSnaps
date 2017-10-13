# PAGES

This directory contains your Application Views and Routes.
The framework reads all the .vue files inside this directory and create the router of your application.

More information about the usage of this directory in the documentation:
https://nuxtjs.org/guide/routing


### DevSnaps path structure

Paths for listing, creating, editing and deleting the snaps:

| Path           | Description |
| :---------------- | :-----------  |
| / | Homepage with picked snaps, info, etc. |
| /snaps | List all snaps  |
| /snap | Create a new snap (even anonymous) |
| /{user}/snaps | List all the snaps of the given user (only work for the given auth user) |
| /{user}/snap/{idSnap}/{slugSnap} | Show the given snap for the given user |

Paths for the static pages, auth and admin pages:

| Path           | Description |
| :---------------- | :-----------  |
| /profile/{user} | Show the settings for the given user |
| /{user} | Show all the public info and snaps for the given user. Also allows to search those snaps. Show the pinned one. Follow him/her, etc. |
| /signup | Show the register page for creating a new account |
| /login | Show the login page |
| /logout | Logout the current user, redirect to / if no user is logged |
| /hi | Presentation of the DevSnaps website |

**Note**: Instead of using the database `id` to identify the snaps, I should use a short 6 letters code ie `'EoteCm'`
