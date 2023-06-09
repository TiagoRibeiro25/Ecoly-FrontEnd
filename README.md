# Ecoly - Eco-Schools Management Web Application

Ecoly is a web application that helps schools manage their eco-schools subjects. It allows schools to easily create new activities, schedule meetings, and track progress towards eco-friendly goals.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your local machine
- An IDE or text editor installed

## Install

1. Clone this repository to your local machine:
   `git clone https://github.com/TiagoRibeiro25/Ecoly-FrontEnd.git`

2. Navigate to the project directory:
   `cd Ecoly-FrontEnd`

3. Install the dependencies:
   `npm install`

4. Run the development server:
   `npm run dev`

5. Open your browser and navigate to `http://localhost:5173` to view the app.

## Environment Variables

To run properly, be sure to create a `.env` file in the root directory of the project and add the following variables (use `.env.sample` as a template):

``` dotenv
VITE_API_ROUTE=https://ecoly-api.cyclic.app/api
VITE_QUOTE_API_ROUTE=https://get-quotes-api.cyclic.app/api/quotes/random
```

Replace the value of `VITE_API_ROUTE` with the URL of the API you are using (see [APIs Used](#apis-used) below)

## APIs Used

Ecoly uses the following APIs:

- [Ecoly API](https://github.com/TiagoRibeiro25/ecoly-api)
- [Quotes API](https://github.com/TiagoRibeiro25/Get-Quotes-API)

## Technologies Used

Ecoly is built using the following technologies:

- [Vue.js 3](https://v3.vuejs.org/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Vite](https://vitejs.dev/)

## Testing

The tests were written using [Selenium](https://www.selenium.dev/). To run the tests, run the following command:

``` bash
npm run test
```

## Contributing to Ecoly

Since this is a school project, we are not accepting contributions at this time. However, feel free to fork this repository and make your own changes. If you do, please give credit to the original authors. Thank you! 💪🤓

## Contributors

- [Tiago Ribeiro](<https://github.com/TiagoRibeiro25>)
- [José Nogueira](<https://github.com/JoseNogueira13>)
- [Pedro Teixeira](<https://github.com/pedromst2000>)
