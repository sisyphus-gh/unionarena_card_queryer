document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.materialboxed');
    let instances = M.Materialbox.init(elems);

    elems = document.querySelectorAll('.modal');
    instances = M.Modal.init(elems, {});
});

var datas;
var deckList = [];

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
        let deck = urlParams.get('deck');

        if (ip == null) {
            return;
        }
        datas = JSON.parse(this.responseText);
        datas = datas.filter(data => { return data.ipData == ip && !data.rareData.includes("★") });
        datas.sort(function (data1, data2) {
            return data1.cardNumData2.localeCompare(data2.cardNumData2);
        });
        search();

        let cardList = deck.split("\n");
        for (var i = 0; i < cardList.length; i++) {
            let cardNumData = cardList[i].split(" ")[0];
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                if (data.cardNumData == cardNumData) {
                    deckList.push(data);
                }
            }
        }
        displayDeck();
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

function clickCard(id) {
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
                <img class="materialboxed" src="${data.imageUrl}" >
        </div>
        <div class="col s8">
            <p style="font-size:1.5rem;">${data.cardNumData}</p>
                <p style="font-size:1.2rem;">中文卡名: ${data.cardCnName}</p>
            <p style="font-size:1.2rem;">日文卡名: ${data.cardName}</p>
            <p style="font-size:1.2rem;">特征：${data.attributeCnData}</p>
        </div>
        <div class="col s12">
            <p style="font-size:1.2rem;">效果：</p>
            <p class="effectCnData" >${data.effectCnData}</p>
            <p style="font-size:1.2rem;">触发效果：</p>
            <p >${data.triggerCnData}</div>
        </div>
        <div class ="col s3 ">
        <a class="btn-floating btn-large waves-effect waves-light" style='background: #391922  !important' onclick="addCard(${data.id})">+</a>
        </div>
        <div class ="col s3"> 
        <a class="btn-floating btn-large waves-effect waves-light" style='background: #391922  !important' onclick="removeCard(${data.id})">-</a>
        </div>
       `;

    document.querySelector('.effectCnData').innerText = data.effectCnData;
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    M.Tabs.init(document.querySelectorAll('.tabs'), {
        "swipeable": true
    });
}

function addCard(id) {
    let data;
    for (let i = 0; i < datas.length; i++) {
        data = datas[i];
        if (data.id == id) {
            break;
        }
    }

    let num = deckList.filter(e => e.cardNumData2 == data.cardNumData2).length;
    if (num >= 4) {
        M.toast({ html: data.cardNumData2 + '已经有四张。' });
    } else {
        console.log("", data);
        deckList.push(data);
        displayDeck();
    }
}

function removeCard(id) {
    let data;
    for (let i = 0; i < datas.length; i++) {
        data = datas[i];
        if (data.id == id) {
            break;
        }
    }

    console.log("", data);
    let index = deckList.indexOf(data);
    if (index < 0) {
        return;
    }
    deckList.splice(index, 1);
    displayDeck();
}

function displayDeck() {
    let deck = document.getElementById("deck");

    let deckHtml = "";
    for (let i = 0; i < deckList.length; i++) {
        let data = deckList[i];
        deckHtml = deckHtml +
            `<div onclick="clickCard(${data.id});">
            <div class="card-image col s3" style="padding: 5px;">
                <img  src="${data.imageUrl}" >
        </div>
        </div>`;
    }
    deck.innerHTML = deckHtml;
}

function sort() {
    deckList = deckList.sort(function (data1, data2) {
        return (data1.cardNumData > data2.cardNumData ? 1 : (data1.cardNumData == data2.cardNumData ? 0 : -1));
    });
    displayDeck();
}

function sort2() {
    deckList = deckList.sort(function (data1, data2) {
        var needEnergyData = data1.needEnergyData.substr(-1);
        needEnergyData = needEnergyData == "-" ? 0 : needEnergyData;
        var needEnergyData2 = data2.needEnergyData.substr(-1);
        needEnergyData2 = needEnergyData2 == "-" ? 0 : needEnergyData2;
        return needEnergyData - needEnergyData2;
    });
    displayDeck();
}

function share() {
    let urlParams = new URLSearchParams(window.location.search);
    let ip = urlParams.get('ip');

    let url = "https://sisyphus2016.gitee.io/unionarena_card_queryer/deck_edit2.html?ip=" + ip + "&deck=";
    for (let i = 0; i < deckList.length; i++) {
        let data = deckList[i];
        url += data.cardNumData + "%0A";
    }

    document.getElementById('modal1-content').innerHTML = url;
    M.Modal.getInstance(document.getElementById('modal1')).open();
    //   window.open(url, "_blank");
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
                <img onclick="clickCard(${data.id});" src="${data.imageUrl}" width="100%" class="col s12"/>
                <p class="center-align" style="font-size: 1.1rem; margin: 0px;">${data.cardNumData}</p>
                <p class="center-align " style="font-size: 1rem; margin: 0px;">${data.cardCnName}</p>
            </div>`;
        count++;
    }
    cardDiv.innerHTML = cardDivHtml;

    document.getElementById("searchCount").innerHTML = count;
}