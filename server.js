const {prompt} = require('inquirer');
const db = require("./db");

const app = express();
const PORT = 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
