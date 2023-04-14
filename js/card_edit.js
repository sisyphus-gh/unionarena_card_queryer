document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.materialboxed');
    let instances = M.Materialbox.init(elems);
});

var datas;

let request = new XMLHttpRequest();
request.open("get", "./data_cn.json"); /*设置请求方法与路径*/
request.send(null); /*不发送数据到服务器*/
request.onload = function () {
    /*XHR对象获取到返回信息后执行*/
    if (this.status == 200) {
        /*返回状态为200，即为数据获取成功*/
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let ip = urlParams.get('ip');

        if (ip == null) {
            return;
        }
        datas = JSON.parse(this.responseText);
        datas = datas.filter(data => { return data.ipData == ip && !data.rareData.includes("★") });
        datas.sort(function (data1, data2) {
            return data1.cardNumData2.localeCompare(data2.cardNumData2);
        });
        search();
    }
}

request = new XMLHttpRequest();
request.open("get", "./data/ua_dict.json"); /*设置请求方法与路径*/
request.send(null); /*不发送数据到服务器*/
request.onload = function () {
    /*XHR对象获取到返回信息后执行*/
    if (this.status == 200) {
        /*返回状态为200，即为数据获取成功*/
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let ip = urlParams.get('ip');

        if (ip == null) {
            return;
        }

        let response = JSON.parse(this.responseText);
        let ipData = response.ips.filter(e => { return e.serialNo == ip })[0];

        console.log("", ipData);

        let cardPackData = document.querySelector('[name="cardPackData"]');
        ipData.cardPacks.forEach(element => {
            cardPackData.options.add(new Option(element.packName, element.serialNo));
        });
        let colorData = document.querySelector('[name="colorData"]');
        ipData.colors.forEach(element => {
            colorData.options.add(new Option(element.name, element.jpName));
        });
        let attributeCnData = document.querySelector('[name="attributeCnData"]');
        ipData.attributes.forEach(element => {
            attributeCnData.options.add(new Option(element.name, element.name));
        });

    }
}

function clickCard(e) {
    let id = e.getAttribute("id");

    let data;
    for (let i = 0; i < datas.length; i++) {
        data = datas[i];
        if (data.id == id) {
            break;
        }
    }

    let cardInfoDiv = document.getElementById("cardInfoArea");
    while (cardInfoDiv.hasChildNodes()) {
        cardInfoDiv.removeChild(cardInfoDiv.firstChild);
    }

    cardInfoDiv.innerHTML =
        `<div class="card-image col s4" style="padding: 5px;">
                <img class="materialboxed" src="./card/${data.imageFileName}" >
        </div>
        <div class="col s8">
            <p style="font-size:1.5rem;">${data.cardNumData}</p>
                <p style="font-size:1.2rem;">中文卡名: ${data.cardCnName}</p>
            <p style="font-size:1.2rem;">日文卡名:${data.cardName}</p>
            <p style="font-size:1.2rem;">特征：${data.attributeCnData}</p>
        </div>
        <div class="col s12">
            <p style="font-size:1.2rem;">效果：</p>
            <p class="effectCnData" >${data.effectCnData}</p>
            <p style="font-size:1.2rem;">触发效果：</p>
            <p >${data.triggerCnData}</div>
        </div>
        <div class ="col s3 ">
        <a class="btn-floating btn-large waves-effect waves-light teal" style='background: #391922  !important'>+</a>
        </div>
        <div class ="col s3"> 
        <a class="btn-floating btn-large waves-effect waves-light teal" style='background: #391922  !important'>-</a>
        </div>
       `;

    document.querySelector('.effectCnData').innerText = data.effectCnData;
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    M.Tabs.init(document.querySelectorAll('.tabs'), {
        "swipeable": true
    });
}

function search() {
    let form = document.getElementById("search");
    let effectData = form.querySelector('[name="effectData"]').value;
    let cardCnName = form.querySelector('[name="cardCnName"]').value;
    let cardName = form.querySelector('[name="cardName"]').value;
    let cardPackData = form.querySelector('[name="cardPackData"]').value;
    let colorData = form.querySelector('[name="colorData"]').value;
    let needEnergyData = form.querySelector('[name="needEnergyData"]').value;
    let cardNumData = form.querySelector('[name="cardNumData"]').value;
    let triggerCnData = form.querySelector('[name="triggerCnData"]').value;
    let attributeCnData = form.querySelector('[name="attributeCnData"]').value;

    let cardDiv = document.getElementById("cardListArea");
    let cardDivHtml = "";
    let count = 0;

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

        if (cardPackData != "" && data.cardPackData != cardPackData) {
            continue;
        }
        if (colorData != "" && !data.needEnergyData.includes(colorData)) {
            continue;
        }
        if (needEnergyData != "" && !data.needEnergyData.endsWith(needEnergyData)) {
            continue;
        }


        if (triggerCnData != "" && !data.triggerCnData.startsWith(triggerCnData)) {
            continue;
        }
        if (attributeCnData != "" && !data.attributeCnData.includes(attributeCnData)) {
            continue;
        }

        cardDivHtml = cardDivHtml +
            `<div style=" width: 20%;">
                <img onclick="clickCard(this);" id="${data.id}" src="./card/${data.imageFileName}" width="100%" class="col s12"/>
                <p class="center-align" style="font-size: 1.1rem; margin: 0px;">${data.cardNumData}</p>
                <p class="center-align " style="font-size: 1rem; margin: 0px;">${data.cardCnName}</p>
            </div>`;
        count++;
    }
    cardDiv.innerHTML = cardDivHtml;

    document.getElementById("searchCount").innerHTML = count;
}