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
    res.render("addTasks",{id:req.params.id});
    // let tasks=db.collection('employees').doc(req.params.id).collection('tasks').doc()

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
        //var i=req.params.id;
        res.redirect("/"+req.params.id);
    });
});

// let doc=db.collection('employees').doc('QjAgkvWPSA0BHOlWmKRL');
// doc.collection("tasks").get().then( tasks =>{
//     tasks.forEach( item =>{
//         // console.log(item.data());
//     });
// });


// wdgkdjksjxaxascasaasschdka













//==============================================================
app.listen(3000,function(){
	console.log("server is live");
});