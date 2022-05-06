
    

const {env} = require('process')
const express = require("express");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const app = express();
const port = 3000;

// https://nodejs.org/api/fs.html
const fs = require("fs");
// https://nodejs.org/api/path.html
const path = require("path");

//Secure password storage
const env_username = env.ADMIN_USERNAME
const env_password = env.ADMIN_PASSWORD
console.log(env_username)
console.log(env_password)





const basicAuth = require("express-basic-auth");
const bcrypt = require("bcrypt");

// Enable cookie parsing (and writing)
const cookieParser = require("cookie-parser");

app.use(cookieParser());

/**
 * CSV parsing (for files with a header and 2 columns only)
 *
 * @example: "name,school\nEric Burel, LBKE"
 * => [{ name: "Eric Burel", school: "LBKE"}]
 */
 const parseCsvWithHeader = (filepath, cb) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  // example based on a CSV file
  fs.readFile(filepath, "utf8", (err, data) => {
    const rows = data.split(rowSeparator);
    // first row is an header I isolate it
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const items = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const item = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return item;
    });
    return cb(null, items);
  });
};




/**
 * Authorizer function of basic auth, that handles encrypted passwords
 * @param {*} username Provided username
 * @param {*} password Provided password
 * @param {*} cb (error, isAuthorized)
 */
 const encryptedPasswordAuthorizer = (username, password, cb) => {
  // Parse the CSV file: this is very similar to parsing students!
  parseCsvWithHeader("./users.csv", (err, users) => {
    // Check that our current user belong to the list
    const storedUser = users.find((possibleUser) => {
      // NOTE: a simple comparison with === is possible but less safe
      return basicAuth.safeCompare(possibleUser.username, username);
    });
    // NOTE: this is an example of using lazy evaluation of condition
    if (!storedUser) {
      // username not found
      cb(null, false);
    } else {
      // now we check the password
      // bcrypt handles the fact that storedUser password is encrypted
      // it is asynchronous, because this operation is long
      // so we pass the callback as the last parameter
      bcrypt.compare(password, storedUser.password, cb);
    }
  });
};
// Setup basic authentication
app.use(
  basicAuth({
    // Basic hard-coded version:
    //users: { admin: "supersecret" },
    // From environment variables:
    // users: { [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD },
    // Custom auth based on a file
    //authorizer: clearPasswordAuthorizer,
    // Final auth, based on a file with encrypted passwords
    authorizer: encryptedPasswordAuthorizer,
    // Our authorization schema needs to read a file: it is asynchronous
    authorizeAsync: true,
    challenge: true,
  })
)


app.get("/students/data", (req, res) => {
  res.render("students-data");
});

app.use(express.urlencoded({ extended: true }));

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static('public')); //inclure le dossier

// Create an endpoint => Le classique 

app.get("/", (req, res) => {
  const path = require("path");
  res.sendFile(path.join(__dirname, "./views/home.html"));
  
});

// Basic 


// In this version, we parse the CSV content => Je comprends pas ce que ca fait 
app.get("/students-csv-parsed", (req, res) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  // example based on a CSV file
  fs.readFile("./students.csv", "utf8", (err, data) => {
    const rows = data.split(rowSeparator);
    // first row is an header I isolate it
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student;
    });
    res.send(students);
  });
});

// Voie facile pour obteni un csv 


app.use(express.json());

// Student model
/**
 * @param {*} cb A callback (err, students) => {...}
 * that is called when we get the students
 */
 const getStudentsFromCsvfile = (cb) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  // example based on a CSV file
  fs.readFile("./students.csv", "utf8", (err, data) => {
    const rows = data.split(rowSeparator);
    // first row is an header I isolate it
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
        [header[2]]: cells[2],
        [header[3]]: cells[3],
        [header[4]]: cells[4],
        [header[5]]: cells[5],

      };
      return student;
    });
    return cb(null, students);
  });
  
};

const getCommentsFromCsvfile = (cb) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  // example based on a CSV file
  fs.readFile("./comments", "utf8", (err, data) => {
    const rows = data.split(rowSeparator);
    // first row is an header I isolate it
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const comments = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const comment = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
        [header[2]]: cells[2],
  
      };
      return comment;
    });
    return cb(null, comments);
  });
};

const csvfil = (cb) => {
  getStudentsFromCsvfile
  getCommentsFromCsvfile
  return cb(null, comments, students)
  console.log(comments, students)
}

function getLines(s) {

  return s.match(/^(.*)$/gm);

}

const storeStudentInCsvFile = (student, cb) => {
  const file = fs.readFileSync("./students.csv", (err) => {

    cb(err, "ok");

  });

  const toParse = file.toString();

  const nLines = getLines(toParse).length;

  console.log(nLines);
  const csvLine = `\n${(student.id =

    nLines - 1)},${student.name},${student.school},${student.details = 0 }`;
  // Temporary log to check if our value is correct
  // in the future, you might want to enable Node debugging
  // https://code.visualstudio.com/docs/nodejs/nodejs-debugging
  console.log(csvLine);
  fs.writeFile("./students.csv", csvLine, { flag: "a" }, (err) => {
    cb(err, "ok");
  });
};

