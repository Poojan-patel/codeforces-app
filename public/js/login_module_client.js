console.log("Login Module loaded");
const Name = document.querySelector(".reg-name");
const RegButton = document.querySelector(".reg-submit");
const LoginButton = document.querySelector(".log-submit");
const LoginForm = document.querySelector(".login-form");
const LogSelect = document.querySelector(".type-login");
const RegSelect = document.querySelector(".type-reg");
const LoginWindow = document.querySelector("#login-box");
const Email = document.querySelector(".login-form input[type='email']")
const Password = document.querySelector(".login-form input[type='password']")
const PasswordDiv = document.querySelector(".login-form > .reg-password")
const UserName = document.querySelector(".login-form input[type='text']")
const Auth = document.querySelector(".authenticated");
const HandleName = document.querySelector(".authenticated > span")
const unAuth = document.querySelector(".unauthenticated");
const ForgotPass = document.querySelector(".login-form > a")
const functionVal = ForgotPass.getAttribute('onclick')

Name.style.display = 'none';
RegButton.style.display = 'none';
LogSelect.style.backgroundColor = 'lightgrey';
RegSelect.style.boxShadow = '-10px 1px black';

var loginWindow = 1;

const findSelector = (eve,val)=>{
    eve.preventDefault();
    if(val === 1){
        RegButton.style.display = 'none';
        LoginButton.style.display = 'block';
        LogSelect.id = 'selectedOption';
        RegSelect.removeAttribute('id');
        
        Name.style.display = 'none';
        RegSelect.style.backgroundColor = 'white';
        LogSelect.style.backgroundColor = 'lightgrey';
        RegSelect.style.boxShadow = '-10px 1px black';
        LogSelect.style.boxShadow = 'none';
        //Password.style.display = 'block';
        PasswordDiv.style.display = 'block';
        ForgotPass.style.display = 'block';
    }
    else{
        RegSelect.id = 'selectedOption';
        LogSelect.removeAttribute('id');
        Name.style.display = 'block';
        RegButton.style.display = 'block';
        LoginButton.style.display = 'none';
        RegSelect.style.backgroundColor = 'lightgrey';
        LogSelect.style.backgroundColor = 'white';
        RegSelect.style.boxShadow = 'none';
        LogSelect.style.boxShadow = '10px 1px black';
        //Password.style.display = 'none';
        PasswordDiv.style.display = 'none';
        ForgotPass.style.display = 'none';
    }
}

const forgotPassword = async(eve)=>{
    eve.preventDefault();
    //console.log(functionVal)
    if(Email.value === ""){
        return window.alert("Enter Email to Proceed")
    }
    
    ForgotPass.setAttribute('onclick','');
    //console.log(ForgotPass.getAttribute('onclick'))
    //ForgotPass.onclick = "";
    
    await fetch("/resetpassword",{
        method: "POST",
        headers:{
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            'email': Email.value
        })
    }).then(response=>response.json()).then(data=>{
        if(data.updated){
            window.alert("Check Your Email to reset your password")
            window.location.replace("/")
        }
        else{
            window.alert(data.error);
        }
    })
    //ForgotPass.onclick = "forgotPassword(event)";
    ForgotPass.setAttribute('onclick',functionVal);
    //console.log(ForgotPass.getAttribute('onclick'))
}

const openWindow = async (eve)=>{
    eve.preventDefault();
    loginWindow++;
    if(loginWindow%2 == 0){
        LoginWindow.style.display = 'block';
        let tok = window.localStorage.getItem('CodeforcesMiniAppAuthToken');
        if(tok === null){
            unAuth.style.display = 'block';
            Auth.style.display = 'none';
            return;
        }
        Auth.style.display = 'none';
        unAuth.style.display = 'none';
        await fetch("/authenticate",{
            method: "POST",
            headers:{
                'Content-type': 'application/json',
                'CodeforcesMiniAppAuthToken': tok
            },
        }).then(response=>response.json()).then(data=>{
            if(data.isLogged === true){
                Auth.style.display = 'block';
                
                HandleName.textContent = "Hello! " + (data.user.name || data.user.email)
            }
            else
                unAuth.style.display = 'block';
        })
    }
    else
        LoginWindow.style.display = 'none';
}

const registrationFunc = async(queryString)=>{
    fetch('/register',{
        method: 'POST',
        headers:{
            'Content-type': 'application/json'
        },
        body: JSON.stringify(queryString)
    }).then(response=>{
        return response.json()
    }).then((data)=>{
        //console.log(data)
        if(data.initialToken){
            //console.log('Registered:',data);
            window.alert('Registered Successfully, Kindly Check Your Mail to login');
            return window.location.replace("/");
        }
        window.alert('Registration Unsuccessful, Try to Log-in incase you are registered');
        return window.location.replace("/");
    })//.catch(err=>console.log('err',err));
}

const logMeOut= async (eve)=>{
    eve.preventDefault();
    const repl = window.confirm("Are you sure you want to go?");
    if(repl === false){
        return;
    }
    fetch('/logout',{
        method: 'POST',
        headers:{
            'CodeforcesMiniAppAuthToken': window.localStorage.getItem('CodeforcesMiniAppAuthToken'),
            'Content-type': 'application/json'
        }
    }).then(response=>response.json()).then(data=>{
        if(data.loggedOut){
            window.localStorage.removeItem('CodeforcesMiniAppAuthToken');
            window.alert('Logged Out Successfully');
        }
        else
        window.alert('Logged-out Attempt Unsuccessful');
        return window.location.replace("/")
    })
}

const loginFunc = async(queryString)=>{
    fetch('/login',{
        method: 'POST',
        headers:{
            'Content-type': 'application/json'
        },
        body: JSON.stringify(queryString)
    }).then(response=>{
        return response.json()
    }).then((data)=>{
       // console.log(data)
        if(data.initialToken){
            //console.log('Registered:',data);
            window.alert('Logged-in Successfully');
            return window.location.replace("/");
        }
        window.alert('Log-in Unsuccessful');
        return window.location.replace("/");
    })
}

LoginForm.addEventListener('submit',async (eve)=>{
    eve.preventDefault();
    //console.log('here')
    queryString = {}
    queryString['email'] = Email.value
    
    if(RegSelect.id !== ""){
        queryString['name'] = UserName.value
        return registrationFunc(queryString);
    }
    else{
        queryString['password'] = Password.value
        return loginFunc(queryString);
    }
    
    
})
