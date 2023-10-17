"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
alert("Log ins: username: js, pin: 1111, username: jd, pin 2222");
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//* Selecting Document Elements:
let dom = document;
//todo LOG-IN Inputs:
const welcomeMessage = dom.querySelector(".login-text");
const appBar = dom.querySelector(".app__panel");
const formLogin = dom.querySelector(".login");
const btnLogin = dom.querySelector(".login__btn");
const inputUserLogin = dom.querySelector(".user-login-input");
const inputPINLogin = dom.querySelector(".pin-login-input");
const currentDate = dom.querySelector(".current__date");
const totalBalance = dom.querySelector(".total__money");
const containerMovements = dom.querySelector(".movements");
const amountTransfer = dom.querySelector(".transfer__amount");

//todo Transfer Money Select Elements:
let transferBtn = dom.querySelector(".transfer__btn");
const transferTo = dom.querySelector(".transfer__to");

//todo Select Elements Display Balance In Desposit/Widtraw List:
const balanceDisplayWithDep = dom.querySelector(".balance__info");

//todo Sort Element Selects:
let sortContainer = dom.querySelector(".sort__container");
let sortElm = dom.querySelector(".sort");

// Create Accounts Owners Short Abbreviation Like: JS, JD, STV, SS:
const ownerNamesToShort = function (accounts) {
  accounts.forEach(function (accs) {
    accs.userName = accs.owner
      .toLowerCase()
      .split(" ")
      .map((letters) => letters[0])
      .join("");
  });
};

ownerNamesToShort(accounts);

// Time/Date:
currentDate.innerHTML = Date();

const updateUI = function (account) {
  displayCurrentBalance(account);
  displayBalance(account.movements);
};

// Create Join Account And Save Current Account Object:
let currentAccount;

let checkLoginBtn = btnLogin.addEventListener("click", (e) => {
  // console.log("EEEE");
  e.preventDefault();
  currentAccount = accounts.find(
    (curAcc) => curAcc.userName === inputUserLogin.value
  );
  if (currentAccount?.pin === Number(inputPINLogin.value)) {
    appBar.style.display = "grid";
    inputUserLogin.value = inputPINLogin.value = "";
    welcomeMessage.textContent = `Welcome Back ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    inputPINLogin.blur(); // ეს მეთოდი აჩერებს ციმციმს მიუხედავად იმისა ჩავწერე თუ არა უკვე input-ში და დავაჭირე enter-ს ამიტომ რომ აღარ იციმციმოს ვთიშავ ამ ბრძანებით
    appBar.style.opacity = "1";
    updateUI(currentAccount);
  } else {
    inputUserLogin.value = inputPINLogin.value = "";
    alert("Enter Valid UserName and PIN");
  }
  // აქ იმიტომ ვიძახებ displayCurrentBalance ფუნქციას რომ გარეთ რომ გადავცე currentAccount იქნება undefiend  და როდესაც user შევა login-ში მაშინ აქტიურდება ეს ცვლადიც და აქედან ხდება გადაცემა !
});

// Setup Movements/Display Balance:
function displayCurrentBalance(currentAcc) {
  const totalBalanceResult = currentAcc.movements
    .map((acc) => acc)
    .reduce((acl, mov) => acl + mov);
  currentAcc.balance = totalBalanceResult;
  totalBalance.textContent = totalBalanceResult.toString() + "$";
}
// Display Witdraw/Deposit List:
const displayBalance = function (balAcc, isSorted = false) {
  const sortMovements = isSorted
    ? balAcc.slice().sort((a, b) => a - b)
    : balAcc;
  console.log(sortMovements);
  containerMovements.innerHTML = "";

  sortMovements.forEach((mov, i) => {
    const elmType = mov > 0 ? "deposit" : "withdraw";
    const html = `<div class="balance__info">
        <div class="balance--signs">
          <p class="${elmType}__sign">${i + 1} ${elmType}</p>
          <span> <p>3 Days Ago</p></span>
        </div>
        <div class="movement__money">${mov}$</div>
      </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

transferBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const transferReceiveUser = accounts.find(
    (acc) => acc.userName === transferTo.value
  );
  const amount = Number(amountTransfer.value);
  if (
    amount > 0 &&
    transferReceiveUser?.userName !== currentAccount.userName &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);

    transferReceiveUser.movements.push(amount);
    updateUI(currentAccount);
  }
});

// Sort Elemnent Manipulation:
sortContainer.addEventListener("mouseover", () => {
  sortContainer.style.backgroundColor = "#ca5324";
  sortElm.style.backgroundColor = "#ca5324";
  sortContainer.style.transition = "background-color 0.1s ease"; // Adding transition
  sortElm.style.transition = "background-color 0.1s ease";
});

sortContainer.addEventListener("mouseout", () => {
  sortContainer.style.backgroundColor = "#39b385";
  sortElm.style.backgroundColor = "#39b385";
});

// Sorting Movements List:
let sorted = false;
sortContainer.addEventListener("click", function (e) {
  displayBalance(currentAccount.movements, !sorted);
  sorted = !sorted;
});
