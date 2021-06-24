const Name = document.querySelector(".reg-name");
const RegButton = document.querySelector(".reg-submit");
const LoginButton = document.querySelector(".log-submit");
const LoginForm = document.querySelector(".login-form");
const LogSelect = document.querySelector(".type-login");
const RegSelect = document.querySelector(".type-reg");
const LoginWindow = document.querySelector("#login-box");
console.log('loaded')
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
        Name.style.display = 'none';
        LoginForm.action = '/login';
        RegSelect.style.backgroundColor = 'white';
        LogSelect.style.backgroundColor = 'lightgrey';
        RegSelect.style.boxShadow = '-10px 1px black';
        LogSelect.style.boxShadow = 'none';
    }
    else{
        LoginForm.action = '/register';
        Name.style.display = 'block';
        RegButton.style.display = 'block';
        LoginButton.style.display = 'none';
        RegSelect.style.backgroundColor = 'lightgrey';
        LogSelect.style.backgroundColor = 'white';
        RegSelect.style.boxShadow = 'none';
        LogSelect.style.boxShadow = '10px 1px black';
    }
}

const openWindow = (eve)=>{
    eve.preventDefault();
    loginWindow++;
    if(loginWindow%2 == 0)
        LoginWindow.style.display = 'block';
    else
        LoginWindow.style.display = 'none';
}
