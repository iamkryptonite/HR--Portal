var express       			=require('express'),
    app           			=express(),
    bodyParser              =require('body-parser');
var firebase                = require('firebase/app');
// var firebaseui              = require('firebaseui');
// var ui                      = new firebaseui.auth.AuthUI(firebase.auth());
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
let auth=firebase.auth();
let db = firebase.firestore();
// var firebaseui              = require('firebaseui');
// var ui                      = new firebaseui.auth.AuthUI(firebase.auth());

// ui.start('#firebaseui-auth-container', {
//     signInOptions: [
//       firebase.auth.EmailAuthProvider.PROVIDER_ID
//     ],
//     // Other config options...
//   });



//=========================================================
// app.get("/secret",function(req,res){
//     res.render("addtasks");
// });
//=========================================Authentication Routes==========================================
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    auth.signInWithEmailAndPassword(email,password).then(cred=>{
        console.log(cred.user);
        res.redirect("/");        
    });    
});
app.get("/signup",function(req,res){
    res.render("signup");
});
app.post("/signup",function(req,res){
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    auth.createUserWithEmailAndPassword(email,password).then(cred=>{
        res.redirect("/addEmployee",{email:email});
    });
});
app.get("/logout",function(req,res){
    auth.signOut().then(()=>{
        res.redirect("/login");
    });
});
//=========================================================================================================
app.get("/",function(req,res){
    db.collection('employees').get()
    .then((snapshot) => {
        res.render("home",{data:snapshot});
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });    
});
//==========================================================================================================
//Adding employee to the employee collection
app.get("/addEmployee",function(req,res){
    res.render("addEmp");
});
app.post("/addEmployee",function(req,res){
    var emp={
        name: req.body.name,
        Age: req.body.age,
        designation: req.body.designation,
        gender: req.body.gender,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
        }
        db.collection('employees').add(emp).then(ref=>{
            res.redirect("/");
        }); 
});
//shows info of an employee 
app.get("/:id",function(req,res){
    let ref = db.collection('employees').doc(req.params.id);
    let getDoc = ref.get()
    .then(doc => {
        if (!doc.exists) {
        console.log('No such document!');
        } else {
            ref.collection('tasks').get().then(snap =>{
                res.render("show",{data:doc.data(),id:doc.id,docsnap:snap});
            });
        
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });    

});
//add tasks to tasks subcollection of an employee
app.get("/:id/addtasks",function(req,res){
    res.render("secret",{id: req.params.id});
});
app.post("/:id/addtasks",function(req,res){
    //res.render("addTasks",{id:req.params.id});
    var task={
        title:req.body.title,
        description: req.body.dscrip,
        status: true,
        deadline: req.body.deadline
    }
    db.collection('employees').doc(req.params.id).collection('tasks').add(task).then(ref=>{
        console.log(req.params.id);
        res.redirect("/"+req.params.id);
    });
});

// let doc=db.collection('employees').doc('QjAgkvWPSA0BHOlWmKRL');
// doc.collection("tasks").get().then( tasks =>{
//     tasks.forEach( item =>{
//         // console.log(item.data());
//     });
// });


// wdgkdjksjxaxascasaasscwcqqhdka
//==============================================================
app.listen(3000,function(){
	console.log("server is live");
});