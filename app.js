let customer={};

let conversation=[];



async function startTraining(){


let response=
await fetch(
"knowledge/customers.json"
);


let data=
await response.json();


customer=
data[
document
.getElementById("customer")
.value
];


conversation=[];



document
.getElementById("chat")
.innerHTML=

`
<h3>
目前客戶：
${customer.name}
</h3>

<p>
客戶背景：
${customer.customer.pain}
</p>

`;



}



async function sendMessage(){


let msg=
document
.getElementById("message")
.value;



conversation.push({

role:"user",

content:msg

});



showMessage(
"你",
msg
);



let response=
await fetch(

CONFIG.WORKER_URL,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

mode:"customer",

message:msg,

customer:
customer.customer

})


}

);



let data=
await response.json();



conversation.push({

role:"customer",

content:data.reply

});



showMessage(
"AI客戶",
data.reply
);


}



async function finishTraining(){


let response=
await fetch(

CONFIG.WORKER_URL,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

mode:"coach",

conversation:

conversation,

customer:

customer.customer

})

}

);



let data=
await response.json();



document
.getElementById("report")
.innerHTML=

`

<h2>
成交分析報告
</h2>

${data.reply}

`;



}




function showMessage(name,text){


document
.getElementById("chat")
.innerHTML+=

`

<p>

<b>${name}</b>

：

${text}

</p>

`;

}