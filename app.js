// ===============================
// AI 成交訓練教練
// Frontend Controller
// ===============================


let customer = {};

let conversation = [];



// ===============================
// 開始訓練
// ===============================

async function startTraining() {


    const select =
        document.getElementById("customer").value;


    const response =
        await fetch(
            "knowledge/customers.json"
        );


    const customers =
        await response.json();



    customer =
        customers[select];



    conversation = [];



    document.getElementById("chat").innerHTML = `

        <h3>
        開始訓練
        </h3>

        <p>
        客戶：
        ${customer.name}
        </p>


        <p>
        年齡：
        ${customer.customer.age}
        </p>


        <p>
        職業：
        ${customer.customer.job}
        </p>


        <p>
        性格：
        ${customer.customer.personality}
        </p>


        <p>
        客戶目前階段：
        ${customer.customer.stage}
        </p>


        <p>
        潛在問題：
        ${customer.customer.pain}
        </p>


        <hr>

        <p>
        請開始與客戶溝通。
        </p>

    `;


}



// ===============================
// 發送成交話術
// ===============================

async function sendMessage(){


    const input =
        document.getElementById("message");


    const message =
        input.value.trim();



    if(!message){

        alert("請輸入內容");

        return;

    }



    // 保存使用者說話

    conversation.push({

        role:"user",

        content:message

    });



    showMessage(
        "你",
        message
    );



    input.value="";



    try{


        const response =
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


                message:message,


                customer:
                customer.customer

            })

            }

        );



        const data =
        await response.json();



        const aiReply =
        data.reply ||
        "AI沒有回覆";



        conversation.push({

            role:"customer",

            content:aiReply

        });



        showMessage(

            "AI客戶",

            aiReply

        );



    }

    catch(error){


        showMessage(

            "系統錯誤",

            error.message

        );


    }



}



// ===============================
// 完成訓練，進入教練分析
// ===============================

async function finishTraining(){


    if(conversation.length===0){

        alert(
        "請先進行對話"
        );

        return;

    }



    try{


        const response =
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



        const data =
        await response.json();



        document
        .getElementById("report")
        .innerHTML = `


        <h2>
        成交教練分析
        </h2>


        <div>

        ${formatReport(data.reply)}

        </div>


        `;



    }

    catch(error){


        document
        .getElementById("report")
        .innerHTML =

        `
        分析失敗：

        ${error.message}

        `;


    }


}




// ===============================
// 顯示聊天訊息
// ===============================

function showMessage(
    name,
    text
){


    const chat =
    document.getElementById("chat");



    chat.innerHTML += `


    <p>

    <b>
    ${name}
    </b>

    :

    ${text}

    </p>


    `;



    chat.scrollTop =
    chat.scrollHeight;


}




// ===============================
// AI報告格式化
// ===============================

function formatReport(text){


    if(!text){

        return "沒有分析結果";

    }



    return text

    .replace(
        /\n/g,
        "<br>"
    );


}