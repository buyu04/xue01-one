let zhuoZi = document.getElementById("zhuoZi");
let cell = 9; //设置棋盘格数9*9
let html = ""; //初始化一个空字符串，用来储存棋盘的HTML【1】
let board = []; //初始化一个空数组，储存棋盘每个棋子的位置和颜色【2】
let zwidth = zhuoZi.clientWidth; //获取zhuoZi元素的宽度
let qwidth = parseInt(zwidth / cell, 10) + "px"; //计算棋盘格子的宽度并转化为字符串
let qzwidth = parseInt(zwidth / cell / 1.2, 10) + "px"; //计算棋子的宽度

let arr = Array.from({ length: cell }); //创建一个数组，长度是cell，用来映射棋盘的行和列
arr.map((_, row) => {
  //给每一行创建棋盘格子
  arr.map((_, column) => {
    //给每一列创建棋盘格子
    let box = `<div class="qiPan" style="width:${qwidth};height:${qwidth}">
        <div class="qiZi" column="${column}" row="${row}" style="width:${qzwidth};height:${qzwidth}"></div>
      </div>`; //构建单个棋盘格子的HTML，以及qiPan和qiZI元素
    html += box; //将构建的HTML添加到【1】中
  });
});
zhuoZi.innerHTML = html; //把构建的棋盘HTML设置到zhuoZi元素中渲染棋盘

let qiColor = "red"; //初始化棋子颜色为红色
zhuoZi.addEventListener("click", (e) => {
  //为zhuoZi元素添加点击事件监听器
  let target = e.target; //获取被点击时的目标元素
  if (target.classList.contains("qiZi") && target.classList.length === 1) {
    //检查目标元素是否包含qiZi类且没有其他类
    if (qiColor === "black") {
      qiColor = "red";
      document.getElementById("info").innerHTML = "黑棋回合";
    } else {
      qiColor = "black";
      document.getElementById("info").innerHTML = "红棋回合";
    }
    target.classList.add(qiColor); //在目标元素上添加棋子颜色
    let column = parseInt(target.getAttribute("column")); //获取目标元素的column属性
    let row = parseInt(target.getAttribute("row")); //获取目标元素的row属性
    console.log(column, row, qiColor); //打印棋子位置和颜色
    board.push({
      column: column,
      row: row,
      qiColor: qiColor,
    }); //将棋子信息推入board数组（数组位置：【2】）
    setTimeout(() => {
      //设置一个延时函数，用于在下一个事件循环中调用shengLi函数
      shengLi(column, row, qiColor); //调用该函数检查是否有胜利条件
    }, 1);
  } else {
    console.log("此处已有棋子"); //若点击的位置有棋子，则会显示该信息
  }
});
//胜利函数：
function shengLi(column, row, qiColor) {
  //创建shengLi函数，接收当前棋子的列，行，颜色作为参数
  let directions = [
    //设置棋盘八个可能胜利的方向
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
    [-1, 0],
    [0, -1],
    [-1, -1],
    [-1, 1],
  ];

  directions.forEach((dir) => {
    let count = 0; //初始化计数器，用来记录连续相同颜色棋子的数量
    for (let i = 1; i <= 4; i++) {
      //循环检查当前方向上接下来的四个位置
      let c = column + dir[0] * i; //计算当前方向列的位置
      let r = row + dir[1] * i; //计算当前方向行的位置
      let found = board.some(
        (item) =>
          item.column === c && item.row === r && item.qiColor === qiColor
      ); //检查board数组中是否有相同颜色的棋子
      if (found) {
        //如果找到相同颜色的棋子
        count++; //增加计数器
      } else {
        break; //没有找到则终止循环
      }
    }
    for (let i = 1; i <= 4; i++) {
      //与上方循环基本一致，该循环检查相反方向上连续棋子的数量
      let c = column - dir[0] * i;
      let r = row - dir[1] * i;
      let found = board.some(
        (item) =>
          item.column === c && item.row === r && item.qiColor === qiColor
      );
      if (found) {
        count++;
      } else {
        break;
      }
    }
    //检查是否满足胜利条件
    if (count >= 4) {
      //若计数器大于等于4，则表示有五个连续的棋子
      if (window.confirm((qiColor === "red" ? "红棋" : "黑棋") + "胜利!")) {
        //弹出确认框，通知玩家获胜
        window.location.reload(); //点击确定则重新加载页面，开始新游戏
      }
    }
  });
}
