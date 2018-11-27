
// div til template som holder på alle lister og tømmes når en spesifikk liste skal vises.

let authenticatedUser = null;
let userID = localStorage.getItem('userID');
let authenticationToken = null;
const DEBUG = true;
const USER_ROLE = 42;

let cont = document.getElementById("content");

//-------


/*------------------- Sjekker om brukeren er autorisert --------------------------*/
(function (){
    if (!authenticatedUser) {
        displayLoginForm();

    } else {
        //displaySubmitRequestForm();
        displayListForm();
    }

})();

displayLoginForm();
/*------------------- Tømmer container og legger inn ny template -----------------*/
function setTemp(id, cont) {
    cont.innerHTML = "";
    let temp = document.getElementById(id);
    let clone = temp.content.cloneNode(true);
    cont.appendChild(clone);
}

/*------------------------TESTER Å LAGE EN CLEARSCREEN FUNKSJON---------------------------------*/
function clearScreen(){
    let container = document.getElementById("content");
    while (container.firstChild) {
        container.removeChild(content.firstChild);
    }
}
/*------------------------ Logg inn ---------------------------*/

function displayLoginForm() {
    setTemp("authenticateUserUITemplate", cont);
    let btn = document.getElementById("loginBt");
    btn.onclick = btnLogin;
}

async function btnLogin (evt) {
    evt.preventDefault();
    let form = document.getElementById("loginForm");
    let username = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    let uploadData = JSON.stringify({
        pswHash: password,
        user: username
    });
    let cfg = {
        method: "POST",
        body: uploadData,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    };

    /*------------------------ Tester om innlogging er vellykket eller om det er noe anna feil ---------------------*/

    try {
        fetch("/app/user/auth", cfg).then(function (respons){ //callback fra funksjonen fetch
            if (respons.status < 400) {
                console.log(respons);
                return respons.json();
                console.log("velkommen");
            } else if (respons.status === 401) {
                // Username or password was wrong, informe the user.
                console.log("Wrong username or password");
            } else {
                // Some other thing went wrong.
                console.log("Could not log you in at this time, try again later");
            }
        }).then(function (responsJSON) { // callback fra respos.json

            console.log("svar fra server", responsJSON);
            authenticationToken =  responsJSON.token;
            userID = responsJSON.userID;
            localStorage.setItem('authenticationToken',authenticationToken);
            localStorage.setItem('userID',userID);
            console.log(authenticationToken);
            displayListForm();
            fetchLists();
            // all done user is auth and logd in!

        }).catch(function (err) {
            // fetch could not complete the request.
            console.log(err.message);
        });
    } catch(err) {
        console.log(err);
        // Her er svaret fra server og bruker ikke logget inn
    }
}
function btnCreate () {
    displayCreateUserForm();
    console.log("kjør create temp");
}

/*------------------ LISTE ---------------------*/

function displayListForm(){
    setTemp("Lister", cont);
    henteLister();
    //fetchLists();
    listeUt(data); //funksjon for for loop

}
/*------------------ Leser liste fra DB -------------*/

function fetchLists() {

    let data = JSON.stringify({
        token: authenticationToken,
        user: authenticatedUser,
        //listid:listid
    });


    fetch('/app/lists/load/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": authenticatedUser
        },
        body: data
    }).then(response => {
        if (response.status < 400) {
            console.log("loading")
            loadLists(response);

        } else {

            console.log('Did not load Database');
        }
    }).catch(err => console.error(err));


}

async function loadLists(response) {

    let data = await response.json();
    console.log(data);
    var container = document.getElementById("listView");
    let listsForDisplay = "";

    for (var i = 0; i < data.length; i++) {
        let listT = data[i].listtittel;
        let listB = data[i].beskrivelse;
        let listid = data[i].listid;

        container.style.display = "block";


        let DBlists =

            `<div onclick ="clearList(); modal(), fetchPosts(${listid}) "id="listBox">

       <h1> ${listT}</h1>
       <p> ${listB}</p>



        </div>`;

        listsForDisplay += DBlists;

    }

    document.getElementById("listView").innerHTML = listsForDisplay;
    document.getElementById("listView").style.cursor = "pointer";
}

//sendListTodb();

/*  -----------------   Sender liste til DB -----------------------*/

function sendListTodb(){
    fetch('/app/list',{
        method:"POST",
        body:JSON.stringify({
            userid:userid,
            listenavn:listenavn,
            listeid:listeid,
        }),

        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    }).then(function(data){
        if(data.status < 400){
            return data.json();
        }
    }).then(function(token){
        console.log(token);
        localStorage.setItem("token", token.tok);

    }).catch(err =>{
        console.error(err);
    });

}

