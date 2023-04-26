// get DOM elements
const timerText = document.querySelector(".timer");
const callBtn = document.querySelector(".result__call");
const pageDiv = document.querySelector(".result")
const apiContainer = document.querySelector(".result__api-data")

//get and display api data on button click 
callBtn.addEventListener("click", async () => {
  const fetchData = await apiCall()
  console.log(fetchData)
  displayApiData(fetchData)
})
//start timer on window load
window.onload = async () => {
  console.log("loaded");
  timer(600);
};



function timer(seconds) {
  if (seconds < 0) {
    return;
  }
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  timerText.innerText = `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  seconds--;

  setTimeout(() => {
    timer(seconds)
  }, 1000);
}

async function apiCall() {
  const request = await fetch("https://swapi.dev/api/people/1/")
  const data = await request.json()
  return data
}

function displayApiData(data) {
  if (document.querySelector(".table")) {
    return alert("Вы уже получили результат!")
  }

  const table = document.createElement("table")
  table.classList.add("table")

  for (key in data) {
    const row = document.createElement("tr")
    row.classList.add("table__row")
    
    const td1 = document.createElement("td")
    td1.innerText = key
    td1.classList.add("table__data")
    row.appendChild(td1)

    const td2 = document.createElement("td")
    // check if api data is array to display it properly
    if (Array.isArray(data[key])) {
      let info = ''
      data[key].forEach(e => info += `${e}\n`)
      td2.innerText = info
    } else {
      td2.innerText = data[key]
    }
    td2.classList.add("table__data")
    row.appendChild(td2)
    
    table.appendChild(row)
    console.log(`${key}: ${data[key]}`)
  }

  pageDiv.appendChild(table)
}

