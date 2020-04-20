var express       			=require('express'),
    app           			=express();
var firebase                = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');


//=========================================================================

app.set('view engine','ejs');

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















//==============================================================
app.listen(3000,function(){
	console.log("server is live");
});