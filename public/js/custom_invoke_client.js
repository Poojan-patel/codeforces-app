var editor = ace.edit("main-content-code");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/c_cpp");

console.log("script loaded Successfully")
const CompileButton = document.querySelector(".compile-button");
const ThemeButton = document.querySelector(".theme-button");
const LanguageSelector = document.querySelector(".languages");
const InputText = document.querySelector(".main-content-input div textarea")
const OutputText = document.querySelector(".main-content-output div textarea")
const EditorWindow = document.querySelector(".main-content-editor")
const IOWindow = document.querySelector(".main-content-io")
const Headings = document.querySelectorAll("center")

const modes = {
    "cpp17": "c_cpp",
    "c": "c_cpp",
    "java": "java",
    "python3": "python",
    "fortran": "fortran",
    "kotlin": "kotlin",
    "swift": "swift",
    "pascal": "pascal",
    "scala": "scala",
    "go": "golang",
    "ruby": "ruby",
    "objc": "objectivec",
    "r": "r",
    "bash": "sh",
    "perl": "perl"
}

const getCurrentCode = ()=>editor.getSession().getValue();

var themeCounter = 1
const change_theme = (e)=>{
    e.preventDefault();
    ++themeCounter;
    if(themeCounter%2 == 0){
        editor.setTheme("ace/theme/chrome");
        ThemeButton.style.color = "black";
        ThemeButton.style.backgroundColor = "white";
        InputText.style.backgroundColor = "white";
        OutputText.style.backgroundColor = "white";
        InputText.style.color = "black";
        OutputText.style.color = "black";
        IOWindow.style.backgroundColor = "inherit";
        EditorWindow.style.backgroundColor = "inherit";
        Headings.forEach(ele=>{
            ele.style.color = "white";
        })
    }
    else{
        editor.setTheme("ace/theme/monokai");
        ThemeButton.style.color = "white";
        ThemeButton.style.backgroundColor = "black";
        InputText.style.backgroundColor = "black";
        OutputText.style.backgroundColor = "black";
        InputText.style.color = "white";
        OutputText.style.color = "white";
        IOWindow.style.backgroundColor = "rgba(200, 230, 230, 1)";
        EditorWindow.style.backgroundColor = "rgba(200, 230, 230, 1)";
        Headings.forEach(ele=>{
            ele.style.color = "black";
        })
    }
    
}

const change_mode = (e)=>{
    e.preventDefault();
    editor.session.setMode("ace/mode/"+modes[LanguageSelector.value])
}
const compile_code = (e)=>{
    e.preventDefault();
    CompileButton.disabled = true;
    var curCode = getCurrentCode();
    if(curCode.search(/[a-zA-Z0-9]/) === -1){
        window.alert("Code is Empty!!")
        return CompileButton.disabled = false;
    }
    const codeOfLang = {
        script: curCode,
        language: LanguageSelector.value,
        stdin: InputText.value
    }
    OutputText.value = ""
    fetch("/compiler",{
        method: "POST",
        body: JSON.stringify(codeOfLang),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response=>{
        response.json().then(data=>{
            if(data.memory === undefined){
                OutputText.value = "Server Not Reachable At Current Moment"
            }
            else{
                data.output = data.output.replaceAll('jdoodle','invoked');
                OutputText.value = data.output + '\n\n========================\n' + "Memory Used:" + data.memory + '\n' + "CPU used:" + data.cpuTime;
            }
            CompileButton.disabled = false;
        })
    })
}
