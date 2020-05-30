"use strict";
//DOM取得
const startDisp = document.getElementById('start-display');
const startBtn = document.getElementById('start-btn');
const startH1 = document.getElementById('start-h1');
const startDiv = document.getElementById('start-div');
const quizDisp = document.getElementById('quiz-display');
const choicesBox = document.createElement('div');
const resultDisp = document.getElementById('result-display');
//グローバル変数
let quizList = [];
let currentQuizNum = 0;
let currentCorrectNum = 0;

//関数：APIからデータを取得
const getApi = () => {
  fetch('https://opentdb.com/api.php?amount=10&category=11&difficulty=hard&type=multiple')
    .then(response => {        
      return response.json();
    })
    .then(jsonData => {
      quizList = jsonData.results.slice(); //sliceで値渡し
    })
    .then(() => {
      displayQuiz();
    });
}

//(バックアップ200530)関数：APIからデータを取得
// async function getApi() {
//   const url = 'https://opentdb.com/api.php?amount=10&category=11&difficulty=hard&type=multiple';
//   const res = await fetch(url);
//   const resArr = await res.json();
//   quizList = resArr.results.slice(); //sliceで値渡し
// }

//関数：設問画面を表示
const displayQuiz = () => {
  if (!startDisp.textContent == '') {startDisp.textContent = ''};
  //設問が切替る度の処理
  quizDisp.textContent = '';
  choicesBox.textContent = '';
  //結果画面の為の条件分岐
  if (currentQuizNum === 10) {
    quizDisp.textContent = '';
    choicesBox.textContent = '';
    displayResult(); //結果画面の表示
    return;
  }
  createQuiz();
}
//関数：設問を生成
const createQuiz = () => {
  //タグ要素を生成
  const quizNum = document.createElement('h1'); //問題No.
  const quizCate = document.createElement('h2'); //カテゴリー
  const quizDiff = document.createElement('h3'); //難易度
  const quizSent = document.createElement('p'); //問題文
  //テキストを追加
  quizNum.textContent = `問題${currentQuizNum + 1}`;
  quizCate.textContent = `[カテゴリー]\n${quizList[currentQuizNum].category}`;    
  quizDiff.textContent = `[難易度]\n${quizList[currentQuizNum].difficulty}`;
  const str = quizList[currentQuizNum].question;
  quizSent.innerHTML = str; //innerHTMLを使用し文字化けを防ぐ
  quizSent.classList.add('msg'); //スタイル適用の為
  //誤配列の先頭に正の値をマージ
  const correctAnswer = quizList[currentQuizNum].correct_answer; //1択
  const incorrectAnswers = quizList[currentQuizNum].incorrect_answers; //3択
  incorrectAnswers.unshift(correctAnswer); //4択
  const shuffledAnswers = shuffle([...incorrectAnswers]); //配列順は崩さず、表示だけシャッフル    
  //quizDispに要素を追加
  quizDisp.appendChild(quizNum);
  quizDisp.appendChild(quizCate);
  quizDisp.appendChild(quizDiff);
  quizDisp.appendChild(quizSent);
  quizDisp.appendChild(choicesBox);
  createChoiceBtn(shuffledAnswers); 
}
//関数：「選択肢」ボタンを生成
const createChoiceBtn = arr => { //仮引数を用い、使用時に実引数として配列を渡す
  arr.forEach(choice => {
    const choiceBtn = document.createElement('button');
    choiceBtn.innerHTML = choice;
    choicesBox.appendChild(choiceBtn)
    //クリックイベントで次の問題へ移行
    choiceBtn.addEventListener('click', () => {        
      checkAnswer(choiceBtn);
      displayQuiz();
    });
  });
  choicesBox.classList.add('choices'); //スタイル適用の為
  currentQuizNum++;
}
//関数：シャッフル
const shuffle = arr => { //引数に配列を渡す
  for (let i = arr.length - 1; i > 0; i--) { //iは配列の最後の添字
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]]; //分割代入を用い入替
  }
  return arr; //???やはりこのreturnがピンとこない
}
//関数：正誤判定
const checkAnswer = slectedBtn => { //引数でcheckBtnを渡す想定
  if (slectedBtn.textContent === quizList[currentQuizNum - 1].correct_answer) { //-1は処理位置から発生するズレを解消する為
    currentCorrectNum++;
  }
}
//関数：結果画面を表示
const displayResult = () => {
  //タグ要素を生成
  const resultH1 = document.createElement('h1'); //正答数
  const resultMsg = document.createElement('p'); //msg
  //テキストを追加
  resultH1.textContent = `あなたの正答数は${currentCorrectNum}です！！`;
  resultMsg.textContent = `再度チャレンジしたい場合は以下、クリック！！`;    
  resultMsg.classList.add('msg'); //スタイル適用の為
  //resultDispに要素を追加
  resultDisp.appendChild(resultH1);
  resultDisp.appendChild(resultMsg);

  //「ホームに戻る」ボタンを生成
  const restartBtn = document.createElement('button');
  restartBtn.textContent = `ホームに戻る`;
  resultDisp.appendChild(restartBtn)
    //クリックイベントで次の問題へ移行
    restartBtn.addEventListener('click', () => {        
      window.location.reload();
    });
}
//イベント処理
startBtn.addEventListener("click", () => {
  //取得中の画面表示
  startBtn.remove();
  startH1.textContent = '取得中';
  startDiv.textContent = '少々お待ちください';
  //ローダーを生成
  const loader = document.createElement('div');
  const id = 'loader';
  loader.setAttribute('id', id);
  startDisp.appendChild(loader);
  
  getApi(); 

  //(バックアップ200530)
  //getApi() //???getApiがasync関数だから.thenメソッドで非同期処理ができる
  // .then(response => {
  //   displayQuiz(); //設問を表示
  //   // setTimeout(() => { //更に時間差で発火する処理をする場合
  //   // }, 3000)
  // })
  // // .then(response => { //非同期処理を続ける場合
  // //   displayQuiz();
  // // })
  // .catch(error => {
  //   console.error(error);
  // })
});

