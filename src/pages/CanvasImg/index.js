import { useRef, useEffect, useState } from "react";
import "./index.css";

// 获取点相对于Canvas的坐标
function getCoordinate(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  return { x, y };
}

// 画线
function drawStraightLine(ctx, startCoord, endCoord, params) {
  ctx.beginPath();
  setKey(ctx, params);
  ctx.moveTo(startCoord.x, startCoord.y);
  ctx.lineTo(endCoord.x, endCoord.y);
  ctx.closePath();
  ctx.stroke();
}
// 设置属性
function setKey(ctx, params) {
  Object.keys(params).forEach((key) => {
    ctx[key] = params[key];
  });
}

// 画矩形
function drawRectLine(ctx, startCoord, endCoord, params) {
  ctx.beginPath();
  setKey(ctx, params);
  ctx.strokeRect(
    startCoord.x,
    startCoord.y,
    Math.abs(endCoord.x - startCoord.x),
    Math.abs(endCoord.y - startCoord.y)
  ); // 绘制轮廓矩形
  ctx.closePath();
}

// 点是否在某个矩形区域内部
/**
 * params coord: {x,y} 点
 * params rect: {x,y,width,height} 点
 */
function isInnerRect(coord, rect) {
  return (
    coord.x >= rect.x &&
    coord.x <= rect.width + rect.x &&
    coord.y >= rect.y &&
    coord.y <= rect.height + rect.y
  );
}

// 画椭圆
function drawEllipse(ctx, startCoord, endCoord, params) {
  const centerX = (startCoord.x + endCoord.x) / 2; // 椭圆中心点的 x 坐标
  const centerY = (startCoord.y + endCoord.y) / 2; // 椭圆中心点的 y 坐标
  const radiusX = Math.abs((startCoord.x - endCoord.x) / 2); // 椭圆 x 轴方向的半径
  const radiusY = Math.abs((startCoord.y - endCoord.y) / 2); // 椭圆 y 轴方向的半径
  const step = 0.01; // 步长
  ctx.beginPath();
  setKey(ctx, params);
  ctx.moveTo(centerX + radiusX, centerY);

  for (let angle = 0; angle < Math.PI * 2; angle += step) {
    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle);
    ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.stroke();
}

// 画虚线框
function rectDash(ctx, rectCoord) {
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "#000";
  ctx.strokeRect(rectCoord.x, rectCoord.y, rectCoord.width, rectCoord.height);
  ctx.setLineDash([]);
}

