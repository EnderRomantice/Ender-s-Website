import { useRef, useEffect, useState, useCallback } from "react";

interface FungalGrowthEffectProps {
  /** Canvas宽度，默认100% */
  width?: string | number;
  /** Canvas高度，默认100% */
  height?: string | number;
  /** 线条颜色，默认#888888 */
  color?: string;
  /** 线条最大宽度，默认1.5 */
  maxLineWidth?: number;
  /** 线条最小宽度，默认0.5 */
  minLineWidth?: number;
  /** 生长速度，默认2.0 */
  growthSpeed?: number;
  /** 分支概率（0-1），默认0.02 */
  branchProbability?: number;
  /** 最大线条数量，默认800 */
  maxLines?: number;
  /** 线条最大长度，默认150 */
  maxLineLength?: number;
  /** 线条生命期（帧数），默认300 */
  lineLifetime?: number;
  /** 是否启用淡出效果，默认true */
  fadeOut?: boolean;
  /** 鼠标移动敏感度（像素移动多少触发新生长点），默认5 */
  sensitivity?: number;
  /** 是否启用，默认true */
  enabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自动生成间隔（毫秒），默认3000 */
  autoSpawnInterval?: number;
  /** 无交互后开始自动生成的时间（毫秒），默认2000 */
  autoSpawnDelay?: number;
  /** 每次自动生成的点数，默认2 */
  autoSpawnCount?: number;
}

interface GrowthPoint {
  x: number;
  y: number;
  angle: number; // 当前生长方向（弧度）
  speed: number; // 生长速度
  length: number; // 已生长长度
  maxLength: number; // 最大长度
  width: number; // 线条宽度
  branches: number; // 已分支次数
  maxBranches: number; // 最大分支次数
  life: number; // 当前生命值
  maxLife: number; // 最大生命值
  path: { x: number; y: number }[]; // 路径点记录
  color: string; // 线条颜色
  isActive: boolean; // 是否仍在生长
}