//修正が反映されていない為、再push!

//Promiseオブジェクトの使用例
// const promiseObj = new Promise(resolve => {
//   setTimeout(() => {
//     console.log(5);
//     resolve();
//     // console.log(typeof resolve);
//   }, 1000);
// })
//   .then(() => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         console.log(4);
//         resolve();        
//       }, 1000);
//     });
//   })
//   .then(() => {
//     setTimeout(() => {
//       console.log('ラスト！');
//     }, 1000);
//   });
// //別解：上記new Promise()する部分を関数として定義
// const promiseMaker = num => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log(num);
//       resolve();
//     }, 1000);
//   });
// };
// promiseMaker(5)
//   .then(()=> promiseMaker(4)) //thenの返り値はpromiseオブジェクト
//   .then(()=> promiseMaker('ラスト！'));

//DOM操作
// quizList.forEach((quiz) => {
//   const list = document.createElement("li");
//   list.textContent = quiz.question;
//   lists.appendChild(list);
// });
  
//ブラウザが読み込まれた時点で表示
// window.addEventListener("load", async function () {
//   //データの取得
//   const res = await fetch("https://opentdb.com/api.php?amount=10");
//   const quizs = await res.json();
//   const quizsArr = quizs.results;

//   //DOM操作
//   quizsArr.forEach((quiz) => {
//     const list = document.createElement("li");
//     list.textContent = quiz.question;
//     lists.appendChild(list);
//   });
// });

//***fetchメソッド基本形
// async function callApi(){ //asyncを付けると非同期関数となる、そしてawaitを使用することができる
//   const res = await fetch('https://opentdb.com/api.php?amount=10');
//   const quizs = await res.json();
//   const quizsArr = quizs.results;
//   console.log(quizs);
//   console.log(typeof quizs);
// }
// callApi();
//***別解
// function callApi(){ //asyncを付けると非同期関数となる、そしてawaitを使用することができる
//   fetch('https://opentdb.com/api.php?amount=10')
//     .then(function(res) {
//       return res.json();
//     })
//     .then(function(quizs) {
//       console.log(quizs);
//     });
// }
// callApi();
