let mode = "prd";


document.addEventListener("DOMContentLoaded", function () {
  let elems = document.querySelectorAll(".materialboxed");
  let instances = M.Materialbox.init(elems);


  elems = document.querySelectorAll('.sidenav');
  instances = M.Sidenav.init(elems, {});
});

var datas;

let request = new XMLHttpRequest();
request.open("get", "./data/data_cn.json"); /*设置请求方法与路径*/
request.send(null); /*不发送数据到服务器*/
request.onload = function () {
  /*XHR对象获取到返回信息后执行*/
  if (this.status == 200) {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let ip = urlParams.get("ip");

    /*返回状态为200，即为数据获取成功*/
    datas = JSON.parse(this.responseText);
    datas = datas.filter((data) => {
      return data.ipData == ip;
    });

    let cardDivHtml = "";
    let cardDivHtml2 = "";
    for (let i = 0; i < datas.length; i++) {
      let data = datas[i];
      if (mode == "dev") {
        data.imageUrl = "./card/" + data.imageFileName;
      }

      cardDivHtml =
        cardDivHtml +
        `<div class=" " style=" width: 16.6666667%;">
                    <img onclick="clickCard(this);" id="${data.id}" src="${data.imageUrl}" width="100%" class="col s12"/>
                    <p class="center-align" style="font-size: 1.1rem; margin: 0px;">${data.cardNumData}</p>
                    <p class="center-align " style="font-size: 1rem; margin: 0px;">${data.cardCnName}</p>
                </div>
            `;
      cardDivHtml2 =
        cardDivHtml2 +
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
};

request = new XMLHttpRequest();
request.open("get", "./data/ua_dict.json"); /*设置请求方法与路径*/
request.send(null); /*不发送数据到服务器*/
request.onload = function () {
  /*XHR对象获取到返回信息后执行*/
  if (this.status == 200) {
    /*返回状态为200，即为数据获取成功*/
    let response = JSON.parse(this.responseText);

    let sidenavIp = document.getElementById("sidenav-ip");
    response.ips.forEach((element) => {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.href = "?ip=" + element.serialNo;
      a.innerHTML = element.ipName;
      li.appendChild(a);

      sidenavIp.appendChild(li);
    });
  }
};

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

  cardInfoDiv.innerHTML = `<div class="card-image col s4" style="padding: 5px;">
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

  document.querySelector(".effectCnData").innerText = data.effectCnData;
  M.Materialbox.init(document.querySelectorAll(".materialboxed"));
}

function search() {
  form = document.getElementById("search");
  let effectData = form.querySelector('[name="effectData"]').value;
  let cardCnName = form.querySelector('[name="cardCnName"]').value;
  let cardPackData = form.querySelector('[name="cardPackData"]').value;
  let colorData = form.querySelector('[name="colorData"]').value;
  let needEnergyData = form.querySelector('[name="needEnergyData"]').value;
  let cardNumData = form.querySelector('[name="cardNumData"]').value;
  let rareData = form.querySelector('[name="rareData"]').value;
  let parallelFlag = form.querySelector('[name="parallelFlag"]').value;
  let triggerCnData = form.querySelector('[name="triggerCnData"]').value;
  let rareStarData = form.querySelector('[name="rareStarData"]').value;
  let categoryData = form.querySelector('[name="categoryData"]').value;

  let cardList = [];

  for (let i = 0; i < datas.length; i++) {
    let data = datas[i];
    if (effectData != "") {
      if (
        !data.effectCnData.includes(effectData) &&
        !data.attributeCnData.join("$$").includes(effectData)
      ) {
        continue;
      }
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


    if (cardPackData != "" && !data.cardPackData.endsWith(cardPackData)) {
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
    if (rareData != "" && !data.rareData.startsWith(rareData)) {
      continue;
    }
    if (triggerCnData != "" && !data.triggerCnData.startsWith(triggerCnData)) {
      continue;
    }
    if (rareStarData != "") {
      if (rareStarData == "★★★") {
        if (!data.rareData.endsWith(rareStarData)) {
          continue;
        }
      } else if (rareStarData == "★★") {
        if (
          !data.rareData.endsWith(rareStarData) ||
          data.rareData.endsWith("★★★")
        ) {
          continue;
        }
      } else if (rareStarData == "★") {
        if (
          !data.rareData.endsWith(rareStarData) ||
          data.rareData.endsWith("★★")
        ) {
          continue;
        }
      }
    }
    if (categoryData != "" && data.categoryData != categoryData) {
      continue;
    }
    cardList.push(data);
  }

  cardList = cardList.sort(function (data1, data2) {
    return data1.cardNumData2 > data2.cardNumData2
      ? 1
      : data1.cardNumData2 == data2.cardNumData2
        ? 0
        : -1;
  });

  let count = 0;
  let cardDivHtml = "";
  let cardDivHtml2 = "";

  cardList.forEach((data) => {
    cardDivHtml =
      cardDivHtml +
      `<div class=" " style=" width: 16.6666667%;">
            <img onclick="clickCard(this);" id="${data.id}" src="${data.imageUrl}" width="100%" class="col s12"/>
            <p class="center-align" style="font-size: 1.1rem; margin: 0px;">${data.cardNumData}</p>
            <p class="center-align " style="font-size: 1rem; margin: 0px;">${data.cardCnName}</p>
        </div>
        
    `;
    cardDivHtml2 =
      cardDivHtml2 +
      `<div class="center-align" style="width: 33.3333%;">
            <a target="_blank" href="./info.html?cardNumData=${data.cardNumData}" >
                <img src="${data.imageUrl}" width="80%" style="margin: 0 auto;" />
                <p style="font-size: 1rem;margin: 0px;">${data.cardNumData}</p>
                <p style="margin: 0px;">${data.cardCnName}</p>
            </a>
        </div>
    `;
    count++;
  });

  document.getElementById("cardListArea").innerHTML = cardDivHtml;
  document.getElementById("cardListArea2").innerHTML = cardDivHtml2;


  Array.prototype.forEach.call(document.getElementsByClassName("searchCount"), element => {
    element.innerHTML = count;
  });

}


function search2() {
  form = document.getElementById("mobile-demo");
  let effectData = form.querySelector('[name="effectData"]').value;
  let cardCnName = form.querySelector('[name="cardCnName"]').value;
  let cardPackData = form.querySelector('[name="cardPackData"]').value;
  let colorData = form.querySelector('[name="colorData"]').value;
  let needEnergyData = form.querySelector('[name="needEnergyData"]').value;
  let cardNumData = form.querySelector('[name="cardNumData"]').value;
  let rareData = form.querySelector('[name="rareData"]').value;
  let parallelFlag = form.querySelector('[name="parallelFlag"]').value;
  let triggerCnData = form.querySelector('[name="triggerCnData"]').value;
  let rareStarData = form.querySelector('[name="rareStarData"]').value;
  let categoryData = form.querySelector('[name="categoryData"]').value;

  let cardList = [];

  for (let i = 0; i < datas.length; i++) {
    let data = datas[i];
    if (effectData != "") {
      if (
        !data.effectCnData.includes(effectData) &&
        !data.attributeCnData.join("$$").includes(effectData)
      ) {
        continue;
      }
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


    if (cardPackData != "" && !data.cardPackData.endsWith(cardPackData)) {
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
    if (rareData != "" && !data.rareData.startsWith(rareData)) {
      continue;
    }
    if (triggerCnData != "" && !data.triggerCnData.startsWith(triggerCnData)) {
      continue;
    }
    if (rareStarData != "") {
      if (rareStarData == "★★★") {
        if (!data.rareData.endsWith(rareStarData)) {
          continue;
        }
      } else if (rareStarData == "★★") {
        if (
          !data.rareData.endsWith(rareStarData) ||
          data.rareData.endsWith("★★★")
        ) {
          continue;
        }
      } else if (rareStarData == "★") {
        if (
          !data.rareData.endsWith(rareStarData) ||
          data.rareData.endsWith("★★")
        ) {
          continue;
        }
      }
    }
    if (categoryData != "" && data.categoryData != categoryData) {
      continue;
    }
    cardList.push(data);
  }

  cardList = cardList.sort(function (data1, data2) {
    return data1.cardNumData2 > data2.cardNumData2
      ? 1
      : data1.cardNumData2 == data2.cardNumData2
        ? 0
        : -1;
  });

  let count = 0;
  let cardDivHtml = "";
  let cardDivHtml2 = "";

  cardList.forEach((data) => {
    cardDivHtml =
      cardDivHtml +
      `<div class=" " style=" width: 16.6666667%;">
            <img onclick="clickCard(this);" id="${data.id}" src="${data.imageUrl}" width="100%" class="col s12"/>
            <p class="center-align" style="font-size: 1.1rem; margin: 0px;">${data.cardNumData}</p>
            <p class="center-align " style="font-size: 1rem; margin: 0px;">${data.cardCnName}</p>
        </div>
        
    `;
    cardDivHtml2 =
      cardDivHtml2 +
      `<div class="center-align" style="width: 33.3333%;">
            <a target="_blank" href="./info.html?cardNumData=${data.cardNumData}" >
                <img src="${data.imageUrl}" width="80%" style="margin: 0 auto;" />
                <p style="font-size: 1rem;margin: 0px;">${data.cardNumData}</p>
                <p style="margin: 0px;">${data.cardCnName}</p>
            </a>
        </div>
    `;
    count++;
  });

  document.getElementById("cardListArea").innerHTML = cardDivHtml;
  document.getElementById("cardListArea2").innerHTML = cardDivHtml2;


  Array.prototype.forEach.call(document.getElementsByClassName("searchCount"), element => {
    element.innerHTML = count;
  });

}