// 颜色转换辅助函数
const hexToRgba = (hex: string, alpha: number): string => {
  // 移除#号
  const cleanHex = hex.replace("#", "");

  // 处理3位hex
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // 处理6位hex
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // 处理8位hex（带alpha）
  if (cleanHex.length === 8) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const a = parseInt(cleanHex.substring(6, 8), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a * alpha})`;
  }

  // 默认返回
  return `rgba(136, 136, 136, ${alpha})`;
};

// 强制淡出持续时间（帧数）
const FORCED_FADE_DURATION = 60;

const FungalGrowthEffect: React.FC<FungalGrowthEffectProps> = ({
  width = "100%",
  height = "100%",
  color = "#888888",
  maxLineWidth = 1.5,
  minLineWidth = 0.5,
  growthSpeed = 2.0,
  branchProbability = 0.02,
  maxLines = 800,
  maxLineLength = 150,
  lineLifetime = 300,
  fadeOut = true,
  sensitivity = 5,
  enabled = true,
  className = "",
  autoSpawnInterval = 3000,
  autoSpawnDelay = 2000,
  autoSpawnCount = 2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const growthPointsRef = useRef<GrowthPoint[]>([]);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const eventLayerRef = useRef<HTMLDivElement>(null);
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const autoSpawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 创建生长点函数
  const createGrowthPoints = useCallback(
    (x: number, y: number, count: number = 3) => {
      // 创建新的生长点
      const points = growthPointsRef.current;
      // 计算添加新点后可能超过限制的数量
      const excess = points.length + count - maxLines;
      if (excess > 0) {
        if (fadeOut) {
          // 淡出模式：标记最旧的excess个点为不活跃，设置短生命值用于淡出
          for (let i = 0; i < excess; i++) {
            const point = points[i];
            if (point) {
              point.isActive = false;
              // 设置淡出持续时间
              point.life = FORCED_FADE_DURATION;
            }
          }
        } else {
          // 非淡出模式：直接移除最前面的excess个点
          points.splice(0, excess);
        }
      }

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const pointColor = color;

        const newPoint = {
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          angle,
          speed: growthSpeed * (0.8 + Math.random() * 0.4),
          length: 0,
          maxLength: maxLineLength * (0.7 + Math.random() * 0.6),
          width: minLineWidth + Math.random() * (maxLineWidth - minLineWidth),
          branches: 0,
          maxBranches: 2 + Math.floor(Math.random() * 3),
          life: lineLifetime,
          maxLife: lineLifetime,
          path: [],
          color: pointColor,
          isActive: true,
        };

        growthPointsRef.current.push(newPoint);
      }
    },
    [
      color,
      growthSpeed,
      maxLineLength,
      maxLineWidth,
      minLineWidth,
      lineLifetime,
      maxLines,
      fadeOut,
    ],
  );

  // 初始化canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // 设置canvas尺寸
    const updateCanvasSize = () => {
      const container = canvas.parentElement;

      let newWidth = 0;
      let newHeight = 0;

      if (typeof width === "string" && width.endsWith("%") && container) {
        newWidth = container.clientWidth;
        newHeight = container.clientHeight;
      } else {
        newWidth = typeof width === "number" ? width : canvas.clientWidth;
        newHeight = typeof height === "number" ? height : canvas.clientHeight;
      }

      // 确保最小尺寸
      if (newWidth <= 0) {
        newWidth = window.innerWidth;
      }

      if (newHeight <= 0) {
        newHeight = window.innerHeight;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
    };

    updateCanvasSize();

    // 创建初始生长点（在canvas中心）
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas && canvas.width > 0 && canvas.height > 0) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        // 直接添加生长点到ref
        for (let i = 0; i < 5; i++) {
          const angle = Math.random() * Math.PI * 2;
          const newPoint = {
            x: centerX + (Math.random() - 0.5) * 50,
            y: centerY + (Math.random() - 0.5) * 50,
            angle,
            speed: growthSpeed * (0.8 + Math.random() * 0.4),
            length: 0,
            maxLength: maxLineLength * (0.7 + Math.random() * 0.6),
            width: minLineWidth + Math.random() * (maxLineWidth - minLineWidth),
            branches: 0,
            maxBranches: 2 + Math.floor(Math.random() * 3),
            life: lineLifetime,
            maxLife: lineLifetime,
            path: [],
            color: color,
            isActive: true,
          };
          growthPointsRef.current.push(newPoint);
        }
      }
    }, 100);

    // 添加防抖的resize监听
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCanvasSize();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [width, height]);

  // 生长点更新逻辑
  const updateGrowthPoints = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const points = growthPointsRef.current;

    // 移除不活跃或生命结束的点
    let removedCount = 0;
    for (let i = points.length - 1; i >= 0; i--) {
      const point = points[i];
      if (!point.isActive && point.life <= 0) {
        points.splice(i, 1);
        removedCount++;
      }
    }
    if (removedCount > 0) {
    }

    // 更新每个生长点
    let activeCount = 0;
    let branchedCount = 0;
     points.forEach((point, index) => {
        if (!point.isActive) {
        // 不活跃的点总是减少生命值（用于强制淡出）
        if (point.life > 0) {
          point.life -= 1;
        }
        return;
      }

      activeCount++;

      // 计算新位置
      let newX = point.x + Math.cos(point.angle) * point.speed;
      let newY = point.y + Math.sin(point.angle) * point.speed;

      // 边界检查
      const margin = 5;
      let bounced = false;

      if (newX < margin) {
        newX = margin;
        point.angle = Math.PI - point.angle;
        bounced = true;
      } else if (newX > canvasWidth - margin) {
        newX = canvasWidth - margin;
        point.angle = Math.PI - point.angle;
        bounced = true;
      }

      if (newY < margin) {
        newY = margin;
        point.angle = -point.angle;
        bounced = true;
      } else if (newY > canvasHeight - margin) {
        newY = canvasHeight - margin;
        point.angle = -point.angle;
        bounced = true;
      }

      // 如果反弹，稍微随机化角度
      if (bounced) {
        point.angle += (Math.random() - 0.5) * 0.5;
      }

      // 记录路径点
      point.path.push({ x: newX, y: newY });
      point.x = newX;
      point.y = newY;
      point.length += point.speed;

      // 检查是否超过最大长度
      if (point.length >= point.maxLength) {
        point.isActive = false;
        // 设置缩短淡出时间，确保有足够的帧数进行缩短效果
        if (point.life > FORCED_FADE_DURATION) {
          point.life = FORCED_FADE_DURATION;
        }
        return;
      }

      // 随机改变方向（模拟自然生长）
      point.angle += (Math.random() - 0.5) * 0.3;

      // 随机减速或加速
      point.speed = Math.max(
        0.5,
        Math.min(3.0, point.speed + (Math.random() - 0.5) * 0.1),
      );

      // 分支逻辑
      if (
        Math.random() < branchProbability &&
        point.branches < point.maxBranches
      ) {
        const newAngle = point.angle + ((Math.random() - 0.5) * Math.PI) / 2;
        const newWidth = Math.max(
          minLineWidth,
          point.width * (0.7 + Math.random() * 0.3),
        );

        // 限制总生长点数量
        if (points.length < maxLines) {
          points.push({
            x: point.x,
            y: point.y,
            angle: newAngle,
            speed: point.speed * (0.8 + Math.random() * 0.4),
            length: 0,
            maxLength: point.maxLength * (0.5 + Math.random()),
            width: newWidth,
            branches: point.branches + 1,
            maxBranches: 3,
            life: point.maxLife,
            maxLife: point.maxLife,
            path: [{ x: point.x, y: point.y }],
            color: point.color,
            isActive: true,
          });
          branchedCount++;
        }
        point.branches += 1;
      }

       // 减少生命值（如果长度接近最大且启用淡出）
       if (fadeOut && point.length > point.maxLength * 0.8) {
         point.life -= 2;
       }
    });
  }, [branchProbability, fadeOut, maxLines, minLineWidth]);

  // 绘制逻辑
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // 记录绘制信息
    const points = growthPointsRef.current;
    const activePoints = points.filter((p) => p.isActive);
    const totalPaths = points.reduce((sum, p) => sum + p.path.length, 0);

    // 清空画布（使用透明背景，让底层内容可见）
    ctx.clearRect(0, 0, canvas.width, canvas.height);

     // 绘制所有生长点的路径
    let drawnCount = 0;
    points.forEach((point) => {
      if (point.path.length < 2) return;

      // 计算要绘制的path点数（用于缩短效果）
      let drawPathLength = point.path.length;
      let drawAlpha = 1.0;
      
      // 对于不活跃且正在淡出的点，应用缩短和透明度效果
      if (!point.isActive && point.life <= FORCED_FADE_DURATION) {
        // 计算淡出比例（1.0 -> 0.0）
        const fadeRatio = point.life / FORCED_FADE_DURATION;
        drawAlpha = fadeRatio;
        // 根据淡出比例缩短路径（保留至少1个点）
        drawPathLength = Math.max(1, Math.floor(point.path.length * fadeRatio));
      } else if (fadeOut || point.life < point.maxLife) {
        // 正常淡出逻辑：只应用透明度
        if (point.life <= FORCED_FADE_DURATION && !point.isActive) {
          drawAlpha = point.life / FORCED_FADE_DURATION;
        } else {
          drawAlpha = point.life / point.maxLife;
        }
      }

      // 确保至少绘制2个点才能形成线段
      if (drawPathLength < 2) return;

      ctx.beginPath();
      ctx.moveTo(point.path[0].x, point.path[0].y);

      // 只绘制前drawPathLength个点
      const endIndex = Math.min(drawPathLength, point.path.length);
      for (let i = 1; i < endIndex; i++) {
        ctx.lineTo(point.path[i].x, point.path[i].y);
      }

      const strokeStyle = hexToRgba(point.color, drawAlpha);
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = point.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      drawnCount++;

      // 调试：绘制第一个点的信息
      if (drawnCount === 1) {
      }
    });

    if (drawnCount > 0) {
    }
  }, [fadeOut]);

  // 动画循环
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const animate = () => {
      updateGrowthPoints();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [enabled, updateGrowthPoints, draw]);

  // 鼠标移动处理
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const container = eventLayerRef.current;
      if (!container) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      // 更新最后交互时间
      lastInteractionTimeRef.current = Date.now();

      // 检查是否移动足够距离
      if (lastMousePosRef.current) {
        const dx = x - lastMousePosRef.current.x;
        const dy = y - lastMousePosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < sensitivity) {
          lastMousePosRef.current = { x, y };
          return;
        }
      }

      lastMousePosRef.current = { x, y };

      // 在鼠标位置创建生长点
      createGrowthPoints(x, y, 3);
    };

    // 使用捕获阶段确保能收到事件
    document.addEventListener("mousemove", handleMouseMove, true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, true);
    };
  }, [enabled, sensitivity, createGrowthPoints]);

  // 自动生成处理
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const container = eventLayerRef.current;
    if (!container) {
      // 延迟设置定时器以确保ref已设置
      const timeoutId = setTimeout(() => {
        const delayedContainer = eventLayerRef.current;
        if (delayedContainer) {
          // 容器现在存在，设置自动生成定时器
          const autoSpawn = () => {
            const now = Date.now();
            const timeSinceLastInteraction =
              now - lastInteractionTimeRef.current;
            const containerRect = delayedContainer.getBoundingClientRect();

            if (
              timeSinceLastInteraction > autoSpawnDelay &&
              containerRect.width > 0 &&
              containerRect.height > 0
            ) {
              const randomX = Math.random() * containerRect.width;
              const randomY = Math.random() * containerRect.height;
              createGrowthPoints(randomX, randomY, autoSpawnCount);
            }
          };

          autoSpawnTimerRef.current = setInterval(autoSpawn, autoSpawnInterval);
        }
      }, 500);

      return () => {
        clearTimeout(timeoutId);
        if (autoSpawnTimerRef.current) {
          clearInterval(autoSpawnTimerRef.current);
          autoSpawnTimerRef.current = null;
        }
      };
    }

    const autoSpawn = () => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteractionTimeRef.current;
      const containerRect = container.getBoundingClientRect();

      if (
        timeSinceLastInteraction > autoSpawnDelay &&
        containerRect.width > 0 &&
        containerRect.height > 0
      ) {
        const randomX = Math.random() * containerRect.width;
        const randomY = Math.random() * containerRect.height;
        createGrowthPoints(randomX, randomY, autoSpawnCount);
      }
    };

    autoSpawnTimerRef.current = setInterval(autoSpawn, autoSpawnInterval);

    return () => {
      if (autoSpawnTimerRef.current) {
        clearInterval(autoSpawnTimerRef.current);
        autoSpawnTimerRef.current = null;
      }
    };
  }, [
    enabled,
    autoSpawnInterval,
    autoSpawnDelay,
    autoSpawnCount,
    createGrowthPoints,
  ]);

  return (
    <div
      ref={eventLayerRef}
      className={`${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default FungalGrowthEffect;
