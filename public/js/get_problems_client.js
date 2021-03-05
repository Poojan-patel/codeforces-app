console.log("get_problem_client.js loaded Successfully");
const Form = document.querySelector(".get-problems-form");
const tags = document.querySelector(".get-problems-form input")
const Table = document.querySelector(".main-content-problems table")
const errorP = document.querySelector(".main-content-problems p")
const mainDiv = document.querySelector(".main-content-problems")
const regex = RegExp('[a-zA-Z0-9]');

Form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(regex.test(tags.value) == false)
        return console.log('not possible')
    const tagValue = tags.value.toLowerCase();
    fetch('/fetchproblems?tags='+tagValue).then((response)=>{
        errorP.style.display = 'none';
        Table.style.display = 'none';
        errorP.innerHTML = '';
        Table.innerHTML = '';
        mainDiv.style.backgroundColor = "rgba(0,0,0,1)"
        response.json().then((data)=>{
            if(data.err){
                errorP.style.display = 'block';
                return errorP.innerHTML = data.err;
            }
            else{
                Table.style.display = 'block';
                Table.style.color = 'white';
                const probs = data.problems;
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                th.innerHTML = 'Contest ID'
                tr.appendChild(th);
                th = document.createElement('th');
                th.innerHTML = 'Problem Index'
                tr.appendChild(th);
                th = document.createElement('th');
                th.innerHTML = 'Problem Name'
                tr.appendChild(th);
                Table.appendChild(tr);
                probs.forEach(ele=>{
                    tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.innerHTML = ele.contestId
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerHTML = ele.index
                    tr.appendChild(td);
                    td = document.createElement('a');
                    td.innerHTML = ele.name
                    td.href = "https://codeforces.com/problemset/problem/" + ele.contestId +"/" + ele.index;
                    td.target = "_blank"
                    tr.appendChild(td);
                    Table.appendChild(tr);
                });
                return;
            }
        })
        
    })
})