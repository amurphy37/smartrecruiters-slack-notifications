const prod = {
    url: {
        API_URL: "https://slacktoplaylist.herokuapp.com",
        API_URL_USERS: "https://myapp.herokuapp.com/users"
    }
};
const dev = {
    url: {
        API_URL: "http://localhost:3000"
    }
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default config