/*------------------------ Lag bruker ------------------------- */

function displayCreateUserForm() {
    setTemp("createUserUITemplate", cont);
    let form = document.getElementById("createUserForm");
    form.onsubmit = function (evt) {
        // Stops the form from submitting
        evt.preventDefault();
        // Username, email and password is validated by browser :)
        // if values are missing it is our mistake in not finding the correct element.
        let userName = document.getElementById("newUserName").value;
        let password = document.getElementById("newPassword").value;
        let email = document.getElementById("email").value;
        let role = USER_ROLE;
        fetch('/app/user/create',{
            method:"POST",
            body:JSON.stringify({
                name:userName,
                pswHash:password,
                userRole:role,
                email:email
            }),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
        }).then(function(data){
            if(data.status < 400){
                return data.json();
            }
        }).then(function(token){
            console.log(token);
            localStorage.setItem("token", token.tok);
            //if(createdUser.id){
            // We have a newly created user !!
            clearScreen();
            //----------------KJØRER CLEARSCREEN---------------------------
            displayLoginForm();
            //-------------TILBAKE TIL START #LOGIN-------------------

        }).catch(err =>{
            console.error(err);
        });
    }
}

/*------------------    Lager ny liste på server ----------------------*/

function btnListCreateClick() {
    try {
        authenticationToken = localStorage.getItem("authenticationToken");
        userID = localStorage.getItem("userID");
        let uploadData = JSON.stringify({
            token: authenticationToken,
            userID: userID,
            listenavn: document.getElementById("txtListName").value
        });
        let cfg = {
            method:"POST",
            body:uploadData,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        };
        fetch("/app/list/create", cfg).then(function (respons){ //callback fra funksjonen fetch
            if (respons.status < 400) {
                console.log(respons);
                return respons.json();
                console.log("velkommen");
            } else if (respons.status === 401) {
                // Username or password was wrong, inform the user.
                console.log("Wrong username or password");
            } else {
                // Some other thing went wrong.
                console.log("Could not log you in at this time, try again later");
            }
        }).then(function (responsJSON) { // callback fra respos.json

            console.log("svar fra server", responsJSON);
            // OK vi har fått laget en ny liste
            //listeUt();
            clearScreen(); //oppdaterer liste
            displayListForm(); //refresher listform display

        }).catch(function (err) {
            // fetch could not complete the request.
            console.log(err.message);
        });
    } catch(err) {
        console.log(err);
        // Her er svaret fra server og bruker er ikke logget inn
    }
}

/*-------------------------Lese lister---------------------*/

async function henteLister(){
    console.log('Kjører hente lister funksjon');

    let response = await fetch("/app/list/",{
        method:"GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-access-auth":authenticationToken
        },
    });
    let data = await response.json();
    console.log(data);
    listeUt(data);
    return data;

}

function listeUt(data){ //satt denne funksjonen under displayListForm -fungerer ikke.
    console.log("funker")

    /*------ Få opp lister i vinduet/template lister -----*/

    let listsForDisplay = "";
    let henteUtLister = "";
    for (let i = 0; i < data.length; i++){
        let listT = data[i].listenavn;
        let listB = data[i].time;
        let listid = data[i].listeid;


        let DBlists =

            `<div "id="listBox">
       <h1> ${listT}</h1>
       <p> ${listB}</p>
            <button id="delete" onclick="deleteList(${listid})"> DELETE </button>
        </div>`;

        listsForDisplay += DBlists;


    }
    document.getElementById("container").innerHTML = listsForDisplay;



}
function deleteList(listvalue) {

    console.log(listvalue);
    console.log(listvalue);
    let listide = localStorage.getItem("listid");
    let data = JSON.stringify({

        listid: listvalue

    });

    fetch('/app/lists', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": authenticatedUser,
            "listid": listvalue
        },
        body: data
    }).then(response => {
        if (response.status < 400) {
            console.log("loading")
            fetchLists(listide);

        } else {
            // TODO: MESSAGE
            console.log('Did not load presentation :(');
        }
    }).catch(err => console.error(err));
    clearScreen(); //oppdaterer liste
    displayListForm(); //refresher listform display

}
function log(...messages) {
    if (DEBUG) {
        messages.forEach(msg => {
            console.log(msg);
        })
    }
}
