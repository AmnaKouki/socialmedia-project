# Social Media Project

A social network platform inspired by LinkedIn, developed as a collaborative project by Kouki Amna, Rajhi Haifa and Ouelhezi Oumaima.


## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)


## Introduction

Welcome to our Professional Network Platform! This project is a social network that allows users to connect, share posts, and build a professional network. It was developed by a team of three as part of a web development course.


## Features

- **User Authentication:** Create an account, sign in, and securely manage your profile.
- **Network Building:** Connect with other users, view their profiles, and send/receive friend requests.
- **Post Interaction:** Share posts, like posts, and leave comments with support for emojis.
- **Media Upload:** Upload and share images in your posts.
- **Search Functionality:** Find other users and visit their profiles.


## Technologies Used

This project utilizes the following dependencies:

- **[Express.js](https://expressjs.com/)**: Web application framework for Node.js.
- **[Node.js](https://nodejs.org/)**: JavaScript runtime for server-side development.
- **[prisma](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript-postgres)**: Prisma CLI for database migrations and schema management.
 - **[Bootstrap](https://getbootstrap.com/)**: Frontend framework for responsive design.
- **[ejs](https://www.npmjs.com/package/ejs)**: Templating engine for rendering views.



## Installation

To run the project locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/AmnaKouki/socialmedia-project

# Navigate to the project directory
cd socialmedia-project

# Install dependencies
npm install
```
## Usage
To start the application, run:
``` bash
npm start
```
Visit http://localhost:3000 in your browser to access the application.

*To change the PORT number, you can access the `.env` file and change the `PORT` variable.*

----------------------

For testing, you can use the already-created **fake users** saved in the database in the `social.sql` file. The passworld for these fake accounts is `123456`