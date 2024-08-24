'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-14T10:17:24.185Z',
    '2024-08-15T14:11:59.604Z',
    '2024-08-18T17:01:17.194Z',
    '2024-08-21T23:36:17.929Z',
    '2024-08-19T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatmovementDate = function (date, locale) {
  const calcdayspassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayspassed = calcdayspassed(new Date(), date);
  console.log(dayspassed);

  if (dayspassed === 0) return 'Today';
  if (dayspassed === 1) return 'Yesterday';
  if (dayspassed <= 7) return `${dayspassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year} `;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatmovementDate(date, acc.locale);

    const formattedmovement = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedmovement}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};



const startLogOutTimer = function () {
  const tick=(function () {
    const min = String(Math.trunc(time/60)).padStart(2,0)
    const sec=String(time%60).padStart(2,0)
  
    // In each call, print the time to UI
    labelTimer.textContent =` ${min} : ${sec}`;
    
    //wheb 0 seconds , stop timer and log out user
    if(time===0) {
      clearInterval(timer)
      labelWelcome.textContent=`Log in to get started`
    
    containerApp.style.opacity=0
    }

    //decrese 1S
    time--;
  });
  //set time to 5 minutes
  let time = 300;
  
  //call thr timer evrey second \
  tick()
  const timer=setInterval(tick,1000)
  return timer
};

///////////////////////////////////////
// Event handlers
let currentAccount,timer;

//fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//experimenting aPI

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //current date and time
    const now = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    // const local = navigator.language;
    // console.log(local);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const Minutes = `${now.getMinutes()}`.padStart(2, 0);
    // const secondutes = now.getSeconds();
    // labelDate.textContent = `${day}/${month}/${year} , ${hours}:${Minutes}:${secondutes}`;
    // // Clear input fields
     inputLoginUsername.value = inputLoginPin.value = '';
    
    // Update UI
   
    if (timer) clearInterval(timer)
    timer=startLogOutTimer()
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //doing the transfer
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    clearInterval(timer)
    timer=startLogOutTimer()
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      //loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
      clearInterval(timer)
      timer=startLogOutTimer()
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
 
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(5 % 2);
// console.log(8 % 3);
// console.log(6 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(3));
// console.log(isEven(34));
// console.log(isEven(435));
// console.log(isEven(324));
// console.log(isEven(567));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')];
//   forEach(function (row, i) {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'orangered';
//     } else if (i % 3 === 0) {
//       row.style.backgroundColor = 'blue';
//     }
//   });
// });

// const diameter = '348234000000000';
// console.log(Number(diameter).toLocaleString());

// //dates and times
// //create date

// const date = new Date();
// console.log(date);
// console.log(new Date('Aug 21 2024 12:59:15'));
// console.log(new Date('Dec 21 2021 12:59:15'));
// console.log(new Date(2021, 12, 24, 11));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// //working with date
// const future = new Date(2021, 12, 24, 11);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getDate());
// console.log(future.getMonth());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.getDay());
// console.log(future.toISOString());

// console.log(Date.now());
// console.log(new Date(1724233334482));

// const today = new Date().toLocaleDateString('fa-IR');
// console.log(today);

// let options = { year: 'numeric', month: 'long', day: 'numeric' };
// let today1 = new Date().toLocaleDateString('fa-IR', options);
// console.log(today1);

// const future = new Date(2020, 10, 19, 15, 23);
// console.log(+future);

// const calcdayspassed = (date1, date2) =>
//   (Math.abs(date2 - date1) / 1000) * 60 * 60 * 24;

// const days1 = calcdayspassed(new Date(2037, 3, 4), new Date(2037, 3, 24));
// console.log(days1);
// const we = new Intl.DateTimeFormat('fa-IR', {
//   hour: 'numeric',
//   minute: 'numeric',
//   second: 'numeric',
// });
// const me = we.format(new Date());
// console.log(me);
// const mee = new Date();
// console.log(mee);

// const option1 = {
//   style: 'currency',
//   unit: 'mile-per-hour',
//   currency: 'EUR',
// };

// const num = 5089762000.67;
// console.log(new Intl.NumberFormat('fa-IR', option1).format(num));
// console.log(new Intl.NumberFormat('en-US', option1).format(num));
// console.log(new Intl.NumberFormat('ar-SY', option1).format(num));
// console.log(new Intl.NumberFormat('de-DE', option1).format(num));

//SetTimeout
const ingredients = ['olive', 'spinach', 'karaafs'];
const pizzaTimer = setTimeout(
  (ing1, ing2, ing3) =>
    console.log(`'Here is  your pizza with ${ing1} and ${ing2} and ${ing3}🍕'`),
  3000,
  ...ingredients
);
console.log('wating...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//SetTime Interval

const options = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

// const timerC=setInterval(function(){
//   const now = new Date();
//
//   console.log(formattedtime);
// },1000)