function CanvasImg() {
  const canvasRef = useRef(null);
  const colorInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const ctx = useRef(null);
  // 开始画线标志
  const [lineFlag, setLineFlag] = useState(false);
  // 鼠标状态
  const [cursor, setCursor] = useState("default");
  // 线条类型
  // 0001 -- 手绘
  // 0010 -- 直线
  // 0100 -- 方形
  // 1000 -- 圆形
  // 10000 -- 图像
  const [lineType, setLineType] = useState(0b1);
  // 开始点坐标（直线、方形、圆形）
  const startCoord = useRef({ x: 0, y: 0 });
  // 结束点坐标（直线、方形、圆形）
  const endCoord = useRef({ x: 0, y: 0 });
  // 图片信息
  const imgCoord = useRef({ img: null, x: 0, y: 0, width: 0, height: 0 });
  // 图片编辑时：鼠标点相对于图片的坐标位置记录
  const cursorPointCoord = useRef({ left: 0, top: 0 });
  /*
   * 点集合
   * 二维数组，第一层表示线，第二层表示点
   * 第二层的第一个表示线条属性，第二个点才是起始点
   */
  // 手绘线条历史点集合
  const penCoordArr = useRef([]);
  // 直线、方形、圆形历史点集合（只需要存储起始点）
  const straightLineCoordArr = useRef([]);
  const rectCoordArr = useRef([]);
  const circleCoordArr = useRef([]);
  // 图片点集合[x,y,width,height]
  const imgCoordArr = useRef([]);

  useEffect(() => {
    ctx.current = canvasRef.current.getContext("2d");
  }, []);

  // 重置开始结束点
  const resetCoord = () => {
    startCoord.current = { x: 0, y: 0 };
    endCoord.current = { x: 0, y: 0 };
  };

  // 重绘历史
  const drawHistory = (imgNeedDash) => {
    // 手绘
    if (penCoordArr.current.length > 0) {
      penCoordArr.current.forEach((coords, index) => {
        ctx.current.beginPath();
        setKey(ctx.current, penCoordArr.current[index][0]);
        ctx.current.moveTo(
          penCoordArr.current[index][1].x,
          penCoordArr.current[index][1].y
        );
        coords.forEach((coord, key) => {
          if (key > 1) {
            ctx.current.lineTo(coord.x, coord.y);
            ctx.current.stroke();
          }
        });
        ctx.current.closePath();
      });
    }
    // 直线
    if (straightLineCoordArr.current.length > 0) {
      straightLineCoordArr.current.forEach((coords, index) => {
        drawStraightLine(
          ctx.current,
          {
            x: coords[1].x,
            y: coords[1].y,
          },
          {
            x: coords[2].x,
            y: coords[2].y,
          },
          coords[0]
        );
      });
    }
    // 方形
    if (rectCoordArr.current.length > 0) {
      rectCoordArr.current.forEach((coords) => {
        drawRectLine(
          ctx.current,
          {
            x: coords[1].x,
            y: coords[1].y,
          },
          {
            x: coords[2].x,
            y: coords[2].y,
          },
          coords[0]
        );
      });
    }
    // 圆形
    if (circleCoordArr.current.length > 0) {
      circleCoordArr.current.forEach((coords) => {
        drawEllipse(
          ctx.current,
          {
            x: coords[1].x,
            y: coords[1].y,
          },
          {
            x: coords[2].x,
            y: coords[2].y,
          },
          coords[0]
        );
      });
    }
    // 图片
    if (imgCoordArr.current.length > 0) {
      console.log(imgCoordArr.current);
      imgCoordArr.current.forEach((coords, index) => {
        const { img, ...rest } = coords;
        ctx.current.drawImage(img, coords.x, coords.y);
        if (index === imgCoordArr.current.length - 1 && imgNeedDash) {
          rectDash(ctx.current, rest);
        }
      });
    }
  };

  const handleMouseDown = (e) => {
    // 画线状态
    setLineFlag(true);
    switch (lineType) {
      case 0b1:
        // 手绘线条开始
        {
          const { x, y } = getCoordinate(canvasRef.current, e);
          ctx.current.beginPath();
          const params = {
            strokeStyle: colorInputRef.current.value,
            lineWidth: 1,
          };
          setKey(ctx.current, params);
          ctx.current.moveTo(x, y);
          // 收集点
          penCoordArr.current.push([params, { x, y }]);
        }
        break;
      case 0b10:
        // 直线开始
        {
          const { x, y } = getCoordinate(canvasRef.current, e);
          startCoord.current = { x, y };
        }
        break;
      case 0b100:
        // 方形开始
        {
          const { x, y } = getCoordinate(canvasRef.current, e);
          startCoord.current = { x, y };
        }
        break;
      case 0b1000:
        // 椭圆开始
        {
          const { x, y } = getCoordinate(canvasRef.current, e);
          startCoord.current = { x, y };
        }
        break;
      case 0b10000:
        // 图像处理
        // 1. 上传图片到canvas
        // 2. 鼠标处于图片编辑状态
        //  2.1 添加图片虚线框
        // 3. 编辑状态下，鼠标进出图片区域，修改鼠标状态
        // 4. 编辑状态下，鼠标如果在图片区域按下，则可以拖动图片
        //  4.1 鼠标移动，图片拖动处理
        // 5. 编辑状态下，鼠标如果在图片区域外按下，则图片编辑状态结束
        //  4.1 清除虚线框
        const { x, y } = getCoordinate(canvasRef.current, e);
        if (isInnerRect({ x, y }, imgCoord.current)) {
          // 4. 编辑状态下，鼠标如果在图片区域按下，则可以拖动图片
          // 4.1.1 计算鼠标点距离图片左上角点位置距离，得到top，left，然后移动
          const left = x - imgCoord.current.x;
          const top = y - imgCoord.current.y;
          cursorPointCoord.current = { left, top };
        } else {
          // 5. 鼠标如果在图片区域外按下，则图片编辑状态结束
          setLineType(0);
          // 5.1 清除虚线框
          // 清理画布
          ctx.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          // 重绘历史
          drawHistory();
        }

        break;
      default:
        break;
    }
  };
  const handleMouseMove = (e) => {
    if (lineFlag) {
      switch (lineType) {
        case 0b1:
          // 手绘
          {
            const { x, y } = getCoordinate(canvasRef.current, e);
            ctx.current.lineTo(x, y);
            ctx.current.stroke();
            // 存储手绘的点数据
            penCoordArr.current[penCoordArr.current.length - 1].push({ x, y });
          }
          break;
        case 0b10:
          // 直线
          {
            const { x, y } = getCoordinate(canvasRef.current, e);
            // 清理画布
            ctx.current.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            // 重绘历史
            drawHistory();
            // 设置终点
            endCoord.current = { x, y };
            const params = {
              strokeStyle: colorInputRef.current.value,
              lineWidth: 2,
            };
            // 画线
            drawStraightLine(
              ctx.current,
              startCoord.current,
              endCoord.current,
              params
            );
          }
          break;
        case 0b100:
          // 方形
          {
            const { x, y } = getCoordinate(canvasRef.current, e);
            // 清理画布
            ctx.current.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            // 重绘历史
            drawHistory();
            // 设置终点
            endCoord.current = { x, y };
            const params = {
              strokeStyle: colorInputRef.current.value,
              lineWidth: 2,
            };
            // 画矩形
            drawRectLine(ctx.current, startCoord.current, { x, y }, params);
          }
          break;
        case 0b1000:
          // 椭圆
          const { x, y } = getCoordinate(canvasRef.current, e);
          // 清理画布
          ctx.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          // 重绘历史
          drawHistory();
          // 设置终点
          endCoord.current = { x, y };
          const params = {
            strokeStyle: colorInputRef.current.value,
            lineWidth: 2,
          };
          // 画圆形
          drawEllipse(
            ctx.current,
            startCoord.current,
            endCoord.current,
            params
          );
          break;
        case 0b10000:
          {
            // 4.1 鼠标移动，图片拖动处理
            const { x, y } = getCoordinate(canvasRef.current, e);
            if (isInnerRect({ x, y }, imgCoord.current)) {
              // 重置当前图片信息
              imgCoord.current = {
                ...imgCoord.current,
                y: y - cursorPointCoord.current.top,
                x: x - cursorPointCoord.current.left,
                img: imgCoord.current.img,
              };
              // 重置历史图片信息
              imgCoordArr.current[imgCoordArr.current.length - 1] =
                imgCoord.current;
              // 清理画布
              ctx.current.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );
              // 重绘历史,图片含虚线框
              drawHistory(true);
              console.log("编辑状态，鼠标进入图片区域");
            }
          }
          break;
        default:
          break;
      }
    }
    // 3. 编辑状态下，鼠标进出图片区域，修改鼠标状态
    if (lineType === 0b10000) {
      if (imgCoord.current.width || imgCoord.current.height) {
        const { x, y } = getCoordinate(canvasRef.current, e);
        if (isInnerRect({ x, y }, imgCoord.current)) {
          // 鼠标进入图片区域
          // 设置鼠标状态
          setCursor("move");
          console.log("鼠标进入图片区域");
        } else {
          // 鼠标退出图片区域
          // 设置鼠标状态
          setCursor("default");
        }
      }
    }
  };
  const handleMouseUp = (e) => {
    // 画线结束标注位
    setLineFlag(false);
    switch (lineType) {
      case 0b10:
        // 直线结束 - 收集点
        straightLineCoordArr.current.push([
          {
            strokeStyle: colorInputRef.current.value,
            lineWidth: 2,
          },
          startCoord.current,
          endCoord.current,
        ]);
        break;
      case 0b100:
        // 矩形结束 - 收集点
        rectCoordArr.current.push([
          {
            strokeStyle: colorInputRef.current.value,
            lineWidth: 2,
          },
          startCoord.current,
          endCoord.current,
        ]);
        break;
      case 0b1000:
        // 圆形结束 - 收集点
        circleCoordArr.current.push([
          {
            strokeStyle: colorInputRef.current.value,
            lineWidth: 2,
          },
          startCoord.current,
          endCoord.current,
        ]);
        break;
      default:
        break;
    }
    // 重置开始结束点
    resetCoord();
  };

  // 文件上传
  // 1. 上传图片到canvas
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // 画图
          const x = 0,
            y = 0,
            width = img.width,
            height = img.height;
          imgCoord.current = { x, y, width, height, img };
          // 存储图片基本信息
          imgCoordArr.current.push(imgCoord.current);
          // 画图
          ctx.current.drawImage(img, x, y);

          // 2. 鼠标处于图片编辑状态
          setLineType(0b10000);
          // 2.1 添加图片虚线框
          rectDash(ctx.current, imgCoord.current);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <canvas
        ref={canvasRef}
        className="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={600}
        height={600}
        style={{ cursor: cursor }}
      ></canvas>
      <button onClick={() => setLineType(0b1)}>手绘</button>
      <button onClick={() => setLineType(0b10)}>直线</button>
      <button onClick={() => setLineType(0b100)}>方形</button>
      <button onClick={() => setLineType(0b1000)}>圆形</button>
      <input ref={colorInputRef} type="color" />
      <div className="fileInput">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </div>
  );
}

export default CanvasImg;
