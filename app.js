var express       			=require('express'),
    app           			=express(),
    bodyParser              =require('body-parser');
var firebase                = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');


//=========================================================================

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));
app.use('/assets', express.static('assets'));

var firebaseConfig = {
    apiKey: "AIzaSyD4mrp7RWqRMv4QJB-LSR5ftzrpKTrTYyQ",
    authDomain: "employee-management-portal.firebaseapp.com",
    databaseURL: "https://employee-management-portal.firebaseio.com",
    projectId: "employee-management-portal",
    storageBucket: "employee-management-portal.appspot.com",
    messagingSenderId: "735823522720",
    appId: "1:735823522720:web:e9343d7b19d08d185692c5",
    measurementId: "G-0ML6E508G9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//   firebase.(database);
let db = firebase.firestore();



//=========================================================
app.get("/",function(req,res){
    db.collection('employees').get()
    .then((snapshot) => {
        // snapshot.forEach((doc) => {
        // console.log(doc.id, '=>', doc.data());
        // });
        res.render("home",{data:snapshot});
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
    // res.render("home");
})
//Adding employee to the employee collection
app.get("/addEmployee",function(req,res){
    // res.send("ssup");
    res.render("addEmp");

});
app.post("/addEmployee",function(req,res){
    var emp={
        name: req.body.name,
        Age: req.body.age,
        designation: req.body.designation,
        gender: req.body.gender
        }
        db.collection('employees').add(emp).then(ref=>{
            res.redirect("/");
        }); 
});
//adding a collection called tasks in a document with the given id 
app.get("/:id",function(req,res){
    let cityRef = db.collection('employees').doc(req.params.id);
    let getDoc = cityRef.get()
    .then(doc => {
        if (!doc.exists) {
        console.log('No such document!');
        } else {
        res.render("show",{data:doc.data()});
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });    

});

let doc=db.collection('employees').doc('QjAgkvWPSA0BHOlWmKRL');
doc.collection("tasks").get().then( tasks =>{
    tasks.forEach( item =>{
        console.log(item.data());
    });
});













//==============================================================
app.listen(3000,function(){
	console.log("server is live");
});