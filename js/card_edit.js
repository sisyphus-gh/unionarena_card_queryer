
let mode = "dev";

let modal1;

document.addEventListener("DOMContentLoaded", function () {
  let elems = document.querySelectorAll(".materialboxed");
  let instances = M.Materialbox.init(elems);

  modal1 = M.Modal.init(document.getElementById("modal1"), {
    onOpenEnd: function () {
      $(".tabs").tabs();
    },
  });

  $(".tabs").tabs();
});

let datas = [];
let deckList = [];

let request = new XMLHttpRequest();
request.open("get", "./data/data_cn.json"); /*设置请求方法与路径*/
request.send(null); /*不发送数据到服务器*/
request.onload = function () {
  /*XHR对象获取到返回信息后执行*/
  if (this.status == 200) {
    /*返回状态为200，即为数据获取成功*/
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let ip = urlParams.get("ip");
    let deck = urlParams.get("deck");

    if (ip == null) {
      return;
    }
    let rawDatas = JSON.parse(this.responseText);
    rawDatas = rawDatas.filter((data) => {
      return data.ipData == ip && !data.rareData.includes("★");
    });
    for (let i = 0; i < rawDatas.length; i++) {
      let rawData = rawDatas[i];

      let isAdd = true;
      for (let j = 0; j < datas.length; j++) {
        let data = datas[j];
        if (data.cardNumData2 == rawData.cardNumData2) {
          isAdd = false;
          break;
        }
      }
      if (isAdd) {
        datas.push(rawData);
        if (mode == "dev") {
          rawData.imageUrl = "./card/" + rawData.imageFileName;
        }
      }
    }

    datas.sort(function (data1, data2) {
      return data1.cardNumData2.localeCompare(data2.cardNumData2);
    });
    search();

    if (deck != null) {
      let cardList = deck.split("\n").filter((str) => {
        return str != "";
      });

      for (let i = 0; i < cardList.length; i++) {
        let cardNumData = cardList[i];

        let isAdd = false;
        for (let j = 0; j < datas.length; j++) {
          let data = datas[j];
          if (data.cardNumData == cardNumData) {
            deckList.push(data);
            isAdd = true;
            break;
          }
        }
        if (!isAdd) {
          M.toast({ html: "找不到" + cardNumData });
        }
      }
      displayDeck();
    }
  }
};

request = new XMLHttpRequest();
request.open("get", "./data/ua_dict.json"); /*设置请求方法与路径*/
request.send(null); /*不发送数据到服务器*/
request.onload = function () {
  /*XHR对象获取到返回信息后执行*/
  if (this.status == 200) {
    /*返回状态为200，即为数据获取成功*/
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let ip = urlParams.get("ip");

    if (ip == null) {
      return;
    }

    let response = JSON.parse(this.responseText);
    let ipData = response.ips.filter((e) => {
      return e.serialNo == ip;
    })[0];

    let cardPackData = document.querySelector('[name="cardPackData"]');
    ipData.cardPacks.forEach((element) => {
      cardPackData.options.add(new Option(element.packName, element.serialNo));
    });
    let colorData = document.querySelector('[name="colorData"]');
    ipData.colors.forEach((element) => {
      colorData.options.add(new Option(element.name, element.jpName));
    });
    let attributeCnData = document.querySelector('[name="attributeCnData"]');
    ipData.attributes.forEach((element) => {
      attributeCnData.options.add(new Option(element.name, element.name));
    });
  }
};

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

  cardInfoDiv.innerHTML = `<div class="card-image col s5" style="padding: 5px;">
                <img class="materialboxed" src="${data.imageUrl}" >
        </div>
        <div class="col s7">
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
        <div class ="col s3"> 
        <a class="btn-floating btn-large waves-effect waves-light" style='background: #391922  !important' onclick="addCard(${data.id});addCard(${data.id});addCard(${data.id});addCard(${data.id});">+4</a>
        </div>
        <div class ="col s3"> 
        <a class="btn-floating btn-large waves-effect waves-light" style='background: #391922  !important' onclick="removeCard(${data.id});removeCard(${data.id});removeCard(${data.id});removeCard(${data.id});">-4</a>
        </div>
       `;

  document.querySelector(".effectCnData").innerText = data.effectCnData;
  M.Materialbox.init(document.querySelectorAll(".materialboxed"));
}