const updateStudentInCsvFile = (student, cb) => {
  const csvLine = `\n${student.name},${student.school},${student.score},${student.details} `;
  // Temporary log to check if our value is correct
  // in the future, you might want to enable Node debugging
  // https://code.visualstudio.com/docs/nodejs/nodejs-debugging
  console.log(csvLine);
  fs.writeFile("./students.csv", csvLine, { flag: "w" }, (err) => {
    cb(err, "ok");
  });
};

app.get("/students-csv", (req, res) => {
  fs.readFile("./students.csv","utf8",(err,data) => { // call back (lire le fichier )
    //res.send(data)
    const rowSeparator = "\n";
    const cellSeparator = ",";
    const rows = data.split(rowSeparator);
    // first row is an header I isolate it
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);
  
    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student;
    });
    res.send(students);
  });
});



// Endpoint 

//Un Endpoint est ce qu'on appelle une extrémité d'un canal de communication. Autrement dit, lorsqu'une API interagit avec un autre système, 
// les points de contact de cette communication sont considérés comme des Endpoints. Ainsi, pour les API, un Endpoint peut inclure une URL d'un serveur ou d'un service.


app.get("/students", (req, res) => {
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      console.error(err);
      res.send("ERROR");
    }
    res.render("students", {
      students,
    });
  });
});





// Alternative without CSV
app.get("/students-basic", (req, res) => {
  res.render("students", {
    students: [{ name: "Mathieu", school: "EPF" }],
  });
});
// A very simple page using an EJS template, render will redirect you on th page 
app.get("/students-no-data", (req, res) => {
  res.render("students-no-data");
});

// Student create form
app.get("/students/create", (req, res) => {
  res.render("create-student");
});


const token = "FOOBAR";
const tokenCookie = {
  path: "/",
  httpOnly: true,
  expires: new Date(Date.now() + 60 * 60 * 1000),
};
//res.cookie("auth-token", token, tokenCookie);

// Form handlers
app.post("/students/create", (req, res) => {
  console.log(req.body);
  const student = req.body;
  storeStudentInCsvFile(student, (err, storeResult) => {
    if (err) {
      res.redirect("/students/create?error=1");
    } else {
      res.redirect("/students/create?created=1");
    }
  });
});

// JSON API
app.get("/api/students", (req, res) => {
  getStudentsFromCsvfile((err, students) => {
    res.send(students);
  });
});

app.post("/api/students/create", (req, res) => {
  console.log(req.body);
  const student = req.body;
  storeStudentInCsvFile(student, (err, storeResult) => {
    if (err) {
      res.status(500).send("error");
    } else {
      res.send("ok");
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


//(base) MacBook-Pro-de-Mathieu-Laversin:~ mathieu$ node
//Welcome to Node.js v16.14.0.
//Type ".help" for more information.
//> 2+2
//4
//> "Basic " + Buffer.from("admin:supersecret").toString("base64");
//'Basic YWRtaW46c3VwZXJzZWNyZXQ='
//> 


//  Time for cookies: an introduction to browser storage



//  Exercice 1 : 

// Student create form
app.get("/students/:id", (req, res) => {
  const id = req.params.id;
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      console.error(err);
      res.send("ERROR");
    }
    res.render("profile", {
      student : students[id], 
    });
});
});

// Page fan (Youtubeur)

app.get("/fan", (req, res) => {
  res.render("fans-page");
});

app.get("/exercice", (req, res) => {
  res.render("ex0");
});

// Exercice 2 
app.get("/formulaire/:id", (req, res) => {
  const id = req.params.id;
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      console.error(err);
      res.send("ERROR");
    }
      res.render("formulaire", {
        student : students[id]

      });
    });
  });
 
    //console.log(students)
    //console.log(students[id].name)


  //console.log(req.params.id);

// Méthode post pour modifier les données 

// Méthode post pour modifier les données 
app.post("/formulaire/:id", (req, res) => {
  const student = req.body;
  const id = req.params.id;
  //console.log(id)
  
  
  //console.log(newinfos);
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      console.error(err);
      res.send("ERROR");
    }
    
    //newinfos.splice(id, 0, score)
    //console.log(newinfos)
   //  id,name,school,score
   // work with the student for whom the data needs to be modified
   const student = students[id]
   console.log("student json",student)
   // Convert to object to work with splice 
   const objectArray = Object.entries(student);
   console.log('object',objectArray)
   // Change the info, while keeping the url  
   // name
  
   console.log("test acces",objectArray)
   // name
   objectArray[1][1][2] = req.body.name
   //school
   objectArray[2][1] = req.body.school
   //score
   objectArray[3][1] = req.body.score
   
   

   console.log("object apres affectation",objectArray)




   


   var newinfos =

   { id : id, name : objectArray[1][1],  school : objectArray[2][1], score :objectArray[3][1], details :objectArray[4][1], url :objectArray[5][1]}
   students.splice(id, 1, newinfos);
 console.log(students)
   
    //console.log(students[id].name)
  
    // Installation de csvwritter 

  const csvWriter = createCsvWriter({
    header: [
      {id: 'id', title: 'id'},
      {id: 'name', title: 'name'},
      {id: 'school', title: 'school'},
      {id: 'score', title: 'score'},
      {id: 'details', title: 'details'},
      {id: 'url', title: 'url'}
  ],
    path: 'students.csv'
});
  csvWriter.writeRecords(students)       // returns a promise
    .then(() => {
        console.log('...Done');
    });



  });
});