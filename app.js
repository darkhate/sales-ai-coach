// =====================================
// AI 保險成交訓練教練
// Frontend Controller
// =====================================


let customer = null;

let conversation = [];




// =====================================
// 開始隨機訓練
// =====================================

async function startTraining(){


    // 取得客戶資料

    const customerResponse =
    await fetch(
        "knowledge/insurance_customers.json"
    );


    const customers =
    await customerResponse.json();



    // 取得情境資料

    const scenarioResponse =
    await fetch(
        "knowledge/insurance_scenarios.json"
    );


    const scenarios =
    await scenarioResponse.json();



    // 隨機抽客戶

    const randomCustomer =
    Math.floor(
        Math.random() *
        customers.length
    );



    // 隨機抽情境

    const randomScenario =
    Math.floor(
        Math.random() *
        scenarios.length
    );



    customer = {


        ...customers[randomCustomer],


        scenario:
        scenarios[randomScenario]

    };



    conversation=[];



    // 注意：
    // 不顯示 hidden_need
    // 不顯示真正拒絕原因
    // 避免作弊


    document
    .getElementById("customer")
    .innerHTML = `


    <h3>
    保險客戶訓練開始
    </h3>


    <p>
    客戶姓名：
    ${customer.name}
    </p>


    <p>
    年齡：
    ${customer.age}
    </p>


    <p>
    職業：
    ${customer.job}
    </p>


    <p>
    客戶特性：
    ${customer.personality}
    </p>


    <p>
    本次情境：
    ${customer.scenario.title}
    </p>


    <hr>


    請開始與客戶進行需求訪談。


    `;



    document
    .getElementById("chat")
    .innerHTML="";


}






// =====================================
// 發送話術
// =====================================


async function sendMessage(){



    const input =
    document.getElementById("message");



    const message =
    input.value.trim();



    if(!message){

        alert(
        "請輸入你的話術"
        );

        return;

    }



    input.value="";



    // 保存業務員說話


    conversation.push({

        role:"sales",

        content:message

    });



    showMessage(
        "你",
        message
    );




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



                message:



                message,



                customer:



                {

                name:
                customer.name,


                age:
                customer.age,


                job:
                customer.job,


                personality:
                customer.personality,


                pain:
                customer.pain,


                scenario:
                customer.scenario

                }


            })

            }

        );




        const data =
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


    catch(error){



        showMessage(

            "系統錯誤",

            error.message

        );



    }



}






// =====================================
// 成交分析
// =====================================


async function finishTraining(){



    if(
    conversation.length===0
    ){

        alert(
        "請先完成一段對話"
        );

        return;

    }




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
            customer


        })


        }

    );



    const data =
    await response.json();




    document
    .getElementById("report")
    .innerHTML =

    `

    <h2>
    AI成交教練分析
    </h2>


    <div>

    ${formatText(data.reply)}

    </div>

    `;



}






// =====================================
// 顯示聊天
// =====================================


function showMessage(
name,
message
){



    document
    .getElementById("chat")
    .innerHTML +=


    `

    <p>

    <b>
    ${name}
    </b>

    :

    ${message}

    </p>


    `;



}







function formatText(text){


    if(!text){

        return "無分析結果";

    }


    return text.replace(
        /\n/g,
        "<br>"
    );


}