function addCard(id) {
  let data;
  for (let i = 0; i < datas.length; i++) {
    data = datas[i];
    if (data.id == id) {
      break;
    }
  }

  let num = deckList.filter((e) => e.cardNumData2 == data.cardNumData2).length;
  if (num >= 4) {
    M.toast({ html: data.cardNumData2 + "已经有四张。" });
  } else {
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

  let index = deckList.indexOf(data);
  if (index < 0) {
    return;
  }
  deckList.splice(index, 1);
  displayDeck();
}

function displayDeck() {
  let count = 0;
  let deck = document.getElementById("deck");

  let deckHtml = "";
  for (let i = 0; i < deckList.length; i++) {
    let data = deckList[i];
    deckHtml =
      deckHtml +
      `<div onclick="clickCard(${data.id});">
            <div class="card-image col ms5" style="padding: 5px;">
                <img  src="${data.imageUrl}" >
        </div>
        </div>`;
    count += 1;
  }
  deck.innerHTML = deckHtml;
  document.getElementById("deckCount").innerHTML = count;
}

function sort() {
  deckList = deckList.sort(function (data1, data2) {
    return data1.cardNumData > data2.cardNumData
      ? 1
      : data1.cardNumData == data2.cardNumData
      ? 0
      : -1;
  });
  displayDeck();
}

function sort2() {
  deckList = deckList.sort(function (data1, data2) {
    let needEnergyData = data1.needEnergyData.substr(-1);
    needEnergyData = needEnergyData == "-" ? 0 : needEnergyData;
    let needEnergyData2 = data2.needEnergyData.substr(-1);
    needEnergyData2 = needEnergyData2 == "-" ? 0 : needEnergyData2;
    return needEnergyData - needEnergyData2;
  });
  displayDeck();
}

function sort3() {
  const shuffle = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
      [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
    return arr;
  };
  deckList = shuffle(deckList);
  displayDeck();
}

function clearDeck() {
  deckList = [];
  displayDeck();
}

function search() {
  let form = document.getElementById("search");
  let effectData = form.querySelector('[name="effectData"]').value;
  let cardCnName = form.querySelector('[name="cardCnName"]').value;
  let cardPackData = form.querySelector('[name="cardPackData"]').value;
  let colorData = form.querySelector('[name="colorData"]').value;
  let needEnergyData = form.querySelector('[name="needEnergyData"]').value;
  let cardNumData = form.querySelector('[name="cardNumData"]').value;
  let triggerCnData = form.querySelector('[name="triggerCnData"]').value;
  let attributeCnData = form.querySelector('[name="attributeCnData"]').value;
  let rareData = form.querySelector('[name="rareData"]').value;
  let categoryData = form.querySelector('[name="categoryData"]').value;

  let cardDivHtml = "";
  let count = 0;

  for (let i = 0; i < datas.length; i++) {
    let data = datas[i];
    if (
      effectData != "" &&
      !data.effectCnData.includes(effectData) &&
      !data.attributeCnData.join("$$").includes(effectData)
    ) {
      continue;
    }
    if (cardNumData != "" && !data.cardNumData.includes(cardNumData)) {
      continue;
    }
    if (
      cardCnName != "" &&
      !data.cardCnName.includes(cardCnName) &&
      !data.cardName.includes(cardCnName)
    ) {
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
    if (
      attributeCnData != "" &&
      !data.attributeCnData.includes(attributeCnData)
    ) {
      continue;
    }
    if (rareData != "" && data.rareData != rareData) {
      continue;
    }
    if (categoryData != "" && data.categoryData != categoryData) {
      continue;
    }

    cardDivHtml =
      cardDivHtml +
      `<div style=" width: 20%;">
                <img onclick="clickCard(${data.id});" src="${data.imageUrl}" width="100%" class="col s12"/>
                <p class="center-align" style="font-size: 1.1rem; margin: 0px;">${data.cardNumData}</p>
                <p class="center-align " style="font-size: 1rem; margin: 0px;">${data.cardCnName}</p>
            </div>`;
    count++;
  }

  document.getElementById("cardListArea").innerHTML = cardDivHtml;
  document.getElementById("searchCount").innerHTML = count;
}

function share() {
  let urlParams = new URLSearchParams(window.location.search);
  let ip = urlParams.get("ip");

  let url =
    "https://sisyphus2016.gitee.io/unionarena_card_queryer/deck_edit2.html?ip=" +
    ip +
    "&deck=";
  let cardNumDatas = [];
  for (let i = 0; i < deckList.length; i++) {
    let data = deckList[i];
    cardNumDatas.push(data.cardNumData);
  }

  document.getElementById(
    "modal1-tab1"
  ).innerHTML = `<div class="modal-content">
        <h5>复制下方链接，分享给你的好友。</h5>
        <textarea style='height: 200px;color: white;'>${
          url + cardNumDatas.join("%0A")
        }</textarea>
        </div>`;
  document.getElementById(
    "modal1-tab2"
  ).innerHTML = `<div class="modal-content"><textarea style='height: 400px;color: white;'>${cardNumDatas.join(
    "\n"
  )}</textarea></div>`;
  document.getElementById(
    "modal1-tab3"
  ).innerHTML = `<div class="modal-content"><textarea style='height: 400px;color: white;'>${JSON.stringify(
    cardNumDatas
  )}</textarea></div>`;

  modal1.open();
}
