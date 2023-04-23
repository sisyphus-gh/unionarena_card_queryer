document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems);
});

var datas;
var url = "./data_cn.json"
var request = new XMLHttpRequest();
request.open("get", url); /*设置请求方法与路径*/
request.send(null); /*不发送数据到服务器*/
request.onload = function () {
    /*XHR对象获取到返回信息后执行*/
    if (request.status == 200) {
        /*返回状态为200，即为数据获取成功*/
        datas = JSON.parse(request.responseText);

        let cardDivHtml = "";
        let cardDivHtml2 = "";
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            cardDivHtml = cardDivHtml +
                `<div class=" " style=" width: 16.6666667%;">
                    <img onclick="clickCard(this);" id="${data.id}" src="${data.imageUrl}" width="100%" class="col s12"/>
                    <p class="center-align" style="font-size: 1.1rem; margin: 0px;">${data.cardNumData}</p>
                    <p class="center-align " style="font-size: 1rem; margin: 0px;">${data.cardCnName}</p>
                </div>
            `;
            cardDivHtml2 = cardDivHtml2 +
                `<div class="center-align" style="width: 33.3333%;">
                    <a target="_blank" href="./info.html?cardNumData=${data.cardNumData}" >
                        <img src="${data.imageUrl}" width="80%" style="margin: 0 auto;" />
                        <p style="font-size: 1rem;margin: 0px;">${data.cardNumData}</p>
                        <p style="margin: 0px;">${data.cardCnName}</p>
                    </a>
                </div>
            `;
        }
        document.getElementById("cardListArea").innerHTML = cardDivHtml;
        document.getElementById("cardListArea2").innerHTML = cardDivHtml2;
        search();
    }
}

function clickCard(e) {
    var id = e.getAttribute("id");

    var data;
    for (var i = 0; i < datas.length; i++) {
        data = datas[i];
        if (data.id == id) {
            break;
        }
    }

    var cardInfoDiv = document.getElementById("cardInfoArea");
    while (cardInfoDiv.hasChildNodes()) {
        cardInfoDiv.removeChild(cardInfoDiv.firstChild);
    }

    cardInfoDiv.innerHTML =
        `<div class="card-image col s4" style="padding: 5px;">
                <img class="materialboxed" src="${data.imageUrl}" >
        </div>
        <div class="col s8">
            <p style="font-size:1.5rem;">${data.cardNumData}&nbsp;&nbsp;&nbsp;&nbsp;${data.rareData}</p>
                <p style="font-size:1.2rem;">中文卡名: ${data.cardCnName}</p>
            <p style="font-size:1.2rem;">日文卡名: ${data.cardName}</p>
            <p style="font-size:1.2rem;">特征: ${data.attributeCnData}</p>
        </div>
        <div class="col s12">
            <p style="font-size:1.2rem;">效果: </p>
            <p class="effectCnData" >${data.effectCnData}</p>
            <p style="font-size:1.2rem;">触发效果: </p>
            <p >${data.triggerCnData}</div>
        </div>`;

    document.querySelector('.effectCnData').innerText = data.effectCnData;
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
}

function search() {
    form = document.getElementById("search");
    let effectData = form.querySelector('[name="effectData"]').value;
    let ipData = form.querySelector('[name="ipData"]').value;
    let cardCnName = form.querySelector('[name="cardCnName"]').value;
    let cardName = form.querySelector('[name="cardName"]').value;
    let cardPackData = form.querySelector('[name="cardPackData"]').value;
    let colorData = form.querySelector('[name="colorData"]').value;
    let needEnergyData = form.querySelector('[name="needEnergyData"]').value;
    let cardNumData = form.querySelector('[name="cardNumData"]').value;
    let rareData = form.querySelector('[name="rareData"]').value;
    let parallelFlag = form.querySelector('[name="parallelFlag"]').value;
    let triggerCnData = form.querySelector('[name="triggerCnData"]').value;
    let attributeCnData = form.querySelector('[name="attributeCnData"]').value;

    let count = 0;

    let cardDivHtml = "";
    let cardDivHtml2 = "";
    for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        if (effectData != "" && !data.effectCnData.includes(effectData)) {
            continue;
        }
        if (cardNumData != "" && !data.cardNumData.includes(cardNumData)) {
            continue;
        }
        if (cardCnName != "" && !data.cardCnName.includes(cardCnName)) {
            continue;
        }
        if (cardName != "" && !data.cardName.includes(cardName)) {
            continue;
        }
        if (ipData != "" && data.ipData != ipData) {
            continue;
        }
        if (cardPackData != "" && data.cardPackData != cardPackData) {
            continue;
        }
        if (colorData != "" && !data.needEnergyData.includes(colorData)) {
            continue;
        }
        if (needEnergyData != "" && !data.needEnergyData.endsWith(needEnergyData)) {
            continue;
        }
        if (parallelFlag != "" && data.rareData.includes("★")) {
            continue;
        }
        if (rareData != "" && data.rareData != rareData) {
            continue;
        }
        if (triggerCnData != "" && !data.triggerCnData.startsWith(triggerCnData)) {
            continue;
        }
        if (attributeCnData != "" && !data.attributeCnData.includes(attributeCnData)) {
            continue;
        }

        cardDivHtml = cardDivHtml +
            `<div class=" " style=" width: 16.6666667%;">
                    <img onclick="clickCard(this);" id="${data.id}" src="${data.imageUrl}" width="100%" class="col s12"/>
                    <p class="center-align" style="font-size: 1.1rem; margin: 0px;">${data.cardNumData}</p>
                    <p class="center-align " style="font-size: 1rem; margin: 0px;">${data.cardCnName}</p>
                </div>
                
            `;
        cardDivHtml2 = cardDivHtml2 +
            `<div class="center-align" style="width: 33.3333%;">
                    <a target="_blank" href="./info.html?cardNumData=${data.cardNumData}" >
                        <img src="${data.imageUrl}" width="80%" style="margin: 0 auto;" />
                        <p style="font-size: 1rem;margin: 0px;">${data.cardNumData}</p>
                        <p style="margin: 0px;">${data.cardCnName}</p>
                    </a>
                </div>
            `;
        count++;
    }
    document.getElementById("cardListArea").innerHTML = cardDivHtml;
    document.getElementById("cardListArea2").innerHTML = cardDivHtml2;

    document.getElementById("searchCount").innerHTML = count;
}